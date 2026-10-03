import { useState, useRef, useId, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import type { TextareaProps, TextareaResize } from './Textarea.types';
import {
  sizeClasses,
  wrapperRadiusClasses,
  variantClasses,
  depthClasses,
  resizeClasses,
  resolveDepthKey,
} from './Textarea.styles';
import { TextareaLabel } from './components/TextareaLabel';
import { TextareaFooter } from './components/TextareaFooter';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Tokens & Styling Setup
// ─────────────────────────────────────────────────────────────

/**
 * Textarea Atom Component
 * 
 * Komponen masukan teks multi-baris reaktif berbasis Depth System (-3 s/d 3)
 * dengan arsitektur & styling persis seperti `Input.tsx`.
 * 
 * @param {InputSize} [props.size='md'] - Skala ukuran textarea ('sm', 'md', 'lg')
 * @param {InputVariant} [props.variant='outline'] - Varian visual ('outline', 'filled', 'ghost')
 * @param {InputDepth} [props.depth=-1] - Kedalaman visual taktil (Depth System: -3 s/d 3)
 * @param {ReactNode} [props.label] - Label teks di atas bidang textarea
 * @param {ReactNode} [props.description] - Petunjuk atau deskripsi tambahan di bawah textarea
 * @param {ReactNode} [props.error] - Pesan kesalahan validasi (error state)
 * @param {boolean} [props.success=false] - Status sukses validasi
 * @param {boolean} [props.required=false] - Indikator wajib diisi
 * @param {boolean} [props.autoResize=false] - Menyesuaikan tinggi otomatis saat teks bertambah
 * @param {boolean} [props.showCharacterCount=false] - Menampilkan penghitung karakter di kanan bawah
 * @param {boolean} [props.showCount=false] - Alias untuk showCharacterCount
 * @param {number} [props.maxLength] - Batas maksimal karakter
 * @param {number} [props.rows=3] - Jumlah baris default textarea
 * @param {TextareaResize} [props.resize='none'] - Kontrol pengubahan ukuran elemen
 * @param {boolean} [props.resizable=false] - Mengaktifkan manual resize handle
 * @param {boolean} [props.fullWidth=true] - Membentang selebar kontainer (100% width)
 * @param {boolean} [props.disabled=false] - Menonaktifkan textarea
 * @param {boolean} [props.readOnly=false] - Textarea hanya dapat dibaca
 * @param {string} [props.className] - Class kustom tambahan untuk elemen textarea
 * @param {string} [props.wrapperClassName] - Class kustom tambahan untuk wadah pembungkus
 * 
 * @returns {ReactElement} Elemen textarea atom interaktif
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  size = 'md',
  variant = 'outline',
  depth = -1,
  label,
  description,
  error,
  success = false,
  required = false,
  autoResize = false,
  showCharacterCount = false,
  showCount = false,
  maxLength,
  rows = 3,
  resize = 'none',
  resizable = false,
  fullWidth = true,
  disabled = false,
  readOnly = false,
  className = '',
  wrapperClassName = '',
  id,
  value: controlledValue,
  defaultValue = '',
  onChange,
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management & Auto-Resize Handlers
  // ─────────────────────────────────────────────────────────────
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const descId = `${textareaId}-desc`;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    String(controlledValue ?? defaultValue ?? '')
  );

  const currentValue = isControlled
    ? String(controlledValue ?? '')
    : internalValue;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Bind forwarded ref dengan internal ref
  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  // Sync internal state bila controlled value berubah dari luar
  useEffect(() => {
    if (isControlled) {
      setInternalValue(String(controlledValue ?? ''));
    }
  }, [controlledValue, isControlled]);

  // Handle auto-resize height berdasarkan scrollHeight
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentValue, autoResize]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled || readOnly) return;
    const newVal = e.target.value;
    if (!isControlled) {
      setInternalValue(newVal);
    }
    onChange?.(e);
  };

  const hasError = Boolean(error);
  const isSuccess = Boolean(success) && !hasError;
  const depthKey = resolveDepthKey(depth);
  const resolvedDepth = depthClasses[depthKey] || depthClasses['-1'];

  const effectiveResize: TextareaResize = resizable && resize === 'none'
    ? 'vertical'
    : resize;

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const containerClasses = cn(
    // layout
    'flex flex-col gap-1.5',
    // position
    'relative',
    // size
    fullWidth ? 'w-full' : 'w-auto inline-flex',
    // interaction
    disabled && 'cursor-not-allowed',
    // state
    disabled && 'opacity-60',
    // transition
    'transition-all duration-200',
    wrapperClassName
  );

  const textareaWrapperClasses = cn(
    // layout
    'flex flex-col overflow-hidden',
    // position
    'relative',
    // size
    'w-full',
    // border
    wrapperRadiusClasses[size],
    // background & variant
    variantClasses[variant],
    // shadow & depth
    resolvedDepth,
    // interaction
    'select-none',
    disabled && 'cursor-not-allowed',
    // focus
    'outline-none',
    // state
    hasError
      ? 'border-destructive text-destructive focus-within:border-destructive focus-within:ring-destructive/25'
      : isSuccess
        ? 'border-success text-success focus-within:border-success focus-within:ring-success/25'
        : disabled
          ? 'bg-muted/40'
          : '',
    // transition
    'transition-all duration-200'
  );

  const textareaElementClasses = cn(
    // layout
    resizeClasses[autoResize ? 'none' : effectiveResize],
    // size
    'w-full',
    sizeClasses[size],
    // border
    'border-none rounded-[inherit]',
    // background
    'bg-transparent',
    // text
    'text-foreground placeholder:text-muted-foreground/70',
    // interaction
    disabled && 'cursor-not-allowed',
    // focus
    'outline-none',
    // transition
    'transition-colors duration-200',
    className
  );

  const charCount = currentValue.length;
  const displayCharacterCount = Boolean(showCharacterCount || showCount);

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output (Persis Arsitektur Input.tsx)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* 3.1 Label Komponen */}
      <TextareaLabel
        textareaId={textareaId}
        label={label}
        required={required}
      />

      {/* 3.2 Pembungkus Textarea (Depth System Container) */}
      <div className={textareaWrapperClasses}>
        <textarea
          ref={textareaRef}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : description ? descId : undefined}
          className={textareaElementClasses}
          {...restProps}
        />
      </div>

      {/* 3.3 Footer Helper: Error / Description & Character Counter */}
      <TextareaFooter
        error={error}
        description={description}
        errorId={errorId}
        descId={descId}
        charCount={charCount}
        maxLength={maxLength}
        displayCharacterCount={displayCharacterCount}
      />
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
