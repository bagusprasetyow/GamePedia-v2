/**
 * Opsi konfigurasi untuk MemoryCache.
 */
export interface CacheOptions {
  /**
   * Jumlah kapasitas maksimum item dalam cache sebelum item paling jarang digunakan (LRU) di-evict.
   * @default 100
   */
  maxSize?: number;

  /**
   * Waktu kedaluwarsa default (Time-To-Live) dalam milidetik.
   * Nilai 0 atau `undefined` berarti item tidak kedaluwarsa secara otomatis.
   * @default 0
   */
  defaultTtl?: number;
}

/**
 * Metadata dan nilai dari satu entri cache.
 */
export interface CacheEntry<T> {
  /** Nilai yang disimpan */
  value: T;
  /** Waktu pembuatan dalam timestamp milidetik (Date.now()) */
  createdAt: number;
  /** Waktu kedaluwarsa dalam timestamp milidetik, atau null jika tidak ada batas waktu */
  expiresAt: number | null;
}

/**
 * Kontrak antarmuka (interface) untuk struktur data Cache.
 */
export interface ICache<K, V> {
  /**
   * Mengambil item dari cache. Jika item telah kedaluwarsa, item akan dihapus dan mengembalikan undefined.
   */
  get(key: K): V | undefined;

  /**
   * Menyimpan item ke dalam cache dengan opsi TTL kustom.
   * Jika kapasitas melebihi maxSize, item tertua (LRU) akan dikeluarkan.
   */
  set(key: K, value: V, ttl?: number): void;

  /**
   * Memeriksa apakah key ada dalam cache dan belum kedaluwarsa.
   */
  has(key: K): boolean;

  /**
   * Menghapus item berdasarkan key. Mengembalikan true jika item berhasil dihapus.
   */
  delete(key: K): boolean;

  /**
   * Mengosongkan seluruh entri di dalam cache.
   */
  clear(): void;

  /**
   * Mengembalikan jumlah item yang masih valid (belum kedaluwarsa) dalam cache.
   */
  size(): number;

  /**
   * Menghapus seluruh entri yang telah kedaluwarsa secara manual.
   * @returns Jumlah item yang berhasil dibersihkan.
   */
  prune(): number;

  /**
   * Mengambil seluruh daftar key yang aktif dalam urutan akses (LRU ke MRU).
   */
  keys(): K[];
}
