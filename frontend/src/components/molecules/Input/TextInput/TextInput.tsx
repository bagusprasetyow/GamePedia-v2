import { useState, forwardRef } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { cn } from '@/lib/utils';
import { Input, Text } from '@/components/atoms';
import type { TextInputProps, TextTransformCase } from './TextInput.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Helpers & Styling Variables
// ─────────────────────────────────────────────────────────────

// Helper fungsi transformasi teks
const applyTransformCase = (text: string, transform: TextTransformCase): string => {
  if (!text) return text;
  switch (transform) {
    case 'lowercase':
      return text.toLowerCase();
    case 'uppercase':
      return text.toUpperCase();
    case 'capitalize':
      return text.charAt(0).toUpperCase() + text.slice(1);
    case 'titlecase':
      return text.replace(/\b\w/g, (char) => char.toUpperCase());
    case 'none':
    default:
      return text;
  }
};

/**
 * TextInput Component - Molecule UI Element
 * 
 * Komponen bidang masukan teks khusus (single-line text field) berbasis atom `Input`.
 * Dilengkapi fitur transformasi kasus huruf (uppercase/lowercase/titlecase),
 * sanitasi spasi, penghitung karakter (character counter), dan trimming otomatis.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  transformCase = 'none',
  showCount = false,
  allowSpaces = true,
  trimOnBlur = false,
  footerRight,
  maxLength,
  value,
  defaultValue,
  onChange,
  onBlur,
  description,
  startIcon,
  clearable = false,
  className = '',
  type = 'text',
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management & Event Handlers
  // ─────────────────────────────────────────────────────────────
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    String(value ?? defaultValue ?? '')
  );

  const currentValue = isControlled ? String(value ?? '') : internalValue;
  const currentLength = currentValue.length;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;

    // Filter spasi jika allowSpaces diset false
    if (!allowSpaces) {
      rawValue = rawValue.replace(/\s+/g, '');
    }

    // Terapkan transformasi huruf
    const transformedValue = applyTransformCase(rawValue, transformCase);

    if (!isControlled) {
      setInternalValue(transformedValue);
    }

    // Buat event sintetis jika teks bertransformasi
    if (transformedValue !== e.target.value) {
      e.target.value = transformedValue;
    }

    onChange?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (trimOnBlur && currentValue) {
      const trimmed = currentValue.trim();
      if (trimmed !== currentValue) {
        if (!isControlled) {
          setInternalValue(trimmed);
        }
        e.target.value = trimmed;
        onChange?.(e as unknown as ChangeEvent<HTMLInputElement>);
      }
    }
    onBlur?.(e);
  };

  // Enkapsulasi ClassName Elemen Pendukung
  const footerRightWrapperClasses = cn(
    // layout
    'flex items-center gap-2 select-none shrink-0 ml-auto',
    // typography & text
    'text-2xs text-muted-foreground'
  );

  const counterTextClasses = cn(
    maxLength && currentLength >= maxLength && 'text-destructive font-semibold'
  );

  const descriptionFooterClasses = cn(
    // layout
    'flex items-center justify-between gap-2 w-full'
  );

  // Keterangan Footer Kanan (Character Count / Footer Right)
  const renderFooterRight = () => {
    if (!showCount && !footerRight) return null;

    return (
      <div className={footerRightWrapperClasses}>
        {footerRight}
        {showCount && (
          <Text as="span" size="xs" className={counterTextClasses}>
            {currentLength}{maxLength ? `/${maxLength}` : ''}
          </Text>
        )}
      </div>
    );
  };

  // Jika ada description atau showCount, kita manipulasi footer melalui description propping atau kustomisasi
  const hasCustomFooter = Boolean(showCount || footerRight);

  const combinedDescription = hasCustomFooter ? (
    <div className={descriptionFooterClasses}>
      <Text as="span" size="xs" className="truncate">{description}</Text>
      {renderFooterRight()}
    </div>
  ) : (
    description
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output (Atomic Component Compliant)
  // ─────────────────────────────────────────────────────────────
  return (
    <Input
      ref={ref}
      type={type}
      value={isControlled ? value : internalValue}
      maxLength={maxLength}
      onChange={handleChange}
      onBlur={handleBlur}
      startIcon={startIcon}
      clearable={clearable}
      description={combinedDescription}
      className={className}
      {...restProps}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
