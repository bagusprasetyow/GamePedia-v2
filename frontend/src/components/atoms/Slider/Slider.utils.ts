import type { SliderDirection, SliderOrientation } from './Slider.types';

/**
 * Menghitung jumlah angka desimal presisi dari suatu bilangan.
 *
 * @param {number} value - Angka yang diperiksa
 * @returns {number} Jumlah digit di belakang koma
 */
export const getPrecision = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  const valueString = value.toString();
  if (valueString.indexOf('e-') >= 0) {
    const parts = valueString.split('e-');
    return parseInt(parts[1], 10);
  }
  const decimalPart = valueString.split('.')[1];
  return decimalPart ? decimalPart.length : 0;
};

/**
 * Membulatkan angka ke presisi desimal tertentu untuk mencegah precision artifact floating-point.
 *
 * @param {number} value - Angka asli
 * @param {number} precision - Jumlah digit di belakang koma yang diinginkan
 * @returns {number} Angka yang telah dinormalisasi
 */
export const roundToPrecision = (value: number, precision: number): number => {
  if (!Number.isFinite(value)) return 0;
  const factor = Math.pow(10, Math.max(0, precision));
  return Math.round(value * factor) / factor;
};

/**
 * Menormalkan konfigurasi range min, max, dan step agar selalu aman dan valid.
 *
 * @param {number} [rawMin=0] - Nilai batas minimum
 * @param {number} [rawMax=100] - Nilai batas maksimum
 * @param {number} [rawStep=1] - Besaran step
 * @returns {{ min: number; max: number; step: number }} Konfigurasi ternormalisasi
 */
export const normalizeRange = (
  rawMin = 0,
  rawMax = 100,
  rawStep = 1
): { min: number; max: number; step: number } => {
  let min = Number.isFinite(rawMin) ? rawMin : 0;
  let max = Number.isFinite(rawMax) ? rawMax : 100;

  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  let step = Number.isFinite(rawStep) && rawStep > 0 ? rawStep : 1;
  const range = max - min;
  if (range > 0 && step > range) {
    step = range;
  }

  return { min, max, step };
};

/**
 * Membatasi nilai agar selalu berada di dalam batas inklusif [min, max].
 *
 * @param {number} value - Nilai yang akan dibatasi
 * @param {number} min - Batas minimum
 * @param {number} max - Batas maksimum
 * @returns {number} Nilai yang telah di-clamp
 */
export const clampSliderValue = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  if (min > max) {
    return Math.min(Math.max(value, max), min);
  }
  return Math.min(Math.max(value, min), max);
};

/**
 * Menyesuaikan nilai ke kelipatan step terdekat dengan batas [min, max]
 * serta membersihkan error kalkulasi presisi floating point.
 *
 * @param {number} value - Nilai masukan
 * @param {number} min - Batas minimum
 * @param {number} max - Batas maksimum
 * @param {number} step - Besaran kelipatan
 * @returns {number} Nilai yang telah di-snap
 */
export const snapSliderValue = (
  value: number,
  min: number,
  max: number,
  step: number
): number => {
  const norm = normalizeRange(min, max, step);
  if (!Number.isFinite(value)) return norm.min;
  if (norm.min === norm.max) return norm.min;

  const precision = Math.max(
    getPrecision(norm.step),
    getPrecision(norm.min),
    getPrecision(norm.max)
  );

  const diff = value - norm.min;
  const stepCount = Math.round(diff / norm.step);
  const rawSnapped = norm.min + stepCount * norm.step;
  const rounded = roundToPrecision(rawSnapped, precision);

  return clampSliderValue(rounded, norm.min, norm.max);
};

/**
 * Mengonversi nilai numerik slider menjadi nilai persentase (0% s/d 100%).
 *
 * @param {number} value - Nilai saat ini
 * @param {number} min - Batas minimum
 * @param {number} max - Batas maksimum
 * @param {SliderDirection} [direction='normal'] - Arah pergeseran
 * @returns {number} Persentase posisi (0 - 100)
 */
export const valueToPercentage = (
  value: number,
  min: number,
  max: number,
  direction: SliderDirection = 'normal'
): number => {
  const norm = normalizeRange(min, max);
  if (norm.min === norm.max) return 0;

  const clamped = clampSliderValue(value, norm.min, norm.max);
  let percentage = ((clamped - norm.min) / (norm.max - norm.min)) * 100;

  if (direction === 'reverse') {
    percentage = 100 - percentage;
  }

  return Math.min(Math.max(percentage, 0), 100);
};

/**
 * Mengonversi persentase posisi (0 s/d 100) kembali menjadi nilai numerik yang di-snap.
 *
 * @param {number} percentage - Persentase posisi (0 - 100)
 * @param {number} min - Batas minimum
 * @param {number} max - Batas maksimum
 * @param {number} step - Besaran kelipatan
 * @param {SliderDirection} [direction='normal'] - Arah pergeseran
 * @returns {number} Nilai numerik hasil snap
 */
export const percentageToValue = (
  percentage: number,
  min: number,
  max: number,
  step: number,
  direction: SliderDirection = 'normal'
): number => {
  const norm = normalizeRange(min, max, step);
  if (norm.min === norm.max) return norm.min;

  let effectivePercentage = Math.min(Math.max(percentage, 0), 100);
  if (direction === 'reverse') {
    effectivePercentage = 100 - effectivePercentage;
  }

  const rawValue = norm.min + (effectivePercentage / 100) * (norm.max - norm.min);
  return snapSliderValue(rawValue, norm.min, norm.max, norm.step);
};

/**
 * Mendapatkan nilai langkah berikutnya (+1 step).
 *
 * @param {number} current - Nilai saat ini
 * @param {number} step - Besaran step
 * @param {number} min - Batas minimum
 * @param {number} max - Batas maksimum
 * @returns {number} Nilai berikutnya
 */
export const getNextValue = (
  current: number,
  step: number,
  min: number,
  max: number
): number => {
  const norm = normalizeRange(min, max, step);
  return snapSliderValue(current + norm.step, norm.min, norm.max, norm.step);
};

/**
 * Mendapatkan nilai langkah sebelumnya (-1 step).
 *
 * @param {number} current - Nilai saat ini
 * @param {number} step - Besaran step
 * @param {number} min - Batas minimum
 * @param {number} max - Batas maksimum
 * @returns {number} Nilai sebelumnya
 */
export const getPreviousValue = (
  current: number,
  step: number,
  min: number,
  max: number
): number => {
  const norm = normalizeRange(min, max, step);
  return snapSliderValue(current - norm.step, norm.min, norm.max, norm.step);
};

/**
 * Mendapatkan nilai kenaikan halaman PageUp.
 *
 * @param {number} current - Nilai saat ini
 * @param {number} step - Besaran step
 * @param {number} min - Batas minimum
 * @param {number} max - Batas maksimum
 * @param {number} [pageFactor=10] - Faktor pengali step
 * @returns {number} Nilai kenaikan PageUp
 */
export const getPageUpValue = (
  current: number,
  step: number,
  min: number,
  max: number,
  pageFactor = 10
): number => {
  const norm = normalizeRange(min, max, step);
  const range = norm.max - norm.min;
  const pageIncrement = Math.max(norm.step * pageFactor, range / 10 || norm.step);
  return snapSliderValue(current + pageIncrement, norm.min, norm.max, norm.step);
};

/**
 * Mendapatkan nilai penurunan halaman PageDown.
 *
 * @param {number} current - Nilai saat ini
 * @param {number} step - Besaran step
 * @param {number} min - Batas minimum
 * @param {number} max - Batas maksimum
 * @param {number} [pageFactor=10] - Faktor pengali step
 * @returns {number} Nilai penurunan PageDown
 */
export const getPageDownValue = (
  current: number,
  step: number,
  min: number,
  max: number,
  pageFactor = 10
): number => {
  const norm = normalizeRange(min, max, step);
  const range = norm.max - norm.min;
  const pageIncrement = Math.max(norm.step * pageFactor, range / 10 || norm.step);
  return snapSliderValue(current - pageIncrement, norm.min, norm.max, norm.step);
};

/**
 * Menghitung nilai slider berdasarkan koordinat pointer (mouse/touch) dan elemen trek.
 *
 * @param {object} params - Parameter kalkulasi pointer
 * @param {number} params.clientX - Posisi X pointer pada viewport
 * @param {number} params.clientY - Posisi Y pointer pada viewport
 * @param {DOMRect} params.rect - BoundingClientRect elemen trek
 * @param {number} params.min - Batas minimum
 * @param {number} params.max - Batas maksimum
 * @param {number} params.step - Besaran step
 * @param {SliderOrientation} params.orientation - Orientasi slider ('horizontal' | 'vertical')
 * @param {SliderDirection} params.direction - Arah pergeseran ('normal' | 'reverse')
 * @returns {number} Nilai slider hasil kalkulasi pointer
 */
export const getPointerValue = ({
  clientX,
  clientY,
  rect,
  min,
  max,
  step,
  orientation,
  direction,
}: {
  clientX: number;
  clientY: number;
  rect: DOMRect;
  min: number;
  max: number;
  step: number;
  orientation: SliderOrientation;
  direction: SliderDirection;
}): number => {
  let percentage: number;

  if (orientation === 'vertical') {
    if (rect.height <= 0) return min;
    // Pada mode normal vertikal: bagian bawah adalah 0% (min) dan atas adalah 100% (max)
    const ratio =
      direction === 'reverse'
        ? (clientY - rect.top) / rect.height
        : (rect.bottom - clientY) / rect.height;
    percentage = Math.min(Math.max(ratio * 100, 0), 100);
    return percentageToValue(percentage, min, max, step, 'normal');
  }

  if (rect.width <= 0) return min;
  const ratio = (clientX - rect.left) / rect.width;
  percentage = Math.min(Math.max(ratio * 100, 0), 100);
  return percentageToValue(percentage, min, max, step, direction);
};
