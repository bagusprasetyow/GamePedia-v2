import { forwardRef, useId } from 'react';
import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text, Icon } from '@/components/atoms';
import type { InputSize, InputVariant } from '@/components/atoms/Input/Input.types';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { DropdownProps, DropdownOption } from './Dropdown.types';
import { useDropdown } from './useDropdown';
import { DropdownTrigger } from './components/DropdownTrigger';
import { DropdownPopover } from './components/DropdownPopover';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps, Styling Variables & Depth Scale
// ─────────────────────────────────────────────────────────────
interface SizeStyle {
  container: string;
  text: 'xs' | 'sm' | 'base';
  iconSize: IconSize;
  clearIconSize: IconSize;
  gap: string;
}

const sizeStyles: Record<InputSize, SizeStyle> = {
  sm: {
    container: 'h-8 px-2.5 rounded-lg',
    text: 'xs',
    iconSize: 'sm',
    clearIconSize: 'xs',
    gap: 'gap-1.5',
  },
  md: {
    container: 'h-10 px-3.5 rounded-xl',
    text: 'sm',
    iconSize: 'md',
    clearIconSize: 'sm',
    gap: 'gap-2',
  },
  lg: {
    container: 'h-12 px-4 rounded-xl',
    text: 'base',
    iconSize: 'lg',
    clearIconSize: 'md',
    gap: 'gap-2.5',
  },
};

const variantStyles: Record<InputVariant, string> = {
  outline: 'bg-background border-2 border-border/80 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
  filled: 'bg-muted/70 border-2 border-transparent focus-visible:bg-background focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
  ghost: 'bg-transparent border-2 border-transparent focus-visible:bg-background focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
};

const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2',
  '-1': 'shadow-n1',
  '0': 'shadow-0',
  '1': 'shadow-1',
  '2': 'shadow-2',
  '3': 'shadow-3',
  sunken: 'shadow-n2',
  flat: 'shadow-0',
  'raised-sm': 'shadow-1',
  'raised-md': 'shadow-2',
  'raised-lg': 'shadow-3',
};

/**
 * Dropdown Component - Molecule UI Element
 * 
 * Komponen bidang dropdown interaktif serbaguna yang terdekomposisi bersih menjadi 3 sub-komponen:
 * - `<DropdownTrigger>`: Bidang trigger visual utama
 * - `<DropdownPopover>`: Menu popover melayang & pencarian ComboBox
 * - `<DropdownItem>`: Opsi pilihan tunggal/ganda
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(<T extends string | number = string | number>(
  props: DropdownProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
): ReactElement => {
  const {
    variant = 'single',
    placeholder = 'Pilih opsi...',
    searchPlaceholder = 'Cari opsi...',
    label,
    description,
    error,
    required = false,
    disabled = false,
    fullWidth = true,
    startIcon,
    size = 'md',
    variantStyle = 'outline',
    depth = -1,
    maxHeight = 240,
    notFoundText = 'Tidak ada opsi ditemukan',
    className = '',
    wrapperClassName = '',
    popoverClassName = '',
    id,
    searchMode,
    matchMode,
  } = props;

  const resolvedSearchMode = searchMode ?? matchMode ?? '...x...';

  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management Hook & Helper Calculations
  // ─────────────────────────────────────────────────────────────
  const generatedId = useId();
  const dropdownId = id || generatedId;
  const labelId = `${dropdownId}-label`;
  const errorId = `${dropdownId}-error`;
  const descId = `${dropdownId}-desc`;

  const {
    isOpen,
    toggleOpen,
    searchQuery,
    setSearchQuery,
    enableSearch,
    filteredOptions,
    groupedOptions,
    currentSingleValue,
    currentMultiValue,
    selectedSingleOption,
    selectedMultiOptions,
    hasValue,
    selectOption,
    handleClear,
    highlightedIndex,
    setHighlightedIndex,
    containerRef,
    searchInputRef,
    clearable,
  } = useDropdown(props);

  const isMulti = variant === 'multi';
  const sizeStyle = sizeStyles[size] || sizeStyles.md;
  const variantClass = variantStyles[variantStyle] || variantStyles.outline;
  const depthKey = String(depth);
  const resolvedDepth = depthClasses[depthKey] || depthClasses['-1'];

  const hasError = Boolean(error);

  const dynamicIcon = !isMulti
    ? (selectedSingleOption?.icon || startIcon)
    : (selectedMultiOptions.length === 1 ? (selectedMultiOptions[0]?.icon || startIcon) : startIcon);

  // Enkapsulasi Class Names
  const outerWrapperClasses = cn(
    'flex flex-col gap-1.5',
    fullWidth ? 'w-full' : 'w-auto inline-flex',
    disabled && 'opacity-60 cursor-not-allowed',
    wrapperClassName
  );

  const triggerClasses = cn(
    'flex items-center justify-between select-none cursor-pointer',
    sizeStyle.container,
    sizeStyle.gap,
    variantClass,
    resolvedDepth,
    'outline-none transition-all duration-200',
    hasError && 'border-destructive text-destructive focus-visible:border-destructive focus-visible:ring-destructive/25',
    disabled && 'bg-muted/40 cursor-not-allowed pointer-events-none',
    className
  );

  const popoverMenuClasses = cn(
    'absolute top-full mt-1 left-0 right-0 z-50',
    'rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-3 overflow-hidden',
    'animate-in fade-in zoom-in-95 duration-150',
    popoverClassName
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Dekomposisi Bersih & Terstruktur
  // ─────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className={outerWrapperClasses}>
      {/* 3.1 Form Label */}
      {label && (
        <Text
          as="label"
          id={labelId}
          size="xs"
          weight="semibold"
          className="flex items-center gap-1 select-none text-foreground"
        >
          {label}
          {required && (
            <Text as="span" variant="error" weight="bold" aria-hidden="true">
              *
            </Text>
          )}
        </Text>
      )}

      {/* 3.2 Trigger Field Box & Popover Anchor */}
      <div className="relative w-full">
        <DropdownTrigger
          triggerRef={ref}
          id={dropdownId}
          isOpen={isOpen}
          disabled={disabled}
          clearable={clearable}
          hasValue={hasValue}
          placeholder={placeholder}
          startIcon={dynamicIcon}
          sizeStyle={sizeStyle}
          triggerClasses={triggerClasses}
          selectedSingleOption={selectedSingleOption as unknown as DropdownOption | null}
          selectedMultiOptions={selectedMultiOptions as unknown as DropdownOption[]}
          isMulti={isMulti}
          handleClear={handleClear}
          toggleOpen={toggleOpen}
          errorId={hasError ? errorId : undefined}
          descId={description ? descId : undefined}
        />

        {/* 3.3 Popover Dropdown Menu */}
        {isOpen && (
          <DropdownPopover
            popoverMenuClasses={popoverMenuClasses}
            enableSearch={enableSearch}
            searchPlaceholder={searchPlaceholder}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchInputRef={searchInputRef}
            isMulti={isMulti}
            maxHeight={maxHeight}
            filteredOptions={filteredOptions as unknown as DropdownOption[]}
            groupedOptions={groupedOptions as unknown as { ungrouped: DropdownOption[]; groups: Record<string, DropdownOption[]> }}
            notFoundText={notFoundText}
            currentSingleValue={currentSingleValue}
            currentMultiValue={currentMultiValue}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            selectOption={selectOption as unknown as (option: DropdownOption) => void}
            size={size}
            sizeStyle={sizeStyle}
            searchMode={resolvedSearchMode}
          />
        )}
      </div>

      {/* 3.4 Validasi Kesalahan / Teks Bantuan */}
      {hasError ? (
        <Text
          id={errorId}
          role="alert"
          size="xs"
          variant="error"
          className="flex items-center gap-1 mt-0.5"
        >
          <Icon icon="mdi:alert-circle" size="2xs" className="shrink-0" />
          <Text as="span" size="xs" className="truncate">
            {error}
          </Text>
        </Text>
      ) : description ? (
        <Text id={descId} size="xs" variant="muted" className="mt-0.5 truncate">
          {description}
        </Text>
      ) : null}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
