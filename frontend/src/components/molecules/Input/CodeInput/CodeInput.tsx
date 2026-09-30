import { useState, useRef, useEffect, forwardRef, Fragment } from 'react';
import type { ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Input, Text, Icon } from '@/components/atoms';
import type { InputSize } from '@/components/atoms/Input/Input.types';
import type { CodeInputProps, CodeInputJustify, CodeInputAlign } from './CodeInput.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Helper Size Config
// ─────────────────────────────────────────────────────────────
interface SizeBoxConfig {
  box: string;
  font: string;
  container: string;
}

const sizeBoxMap: Record<InputSize, SizeBoxConfig> = {
  sm: {
    box: 'px-0 text-center',
    font: 'text-xs font-semibold',
    container: '[&>div.relative]:w-6 [&>div.relative]:h-8 [&>div.relative]:px-0 [&>div.relative]:justify-center',
  },
  md: {
    box: 'px-0 text-center',
    font: 'text-base font-bold',
    container: '[&>div.relative]:w-[30px] [&>div.relative]:h-10 [&>div.relative]:px-0 [&>div.relative]:justify-center',
  },
  lg: {
    box: 'px-0 text-center',
    font: 'text-xl font-bold',
    container: '[&>div.relative]:w-9 [&>div.relative]:h-12 [&>div.relative]:px-0 [&>div.relative]:justify-center',
  },
};

const justifyClasses: Record<CodeInputJustify, string> = {
  between: 'justify-between',
  center: 'justify-center gap-2.5',
  start: 'justify-start gap-2.5',
  end: 'justify-end gap-2.5',
  around: 'justify-around',
};

const alignClasses: Record<CodeInputAlign, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

const maxWidthClasses: Record<string, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  full: 'max-w-full',
  none: '',
};

/**
 * CodeInput Component - Molecule UI Element
 * 
 * Komponen dasar bidang masukan kode / OTP / PIN multi-digit berbasis atom `Input` dan `Text`.
 * Mendukung pengetikan cepat ultra-responsif, navigasi keyboard otomatis (auto-advance/backspace),
 * paste multi-digit, masking bulatan kata sandi, validasi numerik/alfanumerik, pemisah segmen (separator), dan Depth System (-3 s/d 3).
 * 
 * @param {number} [props.length=6] - Jumlah digit/kotak kode
 * @param {string} [props.value] - Nilai kode terformat (controlled)
 * @param {string} [props.defaultValue=''] - Nilai kode awal (uncontrolled)
 * @param {(value: string) => void} [props.onChange] - Callback saat nilai kode berubah
 * @param {(value: string) => void} [props.onComplete] - Callback saat seluruh digit terisi penuh
 * @param {CodeInputType} [props.type='numeric'] - Tipe karakter masukan ('numeric' | 'alphanumeric')
 * @param {boolean} [props.mask=false] - Menyembunyikan karakter kode dalam mode password
 * @param {CodeInputJustify} [props.justify='between'] - Penjajaran kotak ('between', 'center', 'start', dll.)
 * @param {CodeInputAlign} [props.align='left'] - Perataan teks label/deskripsi ('left', 'center', 'right')
 * @param {CodeInputMaxWidth} [props.maxWidth='xs'] - Batas lebar maksimum baris kotak kode ('xs', 'sm', 'md', 'lg', 'full', 'none')
 * @param {InputSize} [props.size='md'] - Skala ukuran kotak input ('sm', 'md', 'lg')
 * @param {InputVariant} [props.variant='outline'] - Varian visual ('outline', 'filled', 'ghost')
 * @param {InputDepth} [props.depth=-1] - Kedalaman visual taktil (Depth System: -3 s/d 3)
 */
export const CodeInput = forwardRef<HTMLDivElement, CodeInputProps>(({
  length = 6,
  value: controlledValue,
  defaultValue = '',
  onChange,
  onComplete,
  type = 'numeric',
  mask = false,
  justify = 'between',
  align = 'left',
  maxWidth = 'xs',
  size = 'md',
  variant = 'outline',
  depth = -1,
  label,
  description,
  error,
  success = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  className = '',
  separator,
  separatorPosition,
  uppercase = false,
  children,
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management & Handlers
  // ─────────────────────────────────────────────────────────────
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    String(controlledValue ?? defaultValue ?? '')
  );

  const currentPin = isControlled
    ? String(controlledValue ?? '')
    : internalValue;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal value jika controlled value berubah dari luar
  useEffect(() => {
    if (isControlled) {
      setInternalValue(String(controlledValue ?? ''));
    }
  }, [controlledValue, isControlled]);

  // Handle auto-focus ke indeks 0
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const validateChar = (char: string): boolean => {
    if (type === 'numeric') {
      return /^\d$/.test(char);
    }
    return /^[a-zA-Z0-9]$/.test(char);
  };

  const updatePinValue = (newPin: string) => {
    const trimmedPin = newPin.slice(0, length);
    if (!isControlled) {
      setInternalValue(trimmedPin);
    }
    onChange?.(trimmedPin);

    if (trimmedPin.length === length) {
      onComplete?.(trimmedPin);
    }
  };

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    const rawVal = event.target.value;

    const oldChar = currentPin[index] || '';
    let incomingText = rawVal;

    // Jika kotak sebelumnya sudah terisi (misal '5') dan pengguna mengetik digit baru (misal '56' atau '65')
    if (oldChar && rawVal.length > 1 && rawVal.includes(oldChar)) {
      if (rawVal.startsWith(oldChar)) {
        incomingText = rawVal.slice(oldChar.length);
      } else if (rawVal.endsWith(oldChar)) {
        incomingText = rawVal.slice(0, rawVal.length - oldChar.length);
      } else {
        incomingText = rawVal.replace(oldChar, '');
      }
    }

    // Kumpulkan seluruh karakter valid dari masukan (diubah ke uppercase jika aktif)
    const validChars = incomingText
      .split('')
      .filter(validateChar)
      .map((char) => (uppercase ? char.toUpperCase() : char));

    if (validChars.length === 0) {
      // Jika input dikosongkan (backspace murni pada kotak ini)
      if (rawVal === '') {
        const pinChars = currentPin.padEnd(length, ' ').split('').slice(0, length);
        pinChars[index] = ' ';
        const nextPin = pinChars.join('').trimEnd();
        updatePinValue(nextPin);
      }
      return;
    }

    // Buat array karakter PIN ukuran fixed length
    const pinChars = Array(length).fill('');
    for (let i = 0; i < length; i++) {
      if (currentPin[i]) {
        pinChars[i] = currentPin[i];
      }
    }

    // Distribusikan validChars mulai dari `index` (mengatasi pengetikan cepat & paste)
    let nextFocusIndex = index;
    for (let i = 0; i < validChars.length && index + i < length; i++) {
      pinChars[index + i] = validChars[i];
      nextFocusIndex = index + i + 1;
    }

    const nextPin = pinChars.join('').trimEnd();
    updatePinValue(nextPin);

    // Pindahkan fokus ke kotak berikutnya secara akurat
    const targetIndex = Math.min(nextFocusIndex, length - 1);
    if (inputRefs.current[targetIndex]) {
      inputRefs.current[targetIndex]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    if (event.key === 'Backspace') {
      const currentChar = currentPin[index];
      if (!currentChar && index > 0) {
        // Jika kotak saat ini kosong dan pengguna menekan Backspace,
        // pindah ke kotak sebelumnya dan hapus nilainya
        event.preventDefault();
        const pinChars = Array(length).fill('');
        for (let i = 0; i < length; i++) {
          if (currentPin[i]) pinChars[i] = currentPin[i];
        }
        pinChars[index - 1] = '';
        const nextPin = pinChars.join('').trimEnd();
        updatePinValue(nextPin);

        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').trim();
    if (!pastedData) return;

    const validChars = pastedData
      .split('')
      .filter(validateChar)
      .map((char) => (uppercase ? char.toUpperCase() : char))
      .slice(0, length);

    if (validChars.length > 0) {
      const newPin = validChars.join('');
      updatePinValue(newPin);

      const targetIndex = Math.min(validChars.length, length - 1);
      if (inputRefs.current[targetIndex]) {
        inputRefs.current[targetIndex]?.focus();
      }
    }
  };

  // Enkapsulasi ClassName Internal
  const sizeConfig = sizeBoxMap[size] || sizeBoxMap.md;

  const isPresetMaxWidth = maxWidthClasses[String(maxWidth)] !== undefined;
  const resolvedMaxWidthClass = isPresetMaxWidth ? maxWidthClasses[String(maxWidth)] : '';
  const inlineMaxWidthStyle = !isPresetMaxWidth && maxWidth
    ? (typeof maxWidth === 'number' ? `${maxWidth}px` : String(maxWidth))
    : undefined;

  const containerClasses = cn(
    // layout & alignment
    'flex flex-col gap-1.5 select-none w-full',
    alignClasses[align],
    className
  );

  const boxesWrapperClasses = cn(
    // layout & width & spacing
    'flex items-center w-full flex-wrap mx-auto',
    justifyClasses[justify] || justifyClasses.between,
    resolvedMaxWidthClass
  );

  const pinBoxClasses = cn(
    sizeConfig.box,
    sizeConfig.font,
    'selection:bg-transparent selection:text-current',
    uppercase && 'uppercase'
  );

  const errorTextClasses = cn(
    // layout
    'flex items-center gap-1',
    // typography & text
    'text-xs font-medium text-destructive',
    align === 'center' && 'justify-center w-full',
    align === 'right' && 'justify-end w-full'
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output (Atomic Component Compliant)
  // ─────────────────────────────────────────────────────────────
  return (
    <div ref={ref} className={containerClasses} {...restProps}>
      {/* Label Komponen */}
      {label && (
        <Text
          as="span"
          size="sm"
          weight="semibold"
          className={cn('text-foreground block', align === 'center' && 'text-center w-full', align === 'right' && 'text-right w-full')}
        >
          {label}
        </Text>
      )}

      {/* Baris Kotak Code Inputs (Wadah Penuh dengan Spacing Auto / Center) */}
      <div className={boxesWrapperClasses} style={{ maxWidth: inlineMaxWidthStyle }}>
        {Array.from({ length }).map((_, idx) => {
          const targetPos = separatorPosition ?? Math.floor(length / 2);
          const showSeparatorHere = Boolean(separator) && idx > 0 && idx === targetPos;

          return (
            <Fragment key={idx}>
              {showSeparatorHere && (
                typeof separator === 'string' || typeof separator === 'number' ? (
                  <Text
                    as="span"
                    size="md"
                    weight="bold"
                    className="text-muted-foreground self-center px-0.5 select-none shrink-0"
                  >
                    {separator}
                  </Text>
                ) : (
                  separator
                )
              )}
              <Input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type={mask ? 'password' : 'text'}
                inputMode={type === 'numeric' ? 'numeric' : 'text'}
                value={currentPin[idx] || ''}
                onChange={(e) => handleInputChange(idx, e)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={disabled}
                readOnly={readOnly}
                size={size}
                variant={variant}
                depth={depth}
                error={Boolean(error)}
                success={success}
                className={pinBoxClasses}
                wrapperClassName={cn('w-auto shrink-0', sizeConfig.container)}
                aria-label={`Digit kode ke-${idx + 1}`}
              />
            </Fragment>
          );
        })}
      </div>

      {/* Footer Error / Description Helper Text */}
      {error ? (
        <Text as="span" size="xs" variant="error" className={errorTextClasses}>
          <Icon icon="mdi:alert-circle" size="2xs" className="shrink-0" />
          <Text as="span">{error}</Text>
        </Text>
      ) : description ? (
        <Text
          as="span"
          size="xs"
          variant="muted"
          className={cn(align === 'center' && 'text-center w-full', align === 'right' && 'text-right w-full')}
        >
          {description}
        </Text>
      ) : null}

      {/* Konten Kustom Tambahan (misal Tombol Resend OTP) */}
      {children}
    </div>
  );
});

CodeInput.displayName = 'CodeInput';

export default CodeInput;
