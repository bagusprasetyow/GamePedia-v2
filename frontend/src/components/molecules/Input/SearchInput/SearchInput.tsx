import { useState, useEffect, forwardRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Input, Icon } from '@/components/atoms';
import { useDebouncedCallback } from '@/hooks';
import type { SearchInputProps, SearchMatchMode } from './SearchInput.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Helper Styling
// ─────────────────────────────────────────────────────────────
const adornmentWrapperClasses = 'flex items-center gap-1.5 shrink-0';

/**
 * SearchInput Component - Molecule UI Element
 * 
 * Komponen bidang pencarian reaktif berbasis atom `Input`, `Button`, dan `Icon`.
 * Mendukung pencarian reaktif dengan debounce timer, indikator status loading, tombol pembersih cepat,
 * mode pencocokan awalan ("x...") atau substring ("...x..."), serta Depth System (-3 s/d 3).
 * 
 * @param {string} [props.placeholder='Cari...'] - Teks petunjuk (placeholder) bidang pencarian
 * @param {(query: string, matchMode?: SearchMatchMode) => void} [props.onSearch] - Callback saat query pencarian terkirim/berubah
 * @param {SearchMatchMode} [props.searchMode='...x...'] - Mode pencarian ('x...' untuk awalan, '...x...' untuk mengandung)
 * @param {SearchMatchMode} [props.matchMode] - Alias untuk searchMode
 * @param {number} [props.debounceTime=300] - Jeda debounce dalam milidetik (default: 300ms)
 * @param {boolean} [props.isLoading=false] - Menampilkan animasi loading spinner
 * @param {string} [props.searchIcon='mdi:magnify'] - Ikon pencarian di sisi kiri
 * @param {InputDepth} [props.depth=-1] - Kedalaman visual taktil (Depth System: -3 s/d 3)
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSearch,
  debounceTime = 300,
  isLoading = false,
  searchIcon = 'mdi:magnify',
  placeholder = 'Cari...',
  clearable = true,
  onClear,
  size = 'md',
  variant = 'outline',
  depth = -1,
  className = '',
  wrapperClassName = '',
  disabled = false,
  searchMode,
  matchMode,
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management, Debounce, & Handlers
  // ─────────────────────────────────────────────────────────────
  const resolvedMatchMode: SearchMatchMode = searchMode ?? matchMode ?? '...x...';
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    String(controlledValue ?? defaultValue ?? '')
  );

  const currentValue = isControlled
    ? String(controlledValue ?? '')
    : internalValue;

  // Sync internal state bila controlled value berubah dari luar
  useEffect(() => {
    if (isControlled) {
      setInternalValue(String(controlledValue ?? ''));
    }
  }, [controlledValue, isControlled]);

  const debouncedSearch = useDebouncedCallback(
    (query: string) => {
      onSearch?.(query, resolvedMatchMode);
    },
    Math.max(0, debounceTime)
  );

  const triggerImmediateSearch = (query: string) => {
    debouncedSearch.cancel();
    onSearch?.(query, resolvedMatchMode);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (!isControlled) {
      setInternalValue(newVal);
    }
    onChange?.(e);

    if (onSearch) {
      if (debounceTime > 0) {
        debouncedSearch.run(newVal);
      } else {
        triggerImmediateSearch(newVal);
      }
    }
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
    triggerImmediateSearch('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerImmediateSearch(currentValue);
    }
    restProps.onKeyDown?.(e);
  };

  // Rakit End Adornment (Loading Spinner)
  const renderEndAdornment = () => {
    if (!isLoading) return null;

    return (
      <div className={adornmentWrapperClasses}>
        <Icon
          icon="mdi:loading"
          size="2xs"
          className="animate-spin text-muted-foreground shrink-0"
        />
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output (Atomic Component Compliant)
  // ─────────────────────────────────────────────────────────────
  return (
    <Input
      ref={ref}
      type="search"
      value={currentValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      startIcon={searchIcon}
      endAdornment={renderEndAdornment()}
      clearable={clearable}
      onClear={handleClear}
      size={size}
      variant={variant}
      depth={depth}
      disabled={disabled}
      className={className}
      wrapperClassName={cn('w-full', wrapperClassName)}
      {...restProps}
    />
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
