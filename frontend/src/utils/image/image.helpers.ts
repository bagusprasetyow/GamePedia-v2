import type { ImageDimensions, ImageFormat, TargetImageFormat } from './image.types';

/**
 * Menghitung dimensi gambar baru dengan mempertahankan rasio aspek asli.
 *
 * @param {number} width - Lebar asli gambar dalam pixel
 * @param {number} height - Tinggi asli gambar dalam pixel
 * @param {number} [maxWidth] - Batas lebar maksimum
 * @param {number} [maxHeight] - Batas tinggi maksimum
 * @returns {ImageDimensions} Dimensi baru yang proporsional
 */
export function calculateDimensions(
  width: number,
  height: number,
  maxWidth?: number,
  maxHeight?: number
): ImageDimensions {
  if (width <= 0 || height <= 0) {
    return { width: Math.max(1, width), height: Math.max(1, height) };
  }

  let newWidth = width;
  let newHeight = height;

  if (maxWidth && maxWidth > 0 && newWidth > maxWidth) {
    newHeight = Math.round((newHeight * maxWidth) / newWidth);
    newWidth = maxWidth;
  }

  if (maxHeight && maxHeight > 0 && newHeight > maxHeight) {
    newWidth = Math.round((newWidth * maxHeight) / newHeight);
    newHeight = maxHeight;
  }

  return {
    width: Math.max(1, newWidth),
    height: Math.max(1, newHeight),
  };
}

/**
 * Memuat objek File gambar menjadi elemen HTMLImageElement di memori browser.
 *
 * @param {File} file - Berkas gambar yang akan dimuat
 * @returns {Promise<HTMLImageElement>} Objek gambar yang siap digambar ke canvas
 */
export function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Fungsi kompresi gambar hanya didukung di lingkungan browser'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Gagal memuat berkas gambar: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

/**
 * Memetakan format input/shorthand ke MIME type standar browser yang valid.
 *
 * @param {TargetImageFormat | string} format - String format gambar (contoh: 'png', 'jpg', 'image/webp')
 * @returns {ImageFormat} Tipe MIME gambar standar
 */
export function normalizeImageFormat(format: TargetImageFormat | string): ImageFormat {
  const clean = (format || '').trim().toLowerCase();

  if (clean === 'jpg' || clean === 'jpeg' || clean === 'image/jpg' || clean === 'image/jpeg') {
    return 'image/jpeg';
  }
  if (clean === 'png' || clean === 'image/png') {
    return 'image/png';
  }
  if (clean === 'webp' || clean === 'image/webp') {
    return 'image/webp';
  }
  if (clean === 'avif' || clean === 'image/avif') {
    return 'image/avif';
  }

  if (clean.startsWith('image/')) {
    return clean as ImageFormat;
  }

  return `image/${clean}` as ImageFormat;
}

/**
 * Mengubah ekstensi nama berkas sesuai dengan tipe MIME target.
 *
 * @param {string} fileName - Nama berkas asal (contoh: 'screenshot.png')
 * @param {string} mimeType - Tipe MIME target (contoh: 'image/webp')
 * @returns {string} Nama berkas dengan ekstensi baru (contoh: 'screenshot.webp')
 */
export function changeFileExtension(fileName: string, mimeType: string): string {
  const extensionMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/avif': '.avif',
  };

  const newExtension = extensionMap[mimeType] || '.jpg';
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex <= 0) {
    return `${fileName}${newExtension}`;
  }

  const baseName = fileName.slice(0, lastDotIndex);
  return `${baseName}${newExtension}`;
}
