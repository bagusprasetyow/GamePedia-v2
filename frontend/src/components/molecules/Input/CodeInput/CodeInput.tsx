import { forwardRef, Fragment } from 'react';
import { cn } from '@/lib/utils';
import { Text, Icon } from '@/components/atoms';
import type { InputSize } from '@/components/atoms/Input/Input.types';
import type { CodeInputProps, CodeInputJustify, CodeInputAlign } from './CodeInput.types';
import { CodeInputField } from './components/CodeInputField';
import { useCodeInput } from './useCodeInput';

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
 * Komponen dasar bidang masukan kode / OTP / PIN multi-digit terdekomposisi.
 * Menggunakan sub-komponen `<CodeInputField>` untuk merender digit individual.
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
  // 2. LOGIKA: State Management Hook & Enkapsulasi Class
  // ─────────────────────────────────────────────────────────────
  const {
    currentPin,
    inputRefs,
    handleInputChange,
    handleKeyDown,
    handlePaste,
  } = useCodeInput({
    length,
    value: controlledValue,
    defaultValue,
    type,
    uppercase,
    disabled,
    readOnly,
    autoFocus,
    onChange,
    onComplete,
  });

  // Enkapsulasi ClassName Internal
  const sizeConfig = sizeBoxMap[size] || sizeBoxMap.md;

  const isPresetMaxWidth = maxWidthClasses[String(maxWidth)] !== undefined;
  const resolvedMaxWidthClass = isPresetMaxWidth ? maxWidthClasses[String(maxWidth)] : '';
  const inlineMaxWidthStyle = !isPresetMaxWidth && maxWidth
    ? (typeof maxWidth === 'number' ? `${maxWidth}px` : String(maxWidth))
    : undefined;

  const containerClasses = cn(
    'flex flex-col gap-1.5 select-none w-full',
    alignClasses[align],
    className
  );

  const boxesWrapperClasses = cn(
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
    'flex items-center gap-1 text-xs font-medium text-destructive',
    align === 'center' && 'justify-center w-full',
    align === 'right' && 'justify-end w-full'
  );

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

      {/* Baris Kotak Code Inputs */}
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
              <CodeInputField
                idx={idx}
                inputRef={(el) => {
                  inputRefs.current[idx] = el;
                }}
                mask={mask}
                type={type}
                value={currentPin[idx] || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                disabled={disabled}
                readOnly={readOnly}
                size={size}
                variant={variant}
                depth={depth}
                error={Boolean(error)}
                success={success}
                pinBoxClasses={pinBoxClasses}
                sizeConfigContainer={sizeConfig.container}
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

      {/* Konten Kustom Tambahan */}
      {children}
    </div>
  );
});

CodeInput.displayName = 'CodeInput';

export default CodeInput;
