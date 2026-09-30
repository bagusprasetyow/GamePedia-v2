import { useState, forwardRef } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { TextInput } from '../TextInput';
import type { FullNameInputProps } from './FullNameInput.types';

// Helper memformat Title Case (Budi Santoso)
const toTitleCase = (str: string): string => {
  return str.replace(/\b[a-zA-Z\u00C0-\u024F]+/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
};

/**
 * FullNameInput Component - Molecule UI Element
 * 
 * Komponen input spesifik untuk pengisian nama lengkap pengguna.
 * Dilengkapi fitur pemformatan Title Case otomatis, filter angka & karakter khusus,
 * serta validasi jumlah kata (Nama Depan + Nama Belakang).
 */
export const FullNameInput = forwardRef<HTMLInputElement, FullNameInputProps>(({
  autoTitleCase = true,
  allowNumbers = false,
  allowSpecialChars = false,
  minWords,
  minWordsErrorMessage,
  label = 'Nama Lengkap',
  placeholder = 'Masukkan nama lengkap Anda...',
  startIcon = 'mdi:account',
  trimOnBlur = true,
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
  ...restProps
}, ref) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    String(value ?? defaultValue ?? '')
  );

  const currentValue = isControlled ? String(value ?? '') : internalValue;

  // Sanitasi teks nama
  const sanitizeName = (rawText: string): string => {
    let result = rawText;

    // Filter angka jika tidak diizinkan
    if (!allowNumbers) {
      result = result.replace(/[0-9]/g, '');
    }

    // Filter simbol khusus jika tidak diizinkan (kecuali spasi, petik tunggal ', dan tanda -)
    if (!allowSpecialChars) {
      result = result.replace(/[^a-zA-Z\u00C0-\u024F\s'-]/g, '');
    }

    // Ubah ke Title Case jika autoTitleCase aktif
    if (autoTitleCase) {
      result = toTitleCase(result);
    }

    return result;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = sanitizeName(rawValue);

    if (!isControlled) {
      setInternalValue(sanitized);
    }

    if (sanitized !== rawValue) {
      e.target.value = sanitized;
    }

    onChange?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
  };

  // Validasi minWords
  let computedError = error;
  if (!computedError && minWords && currentValue.trim()) {
    const wordsCount = currentValue.trim().split(/\s+/).filter(Boolean).length;
    if (wordsCount < minWords) {
      computedError = minWordsErrorMessage || `Masukkan minimal ${minWords} kata nama lengkap`;
    }
  }

  return (
    <TextInput
      ref={ref}
      label={label}
      placeholder={placeholder}
      startIcon={startIcon}
      value={isControlled ? value : internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      trimOnBlur={trimOnBlur}
      error={computedError}
      {...restProps}
    />
  );
});

FullNameInput.displayName = 'FullNameInput';

export default FullNameInput;
