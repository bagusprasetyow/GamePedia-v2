import { useState, useRef, useId, forwardRef } from 'react';
import type { ChangeEvent, MouseEvent, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/Icon';
import type { InputProps } from './Input.types';
import {
  sizeStyles,
  variantStyles,
  depthClasses,
  resolveDepthKey,
  adornmentClasses,
} from './Input.styles';
import { InputLabel } from './components/InputLabel';
import { InputClearButton } from './components/InputClearButton';
import { InputHelperText } from './components/InputHelperText';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di Input.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Input Component - Atomic UI Element
 *
 * Komponen input universal sebagai pondasi formulir UI GamePedia.
 * Mendukung Depth System (-3 s/d 3), varian outline/filled/ghost,
 * prefix/suffix adornments, icons, tombol clear instan, dan status validasi.
 *
 * @param {InputSize} [props.size='md'] - Skala ukuran input ('sm', 'md', 'lg')
 * @param {InputVariant} [props.variant='outline'] - Varian gaya visual ('outline', 'filled', 'ghost')
 * @param {InputDepth} [props.depth=-1] - Skala kedalaman Depth System (-3 s/d 3), default -1 (cekung/sunken)
 * @param {ReactNode} [props.label] - Teks label di atas bidang input
 * @param {ReactNode} [props.description] - Teks keterangan di bawah bidang input
 * @param {ReactNode} [props.error] - Pesan kesalahan validasi (mengaktifkan status visual invalid)
 * @param {boolean} [props.success=false] - Status validasi sukses (border & ring hijau)
 * @param {'absolute' | 'relative'} [props.errorPosition='absolute'] - Posisi peletakan pesan error/keterangan
 * @param {string} [props.startIcon] - Ikon Iconify di sisi kiri input
 * @param {string} [props.endIcon] - Ikon Iconify di sisi kanan input
 * @param {ReactNode} [props.startAdornment] - Elemen kustom di sisi kiri input (prefix/badge)
 * @param {ReactNode} [props.endAdornment] - Elemen kustom di sisi kanan input (suffix/action)
 * @param {boolean} [props.clearable=false] - Menampilkan tombol clear cepat saat terisi
 * @param {() => void} [props.onClear] - Callback ketika tombol clear diklik
 * @param {boolean} [props.fullWidth=true] - Menyesuaikan lebar input membentang 100%
 * @param {string} [props.wrapperClassName] - ClassName tambahan untuk kontainer terluar
 * @param {string} [props.className] - ClassName tambahan untuk elemen input native
 *
 * @returns {ReactElement} Elemen input formulir terenkapsulasi
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
}, ref): ReactElement => {
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

  const safeSize = sizeStyles[size] ? size : 'md';
  const sizeStyle = sizeStyles[safeSize];
  const variantClass = variantStyles[variant] || variantStyles.outline;
  const depthKey = resolveDepthKey(depth);
  const resolvedDepth = depthClasses[depthKey] || depthClasses['-1'];

  const hasError = Boolean(error);
  const isSuccess = Boolean(success) && !hasError;

  // Enkapsulasi ClassName Kontainer Luar
  const outerWrapperClasses = cn(
    // layout
    'flex flex-col gap-1.5',
    // position
    'relative',
    // size
    fullWidth ? 'w-full' : 'w-auto inline-flex',
    // state
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
    // state
    hasError
      ? 'border-destructive text-destructive focus-within:border-destructive focus-within:ring-destructive/25'
      : isSuccess
        ? 'border-success text-success focus-within:border-success focus-within:ring-success/25'
        : disabled
          ? 'bg-muted/40 cursor-not-allowed'
          : '',
    // transition
    'transition-all duration-200'
  );

  // Enkapsulasi ClassName Input Element
  const nativeInputClasses = cn(
    // size
    'w-full',
    sizeStyle.input,
    // background
    'bg-transparent',
    // typography & text
    'text-foreground placeholder:text-muted-foreground/70',
    // focus
    'outline-none',
    // state
    'disabled:cursor-not-allowed',
    // interaction & webkit
    '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
    className
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={outerWrapperClasses}>
      {/* 3.1 Label */}
      {label && (
        <InputLabel
          inputId={inputId}
          label={label}
          required={required}
        />
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
          <InputClearButton
            size={sizeStyle.clearIconSize}
            onClick={handleClear}
          />
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
      <InputHelperText
        error={error}
        description={description}
        errorId={errorId}
        descId={descId}
        errorPosition={errorPosition}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
