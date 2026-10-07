import type { ICache } from '@/utils/cache';

/**
 * Tipe fungsi pengambil data (fetcher) dengan dukungan opsional AbortSignal untuk pembatalan request.
 */
export type CacheFetcher<T> = (signal?: AbortSignal) => Promise<T> | T;

/**
 * Opsi konfigurasi untuk hook useCache.
 */
export interface UseCacheOptions<T> {
  /**
   * Batas waktu kedaluwarsa (TTL) dalam milidetik untuk entri data ini.
   * Default: 0 (mengikuti pengaturan default cache).
   */
  ttl?: number;

  /**
   * Instance cache kustom (mengimplementasikan ICache).
   * Jika tidak ditentukan, hook akan menggunakan shared memory cache default.
   */
  cache?: ICache<string, T>;

  /**
   * Apakah pemanggilan fetcher otomatis dijalankan saat mount/key berubah.
   * @default true
   */
  enabled?: boolean;

  /**
   * Nilai awal (fallback) sebelum data berhasil diambil dari cache atau fetcher.
   */
  initialData?: T;
}

/**
 * Nilai kembalian reaktif dari hook useCache.
 */
export interface UseCacheReturn<T> {
  /**
   * Data hasil komputasi atau fetcher yang telah di-cache.
   */
  data: T | undefined;

  /**
   * Status apakah proses pemanggilan fetcher sedang berlangsung.
   */
  isLoading: boolean;

  /**
   * Objek error jika terjadi kegagalan saat menjalankan fetcher.
   */
  error: Error | null;

  /**
   * Status apakah data saat ini berasal dari cache.
   */
  isCached: boolean;

  /**
   * Memaksa pengambilan ulang data secara asynchronous dan memperbarui cache.
   * Mendukung AbortSignal opsional untuk pembatalan request manual.
   */
  refresh: (signal?: AbortSignal) => Promise<T | undefined>;

  /**
   * Menghapus entri dari cache dan mengosongkan status cached.
   */
  invalidate: () => void;

  /**
   * Memperbarui data secara optimistik langsung ke dalam state dan cache.
   */
  mutate: (newData: T) => void;
}
