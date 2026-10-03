import { type FC, type RefObject } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import { SearchInput } from '@/components/molecules/Input/SearchInput';
import type { SearchMatchMode } from '@/components/molecules/Input/SearchInput';
import type { InputSize } from '@/components/atoms/Input/Input.types';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { DropdownOption } from '../Dropdown.types';
import { DropdownItem } from './DropdownItem';
import { DropdownEmptyState } from './DropdownEmptyState';

export interface DropdownPopoverProps {
  popoverMenuClasses: string;
  enableSearch: boolean;
  searchPlaceholder: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  isMulti: boolean;
  maxHeight: number | string;
  filteredOptions: DropdownOption[];
  groupedOptions: {
    ungrouped: DropdownOption[];
    groups: Record<string, DropdownOption[]>;
  };
  notFoundText: string;
  currentSingleValue: string | number | null | undefined;
  currentMultiValue: (string | number)[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  selectOption: (option: DropdownOption) => void;
  size: InputSize;
  sizeStyle: {
    iconSize: IconSize;
  };
  searchMode?: SearchMatchMode;
}

export const DropdownPopover: FC<DropdownPopoverProps> = ({
  popoverMenuClasses,
  enableSearch,
  searchPlaceholder,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  isMulti,
  maxHeight,
  filteredOptions,
  groupedOptions,
  notFoundText,
  currentSingleValue,
  currentMultiValue,
  highlightedIndex,
  setHighlightedIndex,
  selectOption,
  size,
  sizeStyle,
  searchMode,
}) => {
  // Enkapsulasi Class Variables Sesuai Standar Komposisi Tailwind
  const searchContainerClasses = cn(
    // spacing
    'p-2',
    // border
    'border-b border-border/60',
    // background
    'bg-muted/20'
  );

  const optionsListClasses = cn(
    // layout
    'space-y-0.5 select-none',
    // size & spacing
    'p-1.5 overflow-y-auto scrollbar-thin'
  );

  const groupTitleClasses = cn(
    // layout
    'select-none',
    // spacing
    'px-2.5 pt-1.5 pb-1',
    // typography
    'text-2xs uppercase tracking-wider'
  );

  return (
    <div className={popoverMenuClasses}>
      {/* Kotak Input Pencarian (Khusus Mode ComboBox / Searchable) */}
      {enableSearch && (
        <div className={searchContainerClasses}>
          <SearchInput
            ref={searchInputRef}
            size="sm"
            variant="outline"
            depth={-1}
            debounceTime={0}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            clearable
            fullWidth
            searchMode={searchMode}
            className="h-8 text-xs"
          />
        </div>
      )}

      {/* Daftar Opsi Pilihan */}
      <div
        role="listbox"
        aria-multiselectable={isMulti}
        style={{ maxHeight }}
        className={optionsListClasses}
      >
        {filteredOptions.length === 0 ? (
          <DropdownEmptyState notFoundText={notFoundText} />
        ) : (
          <>
            {/* 1. Opsi Tanpa Group */}
            {groupedOptions.ungrouped.map((option) => {
              const isSelected = isMulti
                ? currentMultiValue.includes(option.value)
                : currentSingleValue === option.value;
              const optIndex = filteredOptions.indexOf(option);
              const isHighlighted = highlightedIndex === optIndex;

              return (
                <DropdownItem
                  key={String(option.value)}
                  option={option}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  isMulti={isMulti}
                  size={size}
                  sizeStyle={sizeStyle}
                  optIndex={optIndex}
                  selectOption={selectOption}
                  setHighlightedIndex={setHighlightedIndex}
                />
              );
            })}

            {/* 2. Opsi Berdasarkan Group */}
            {Object.entries(groupedOptions.groups).map(([groupName, groupOpts]) => (
              <div key={groupName} className="pt-1.5 first:pt-0">
                <Text
                  as="div"
                  size="xs"
                  weight="semibold"
                  variant="muted"
                  className={groupTitleClasses}
                >
                  {groupName}
                </Text>

                {groupOpts.map((option) => {
                  const isSelected = isMulti
                    ? currentMultiValue.includes(option.value)
                    : currentSingleValue === option.value;
                  const optIndex = filteredOptions.indexOf(option);
                  const isHighlighted = highlightedIndex === optIndex;

                  return (
                    <DropdownItem
                      key={String(option.value)}
                      option={option}
                      isSelected={isSelected}
                      isHighlighted={isHighlighted}
                      isMulti={isMulti}
                      size={size}
                      sizeStyle={sizeStyle}
                      optIndex={optIndex}
                      selectOption={selectOption}
                      setHighlightedIndex={setHighlightedIndex}
                    />
                  );
                })}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DropdownPopover;
