import type { ReactNode } from 'react';

/**
 * Membatasi nilai agar selalu berada di dalam rentang inklusif [min, max].
 * Menangani kasus NaN, Infinity, dan min > max secara aman.
 *
 * @param {number} value - Nilai yang akan dibatasi
 * @param {number} min - Batas nilai minimum (bawaan 0)
 * @param {number} max - Batas nilai maksimum
 * @returns {number} Nilai yang telah di-clamp
 */
export const clampProgressValue = (value: number, min = 0, max = 100): number => {
  let safeMin = Number.isFinite(min) ? min : 0;
  let safeMax = Number.isFinite(max) ? max : 100;

  if (safeMin > safeMax) {
    const temp = safeMin;
    safeMin = safeMax;
    safeMax = temp;
  }

  if (Number.isNaN(value)) return safeMin;
  if (value === Infinity) return safeMax;
  if (value === -Infinity) return safeMin;

  return Math.min(Math.max(value, safeMin), safeMax);
};

/**
 * Menghitung persentase progres aktual (0 s/d 100%) berdasarkan nilai dan batas maksimum.
 * Mencegah hasil pembagian nol (division by zero), NaN, dan Infinity.
 *
 * @param {number} value - Nilai progres saat ini
 * @param {number} max - Batas maksimum kapasitas
 * @returns {number} Persentase progres dalam rentang 0 s/d 100
 */
export const getProgressPercentage = (value: number, max = 100): number => {
  if (!Number.isFinite(max) || max <= 0) {
    return 0;
  }

  const clampedValue = clampProgressValue(value, 0, max);
  const percentage = (clampedValue / max) * 100;

  // Presisi 4 angka di belakang koma untuk akurasi styling CSS tanpa floating noise tak berujung
  return Math.min(Math.max(Math.round(percentage * 10000) / 10000, 0), 100);
};

/**
 * Menormalkan nilai value dan max agar selalu valid untuk konsumsi DOM dan komputasi visual.
 *
 * @param {number} [rawValue=0] - Nilai awal progres
 * @param {number} [rawMax=100] - Nilai awal kapasitas maksimum
 * @returns {{ value: number; max: number; percentage: number }} Nilai-nilai ternormalisasi
 */
export const normalizeProgressValue = (
  rawValue = 0,
  rawMax = 100
): { value: number; max: number; percentage: number } => {
  const max = Number.isFinite(rawMax) && rawMax > 0 ? rawMax : 100;
  const value = Number.isFinite(rawValue) ? clampProgressValue(rawValue, 0, max) : 0;
  const percentage = getProgressPercentage(value, max);

  return { value, max, percentage };
};

/**
 * Memformat teks tampilan nilai progres.
 * Jika formatValue kustom disediakan, fungsi tersebut yang akan dipanggil.
 * Jika tidak, nilai persentase bulat akan ditampilkan (misal: "75%").
 *
 * @param {number} value - Nilai progres ternormalisasi
 * @param {number} max - Batas maksimum ternormalisasi
 * @param {number} percentage - Persentase progres
 * @param {(val: number, max: number) => ReactNode} [formatFn] - Formatter kustom opsional
 * @returns {ReactNode} Tampilan nilai yang siap dirender
 */
export const formatProgressValue = (
  value: number,
  max: number,
  percentage: number,
  formatFn?: (val: number, max: number) => ReactNode
): ReactNode => {
  if (typeof formatFn === 'function') {
    return formatFn(value, max);
  }

  const roundedPercentage = Math.round(percentage);
  return `${roundedPercentage}%`;
};
