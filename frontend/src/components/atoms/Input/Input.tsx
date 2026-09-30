import { useState, useRef, useId, forwardRef } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../Icon';
import type { IconSize } from '../Icon/Icon.types';
import type {
  InputProps,
  InputSize,
  InputVariant,
} from './Input.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────
interface SizeStyle {
  container: string;
  input: string;
  iconSize: IconSize;
  clearIconSize: IconSize;
  adornmentGap: string;
}

const sizeStyles: Record<InputSize, SizeStyle> = {
  sm: {
    container: 'h-8 px-2.5 text-xs rounded-lg',
    input: 'text-xs',
    iconSize: 'sm',
    clearIconSize: 'xs',
    adornmentGap: 'gap-1.5',
  },
  md: {
    container: 'h-10 px-3.5 text-sm rounded-xl',
    input: 'text-sm',
    iconSize: 'md',
    clearIconSize: 'sm',
    adornmentGap: 'gap-2',
  },
  lg: {
    container: 'h-12 px-4 text-base rounded-xl',
    input: 'text-base',
    iconSize: 'lg',
    clearIconSize: 'md',
    adornmentGap: 'gap-2.5',
  },
};

const variantStyles: Record<InputVariant, string> = {
  outline: 'bg-background border-2 border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
  filled: 'bg-muted/70 border-2 border-transparent focus-within:bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
  ghost: 'bg-transparent border-2 border-transparent focus-within:bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
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
 * Input Component - Atomic UI Element
 * 
 * Komponen input universal sebagai pondasi formulir UI GamePedia.
 * Mendukung Depth System (-3 s/d 3), varian outline/filled/ghost,
 * prefix/suffix adornments, icons, tombol clear instan, dan status validasi.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  size = 'md',
  variant = 'outline',
  depth = -1,
  label,
  description,
  error,
  success = false,
  errorPosition = 'absolute',
  startIcon,
  endIcon,
  startAdornment,
  endAdornment,
  clearable = false,
  onClear,
  fullWidth = true,
  wrapperClassName = '',
  className = '',
  id,
  value,
  defaultValue,
  disabled = false,
  readOnly = false,
  required = false,
  onChange,
  type = 'text',
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const descId = `${inputId}-desc`;

  const innerRef = useRef<HTMLInputElement | null>(null);

  // Menyinkronkan ref eksternal dan lokal
  const assignRef = (element: HTMLInputElement | null) => {
    innerRef.current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  // State untuk melacak apakah input memiliki nilai (khusus tombol clear)
  const isControlled = value !== undefined;
  const [internalHasValue, setInternalHasValue] = useState<boolean>(
    Boolean(defaultValue || (isControlled && value !== ''))
  );

  const hasValue = isControlled ? String(value ?? '').length > 0 : internalHasValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalHasValue(e.target.value.length > 0);
    }
    onChange?.(e);
  };

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (innerRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(innerRef.current, '');
      } else {
        innerRef.current.value = '';
      }

      const syntheticEvent = new Event('input', { bubbles: true });
      innerRef.current.dispatchEvent(syntheticEvent);
      innerRef.current.focus();
    }

    if (!isControlled) {
      setInternalHasValue(false);
    }

    onClear?.();
  };

  const sizeStyle = sizeStyles[size] || sizeStyles.md;
  const variantClass = variantStyles[variant] || variantStyles.outline;
  const depthKey = String(depth);
  const resolvedDepth = depthClasses[depthKey] || depthClasses['-1'];

  const hasError = Boolean(error);
  const isSuccess = Boolean(success) && !hasError;
  const hasFooter = Boolean(hasError || description);

  // Enkapsulasi ClassName Kontainer Luar
  const outerWrapperClasses = cn(
    // layout
    'flex flex-col gap-1.5',
    // position
    'relative',
    // size
    fullWidth ? 'w-full' : 'w-auto inline-flex',
    // state
    errorPosition === 'absolute' && hasFooter,
    disabled && 'opacity-60 cursor-not-allowed',
    wrapperClassName
  );

  // Enkapsulasi ClassName Input Box Field
  const fieldContainerClasses = cn(
    // layout
    'flex items-center select-none',
    // position
    'relative',
    // size & spacing
    sizeStyle.container,
    sizeStyle.adornmentGap,
    // border & background
    variantClass,
    // shadow & depth
    resolvedDepth,
    // focus
    'outline-none',
    // transition
    'transition-all duration-200',
    // state
    hasError
      ? 'border-destructive text-destructive focus-within:border-destructive focus-within:ring-destructive/25'
      : isSuccess
        ? 'border-success text-success focus-within:border-success focus-within:ring-success/25'
        : disabled
          ? 'bg-muted/40 cursor-not-allowed'
          : ''
  );

  // Enkapsulasi ClassName Input Element
  const nativeInputClasses = cn(
    // layout
    'w-full bg-transparent outline-none',
    // typography & text
    'text-foreground placeholder:text-muted-foreground/70',
    // size & spacing
    sizeStyle.input,
    // state
    'disabled:cursor-not-allowed',
    // hide webkit search cancel button
    '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
    className
  );

  // Enkapsulasi ClassName Elemen Pendukung
  const labelClasses = cn(
    // layout
    'flex items-center gap-1 select-none',
    // typography & text
    'text-xs font-semibold text-foreground'
  );

  const adornmentClasses = cn(
    // layout
    'flex shrink-0 items-center select-none',
    // text
    'text-muted-foreground'
  );

  const clearButtonClasses = cn(
    // layout
    'flex shrink-0 items-center justify-center',
    // spacing
    'p-0.5 -mr-1.5',
    // border
    'rounded-full',
    // text & interaction
    'text-muted-foreground hover:text-destructive',
    // focus
    'focus:outline-none',
    // transition
    'transition-colors'
  );

  const errorTextClasses = cn(
    // layout
    'flex items-center gap-1',
    // typography & text
    'text-xs font-medium text-destructive',
    // transition & animation
    'transition-all',
    errorPosition === 'absolute'
      ? 'absolute left-0 right-0 top-full mt-1 z-10 animate-in fade-in slide-in-from-top-1 duration-150'
      : 'mt-0'
  );

  const descriptionTextClasses = cn(
    // layout & size
    'w-full',
    // typography & text
    'text-xs text-muted-foreground',
    // transition
    'transition-all',
    errorPosition === 'absolute'
      ? 'absolute left-0 right-0 top-full mt-1 z-10'
      : 'mt-0'
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={outerWrapperClasses}>
      {/* 3.1 Label */}
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="text-destructive font-bold" aria-hidden="true">*</span>}
        </label>
      )}

      {/* 3.2 Visual Input Field Container */}
      <div className={fieldContainerClasses}>
        {/* Start Adornment / Start Icon */}
        {startAdornment && (
          <span className={adornmentClasses}>
            {startAdornment}
          </span>
        )}
        {startIcon && !startAdornment && (
          <Icon
            icon={startIcon}
            size={sizeStyle.iconSize}
            className={cn('shrink-0 text-muted-foreground', hasError && 'text-destructive')}
          />
        )}

        {/* Native HTML Input */}
        <input
          ref={assignRef}
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : description ? descId : undefined}
          className={nativeInputClasses}
          {...restProps}
        />

        {/* Clear Button */}
        {clearable && hasValue && !disabled && !readOnly && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            className={clearButtonClasses}
            aria-label="Bersihkan input"
          >
            <Icon icon="mdi:close" size={sizeStyle.clearIconSize} />
          </button>
        )}

        {/* End Icon / End Adornment */}
        {endIcon && !endAdornment && (
          <Icon
            icon={endIcon}
            size={sizeStyle.iconSize}
            className={cn('shrink-0 text-muted-foreground', hasError && 'text-destructive')}
          />
        )}
        {endAdornment && (
          <span className={adornmentClasses}>
            {endAdornment}
          </span>
        )}
      </div>

      {/* 3.3 Error Message / Description Helper Text */}
      {hasError ? (
        <span id={errorId} role="alert" className={errorTextClasses}>
          <Icon icon="mdi:alert-circle" size="2xs" className="shrink-0" />
          <span className="truncate">{error}</span>
        </span>
      ) : description ? (
        <span id={descId} className={descriptionTextClasses}>
          {description}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
