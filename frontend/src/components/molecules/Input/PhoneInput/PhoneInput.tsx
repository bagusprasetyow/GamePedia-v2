import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import { TextInput } from '../TextInput';
import type { PhoneInputProps } from './PhoneInput.types';
import { usePhoneInput } from './usePhoneInput';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

/**
 * PhoneInput Component - Molecule UI Element
 * 
 * Komponen bidang masukan nomor telepon khusus berbasis `TextInput`.
 * Mendukung 4 kategori nomor telepon Indonesia & Internasional:
 * 1. Seluler (0812-3456-7890 | +62-812-3456-7890)
 * 2. Telepon Tetap/PSTN Landline (021-7654321 | 0361-234567 | +62-21-7654321)
 * 3. Call Center Perusahaan (14045, 14000 | 1500-123)
 * 4. Bebas Pulsa & Premium Call (0800-1-123456 | 0809-1-999999)
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({
  autoFormatHyphen = true,
  hyphenSymbol = '-',
  countryCode = '+62',
  allowPlusPrefix = true,
  allowHyphens = true,
  minDigits = 5,
  maxDigits = 14,
  validateOnBlur = true,
  validateOnChange = false,
  invalidErrorMessage,
  label = 'Nomor Telepon',
  placeholder = '812-3456-7890',
  startIcon = 'mdi:phone-outline',
  startAdornment,
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Custom Hook Logic & Handlers
  // ─────────────────────────────────────────────────────────────
  const isControlled = value !== undefined;

  const {
    internalValue,
    computedError,
    isSuccess,
    handleChange,
    handleBlur,
  } = usePhoneInput({
    value,
    defaultValue,
    autoFormatHyphen,
    hyphenSymbol,
    allowPlusPrefix,
    allowHyphens,
    minDigits,
    maxDigits,
    validateOnBlur,
    validateOnChange,
    invalidErrorMessage,
    onChange,
    onBlur,
    error,
    isControlled,
    ...restProps,
  });

  // Enkapsulasi ClassName Country Code Prefix
  const countryCodeClasses = cn(
    // layout
    'flex items-center select-none shrink-0',
    // spacing & border
    'pr-1.5 border-r border-border/60 mr-1',
    // typography & text
    'text-xs font-bold text-muted-foreground/90'
  );

  // Render prefix Kode Negara di startAdornment jika diset
  const computedStartAdornment = startAdornment || (
    countryCode ? (
      <Text as="span" size="xs" weight="bold" className={countryCodeClasses}>
        {countryCode}
      </Text>
    ) : undefined
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output (Atomic Component Compliant)
  // ─────────────────────────────────────────────────────────────
  return (
    <TextInput
      ref={ref}
      type="tel"
      label={label}
      placeholder={placeholder}
      startIcon={startIcon}
      startAdornment={computedStartAdornment}
      value={isControlled ? value : internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      error={computedError}
      success={isSuccess}
      {...restProps}
    />
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
