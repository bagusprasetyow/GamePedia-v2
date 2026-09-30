import { useState, useId } from 'react';
import type { FC, ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../Icon';
import type { IconSize } from '../Icon/Icon.types';
import type {
  RadioProps,
  RadioSize,
  RadioColor,
} from './Radio.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────
interface SizeConfig {
  circle: string;
  solidDot: string;
  iconSize: IconSize;
}

const sizeConfigMap: Record<RadioSize, SizeConfig> = {
  sm: {
    circle: 'h-4 w-4 border-2',
    solidDot: 'h-2 w-2',
    iconSize: '2xs',
  },
  md: {
    circle: 'h-5 w-5 border-2',
    solidDot: 'h-3 w-3',
    iconSize: 'xs',
  },
  lg: {
    circle: 'h-6 w-6 border-[2.5px]',
    solidDot: 'h-3.5 w-3.5',
    iconSize: 'sm',
  },
};

interface ColorStyle {
  border: string;
  dot: string;
  hoverBorder: string;
  ring: string;
  checkBg: string;
  checkBorder: string;
  checkText: string;
}

const colorStyleMap: Record<RadioColor, ColorStyle> = {
  primary: {
    border: 'border-primary',
    dot: 'bg-primary',
    hoverBorder: 'hover:border-primary',
    ring: 'focus-visible:ring-primary/30',
    checkBg: 'bg-primary',
    checkBorder: 'border-primary',
    checkText: 'text-primary-foreground',
  },
  secondary: {
    border: 'border-secondary',
    dot: 'bg-secondary',
    hoverBorder: 'hover:border-secondary',
    ring: 'focus-visible:ring-secondary/30',
    checkBg: 'bg-secondary',
    checkBorder: 'border-secondary',
    checkText: 'text-secondary-foreground',
  },
  accent: {
    border: 'border-accent-600',
    dot: 'bg-accent-600',
    hoverBorder: 'hover:border-accent-600',
    ring: 'focus-visible:ring-accent-600/30',
    checkBg: 'bg-accent-600',
    checkBorder: 'border-accent-600',
    checkText: 'text-white',
  },
  success: {
    border: 'border-success',
    dot: 'bg-success',
    hoverBorder: 'hover:border-success',
    ring: 'focus-visible:ring-success/30',
    checkBg: 'bg-success',
    checkBorder: 'border-success',
    checkText: 'text-white',
  },
  warning: {
    border: 'border-warning',
    dot: 'bg-warning',
    hoverBorder: 'hover:border-warning',
    ring: 'focus-visible:ring-warning/30',
    checkBg: 'bg-warning',
    checkBorder: 'border-warning',
    checkText: 'text-neutral-950',
  },
  error: {
    border: 'border-destructive',
    dot: 'bg-destructive',
    hoverBorder: 'hover:border-destructive',
    ring: 'focus-visible:ring-destructive/30',
    checkBg: 'bg-destructive',
    checkBorder: 'border-destructive',
    checkText: 'text-white',
  },
  info: {
    border: 'border-info-600',
    dot: 'bg-info-600',
    hoverBorder: 'hover:border-info-600',
    ring: 'focus-visible:ring-info-600/30',
    checkBg: 'bg-info-600',
    checkBorder: 'border-info-600',
    checkText: 'text-white',
  },
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

/**
 * Radio Component - Atomic UI Element
 * 
 * Komponen tombol radio bulat interaktif dengan 2 varian visual ('solid' ring+dot & 'check' centang),
 * Depth System (-3 s/d 3), palet tema GamePedia, dan aksesibilitas form standar.
 * 
 * @param {boolean} [props.checked] - Status checked (controlled)
 * @param {boolean} [props.defaultChecked=false] - Status default checked (uncontrolled)
 * @param {(checked: boolean) => void} [props.onCheckedChange] - Callback saat status berubah
 * @param {RadioSize} [props.size='md'] - Skala ukuran ('sm', 'md', 'lg')
 * @param {RadioColor} [props.color='primary'] - Warna saat terpilih
 * @param {RadioVariant} [props.variant='solid'] - Varian indikator ('solid' atau 'check')
 * @param {RadioDepth} [props.depth=-1] - Kedalaman visual lingkaran (-3 s/d 3)
 * @param {ReactNode} [props.label] - Teks label
 * @param {ReactNode} [props.description] - Deskripsi tambahan
 * @param {'left' | 'right'} [props.labelPosition='right'] - Posisi peletakan label
 * @param {boolean} [props.disabled=false] - Status disabled
 * 
 * @returns {ReactElement} Elemen radio button interaktif
 */
export const Radio: FC<RadioProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  value,
  size = 'md',
  color = 'primary',
  variant = 'solid',
  depth = -1,
  label,
  description,
  labelPosition = 'right',
  disabled = false,
  className = '',
  id,
  name,
  onChange,
  onKeyDown,
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const generatedId = useId();
  const inputId = id || generatedId;

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const sizeConfig = sizeConfigMap[size] || sizeConfigMap.md;
  const colorStyle = colorStyleMap[color] || colorStyleMap.primary;

  const depthKey = String(depth);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['-1'];

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newChecked = event.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
    onChange?.(event);
  };

  const handleCircleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!isChecked) {
        if (!isControlled) {
          setInternalChecked(true);
        }
        onCheckedChange?.(true);
      }
    }
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLInputElement>);
  };

  // Enkapsulasi ClassName Internal
  const containerClasses = cn(
    // layout
    'group inline-flex items-center gap-3 select-none',
    // interaction & cursor
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    // position & direction
    labelPosition === 'left' && 'flex-row-reverse justify-end',
    // state
    disabled && 'opacity-50',
    className
  );

  const labelWrapperClasses = cn(
    // layout
    'flex flex-col text-left'
  );

  const labelTitleClasses = cn(
    // typography & text
    'text-sm font-medium text-foreground',
    // transition
    'transition-colors group-hover:text-foreground'
  );

  const labelDescClasses = cn(
    // typography & text
    'text-xs text-muted-foreground'
  );

  const circleClasses = cn(
    // layout & shape
    'relative inline-flex shrink-0 items-center justify-center rounded-full outline-none',
    // size
    sizeConfig.circle,
    // focus
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    colorStyle.ring,
    // shadow & depth
    resolvedDepthClass,
    // transition
    'transition-all duration-200 ease-out',
    // state & colors
    variant === 'solid'
      ? cn(
          'bg-background',
          colorStyle.border,
          'transition-colors duration-150'
        )
      : isChecked
        ? cn(colorStyle.checkBg, colorStyle.checkBorder, colorStyle.checkText)
        : cn(
            'bg-background/80 transition-colors duration-150',
            color === 'error'
              ? colorStyle.border
              : 'border-neutral-500/70 dark:border-neutral-400/60 hover:border-primary text-transparent'
          )
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <label htmlFor={inputId} className={containerClasses}>
      {/* Hidden real input radio untuk aksesibilitas & form submission */}
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        aria-checked={isChecked}
        {...restProps}
      />

      {/* Visual Radio Circle */}
      <span
        role="radio"
        aria-checked={isChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleCircleKeyDown}
        className={circleClasses}
      >
        {isChecked ? (
          /* Varian 1: Solid Ring + Center Dot (Sesuai Referensi Gambar) */
          variant === 'solid' ? (
            <span
              className={cn(
                'rounded-full transition-transform duration-200 ease-out scale-100 animate-in zoom-in-50',
                colorStyle.dot,
                sizeConfig.solidDot
              )}
            />
          ) : (
            /* Varian 2: Checklist Icon (v) */
            <Icon
              icon="mdi:check"
              size={sizeConfig.iconSize}
              className="text-current stroke-current animate-in zoom-in-50 duration-150"
            />
          )
        ) : null}
      </span>

      {/* Label & Description */}
      {(label || description) && (
        <span className={labelWrapperClasses}>
          {label && (
            <span className={labelTitleClasses}>
              {label}
            </span>
          )}
          {description && (
            <span className={labelDescClasses}>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

export default Radio;
