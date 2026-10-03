import { useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import type { DropdownOption } from './Dropdown.types';

export interface UseDropdownKeyboardOptions<T> {
  disabled?: boolean;
  isOpen: boolean;
  filteredOptions: DropdownOption<T>[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  open: () => void;
  close: () => void;
  selectOption: (option: DropdownOption<T>) => void;
}

/**
 * Hook khusus untuk menangani interaksi & aksesibilitas keyboard pada Dropdown.
 * Mendukung navigasi ArrowUp/ArrowDown, seleksi dengan Enter/Space, dan penutupan dengan Escape/Tab.
 */
export function useDropdownKeyboard<T = string | number>({
  disabled,
  isOpen,
  filteredOptions,
  highlightedIndex,
  setHighlightedIndex,
  open,
  close,
  selectOption,
}: UseDropdownKeyboardOptions<T>) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (disabled) return;

      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          close();
          break;

        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex =
            highlightedIndex < filteredOptions.length - 1 ? highlightedIndex + 1 : 0;
          setHighlightedIndex(nextIndex);
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex =
            highlightedIndex > 0 ? highlightedIndex - 1 : filteredOptions.length - 1;
          setHighlightedIndex(prevIndex);
          break;
        }

        case 'Enter': {
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            selectOption(filteredOptions[highlightedIndex]);
          }
          break;
        }

        case 'Tab':
          close();
          break;

        default:
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, filteredOptions, open, close, selectOption, setHighlightedIndex]
  );

  return { handleKeyDown };
}
