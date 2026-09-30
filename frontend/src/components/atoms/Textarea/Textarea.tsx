import { useState, useRef, useId, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms';
import type { InputSize, InputVariant } from '../Input/Input.types';
import type { TextareaProps, TextareaResize } from './Textarea.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Helper Functions (Persis Input.tsx)
// ─────────────────────────────────────────────────────────────
const sizeClasses: Record<InputSize, string> = {
  sm: 'text-xs p-2.5 min-h-[70px]',
  md: 'text-sm p-3 min-h-[90px]',
  lg: 'text-base p-3.5 min-h-[120px]',
};

const wrapperRadiusClasses: Record<InputSize, string> = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-xl',
};

const variantClasses: Record<InputVariant, string> = {
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

const resizeClasses: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

/**
 * Textarea Atom Component
 * 
 * Komponen masukan teks multi-baris reaktif berbasis Depth System (-3 s/d 3)
 * dengan arsitektur & styling persis seperti `Input.tsx`.
 * 
 * @param {InputSize} [props.size='md'] - Skala ukuran textarea ('sm', 'md', 'lg')
 * @param {InputVariant} [props.variant='outline'] - Varian visual ('outline', 'filled', 'ghost')
 * @param {InputDepth} [props.depth=-1] - Kedalaman visual taktil (Depth System: -3 s/d 3)
 * @param {boolean} [props.autoResize=false] - Menyesuaikan tinggi otomatis saat teks bertambah
 * @param {boolean} [props.showCharacterCount=false] - Menampilkan penghitung karakter di kanan bawah
 * @param {TextareaResize} [props.resize='vertical'] - Kontrol pengubahan ukuran elemen
 * @param {boolean} [props.fullWidth=true] - Membentang selebar kontainer (100% width)
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
  const depthKey = String(depth);
  const resolvedDepth = depthClasses[depthKey] || depthClasses['-1'];

  const effectiveResize: TextareaResize = resizable && resize === 'none'
    ? 'vertical'
    : resize;

  const containerClasses = cn(
    'flex flex-col gap-1.5 transition-all duration-200 relative',
    fullWidth ? 'w-full' : 'w-auto inline-flex',
    disabled && 'opacity-60 cursor-not-allowed',
    wrapperClassName
  );

  const textareaWrapperClasses = cn(
    'relative flex flex-col w-full transition-all duration-200 outline-none overflow-hidden select-none',
    wrapperRadiusClasses[size],
    variantClasses[variant],
    resolvedDepth,
    hasError
      ? 'border-destructive text-destructive focus-within:border-destructive focus-within:ring-destructive/25'
      : isSuccess
        ? 'border-success text-success focus-within:border-success focus-within:ring-success/25'
        : disabled
          ? 'bg-muted/40 cursor-not-allowed'
          : ''
  );

  const textareaElementClasses = cn(
    'w-full bg-transparent text-foreground placeholder:text-muted-foreground/70 outline-none border-none transition-colors duration-200 rounded-[inherit]',
    sizeClasses[size],
    resizeClasses[autoResize ? 'none' : effectiveResize],
    disabled && 'cursor-not-allowed',
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
      {label && (
        <label htmlFor={textareaId} className="flex items-center gap-1 select-none text-xs font-semibold text-foreground">
          {label}
          {required && <span className="text-destructive font-bold" aria-hidden="true">*</span>}
        </label>
      )}

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
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex-1">
          {hasError ? (
            <span id={errorId} role="alert" className="flex items-center gap-1 text-xs font-medium text-destructive">
              <Icon icon="mdi:alert-circle" size="2xs" className="shrink-0" />
              <span className="truncate">{error}</span>
            </span>
          ) : description ? (
            <span id={descId} className="w-full text-xs text-muted-foreground">
              {description}
            </span>
          ) : null}
        </div>

        {/* Character Counter (Persis TextInput.tsx) */}
        {displayCharacterCount && (
          <div className="flex items-center gap-2 select-none shrink-0 ml-auto text-2xs text-muted-foreground">
            <span className={cn(maxLength && charCount >= maxLength && 'text-destructive font-semibold')}>
              {charCount}{maxLength ? `/${maxLength}` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
