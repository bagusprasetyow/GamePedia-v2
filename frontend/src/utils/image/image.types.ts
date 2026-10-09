/**
 * Tipe MIME format gambar yang didukung secara standar oleh browser Canvas.
 */
export type ImageFormat =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/avif';

/**
 * Daftar MIME types gambar yang didukung secara resmi oleh platform GamePedia (Single Source of Truth)
 */
export const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

/**
 * Nilai default atribut accept untuk pemilih berkas gambar
 */
export const DEFAULT_ACCEPTED_IMAGE_TYPES = SUPPORTED_IMAGE_MIME_TYPES.join(', ');

/**
 * Format string pendek untuk kenyamanan konsumen API.
 */
export type ImageFormatShorthand = 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif';

/**
 * Target format gambar yang dapat diterima (MIME type atau shorthand).
 */
export type TargetImageFormat = ImageFormat | ImageFormatShorthand;

/**
 * Konfigurasi opsi untuk fungsi kompresi gambar.
 */
export interface CompressImageOptions {
  /**
   * Kualitas kompresi gambar (antara 0.01 hingga 1.0).
   * Hanya berpengaruh pada format lossy seperti image/jpeg, image/webp, dan image/avif.
   * @default 0.8
   */
  quality?: number;

  /**
   * Batas target ukuran maksimum file hasil kompresi dalam Kilobyte (KB).
   * Contoh: 100 untuk target di bawah 100 KB, 200 untuk target di bawah 200 KB.
   * Algoritma akan menyesuaikan kualitas dan/atau dimensi resolusi secara cerdas
   * hingga ukuran berkas berada di bawah batas ini.
   */
  maxSizeKB?: number;

  /**
   * Batas kualitas terendah saat melakukan kompresi iteratif menuju target maxSizeKB.
   * @default 0.1
   */
  minQuality?: number;

  /**
   * Jumlah iterasi maksimum untuk mencari kualitas/dimensi yang memenuhi target maxSizeKB.
   * @default 6
   */
  maxIterations?: number;

  /**
   * Batas lebar maksimum gambar dalam pixel.
   * Jika gambar melebihi batas ini, dimensi akan diskalakan secara proporsional.
   */
  maxWidth?: number;

  /**
   * Batas tinggi maksimum gambar dalam pixel.
   * Jika gambar melebihi batas ini, dimensi akan diskalakan secara proporsional.
   */
  maxHeight?: number;

  /**
   * Tipe MIME output kompresi.
   * Jika tidak ditentukan, akan mempertahankan tipe MIME asli file jika didukung.
   */
  mimeType?: TargetImageFormat | string;

  /**
   * Warna latar belakang saat mengompresi ke format yang tidak mendukung transparansi (seperti JPEG).
   * @default '#FFFFFF'
   */
  backgroundColor?: string;

  /**
   * Jika true, melempar error apabila target ukuran maxSizeKB tidak tercapai setelah iterasi maksimum.
   * Jika false, mengembalikan hasil kompresi terkecil terbaik yang dicapai (best-effort).
   * @default false
   */
  strictMaxSize?: boolean;
}

/**
 * Konfigurasi opsi untuk fungsi konversi format gambar.
 */
export interface ConvertImageOptions {
  /**
   * Format target gambar tujuan (contoh: 'image/webp', 'image/jpeg', 'png', 'webp').
   */
  format: TargetImageFormat | string;

  /**
   * Kualitas kompresi output untuk format lossy (antara 0.01 hingga 1.0).
   * @default 0.92
   */
  quality?: number;

  /**
   * Batas target ukuran maksimum berkas hasil konversi dalam Kilobyte (KB).
   * Contoh: 100 untuk target di bawah 100 KB, 200 untuk target di bawah 200 KB.
   */
  maxSizeKB?: number;

  /**
   * Warna latar belakang saat mengonversi gambar transparan (PNG/WEBP/GIF) ke format yang tidak mendukung transparansi (seperti JPEG).
   * @default '#FFFFFF'
   */
  backgroundColor?: string;

  /**
   * Batas lebar maksimum gambar hasil konversi dalam pixel.
   */
  maxWidth?: number;

  /**
   * Batas tinggi maksimum gambar hasil konversi dalam pixel.
   */
  maxHeight?: number;
}

/**
 * Representasi dimensi dua dimensi (lebar dan tinggi).
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Data berkas gambar yang dikembalikan oleh backend setelah berhasil disimpan
 */
export interface ImageUploadServerData {
  filename: string;
  originalName: string;
  subPath: string;
  relativeFilePath: string;
  url: string;
  size: number;
  mimeType: string;
}

/**
 * Format payload respons API penyimpanan backend
 */
export interface ImageUploadServerResponse {
  success: boolean;
  message: string;
  data: ImageUploadServerData;
}

/**
 * Opsi konfigurasi fungsi pengunggahan berkas gambar ke backend storage API
 */
export interface UploadImageToServerOptions {
  /**
   * Objek berkas gambar yang akan diunggah
   */
  file: File;

  /**
   * Sub-direktori tujuan di backend data/storage/image (contoh: '/game', 'game')
   */
  path?: string;

  /**
   * URL endpoint upload backend
   * @default 'http://localhost:4003/storage/upload'
   */
  uploadUrl?: string;

  /**
   * Header tambahan (misal untuk autentikasi)
   */
  headers?: Record<string, string>;

  /**
   * Callback untuk memantau persentase progres pengunggahan (0 s/d 100)
   */
  onProgress?: (percent: number) => void;

  /**
   * Sinyal pembatalan (AbortSignal) untuk membatalkan koneksi pengunggahan
   */
  signal?: AbortSignal;

  /**
   * Batas waktu pengunggahan dalam milidetik
   * @default 60000 (60 detik)
   */
  timeout?: number;
}
