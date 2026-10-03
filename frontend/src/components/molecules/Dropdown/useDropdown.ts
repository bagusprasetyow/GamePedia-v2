import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { MouseEvent } from 'react';
import type { DropdownOption, DropdownProps } from './Dropdown.types';
import {
  filterDropdownOptions,
  groupDropdownOptions,
  createDropdownOptionsMap,
} from './dropdown.utils';
import { useDropdownKeyboard } from './useDropdownKeyboard';

/**
 * Hook internal untuk mengelola seluruh logika interaktif komponen Dropdown.
 * 
 * Mencakup state buka/tutup, penanganan klik di luar (click-outside),
 * filter pencarian reaktif (ComboBox), navigasi keyboard accessible,
 * serta sinkronisasi nilai mode Single maupun Multi.
 */
export function useDropdown<T = string | number>(props: DropdownProps<T>) {
  const {
    options = [],
    variant = 'single',
    isComboBox = false,
    isSearchable = false,
    searchable,
    searchBar,
    showSearch,
    hideSearch = false,
    disableSearch = false,
    disabled = false,
    clearable = false,
    onClear,
    searchMode,
    matchMode,
  } = props;

  const isSearchDisabled = hideSearch || disableSearch;
  const explicitSearch =
    searchBar !== undefined
      ? searchBar
      : showSearch !== undefined
        ? showSearch
        : searchable !== undefined
          ? searchable
          : undefined;

  const enableSearch = !isSearchDisabled && (
    explicitSearch !== undefined
      ? explicitSearch
      : (isComboBox || isSearchable)
  );
  const resolvedSearchMode = searchMode ?? matchMode ?? '...x...';

  // ─────────────────────────────────────────────────────────────
  // 1. STATE BUKA / TUTUP & PENCARIAN
  // ─────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // ─────────────────────────────────────────────────────────────
  // 2. STATE NILAI TERPILIH (SINGLE & MULTI)
  // ─────────────────────────────────────────────────────────────
  const isMulti = variant === 'multi';
  const singleProps = !isMulti ? (props as unknown as { value?: T | null; defaultValue?: T | null }) : null;
  const multiProps = isMulti ? (props as unknown as { value?: T[]; defaultValue?: T[] }) : null;

  // State untuk Single Mode
  const isSingleControlled = singleProps ? singleProps.value !== undefined : false;
  const [uncontrolledSingleValue, setUncontrolledSingleValue] = useState<T | null>(
    singleProps?.defaultValue ?? null
  );
  const currentSingleValue: T | null = !isMulti
    ? (isSingleControlled ? (singleProps?.value ?? null) : uncontrolledSingleValue)
    : null;

  // State untuk Multi Mode
  const isMultiControlled = multiProps ? multiProps.value !== undefined : false;
  const [uncontrolledMultiValue, setUncontrolledMultiValue] = useState<T[]>(
    multiProps?.defaultValue ?? []
  );
  const currentMultiValue: T[] = useMemo(() => {
    if (!isMulti) return [];
    if (isMultiControlled) return multiProps?.value ?? [];
    return uncontrolledMultiValue;
  }, [isMulti, isMultiControlled, multiProps?.value, uncontrolledMultiValue]);

  // ─────────────────────────────────────────────────────────────
  // 3. FILTERING OPSI & GROUPING (COMBO BOX / SEARCHABLE)
  // ─────────────────────────────────────────────────────────────
  const filteredOptions = useMemo(() => {
    if (!enableSearch || !searchQuery.trim()) {
      return options;
    }
    return filterDropdownOptions(options, searchQuery, resolvedSearchMode);
  }, [options, enableSearch, searchQuery, resolvedSearchMode]);

  const groupedOptions = useMemo(() => {
    return groupDropdownOptions(filteredOptions);
  }, [filteredOptions]);

  const optionsMap = useMemo(() => {
    return createDropdownOptionsMap(options);
  }, [options]);

  const selectedSingleOption = useMemo(() => {
    if (currentSingleValue === null || currentSingleValue === undefined) return null;
    return optionsMap.get(currentSingleValue) || null;
  }, [currentSingleValue, optionsMap]);

  const selectedMultiOptions = useMemo(() => {
    return currentMultiValue
      .map((val) => optionsMap.get(val))
      .filter((opt): opt is DropdownOption<T> => opt !== undefined);
  }, [currentMultiValue, optionsMap]);

  const hasValue = isMulti
    ? currentMultiValue.length > 0
    : currentSingleValue !== null && currentSingleValue !== undefined && currentSingleValue !== '';

  // ─────────────────────────────────────────────────────────────
  // 4. KONTROL INTERAKSI & POPUP
  // ─────────────────────────────────────────────────────────────
  const close = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  }, []);

  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, [disabled]);

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [disabled, isOpen, close, open]);

  // Auto focus ke search input saat dropdown terbuka pada mode ComboBox
  useEffect(() => {
    if (isOpen && enableSearch) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, enableSearch]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, close]);

  // ─────────────────────────────────────────────────────────────
  // 5. SELEKSI ITEM & PEMBERSERAN
  // ─────────────────────────────────────────────────────────────
  const selectOption = useCallback(
    (option: DropdownOption<T>) => {
      if (option.disabled || disabled) return;

      if (!isMulti) {
        // Mode Single
        if (!isSingleControlled) {
          setUncontrolledSingleValue(option.value);
        }
        (props as { onChange?: (val: T | null, opt: DropdownOption<T> | null) => void }).onChange?.(
          option.value,
          option
        );
        close();
      } else {
        // Mode Multi
        const exists = currentMultiValue.includes(option.value);
        const newValues = exists
          ? currentMultiValue.filter((val) => val !== option.value)
          : [...currentMultiValue, option.value];

        if (!isMultiControlled) {
          setUncontrolledMultiValue(newValues);
        }

        const newOptions = newValues
          .map((v) => optionsMap.get(v))
          .filter((opt): opt is DropdownOption<T> => opt !== undefined);

        (props as { onChange?: (vals: T[], opts: DropdownOption<T>[]) => void }).onChange?.(
          newValues,
          newOptions
        );
      }
    },
    [
      disabled,
      isMulti,
      isSingleControlled,
      isMultiControlled,
      currentMultiValue,
      optionsMap,
      props,
      close,
    ]
  );

  const removeMultiOption = useCallback(
    (valueToRemove: T, e?: MouseEvent) => {
      e?.stopPropagation();
      if (disabled || !isMulti) return;

      const newValues = currentMultiValue.filter((v) => v !== valueToRemove);
      if (!isMultiControlled) {
        setUncontrolledMultiValue(newValues);
      }

      const newOptions = newValues
        .map((v) => optionsMap.get(v))
        .filter((opt): opt is DropdownOption<T> => opt !== undefined);

      (props as { onChange?: (vals: T[], opts: DropdownOption<T>[]) => void }).onChange?.(
        newValues,
        newOptions
      );
    },
    [disabled, isMulti, currentMultiValue, isMultiControlled, optionsMap, props]
  );

  const handleClear = useCallback(
    (e?: MouseEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      if (disabled) return;

      if (!isMulti) {
        if (!isSingleControlled) {
          setUncontrolledSingleValue(null);
        }
        (props as { onChange?: (val: T | null, opt: DropdownOption<T> | null) => void }).onChange?.(
          null,
          null
        );
      } else {
        if (!isMultiControlled) {
          setUncontrolledMultiValue([]);
        }
        (props as { onChange?: (vals: T[], opts: DropdownOption<T>[]) => void }).onChange?.(
          [],
          []
        );
      }

      onClear?.();
      setSearchQuery('');
    },
    [disabled, isMulti, isSingleControlled, isMultiControlled, props, onClear]
  );

  // ─────────────────────────────────────────────────────────────
  // 6. AKSESIBILITAS KEYBOARD
  // ─────────────────────────────────────────────────────────────
  const { handleKeyDown } = useDropdownKeyboard({
    disabled,
    isOpen,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    open,
    close,
    selectOption,
  });

  return {
    isOpen,
    open,
    close,
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
    removeMultiOption,
    handleClear,
    handleKeyDown,
    highlightedIndex,
    setHighlightedIndex,
    containerRef,
    searchInputRef,
    clearable,
  };
}
