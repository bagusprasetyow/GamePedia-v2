import { BadRequestException } from '@nestjs/common';
import * as path from 'node:path';

export const MAX_IMAGE_WIDTH = 8192;
export const MAX_IMAGE_HEIGHT = 8192;
export const MAX_IMAGE_PIXELS = 33_554_432; // 33.5 megapixels (e.g. 8192x4096)

/**
 * Format gambar yang didukung oleh sistem penyimpanan GamePedia (Bitmap aman)
 */
export type SupportedImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

/**
 * Dimensi fisik gambar dalam piksel
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Hasil metadata gambar setelah melewati pipeline validasi 4-lapis
 */
export interface ValidatedImageInfo {
  format: SupportedImageFormat;
  mimeType: string;
  extension: string;
  dimensions?: ImageDimensions;
}

/**
 * Pemetaan ekstensi ke format kanonikal dan MIME type
 */
const EXTENSION_MAP: Record<string, { format: SupportedImageFormat; mimeType: string }> = {
  '.jpg': { format: 'jpeg', mimeType: 'image/jpeg' },
  '.jpeg': { format: 'jpeg', mimeType: 'image/jpeg' },
  '.png': { format: 'png', mimeType: 'image/png' },
  '.webp': { format: 'webp', mimeType: 'image/webp' },
  '.avif': { format: 'avif', mimeType: 'image/avif' },
};

/**
 * Pemetaan MIME type ke format kanonikal dan ekstensi default
 */
const MIME_MAP: Record<string, { format: SupportedImageFormat; defaultExt: string }> = {
  'image/jpeg': { format: 'jpeg', defaultExt: '.jpg' },
  'image/jpg': { format: 'jpeg', defaultExt: '.jpg' },
  'image/png': { format: 'png', defaultExt: '.png' },
  'image/webp': { format: 'webp', defaultExt: '.webp' },
  'image/avif': { format: 'avif', defaultExt: '.avif' },
};

/**
 * Mendeteksi format gambar sebenarnya dari signature biner (magic bytes) buffer
 *
 * @param buffer Buffer biner berkas
 * @returns Format gambar yang terdeteksi atau null jika tidak dikenali
 */
export function detectImageSignature(buffer: Buffer): SupportedImageFormat | null {
  if (!buffer || buffer.length < 4) {
    return null;
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpeg';
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'png';
  }

  // 3. WebP: RIFF (byte 0-3) dan WEBP (byte 8-11)
  if (buffer.length >= 12) {
    const riff = buffer.toString('ascii', 0, 4);
    const webp = buffer.toString('ascii', 8, 12);
    if (riff === 'RIFF' && webp === 'WEBP') {
      return 'webp';
    }
  }

  // 4. AVIF: byte 4-7 = 'ftyp', byte 8-11 = 'avif' atau 'avis'
  if (buffer.length >= 12) {
    const ftyp = buffer.toString('ascii', 4, 8);
    const brand = buffer.toString('ascii', 8, 12);
    if (ftyp === 'ftyp' && (brand === 'avif' || brand === 'avis')) {
      return 'avif';
    }
  }

  return null;
}

/**
 * Mengekstrak dimensi gambar (lebar & tinggi) langsung dari header biner buffer tanpa me-load bitmap penuh
 * Mencegah decompression bomb dan eksploitasi dimensi raksasa (pixel bomb).
 *
 * @param buffer Buffer biner gambar
 * @param format Format gambar yang terdeteksi
 * @returns Dimensi { width, height } atau null jika buffer tidak memuat header dimensi lengkap
 */
export function extractImageDimensions(
  buffer: Buffer,
  format: SupportedImageFormat
): ImageDimensions | null {
  try {
    if (format === 'png') {
      // PNG IHDR chunk selalu berada di offset 8-24 jika format standar
      if (buffer.length >= 24) {
        const chunkType = buffer.toString('ascii', 12, 16);
        if (chunkType === 'IHDR') {
          const width = buffer.readUInt32BE(16);
          const height = buffer.readUInt32BE(20);
          if (width > 0 && height > 0) return { width, height };
        }
      }
    } else if (format === 'jpeg') {
      // Scan JPEG markers mencari SOF (Start of Frame)
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xff) {
          offset++;
          continue;
        }
        const marker = buffer[offset + 1];
        // SOF0 (0xC0) hingga SOF15 (0xCF) kecuali DHT (0xC4), JPG (0xC8), DAC (0xCC)
        const isSOF =
          marker >= 0xc0 &&
          marker <= 0xcf &&
          marker !== 0xc4 &&
          marker !== 0xc8 &&
          marker !== 0xcc;

        if (isSOF && offset + 8 < buffer.length) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          if (width > 0 && height > 0) return { width, height };
        }

        if (offset + 3 >= buffer.length) break;
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    } else if (format === 'webp') {
      if (buffer.length >= 30) {
        const chunk = buffer.toString('ascii', 12, 16);
        if (chunk === 'VP8 ' && buffer.length >= 30) {
          // VP8 lossy: cek start code 0x9D 0x01 0x2A
          if (buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
            const width = buffer.readUInt16LE(26) & 0x3fff;
            const height = buffer.readUInt16LE(28) & 0x3fff;
            if (width > 0 && height > 0) return { width, height };
          }
        } else if (chunk === 'VP8L' && buffer.length >= 25) {
          // VP8L lossless
          if (buffer[20] === 0x2f) {
            const b0 = buffer[21];
            const b1 = buffer[22];
            const b2 = buffer[23];
            const b3 = buffer[24];
            const width = 1 + (b0 | ((b1 & 0x3f) << 8));
            const height = 1 + (((b1 >> 6) | (b2 << 2) | ((b3 & 0x0f) << 10)));
            if (width > 0 && height > 0) return { width, height };
          }
        } else if (chunk === 'VP8X' && buffer.length >= 30) {
          // VP8X extended
          const width = 1 + buffer.readUIntLE(24, 3);
          const height = 1 + buffer.readUIntLE(27, 3);
          if (width > 0 && height > 0) return { width, height };
        }
      }
    } else if (format === 'avif') {
      // AVIF: cari box 'ispe' (image spatial extents)
      const ispeIndex = buffer.indexOf('ispe');
      if (ispeIndex >= 4 && ispeIndex + 16 <= buffer.length) {
        const width = buffer.readUInt32BE(ispeIndex + 8);
        const height = buffer.readUInt32BE(ispeIndex + 12);
        if (width > 0 && height > 0) return { width, height };
      }
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Menjalankan validasi menyeluruh pada berkas gambar yang diunggah dengan 4 lapis perlindungan:
 * 1. Extension Check: Memastikan ekstensi nama berkas sah dan terdaftar
 * 2. MIME Check: Memastikan Content-Type MIME yang dideklarasikan valid
 * 3. Actual Image Validation: Memverifikasi signature biner asli (magic bytes) dan konsistensi
 * 4. Dimension & Pixel Bomb Protection: Memverifikasi batas resolusi fisik (maks 8192x8192 & 33.5M piksel)
 *
 * @param file Berkas upload dari Multer
 * @returns Metadata gambar yang tervalidasi
 * @throws BadRequestException jika salah satu lapisan validasi gagal
 */
export function validateImageUpload(file?: Express.Multer.File): ValidatedImageInfo {
  if (!file || !file.buffer || file.buffer.length === 0) {
    throw new BadRequestException('Berkas gambar tidak ditemukan atau kosong');
  }

  // LAPIS 1: Extension Check
  const originalName = file.originalname || '';
  const ext = path.extname(originalName).toLowerCase();

  let extFormat: SupportedImageFormat | null = null;
  if (ext) {
    const extInfo = EXTENSION_MAP[ext];
    if (!extInfo) {
      throw new BadRequestException(
        `Ekstensi berkas "${ext}" tidak diizinkan. Hanya format gambar (.jpg, .jpeg, .png, .webp, .avif) yang diterima`
      );
    }
    extFormat = extInfo.format;
  }

  // LAPIS 2: MIME Check
  const mimeType = (file.mimetype || '').toLowerCase();
  const mimeInfo = MIME_MAP[mimeType];

  if (!mimeInfo || !mimeType.startsWith('image/')) {
    throw new BadRequestException(
      `Tipe MIME "${file.mimetype}" tidak diizinkan atau bukan merupakan gambar yang valid`
    );
  }

  if (extFormat && extFormat !== mimeInfo.format) {
    throw new BadRequestException(
      `Ketidakcocokan format: Ekstensi berkas "${ext}" tidak sesuai dengan MIME type "${file.mimetype}"`
    );
  }

  // LAPIS 3: Actual Image Validation (Magic Bytes & File Signature)
  const actualFormat = detectImageSignature(file.buffer);

  if (!actualFormat) {
    throw new BadRequestException(
      'Isi berkas tidak valid: Berkas tidak memiliki signature/magic bytes gambar yang sah'
    );
  }

  if (actualFormat !== mimeInfo.format) {
    throw new BadRequestException(
      `Pemalsuan berkas terdeteksi: Tipe berkas asli (${actualFormat.toUpperCase()}) berbeda dari MIME yang diklaim (${file.mimetype})`
    );
  }

  // LAPIS 4: Dimension & Pixel Bomb Check
  const dimensions = extractImageDimensions(file.buffer, actualFormat);
  if (dimensions) {
    if (dimensions.width > MAX_IMAGE_WIDTH || dimensions.height > MAX_IMAGE_HEIGHT) {
      throw new BadRequestException(
        `Dimensi gambar (${dimensions.width}x${dimensions.height}) melebihi batas maksimum ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT} piksel`
      );
    }
    const totalPixels = dimensions.width * dimensions.height;
    if (totalPixels > MAX_IMAGE_PIXELS) {
      throw new BadRequestException(
        `Resolusi piksel gambar (${totalPixels.toLocaleString()} px) melebihi batas aman perlindungan pixel-bomb`
      );
    }
  }

  const finalExt = ext || mimeInfo.defaultExt;

  return {
    format: actualFormat,
    mimeType,
    extension: finalExt,
    dimensions: dimensions || undefined,
  };
}
