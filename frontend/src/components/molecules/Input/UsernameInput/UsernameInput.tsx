import { useState, forwardRef } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { Icon } from '@/components/atoms';
import { TextInput } from '../TextInput';
import type { UsernameInputProps, UsernameAvailability } from './UsernameInput.types';

/**
 * UsernameInput Component - Molecule UI Element
 * 
 * Komponen input spesifik untuk pengisian nama pengguna (username).
 * Dilengkapi prefix '@', sanitasi huruf kecil tanpa spasi, filter karakter valid,
 * serta indikator ketersediaan username (idle, checking, available, taken).
 */
export const UsernameInput = forwardRef<HTMLInputElement, UsernameInputProps>(({
  availability = 'idle',
  takenErrorMessage = 'Username ini sudah digunakan',
  prefixSymbol = '@',
  showPrefix = true,
  showAvailabilityIndicator = true,
  forceLowercase = true,
  allowDot = true,
  allowUnderscore = true,
  allowHyphen = true,
  label = 'Username',
  placeholder = 'username_kamu',
  maxLength = 20,
  showCount = true,
  value,
  defaultValue,
  onChange,
  error,
  startAdornment,
  endAdornment,
  ...restProps
}, ref) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    String(value ?? defaultValue ?? '')
  );

  // Sanitasi karakter username
  const sanitizeUsername = (rawText: string): string => {
    let result = rawText;

    // Paksa huruf kecil
    if (forceLowercase) {
      result = result.toLowerCase();
    }

    // Buang spasi
    result = result.replace(/\s+/g, '');

    // Bangun regex izin karakter valid
    const allowedChars: string[] = ['a-z0-9'];
    if (allowUnderscore) allowedChars.push('_');
    if (allowDot) allowedChars.push('\\.');
    if (allowHyphen) allowedChars.push('\\-');

    const regex = new RegExp(`[^${allowedChars.join('')}]`, 'g');
    result = result.replace(regex, '');

    return result;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = sanitizeUsername(rawValue);

    if (!isControlled) {
      setInternalValue(sanitized);
    }

    if (sanitized !== rawValue) {
      e.target.value = sanitized;
    }

    onChange?.(e);
  };

  // Indikator Status Ketersediaan (Availability Indicator)
  const renderAvailabilityIndicator = (): ReactNode => {
    if (!showAvailabilityIndicator || availability === 'idle') return null;

    switch (availability as UsernameAvailability) {
      case 'checking':
        return (
          <span className="flex items-center text-primary" title="Mengecek ketersediaan...">
            <Icon icon="mdi:loading" size="xs" className="animate-spin" />
          </span>
        );
      case 'available':
        // Ikon centang dihilangkan, indikasi status tersedia diwakili oleh border hijau (success)
        return null;
      case 'taken':
        // Ikon silang dihilangkan, indikasi status error/terpakai diwakili oleh border merah & pesan error
        return null;
      default:
        return null;
    }
  };

  // Tentukan pesan error jika status 'taken'
  let computedError = error;
  if (!computedError && availability === 'taken') {
    computedError = takenErrorMessage;
  }

  // Tentukan status success untuk border hijau jika 'available'
  const isSuccess = restProps.success ?? (availability === 'available');

  // Prefix @ di sisi kiri
  const computedStartAdornment = startAdornment || (
    showPrefix ? (
      <span className="text-xs font-bold text-muted-foreground/80 pr-0.5 select-none">
        {prefixSymbol}
      </span>
    ) : undefined
  );

  // End Adornment (gabungan indikator ketersediaan & adornment kustom)
  const computedEndAdornment = endAdornment || renderAvailabilityIndicator();

  return (
    <TextInput
      ref={ref}
      label={label}
      placeholder={placeholder}
      value={isControlled ? value : internalValue}
      onChange={handleChange}
      allowSpaces={false}
      maxLength={maxLength}
      showCount={showCount}
      startAdornment={computedStartAdornment}
      endAdornment={computedEndAdornment}
      error={computedError}
      success={isSuccess}
      {...restProps}
    />
  );
});

UsernameInput.displayName = 'UsernameInput';

export default UsernameInput;
