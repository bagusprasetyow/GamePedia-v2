import type { PasswordStrengthResult } from './PasswordStrengthBar.types';

/**
 * Kalkulasi skor dan evaluasi kekuatan kata sandi berbasis panjang & variasi karakter.
 * 
 * @param {string} password - Teks kata sandi yang dievaluasi
 * @param {number} [minLength=8] - Panjang minimum karakter acuan
 * @returns {PasswordStrengthResult} Hasil evaluasi berupa skor, level, label, persentase, dan class styling
 */
export const calculatePasswordStrength = (password: string, minLength = 8): PasswordStrengthResult => {
  if (!password) {
    return {
      score: 0,
      level: 'weak',
      label: 'Sangat Lemah',
      percent: 0,
      colorClass: 'text-muted-foreground',
      bgClass: 'bg-muted',
    };
  }

  let score = 0;
  if (password.length >= minLength) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return {
        score: 1,
        level: 'weak',
        label: 'Lemah',
        percent: 25,
        colorClass: 'text-destructive',
        bgClass: 'bg-destructive',
      };
    case 2:
      return {
        score: 2,
        level: 'fair',
        label: 'Sedang',
        percent: 50,
        colorClass: 'text-warning',
        bgClass: 'bg-warning',
      };
    case 3:
      return {
        score: 3,
        level: 'good',
        label: 'Kuat',
        percent: 75,
        colorClass: 'text-primary',
        bgClass: 'bg-primary',
      };
    case 4:
      return {
        score: 4,
        level: 'very-strong',
        label: 'Sangat Kuat',
        percent: 100,
        colorClass: 'text-success',
        bgClass: 'bg-success',
      };
    default:
      return {
        score: 0,
        level: 'weak',
        label: 'Sangat Lemah',
        percent: 10,
        colorClass: 'text-destructive',
        bgClass: 'bg-destructive',
      };
  }
};
