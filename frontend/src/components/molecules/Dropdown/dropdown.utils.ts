import { matchesSearch } from '../Input/SearchInput/SearchInput.utils';
import type { SearchMatchMode } from '../Input/SearchInput/SearchInput.types';
import type { DropdownOption } from './Dropdown.types';

/**
 * Filter opsi dropdown berdasarkan kata kunci pencarian dan mode pencocokan.
 */
export function filterDropdownOptions<T = string | number>(
  options: DropdownOption<T>[],
  query: string,
  searchMode: SearchMatchMode
): DropdownOption<T>[] {
  const trimmed = query.trim();
  if (!trimmed) return options;

  return options.filter((opt) => {
    const matchLabel = matchesSearch(opt.label, trimmed, searchMode);
    const matchDesc = opt.description
      ? matchesSearch(opt.description, trimmed, searchMode)
      : false;
    return matchLabel || matchDesc;
  });
}

/**
 * Kelompokkan opsi dropdown menjadi kategori group atau ungrouped.
 */
export function groupDropdownOptions<T = string | number>(
  options: DropdownOption<T>[]
): {
  groups: { [key: string]: DropdownOption<T>[] };
  ungrouped: DropdownOption<T>[];
} {
  const groups: { [key: string]: DropdownOption<T>[] } = {};
  const ungrouped: DropdownOption<T>[] = [];

  options.forEach((option) => {
    if (option.group) {
      if (!groups[option.group]) {
        groups[option.group] = [];
      }
      groups[option.group].push(option);
    } else {
      ungrouped.push(option);
    }
  });

  return { groups, ungrouped };
}

/**
 * Buat lookup map dari daftar opsi untuk resolusi cepat berdasarkan value.
 */
export function createDropdownOptionsMap<T = string | number>(
  options: DropdownOption<T>[]
): Map<T, DropdownOption<T>> {
  const map = new Map<T, DropdownOption<T>>();
  options.forEach((opt) => map.set(opt.value, opt));
  return map;
}
