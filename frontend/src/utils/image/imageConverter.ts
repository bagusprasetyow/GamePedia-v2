import type { ConvertImageOptions } from './image.types';
import {
  normalizeImageFormat,
  changeFileExtension,
} from './image.helpers';
import { compressImage } from './imageCompressor';

/**
 * Mengonversi format berkas gambar ke format lain (misalnya PNG ke WEBP atau JPEG).
 * Secara cerdas mengisi latar transparan saat konversi ke JPEG untuk menghindari artefak hitam,
 * serta mendukung pembatasan target ukuran berkas maksimum (maxSizeKB).
 *
 * @param {File} file - Berkas File gambar sumber
 * @param {ConvertImageOptions} options - Opsi format dan kualitas konversi
 * @returns {Promise<File>} Berkas File gambar baru hasil konversi
 *
 * @example
 * ```ts
 * const webpFile = await convertImage(pngFile, {
 *   format: 'image/webp',
 *   quality: 0.9,
 *   maxSizeKB: 200,
 * });
 * ```
 */
export async function convertImage(
  file: File,
  options: ConvertImageOptions
): Promise<File> {
  const {
    format,
    quality = 0.92,
    backgroundColor = '#FFFFFF',
    maxWidth,
    maxHeight,
    maxSizeKB,
  } = options;

  const targetMime = normalizeImageFormat(format);
  const newFileName = changeFileExtension(file.name, targetMime);

  const processedFile = await compressImage(file, {
    mimeType: targetMime,
    quality,
    backgroundColor,
    maxWidth,
    maxHeight,
    maxSizeKB,
  });

  return new File([processedFile], newFileName, {
    type: targetMime,
    lastModified: Date.now(),
  });
}
