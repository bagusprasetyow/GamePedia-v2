import type {
  ImageUploadFileDetails,
  CompressImageOptions,
  ConvertImageOptions,
  TargetImageFormat,
} from './ImageUpload.types';
import {
  compressImage,
  normalizeImageFormat,
  changeFileExtension,
} from '@/utils/image';

/**
 * Memformat ukuran byte ke satuan yang mudah dibaca (B / KB / MB / GB).
 *
 * @param {number} bytes - Jumlah byte
 * @returns {string} String ukuran terformat (contoh: '2.4 MB')
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const size = bytes / Math.pow(1024, index);
  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

/**
 * Mengekstrak informasi detail dari objek berkas File.
 * Jika berkas berasal dari hasil kompresi (originalFile diberikan dan ukurannya berbeda),
 * informasi ukuran asli sebelum kompresi akan disertakan.
 *
 * @param {File} file - Berkas File aktif/hasil proses
 * @param {File} [originalFile] - Berkas File asli sebelum kompresi (opsional)
 * @returns {ImageUploadFileDetails} Detail berkas
 */
export function extractFileDetails(
  file: File,
  originalFile?: File | null
): ImageUploadFileDetails {
  const isCompressed = Boolean(
    originalFile &&
    originalFile.size > 0 &&
    originalFile.size !== file.size
  );

  return {
    name: file.name,
    size: file.size,
    formattedSize: formatFileSize(file.size),
    type: file.type || 'image/*',
    originalSize: isCompressed ? originalFile!.size : undefined,
    originalFormattedSize: isCompressed ? formatFileSize(originalFile!.size) : undefined,
  };
}

/**
 * Memvalidasi apakah file memenuhi kriteria tipe MIME dan ukuran maksimum.
 *
 * @param {File} file - Berkas yang diuji
 * @param {string} accept - Pola accept MIME (contoh: 'image/png, image/jpeg')
 * @param {number} maxSizeMB - Ukuran maksimum dalam MB
 * @returns {{ valid: boolean; error?: string }} Hasil validasi
 */
export function validateImageFile(
  file: File,
  accept: string,
  maxSizeMB: number
): { valid: boolean; error?: string } {
  // 1. Validasi Ukuran Maksimum
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimum ${maxSizeMB} MB (${formatFileSize(file.size)})`,
    };
  }

  // 2. Validasi Tipe Berkas (MIME)
  if (accept && accept.trim() !== '') {
    const acceptedTypes = accept
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    const fileType = (file.type || '').toLowerCase();
    const fileName = (file.name || '').toLowerCase();

    const isMatch = acceptedTypes.some((typePattern) => {
      // Pola wildcard: image/*
      if (typePattern.endsWith('/*')) {
        const baseType = typePattern.replace('/*', '');
        return fileType.startsWith(baseType);
      }
      // Pola ekstensi: .png, .jpg
      if (typePattern.startsWith('.')) {
        return fileName.endsWith(typePattern);
      }
      // Pola MIME spesifik: image/png
      return fileType === typePattern;
    });

    if (!isMatch) {
      return {
        valid: false,
        error: `Format berkas tidak didukung. Diizinkan: ${accept}`,
      };
    }
  }

  return { valid: true };
}

export interface ProcessImageFilePipelineOptions {
  file: File;
  accept: string;
  maxSizeMB: number;
  compress?: boolean | CompressImageOptions;
  convertTo?: TargetImageFormat | ConvertImageOptions;
}

/**
 * Menjalankan rantai pemrosesan konversi format dan kompresi file gambar.
 *
 * @param {ProcessImageFilePipelineOptions} options - Opsi pemrosesan berkas
 * @returns {Promise<File>} File hasil pemrosesan
 */
export async function processImageFilePipeline({
  file,
  accept,
  maxSizeMB,
  compress,
  convertTo,
}: ProcessImageFilePipelineOptions): Promise<File> {
  // 1. Validasi awal berkas (format awal dan batas ukuran)
  const validation = validateImageFile(file, accept, maxSizeMB);
  if (!validation.valid) {
    throw new Error(validation.error || 'Berkas tidak valid');
  }

  let processedFile = file;
  const needsConversion = Boolean(convertTo);
  const needsCompression = Boolean(compress);

  if (needsConversion || needsCompression) {
    const convertFormat = convertTo
      ? typeof convertTo === 'string'
        ? convertTo
        : convertTo.format
      : undefined;

    const convertOptions: Partial<ConvertImageOptions> =
      typeof convertTo === 'object' && convertTo !== null ? convertTo : {};

    const compressOptions: CompressImageOptions =
      typeof compress === 'object' && compress !== null ? compress : {};

    const targetMime = convertFormat ? normalizeImageFormat(convertFormat) : undefined;

    // Gabungkan opsi kompresi dan konversi agar berjalan dalam satu pipeline render canvas tunggal yang efisien
    const combinedOptions: CompressImageOptions = {
      ...convertOptions,
      ...compressOptions,
      ...(targetMime ? { mimeType: targetMime } : {}),
    };

    processedFile = await compressImage(processedFile, combinedOptions);

    if (targetMime) {
      const newName = changeFileExtension(processedFile.name, targetMime);
      processedFile = new File([processedFile], newName, {
        type: targetMime,
        lastModified: Date.now(),
      });
    }

    // Validasi kembali batas ukuran jika ukuran membengkak pasca proses
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (processedFile.size > maxSizeBytes) {
      throw new Error(
        `Ukuran file hasil pemrosesan melebihi batas maksimum ${maxSizeMB} MB`
      );
    }
  }

  return processedFile;
}
