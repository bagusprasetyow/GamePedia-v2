import type { HTMLAttributes } from 'react';

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'very-strong';

export interface PasswordStrengthResult {
  score: number;
  level: PasswordStrengthLevel;
  label: string;
  percent: number;
  colorClass: string;
  bgClass: string;
}

export interface PasswordStrengthBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Nilai kata sandi yang diuji kekuatannya */
  value?: string;
  /** Menampilkan teks label kekuatan (e.g., 'Kekuatan Kata Sandi: Sangat Lemah') */
  showLabel?: boolean;
  /** Panjang minimum kata sandi (default: 8) */
  minLength?: number;
  /** Kedalaman visual track background (default: -1) */
  depth?: number | string;
  /** Kedalaman visual bar saat terisi (default: 1) */
  filledDepth?: number | string;
  /** ClassName kustom tambahan */
  className?: string;
}
