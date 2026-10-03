import { useState, useId } from 'react';
import type { FC, ReactElement, ReactNode, ChangeEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../Icon';
import type { IconSize } from '../Icon/Icon.types';
import type {
  SwitchProps,
  SwitchSize,
  SwitchVariant,
} from './Switch.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────
interface SizeConfig {
  track: string;
  thumb: string;
  translate: string;
  iconSize: IconSize;
}

const sizeConfigMap: Record<SwitchSize, SizeConfig> = {
  sm: {
    track: 'h-5 w-9 p-0.5',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
    iconSize: '2xs',
  },
  md: {
    track: 'h-6 w-11 p-0.5',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
    iconSize: 'xs',
  },
  lg: {
    track: 'h-7 w-14 p-1',
    thumb: 'h-5 w-5',
    translate: 'translate-x-7',
    iconSize: 'sm',
  },
  xl: {
    track: 'h-8 w-16 p-1',
    thumb: 'h-6 w-6',
    translate: 'translate-x-8',
    iconSize: 'md',
  },
};

const variantClasses: Record<SwitchVariant, string> = {
  primary: 'bg-primary border-primary text-primary-foreground',
  secondary: 'bg-secondary border-secondary text-secondary-foreground',
  accent: 'bg-accent-600 border-accent-600 text-white',
  success: 'bg-success border-success text-white',
  warning: 'bg-warning border-warning text-neutral-950',
  error: 'bg-destructive border-destructive text-white',
  info: 'bg-info-600 border-info-600 text-white',
};

// Depth System: Skala -3 s/d 3 untuk trek switch (Ref: frontend/dev)
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
 * Switch (Toggle) Component - Atomic UI Element
 * 
 * Komponen sakelar biner interaktif dengan dukungan Depth System taktil (alur cekung -1 s/d -3),
 * varian semantik tema GamePedia, ikon terintegrasi, dan aksesibilitas form standar.
 * 
 * @param {boolean} [props.checked] - Status checked dalam mode controlled
 * @param {boolean} [props.defaultChecked=false] - Status default checked dalam mode uncontrolled
 * @param {(checked: boolean) => void} [props.onCheckedChange] - Callback saat status switch berubah
 * @param {SwitchSize} [props.size='md'] - Skala ukuran preset ('sm', 'md', 'lg', 'xl')
 * @param {SwitchVariant} [props.variant='primary'] - Varian warna semantik saat aktif
 * @param {SwitchDepth} [props.depth=-1] - Kedalaman visual trek switch (-3 s/d 3)
 * @param {ReactNode} [props.label] - Label teks di samping switch
 * @param {ReactNode} [props.description] - Deskripsi di bawah label
 * @param {'left' | 'right'} [props.labelPosition='right'] - Posisi peletakan label
 * @param {ReactNode} [props.thumbCheckedIcon] - Ikon di dalam thumb saat aktif
 * @param {ReactNode} [props.thumbUncheckedIcon] - Ikon di dalam thumb saat tidak aktif
 * @param {boolean} [props.disabled=false] - Menonaktifkan kontrol switch
 * @param {string} [props.className] - Class kustom tambahan untuk wadah luar
 * 
 * @returns {ReactElement} Elemen sakelar toggle interaktif
 */
export const Switch: FC<SwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  size = 'md',
  variant = 'primary',
  depth = -1,
  label,
  description,
  labelPosition = 'right',
  thumbCheckedIcon,
  thumbUncheckedIcon,
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
  const safeVariantClass = variantClasses[variant] || variantClasses.primary;

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

  const handleTrackKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const newChecked = !isChecked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    }
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLInputElement>);
  };

  // Helper untuk me-render node ikon di dalam thumb
  const renderIcon = (iconNode: ReactNode) => {
    if (typeof iconNode === 'string') {
      return <Icon icon={iconNode} size={sizeConfig.iconSize} />;
    }
    return iconNode;
  };

  // Enkapsulasi ClassName Internal
  const containerClasses = cn(
    // layout
    'inline-flex items-center gap-3 select-none',
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
    'text-sm font-medium text-foreground'
  );

  const labelDescClasses = cn(
    // typography & text
    'text-xs text-muted-foreground'
  );

  const trackClasses = cn(
    // layout & shape
    'relative inline-flex shrink-0 items-center outline-none',
    // size
    sizeConfig.track,
    // border
    'rounded-full border',
    // shadow & depth
    resolvedDepthClass,
    // focus
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    // transition
    'transition-all duration-300 ease-in-out',
    // background & state
    isChecked
      ? safeVariantClass
      : 'bg-muted border-border text-muted-foreground'
  );

  const thumbClasses = cn(
    // layout & shape
    'pointer-events-none flex items-center justify-center rounded-full',
    // size
    sizeConfig.thumb,
    // background & text
    'bg-neutral-50 dark:bg-neutral-100 text-neutral-900',
    // shadow & depth
    'shadow-1',
    // transition slide
    'transition-all duration-300 ease-out',
    // position & state
    isChecked ? sizeConfig.translate : 'translate-x-0'
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <label htmlFor={inputId} className={containerClasses}>
      {/* Hidden real input checkbox untuk aksesibilitas & form submission */}
      <input
        type="checkbox"
        id={inputId}
        name={name}
        checked={isChecked}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        aria-checked={isChecked}
        {...restProps}
      />

      {/* Visual Switch Track (Trek alur cekung) */}
      <span
        role="switch"
        aria-checked={isChecked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleTrackKeyDown}
        className={trackClasses}
      >
        {/* Visual Switch Thumb (Knop timbul taktil) */}
        <span className={thumbClasses}>
          <span className="inline-flex items-center justify-center transition-transform duration-300 ease-out">
            {isChecked && thumbCheckedIcon && renderIcon(thumbCheckedIcon)}
            {!isChecked && thumbUncheckedIcon && renderIcon(thumbUncheckedIcon)}
          </span>
        </span>
      </span>

      {/* Label & Description Texts */}
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

export default Switch;
