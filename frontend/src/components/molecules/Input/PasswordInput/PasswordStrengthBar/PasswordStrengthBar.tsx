import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import type { PasswordStrengthBarProps } from './PasswordStrengthBar.types';
import { calculatePasswordStrength } from './passwordStrength.utils';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────
const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2',
  '-1': 'shadow-n1',
  '0': 'shadow-0',
  '1': 'shadow-1',
  '2': 'shadow-2',
  '3': 'shadow-3',
};

/**
 * PasswordStrengthBar Component - Molecule UI
 * 
 * Komponen terpisah untuk menampilkan batang indikator kekuatan kata sandi
 * beserta persentase dan label evaluasi kekuatannya.
 * 
 * @param {string} [props.value=''] - Kata sandi yang dievaluasi
 * @param {boolean} [props.showLabel=true] - Menampilkan label teks 'Kekuatan Kata Sandi: ...'
 * @param {number} [props.minLength=8] - Minimum karakter acuan
 * @param {number|string} [props.depth=-1] - Kedalaman visual track background (-3 s/d 3)
 * @param {number|string} [props.filledDepth=1] - Kedalaman visual bar saat terisi (-3 s/d 3)
 */
export const PasswordStrengthBar = forwardRef<HTMLDivElement, PasswordStrengthBarProps>(({
  value = '',
  showLabel = true,
  minLength = 8,
  depth = -1,
  filledDepth = 1,
  className = '',
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA & STYLING
  // ─────────────────────────────────────────────────────────────
  const strength = calculatePasswordStrength(value, minLength);

  const containerClasses = cn(
    // layout
    'space-y-1 select-none',
    // size
    'w-full',
    className
  );

  const depthKey = String(depth);
  const trackDepthClass = depthClasses[depthKey] || depthClasses['-1'];

  const filledDepthKey = String(filledDepth);
  const barFilledDepthClass = depthClasses[filledDepthKey] || depthClasses['1'];

  const headerWrapperClasses = cn(
    // layout
    'flex items-center justify-between'
  );

  const trackBarClasses = cn(
    // layout & position
    'relative overflow-hidden',
    // size & border
    'h-1.5 w-full rounded-full',
    // background
    'bg-muted/60',
    // shadow & depth
    trackDepthClass
  );

  const fillBarClasses = cn(
    // size & border
    'h-full rounded-full',
    // background & state
    strength.bgClass,
    strength.percent > 0 ? barFilledDepthClass : '',
    // transition
    'transition-all duration-300'
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI
  // ─────────────────────────────────────────────────────────────
  return (
    <div ref={ref} className={containerClasses} {...restProps}>
      {showLabel && (
        <div className={headerWrapperClasses}>
          <Text as="span" size="xs" variant="muted">Kekuatan Kata Sandi:</Text>
          <Text as="span" size="xs" weight="semibold" className={strength.colorClass}>
            {strength.label}
          </Text>
        </div>
      )}
      <div className={trackBarClasses}>
        <div
          className={fillBarClasses}
          style={{ width: `${strength.percent}%` }}
        />
      </div>
    </div>
  );
});

PasswordStrengthBar.displayName = 'PasswordStrengthBar';

export default PasswordStrengthBar;
