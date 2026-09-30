import type { HTMLAttributes } from 'react';
import type { PasswordStrengthLevel, PasswordStrengthResult } from '../PasswordStrengthBar/PasswordStrengthBar.types';

export type { PasswordStrengthLevel, PasswordStrengthResult };

export interface PasswordStrengthMeterCustomProps {
  /**
   * Nilai kata sandi yang dievaluasi kekuatannya.
   */
  value: string;

  /**
   * Menampilkan meteran visual bar tingkat kekuatan kata sandi.
   * @default true
   */
  showMeter?: boolean;

  /**
   * Menampilkan checklist 4 kriteria keamanan kata sandi (min 8 karakter, huruf besar, angka, simbol).
   * @default true
   */
  showRequirements?: boolean;

  /**
   * Batas minimal karakter kata sandi.
   * @default 8
   */
  minLength?: number;
}

export type PasswordStrengthMeterProps = PasswordStrengthMeterCustomProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof PasswordStrengthMeterCustomProps>;
