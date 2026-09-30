// Kode Area 2 Digit Utama PSTN Indonesia (tanpa angka 0 di awal):
// 21 (Jakarta/Bodeta), 31 (Surabaya), 22 (Bandung), 61 (Medan), 24 (Semarang)
export const TWO_DIGIT_AREA_CODES = ['21', '31', '22', '61', '24'];

export interface FormatPhoneOptions {
  autoFormatHyphen?: boolean;
  hyphenSymbol?: string;
  allowPlusPrefix?: boolean;
  allowHyphens?: boolean;
  maxDigits?: number;
}

export interface ValidatePhoneOptions {
  minDigits?: number;
  maxDigits?: number;
  invalidErrorMessage?: string;
}

/**
 * Sanitasi & Pemformatan Otomatis Tanda Hubung / Pemisah Pintar
 */
export const formatPhoneHyphens = (
  text: string,
  options: FormatPhoneOptions = {}
): string => {
  const {
    autoFormatHyphen = true,
    hyphenSymbol = '-',
    allowPlusPrefix = true,
    allowHyphens = true,
    maxDigits = 14,
  } = options;

  const startsWithPlus = allowPlusPrefix && text.startsWith('+');
  const pureDigits = text.replace(/\D/g, '').slice(0, maxDigits);
  const h = hyphenSymbol;

  if (!pureDigits) return startsWithPlus ? '+' : '';
  if (!autoFormatHyphen || !allowHyphens) return (startsWithPlus ? '+' : '') + pureDigits;

  // 1. Call Center & Short Code (14xxx, 1500-xxx, dll)
  if (pureDigits.startsWith('14')) {
    // Format 5 digit: 14045, 14000
    return pureDigits.slice(0, 5);
  }
  if (pureDigits.startsWith('15')) {
    // Format 7 digit: 1500-123, 1500-888
    const p1 = pureDigits.slice(0, 4);
    const p2 = pureDigits.slice(4, 8);
    return p2 ? `${p1}${h}${p2}` : p1;
  }
  if (pureDigits.startsWith('1')) {
    // Short code darurat/layanan (112, 110, 188, 123)
    return pureDigits.slice(0, 7);
  }

  // 2. Bebas Pulsa (0800) & Premium Call (0809)
  if (pureDigits.startsWith('0800') || pureDigits.startsWith('0809')) {
    const p1 = pureDigits.slice(0, 4);
    if (pureDigits.length <= 4) return p1;

    if (pureDigits[4] === '1' && pureDigits.length > 5) {
      const p2 = pureDigits.slice(4, 5);
      const p3 = pureDigits.slice(5, 11);
      return `${p1}${h}${p2}${h}${p3}`;
    }

    const p2 = pureDigits.slice(4, 7);
    const p3 = pureDigits.slice(7, 11);
    return p3 ? `${p1}${h}${p2}${h}${p3}` : `${p1}${h}${p2}`;
  }

  // 3. Telepon Tetap / PSTN Landline (021, 031, 0361, dll)
  const isLandlineLocal = /^0[2345679]/.test(pureDigits);
  if (isLandlineLocal) {
    const is2DigitArea = TWO_DIGIT_AREA_CODES.some((ac) => pureDigits.startsWith(`0${ac}`));
    const areaLen = is2DigitArea ? 3 : 4;

    if (pureDigits.length <= areaLen) return pureDigits;
    const area = pureDigits.slice(0, areaLen);
    const sub = pureDigits.slice(areaLen, areaLen + 8);
    return `${area}${h}${sub}`;
  }

  if (startsWithPlus && /^[2345679]/.test(pureDigits)) {
    const is2DigitArea = TWO_DIGIT_AREA_CODES.some((ac) => pureDigits.startsWith(ac));
    const areaLen = is2DigitArea ? 2 : 3;

    if (pureDigits.length <= areaLen) return `+62${h}${pureDigits}`;
    const area = pureDigits.slice(0, areaLen);
    const sub = pureDigits.slice(areaLen, areaLen + 8);
    return `+62${h}${area}${h}${sub}`;
  }

  // 4. Nomor Seluler (Handphone)
  if (startsWithPlus && pureDigits.startsWith('8')) {
    const p1 = pureDigits.slice(0, 3);
    const p2 = pureDigits.slice(3, 7);
    const p3 = pureDigits.slice(7, 12);
    if (!p2) return `+62${h}${p1}`;
    if (!p3) return `+62${h}${p1}${h}${p2}`;
    return `+62${h}${p1}${h}${p2}${h}${p3}`;
  }

  if (pureDigits.startsWith('08')) {
    const p1 = pureDigits.slice(0, 4);
    const p2 = pureDigits.slice(4, 8);
    const p3 = pureDigits.slice(8, 13);
    if (!p2) return p1;
    if (!p3) return `${p1}${h}${p2}`;
    return `${p1}${h}${p2}${h}${p3}`;
  }

  // Fallback Standar
  const prefixLen = pureDigits.startsWith('0') ? 4 : 3;
  if (pureDigits.length <= prefixLen) return (startsWithPlus ? '+' : '') + pureDigits;
  if (pureDigits.length <= prefixLen + 4) {
    return `${startsWithPlus ? '+' : ''}${pureDigits.slice(0, prefixLen)}${h}${pureDigits.slice(prefixLen)}`;
  }
  return `${startsWithPlus ? '+' : ''}${pureDigits.slice(0, prefixLen)}${h}${pureDigits.slice(prefixLen, prefixLen + 4)}${h}${pureDigits.slice(prefixLen + 4, prefixLen + 8)}`;
};

/**
 * Sanitasi input nomor telepon (hanya digit, tanda hubung, dan optional + di awal)
 */
export const sanitizePhone = (
  rawText: string,
  options: FormatPhoneOptions = {}
): string => {
  const { allowPlusPrefix = true, allowHyphens = true } = options;
  let result = rawText;

  const allowedRegex = allowPlusPrefix
    ? allowHyphens
      ? /[^\d\s+-]/g
      : /[^\d\s+]/g
    : allowHyphens
      ? /[^\d\s-]/g
      : /[^\d\s]/g;

  result = result.replace(allowedRegex, '');

  if (allowPlusPrefix && result.includes('+')) {
    const startsWithPlus = result.startsWith('+');
    result = (startsWithPlus ? '+' : '') + result.replace(/\+/g, '');
  }

  return formatPhoneHyphens(result, options);
};

/**
 * Validasi format & panjang nomor telepon berdasarkan jenis nomor
 */
export const validatePhoneFormat = (
  phoneText: string,
  options: ValidatePhoneOptions = {}
): boolean => {
  const { minDigits = 5, maxDigits = 14 } = options;
  if (!phoneText) return true;
  const pureDigits = phoneText.replace(/\D/g, '');
  const len = pureDigits.length;

  // Short Code Call Center 5 digit (14045, 14000)
  if (pureDigits.startsWith('14')) {
    return len === 5;
  }
  // Call Center Perusahaan 7-8 digit (1500-123, 1500-888)
  if (pureDigits.startsWith('15')) {
    return len >= 7 && len <= 8;
  }
  // Layanan darurat / short code (112, 110, 188, 123)
  if (pureDigits.startsWith('1')) {
    return len >= 3 && len <= 7;
  }
  // PSTN Landline (021, 031, 0361, dll)
  if (/^0[2345679]/.test(pureDigits)) {
    return len >= 7 && len <= 11;
  }
  // Mobile / Toll-Free / Standard
  return len >= minDigits && len <= maxDigits;
};

/**
 * Pesan Kesalahan Dinamis berdasarkan Jenis Nomor & Rentang Digit
 */
export const getDynamicErrorMessage = (
  phoneText: string,
  options: ValidatePhoneOptions = {}
): string => {
  const { minDigits = 5, maxDigits = 14, invalidErrorMessage } = options;
  if (invalidErrorMessage) return invalidErrorMessage;

  const pureDigits = phoneText.replace(/\D/g, '');
  if (pureDigits.startsWith('14')) {
    return 'Nomor call center tidak valid (harus 5 digit)';
  }
  if (pureDigits.startsWith('15')) {
    return 'Nomor call center tidak valid (harus 7-8 digit)';
  }
  if (/^0[2345679]/.test(pureDigits)) {
    return 'Nomor telepon PSTN tidak valid (7-11 digit)';
  }
  return `Nomor telepon tidak valid (${minDigits}-${maxDigits} digit)`;
};
