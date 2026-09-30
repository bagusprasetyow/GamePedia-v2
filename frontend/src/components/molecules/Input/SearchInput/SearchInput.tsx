import { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Input, Icon } from '@/components/atoms';
import type { SearchInputProps } from './SearchInput.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Helper Styling
// ─────────────────────────────────────────────────────────────
const adornmentWrapperClasses = 'flex items-center gap-1.5 shrink-0';

/**
 * SearchInput Component - Molecule UI Element
 * 
 * Komponen bidang pencarian reaktif berbasis atom `Input`, `Button`, dan `Icon`.
 * Mendukung pencarian reaktif dengan debounce timer, indikator status loading, tombol pembersih cepat,
 * serta Depth System (-3 s/d 3).
 * 
 * @param {string} [props.placeholder='Cari...'] - Teks petunjuk (placeholder) bidang pencarian
 * @param {(query: string) => void} [props.onSearch] - Callback saat query pencarian terkirim/berubah
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
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management, Debounce, & Handlers
  // ─────────────────────────────────────────────────────────────
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    String(controlledValue ?? defaultValue ?? '')
  );

  const currentValue = isControlled
    ? String(controlledValue ?? '')
    : internalValue;

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync internal state bila controlled value berubah dari luar
  useEffect(() => {
    if (isControlled) {
      setInternalValue(String(controlledValue ?? ''));
    }
  }, [controlledValue, isControlled]);

  const triggerSearch = useCallback(
    (query: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearch?.(query);
    },
    [onSearch]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (!isControlled) {
      setInternalValue(newVal);
    }
    onChange?.(e);

    if (onSearch) {
      if (debounceTime > 0) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          onSearch(newVal);
        }, debounceTime);
      } else {
        onSearch(newVal);
      }
    }
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
    triggerSearch('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch(currentValue);
    }
    restProps.onKeyDown?.(e);
  };

  // Cleanup debounce timer saat komponen unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
