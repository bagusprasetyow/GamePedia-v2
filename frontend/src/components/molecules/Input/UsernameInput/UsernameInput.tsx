import { useState, forwardRef } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { Icon, Text } from '@/components/atoms';
import { TextInput } from '../TextInput';
import type { UsernameInputProps, UsernameAvailability } from './UsernameInput.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Helper Functions & Sanitizers
// ─────────────────────────────────────────────────────────────

/**
 * Sanitasi karakter username: lowercase, tanpa spasi, hanya karakter diizinkan.
 */
const sanitizeUsername = (
  rawText: string,
  options: {
    forceLowercase: boolean;
    allowUnderscore: boolean;
    allowDot: boolean;
    allowHyphen: boolean;
  }
): string => {
  let result = rawText;

  // Paksa huruf kecil
  if (options.forceLowercase) {
    result = result.toLowerCase();
  }

  // Buang spasi
  result = result.replace(/\s+/g, '');

  // Bangun regex izin karakter valid
  const allowedChars: string[] = ['a-z0-9'];
  if (options.allowUnderscore) allowedChars.push('_');
  if (options.allowDot) allowedChars.push('\\.');
  if (options.allowHyphen) allowedChars.push('\\-');

  const regex = new RegExp(`[^${allowedChars.join('')}]`, 'g');
  result = result.replace(regex, '');

  return result;
};

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
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management, Validation & Handlers
  // ─────────────────────────────────────────────────────────────
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    String(value ?? defaultValue ?? '')
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = sanitizeUsername(rawValue, {
      forceLowercase,
      allowUnderscore,
      allowDot,
      allowHyphen,
    });

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
          <Text as="span" className="flex items-center text-primary" title="Mengecek ketersediaan...">
            <Icon icon="mdi:loading" size="xs" className="animate-spin" />
          </Text>
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
      <Text as="span" size="xs" weight="bold" className="text-muted-foreground/80 pr-0.5 select-none">
        {prefixSymbol}
      </Text>
    ) : undefined
  );

  // End Adornment (gabungan indikator ketersediaan & adornment kustom)
  const computedEndAdornment = endAdornment || renderAvailabilityIndicator();

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output (Atomic Component Compliant)
  // ─────────────────────────────────────────────────────────────
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
