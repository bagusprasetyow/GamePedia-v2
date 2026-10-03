import { useState, forwardRef } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { TextInput } from '../TextInput';
import type { EmailInputProps } from './EmailInput.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Helpers & Validation Regex
// ─────────────────────────────────────────────────────────────

// Regex standar validasi alamat email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * EmailInput Component - Molecule UI Element
 * 
 * Komponen bidang masukan alamat email khusus berbasis `TextInput`.
 * Dilengkapi validasi format email otomatis, auto-lowercase tanpa spasi,
 * ikon email terintegrasi, dan penanganan status error/success.
 */
export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(({
  forceLowercase = true,
  validateOnBlur = true,
  validateOnChange = false,
  invalidErrorMessage = 'Format alamat email tidak valid',
  label = 'Email',
  placeholder = 'nama@email.com',
  startIcon = 'mdi:email-outline',
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management, Validation & Handlers
  // ─────────────────────────────────────────────────────────────
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    String(value ?? defaultValue ?? '')
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sanitasi email: buang spasi & opsional paksa huruf kecil
  const sanitizeEmail = (rawText: string): string => {
    let result = rawText.replace(/\s+/g, '');
    if (forceLowercase) {
      result = result.toLowerCase();
    }
    return result;
  };

  const validateEmailFormat = (emailText: string): boolean => {
    if (!emailText) return true;
    return EMAIL_REGEX.test(emailText);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = sanitizeEmail(rawValue);

    if (!isControlled) {
      setInternalValue(sanitized);
    }

    if (sanitized !== rawValue) {
      e.target.value = sanitized;
    }

    if (validateOnChange) {
      if (sanitized && !validateEmailFormat(sanitized)) {
        setValidationError(invalidErrorMessage);
      } else {
        setValidationError(null);
      }
    } else if (validationError) {
      if (!sanitized || validateEmailFormat(sanitized)) {
        setValidationError(null);
      }
    }

    onChange?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const textToValidate = e.target.value;

    if (validateOnBlur && textToValidate) {
      if (!validateEmailFormat(textToValidate)) {
        setValidationError(invalidErrorMessage);
      } else {
        setValidationError(null);
      }
    }

    onBlur?.(e);
  };

  const computedError = error || validationError;
  const currentValueStr = String(isControlled ? (value ?? '') : internalValue);
  const isSuccess = restProps.success ?? (
    Boolean(currentValueStr) && !computedError && validateEmailFormat(currentValueStr)
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output (Atomic Component Compliant)
  // ─────────────────────────────────────────────────────────────
  return (
    <TextInput
      ref={ref}
      type="email"
      label={label}
      placeholder={placeholder}
      startIcon={startIcon}
      value={isControlled ? value : internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      allowSpaces={false}
      error={computedError}
      success={isSuccess}
      {...restProps}
    />
  );
});

EmailInput.displayName = 'EmailInput';

export default EmailInput;
