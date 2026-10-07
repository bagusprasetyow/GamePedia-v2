import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import type { ReactElement, ForwardedRef, Ref, KeyboardEvent, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import type {
  SegmentedControlProps,
  SegmentedControlOption,
} from './SegmentedControl.types';
import {
  sizeStyles,
  depthClasses,
  resolveDepthKey,
  containerBaseClasses,
  indicatorBaseClasses,
  indicatorColorStyles,
  indicatorRadiusMap,
} from './SegmentedControl.styles';
import {
  isOptionDisabled,
  findFirstEnabledIndex,
  findLastEnabledIndex,
  findNextEnabledIndex,
  findPreviousEnabledIndex,
  getInitialSegmentValue,
} from './SegmentedControl.utils';
import { SegmentedControlItem } from './components/SegmentedControlItem';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Tokens & Styling Setup
// ─────────────────────────────────────────────────────────────

function SegmentedControlInner<T extends string | number = string>(
  props: SegmentedControlProps<T>,
  ref: ForwardedRef<HTMLDivElement>
): ReactElement {
  const {
    options = [],
    value: controlledValue,
    defaultValue,
    onChange,
    size = 'md',
    color = 'primary',
    depth = -1,
    fullWidth = false,
    disabled = false,
    ariaLabel = 'Pilihan segmen kontrol',
    name,
    wrapperClassName = '',
    className = '',
    ...restProps
  } = props;

  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State, Selection, Roving Tabindex & Handlers
  // ─────────────────────────────────────────────────────────────
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T | undefined>(() =>
    getInitialSegmentValue(options, defaultValue, disabled)
  );

  const activeValue = isControlled ? controlledValue : internalValue;

  // Indeks aktif saat ini dalam daftar opsi
  const activeIndex = options.findIndex((opt) => opt.value === activeValue);

  // Roving tabindex diturunkan dari focusedIndex manual jika ada, atau mengacu pada opsi aktif/pertama
  const [userFocusedIndex, setUserFocusedIndex] = useState<number | null>(null);

  const effectiveFocusedIndex = (() => {
    if (userFocusedIndex !== null && userFocusedIndex >= 0 && userFocusedIndex < options.length) {
      return userFocusedIndex;
    }
    if (activeIndex !== -1 && !isOptionDisabled(options[activeIndex], disabled)) {
      return activeIndex;
    }
    const firstEnabled = findFirstEnabledIndex(options, disabled);
    return firstEnabled !== -1 ? firstEnabled : 0;
  })();

  const itemsContainerRef = useRef<HTMLDivElement | null>(null);

  // ─────────────────────────────────────────────────────────────
  // 3. ANIMASI: Sliding Pill Indicator Calculation
  // ─────────────────────────────────────────────────────────────
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({ opacity: 0 });

  const updateIndicator = useCallback(() => {
    const container = itemsContainerRef.current;
    if (!container || activeIndex === -1) {
      setIndicatorStyle({ opacity: 0 });
      return;
    }

    const buttons = container.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
    const activeButton = buttons[activeIndex];

    if (activeButton) {
      setIndicatorStyle({
        left: `${activeButton.offsetLeft}px`,
        top: `${activeButton.offsetTop}px`,
        width: `${activeButton.offsetWidth}px`,
        height: `${activeButton.offsetHeight}px`,
        opacity: 1,
      });
    } else {
      setIndicatorStyle({ opacity: 0 });
    }
  }, [activeIndex]);

  useEffect(() => {
    updateIndicator();

    const container = itemsContainerRef.current;
    if (typeof ResizeObserver !== 'undefined' && container) {
      const ro = new ResizeObserver(() => {
        updateIndicator();
      });
      ro.observe(container);
      return () => {
        ro.disconnect();
      };
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateIndicator);
      return () => window.removeEventListener('resize', updateIndicator);
    }
  }, [updateIndicator, options, size, fullWidth]);

  const handleSelect = (newValue: T) => {
    if (disabled) return;

    const targetIndex = options.findIndex((opt) => opt.value === newValue);
    if (targetIndex === -1) return;

    const targetOption = options[targetIndex];
    if (isOptionDisabled(targetOption, disabled)) return;

    // Hanya panggil onChange jika nilai benar-benar berubah
    if (newValue !== activeValue) {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }

    setUserFocusedIndex(targetIndex);
  };

  // Navigasi Keyboard WAI-ARIA Radio Group
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || options.length === 0) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (effectiveFocusedIndex >= 0 && effectiveFocusedIndex < options.length) {
        const focusedOption = options[effectiveFocusedIndex];
        if (!isOptionDisabled(focusedOption, disabled)) {
          handleSelect(focusedOption.value);
        }
      }
      return;
    }

    let targetIndex: number;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault();
        targetIndex = findNextEnabledIndex(options, effectiveFocusedIndex, disabled);
        break;
      }

      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault();
        targetIndex = findPreviousEnabledIndex(options, effectiveFocusedIndex, disabled);
        break;
      }

      case 'Home': {
        e.preventDefault();
        targetIndex = findFirstEnabledIndex(options, disabled);
        break;
      }

      case 'End': {
        e.preventDefault();
        targetIndex = findLastEnabledIndex(options, disabled);
        break;
      }

      default:
        return;
    }

    if (targetIndex !== -1 && targetIndex !== effectiveFocusedIndex) {
      setUserFocusedIndex(targetIndex);
      const targetOption = options[targetIndex];
      if (targetOption && !isOptionDisabled(targetOption, disabled)) {
        handleSelect(targetOption.value);

        // Pindahkan fokus DOM ke tombol target
        const container = itemsContainerRef.current;
        if (container) {
          const buttons = container.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
          buttons[targetIndex]?.focus();
        }
      }
    }
  };


  const currentSize = sizeStyles[size] || sizeStyles.md;
  const depthKey = resolveDepthKey(depth);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['-1'];

  const containerClasses = cn(
    // layout & base
    containerBaseClasses,
    fullWidth ? 'w-full flex' : 'inline-flex w-fit',
    currentSize.gap,
    // spacing
    currentSize.container,
    // shadow & depth
    resolvedDepthClass,
    // state
    disabled && 'opacity-60 cursor-not-allowed',
    className
  );

  const indicatorClasses = cn(
    // position & base
    indicatorBaseClasses,
    // border
    indicatorRadiusMap[size],
    // background & variant
    indicatorColorStyles[color]
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  const content = (
    <div
      ref={(node) => {
        itemsContainerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled ? 'true' : undefined}
      className={containerClasses}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      {/* Sliding Pill Indicator */}
      <div
        data-testid="segmented-control-indicator"
        className={indicatorClasses}
        style={indicatorStyle}
        aria-hidden="true"
      />

      {options.map((option: SegmentedControlOption<T>, index: number) => {
        const isSelected = option.value === activeValue;
        const isDisabled = isOptionDisabled(option, disabled);
        const isFocused = index === effectiveFocusedIndex;

        return (
          <SegmentedControlItem<T>
            key={String(option.value)}
            option={option}
            isSelected={isSelected}
            isDisabled={isDisabled}
            isFocused={isFocused}
            size={size}
            color={color}
            fullWidth={fullWidth}
            iconSize={currentSize.iconSize}
            onSelect={handleSelect}
            onFocus={() => setUserFocusedIndex(index)}
          />
        );

      })}

      {name && activeValue !== undefined && (
        <input type="hidden" name={name} value={String(activeValue)} />
      )}
    </div>
  );

  if (wrapperClassName) {
    const wrapperClasses = cn(
      // position
      'relative',
      // size
      fullWidth ? 'w-full' : 'w-fit',
      wrapperClassName
    );

    return <div className={wrapperClasses}>{content}</div>;
  }

  return content;
}

/**
 * SegmentedControl Component - Atomic UI Element
 *
 * Komponen kumpulan pilihan segmen interaktif terenkapsulasi penuh dengan
 * dukungan Depth System alur cekung (-3 s/d 3), warna tema semantik GamePedia,
 * mode controlled/uncontrolled, integrasi ikon, navigasi keyboard roving tabindex,
 * serta aksesibilitas standar WAI-ARIA Radio Group.
 */
export const SegmentedControl = forwardRef(SegmentedControlInner) as <
  T extends string | number = string,
>(
  props: SegmentedControlProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement;

export default SegmentedControl;
