import { type FC, type MouseEvent, type Ref } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Text } from '@/components/atoms';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { DropdownOption } from '../Dropdown.types';

export interface DropdownTriggerProps {
  isOpen: boolean;
  disabled?: boolean;
  clearable?: boolean;
  hasValue: boolean;
  placeholder?: string;
  startIcon?: string;
  sizeStyle: {
    container: string;
    text: 'xs' | 'sm' | 'base';
    iconSize: IconSize;
    clearIconSize: IconSize;
  };
  triggerClasses: string;
  clearButtonClasses: string;
  selectedSingleOption: DropdownOption | null;
  selectedMultiOptions: DropdownOption[];
  isMulti: boolean;
  handleClear: (e: MouseEvent) => void;
  toggleOpen: () => void;
  triggerRef: Ref<HTMLDivElement>;
  id?: string;
  errorId?: string;
  descId?: string;
}

export const DropdownTrigger: FC<DropdownTriggerProps> = ({
  isOpen,
  disabled,
  clearable,
  hasValue,
  placeholder = 'Pilih opsi...',
  startIcon,
  sizeStyle,
  triggerClasses,
  clearButtonClasses,
  selectedSingleOption,
  selectedMultiOptions,
  isMulti,
  handleClear,
  toggleOpen,
  triggerRef,
  id,
  errorId,
  descId,
}) => {
  // Enkapsulasi Class Variables Sesuai Standar Komposisi Tailwind
  const leftContentWrapperClasses = cn(
    // layout
    'flex items-center gap-2.5 min-w-0 flex-1'
  );

  const rightContentWrapperClasses = cn(
    // layout & spacing
    'flex items-center gap-1 shrink-0 ml-2'
  );

  const startIconClasses = cn(
    // layout
    'shrink-0',
    // transition
    'transition-colors',
    // state
    hasValue
      ? 'text-primary font-semibold'
      : isOpen
        ? 'text-foreground'
        : 'text-muted-foreground'
  );

  const chevronIconClasses = cn(
    // layout
    'shrink-0',
    // text
    'text-muted-foreground',
    // transition
    'transition-transform duration-200',
    // state
    isOpen && 'rotate-180 text-foreground'
  );

  return (
    <div
      ref={triggerRef}
      id={id}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={isOpen ? `${id || 'dropdown'}-menu` : undefined}
      aria-describedby={errorId || descId}
      tabIndex={disabled ? -1 : 0}
      onClick={toggleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleOpen();
        }
      }}
      className={triggerClasses}
    >
      {/* Konten Kiri (Icon + Teks Nilai Terpilih / Placeholder) */}
      <div className={leftContentWrapperClasses}>
        {startIcon && (
          <Icon
            icon={startIcon}
            size={sizeStyle.iconSize}
            className={startIconClasses}
          />
        )}

        {/* Teks Nilai Terpilih / Ringkasan Count / Placeholder */}
        <div className="flex items-center truncate">
          {!isMulti ? (
            selectedSingleOption ? (
              <Text size={sizeStyle.text} className="truncate text-foreground font-medium">
                {selectedSingleOption.label}
              </Text>
            ) : (
              <Text size={sizeStyle.text} variant="muted" className="truncate select-none">
                {placeholder}
              </Text>
            )
          ) : selectedMultiOptions.length === 0 ? (
            <Text size={sizeStyle.text} variant="muted" className="truncate select-none">
              {placeholder}
            </Text>
          ) : selectedMultiOptions.length === 1 ? (
            <Text size={sizeStyle.text} className="truncate text-foreground font-medium">
              {selectedMultiOptions[0].label}
            </Text>
          ) : (
            <Text size={sizeStyle.text} className="truncate text-foreground font-medium select-none">
              {selectedMultiOptions.length} terpilih
            </Text>
          )}
        </div>
      </div>

      {/* Konten Kanan (Clear Button + Chevron Arrow) */}
      <div className={rightContentWrapperClasses}>
        {clearable && hasValue && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            className={clearButtonClasses}
            aria-label="Bersihkan pilihan"
          >
            <Icon icon="mdi:close" size={sizeStyle.clearIconSize} />
          </button>
        )}

        <Icon
          icon="mdi:chevron-down"
          size={sizeStyle.iconSize}
          className={chevronIconClasses}
        />
      </div>
    </div>
  );
};

export default DropdownTrigger;
