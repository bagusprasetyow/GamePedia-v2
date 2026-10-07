import type { SegmentedControlOption } from './SegmentedControl.types';

/**
 * Mengecek apakah opsi tertentu berstatus nonaktif (disabled).
 *
 * @param {SegmentedControlOption<T>} option - Objek opsi yang diperiksa
 * @param {boolean} [isComponentDisabled=false] - Status disabled pada level komponen induk
 * @returns {boolean} True jika opsi nonaktif
 */
export const isOptionDisabled = <T extends string | number = string>(
  option: SegmentedControlOption<T>,
  isComponentDisabled = false
): boolean => {
  return Boolean(isComponentDisabled || option.disabled);
};

/**
 * Mencari indeks opsi aktif pertama yang tidak dinonaktifkan (enabled).
 *
 * @param {SegmentedControlOption<T>[]} options - Daftar opsi
 * @param {boolean} [isComponentDisabled=false] - Status disabled komponen
 * @returns {number} Indeks opsi pertama yang aktif, atau -1 jika tidak ada
 */
export const findFirstEnabledIndex = <T extends string | number = string>(
  options: SegmentedControlOption<T>[],
  isComponentDisabled = false
): number => {
  if (isComponentDisabled) return -1;
  return options.findIndex((opt) => !opt.disabled);
};

/**
 * Mencari indeks opsi aktif terakhir yang tidak dinonaktifkan.
 *
 * @param {SegmentedControlOption<T>[]} options - Daftar opsi
 * @param {boolean} [isComponentDisabled=false] - Status disabled komponen
 * @returns {number} Indeks opsi terakhir yang aktif, atau -1 jika tidak ada
 */
export const findLastEnabledIndex = <T extends string | number = string>(
  options: SegmentedControlOption<T>[],
  isComponentDisabled = false
): number => {
  if (isComponentDisabled) return -1;
  for (let i = options.length - 1; i >= 0; i--) {
    if (!options[i].disabled) {
      return i;
    }
  }
  return -1;
};

/**
 * Mencari indeks opsi aktif berikutnya (dengan wrapping melingkar ke awal).
 * Melewati opsi-opsi yang berstatus disabled.
 *
 * @param {SegmentedControlOption<T>[]} options - Daftar opsi
 * @param {number} currentIndex - Indeks opsi saat ini
 * @param {boolean} [isComponentDisabled=false] - Status disabled komponen
 * @returns {number} Indeks opsi enabled berikutnya, atau currentIndex jika tidak ada
 */
export const findNextEnabledIndex = <T extends string | number = string>(
  options: SegmentedControlOption<T>[],
  currentIndex: number,
  isComponentDisabled = false
): number => {
  if (options.length === 0 || isComponentDisabled) return currentIndex;

  const len = options.length;
  for (let step = 1; step <= len; step++) {
    const nextIdx = (currentIndex + step) % len;
    if (!options[nextIdx].disabled) {
      return nextIdx;
    }
  }

  return currentIndex;
};

/**
 * Mencari indeks opsi aktif sebelumnya (dengan wrapping melingkar ke akhir).
 * Melewati opsi-opsi yang berstatus disabled.
 *
 * @param {SegmentedControlOption<T>[]} options - Daftar opsi
 * @param {number} currentIndex - Indeks opsi saat ini
 * @param {boolean} [isComponentDisabled=false] - Status disabled komponen
 * @returns {number} Indeks opsi enabled sebelumnya, atau currentIndex jika tidak ada
 */
export const findPreviousEnabledIndex = <T extends string | number = string>(
  options: SegmentedControlOption<T>[],
  currentIndex: number,
  isComponentDisabled = false
): number => {
  if (options.length === 0 || isComponentDisabled) return currentIndex;

  const len = options.length;
  for (let step = 1; step <= len; step++) {
    const prevIdx = (currentIndex - step + len) % len;
    if (!options[prevIdx].disabled) {
      return prevIdx;
    }
  }

  return currentIndex;
};

/**
 * Menentukan nilai awal segmen aktif saat komponen diinisialisasi pada mode uncontrolled.
 * Memprioritaskan defaultValue yang valid dan enabled, atau fallback ke opsi enabled pertama.
 *
 * @param {SegmentedControlOption<T>[]} options - Daftar opsi
 * @param {T} [defaultValue] - Nilai bawaan yang dioper
 * @param {boolean} [isComponentDisabled=false] - Status disabled komponen
 * @returns {T | undefined} Nilai awal segmen, atau undefined jika tidak ada opsi enabled
 */
export const getInitialSegmentValue = <T extends string | number = string>(
  options: SegmentedControlOption<T>[],
  defaultValue?: T,
  isComponentDisabled = false
): T | undefined => {
  if (options.length === 0) return undefined;

  // Jika defaultValue disediakan dan ada di daftar opsi
  if (defaultValue !== undefined) {
    const matchingOption = options.find((opt) => opt.value === defaultValue);
    if (matchingOption) {
      // Jika defaultValue tidak disabled, gunakan
      if (!isOptionDisabled(matchingOption, isComponentDisabled)) {
        return defaultValue;
      }
    }
  }

  // Fallback ke opsi enabled pertama
  const firstEnabledIdx = findFirstEnabledIndex(options, isComponentDisabled);
  if (firstEnabledIdx !== -1) {
    return options[firstEnabledIdx].value;
  }

  // Jika semua disabled dan defaultValue cocok dengan salah satu opsi
  if (defaultValue !== undefined) {
    const matchingOption = options.find((opt) => opt.value === defaultValue);
    if (matchingOption) return defaultValue;
  }

  return options[0]?.value;
};
