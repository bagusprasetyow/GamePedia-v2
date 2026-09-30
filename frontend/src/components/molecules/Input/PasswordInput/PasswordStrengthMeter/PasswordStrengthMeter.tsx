import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { PasswordStrengthBar } from '../PasswordStrengthBar';
import { PasswordRequirements } from '../PasswordRequirements';
import type { PasswordStrengthMeterProps } from './PasswordStrengthMeter.types';

/**
 * PasswordStrengthMeter Component - Molecule UI Element
 * 
 * Komponen pembungkus terpisah yang menggabungkan indikator kekuatan kata sandi (`PasswordStrengthBar`)
 * dan checklist kriteria keamanan (`PasswordRequirements`).
 * 
 * @param {string} [props.value=''] - Nilai kata sandi yang dievaluasi
 * @param {boolean} [props.showMeter=true] - Menampilkan meteran visual kekuatan kata sandi
 * @param {boolean} [props.showRequirements=true] - Menampilkan checklist kriteria keamanan
 * @param {number} [props.minLength=8] - Minimum karakter acuan
 */
export const PasswordStrengthMeter = forwardRef<HTMLDivElement, PasswordStrengthMeterProps>(({
  value = '',
  showMeter = true,
  showRequirements = true,
  minLength = 8,
  className = '',
  ...restProps
}, ref) => {
  if (!showMeter && !showRequirements) return null;

  const containerClasses = cn(
    // layout & spacing
    'space-y-2 select-none',
    // size
    'w-full',
    className
  );

  return (
    <div ref={ref} className={containerClasses} {...restProps}>
      {/* Batang Kekuatan Kata Sandi */}
      {showMeter && (
        <PasswordStrengthBar value={value} minLength={minLength} />
      )}

      {/* Checklist Kriteria Keamanan */}
      {showRequirements && (
        <PasswordRequirements value={value} minLength={minLength} size="sm" />
      )}
    </div>
  );
});

PasswordStrengthMeter.displayName = 'PasswordStrengthMeter';

export default PasswordStrengthMeter;
