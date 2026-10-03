import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/Icon';
import type { CheckboxIndicatorProps } from '../Checkbox.types';
import {
  sizeConfigMap,
  colorStyleMap,
  depthClasses,
  resolveDepthKey,
} from '../Checkbox.styles';

/**
 * CheckboxIndicator Component - Sub-Atom Internal Checkbox
 *
 * Merender kotak visual checkbox dengan dukungan varian 'check' (ikon centang)
 * dan 'solid' (kotak padat), status 'indeterminate' (garis minus),
 * Depth System (-3 s/d 3), palet warna semantik tema GamePedia, dan navigasi keyboard.
 *
 * @param {boolean} [props.isChecked=false] - Status tercentang
 * @param {boolean} [props.indeterminate=false] - Status garis minus
 * @param {CheckboxSize} [props.size='md'] - Skala ukuran ('sm', 'md', 'lg')
 * @param {CheckboxColor} [props.color='primary'] - Warna semantik tema
 * @param {CheckboxVariant} [props.variant='check'] - Varian visual ('check' atau 'solid')
 * @param {CheckboxDepth} [props.depth=-1] - Kedalaman visual kotak
 * @param {boolean} [props.disabled=false] - Status dinonaktifkan
 * @param {(e: KeyboardEvent<HTMLSpanElement>) => void} [props.onKeyDown] - Handler keyboard
 * @param {string} [props.className] - Class kustom tambahan
 *
 * @returns {ReactElement} Elemen span visual kotak checkbox
 */
export const CheckboxIndicator: FC<CheckboxIndicatorProps> = ({
  isChecked = false,
  indeterminate = false,
  size = 'md',
  color = 'primary',
  variant = 'check',
  depth = -1,
  disabled = false,
  onKeyDown,
  className = '',
}): ReactElement => {
  const sizeConfig = sizeConfigMap[size] || sizeConfigMap.md;
  const colorStyle = colorStyleMap[color] || colorStyleMap.primary;

  const depthKey = resolveDepthKey(depth);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['-1'];

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const boxClasses = cn(
    // layout
    'inline-flex shrink-0 items-center justify-center',
    // position
    'relative',
    // size & border
    sizeConfig.box,
    // shadow & depth
    isChecked || indeterminate ? 'shadow-0' : resolvedDepthClass,
    // interaction
    'select-none',
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    colorStyle.ring,
    // background & colors
    isChecked || indeterminate
      ? variant === 'solid' && !indeterminate
        ? cn('bg-background', colorStyle.border)
        : cn(colorStyle.checkBg, colorStyle.checkBorder, colorStyle.checkText)
      : cn(
          'bg-background/80',
          variant === 'solid' || color === 'error'
            ? colorStyle.border
            : 'border-border/80 hover:border-primary text-transparent'
        ),
    // transition
    'transition-all duration-200 ease-out',
    className
  );

  return (
    <span
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : isChecked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      className={boxClasses}
    >
      {/* Status Indeterminate: Ikon Minus */}
      {indeterminate ? (
        <Icon icon="mdi:minus" size={sizeConfig.iconSize} className="text-current stroke-current" />
      ) : isChecked ? (
        /* Varian 1: Checklist Icon (v) */
        variant === 'check' ? (
          <Icon
            icon="mdi:check"
            size={sizeConfig.iconSize}
            className="text-current stroke-current animate-in zoom-in-50"
          />
        ) : (
          /* Varian 2: Solid Square Padat */
          <span
            className={cn(
              // border
              sizeConfig.solidSize,
              // background
              colorStyle.dot,
              // animation & transition
              'transition-transform duration-200 ease-out scale-100 animate-in zoom-in-50'
            )}
          />
        )
      ) : null}
    </span>
  );
};

export default CheckboxIndicator;
