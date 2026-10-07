import type { CacheOptions, CacheEntry, ICache } from './cache.types';

/**
 * In-Memory Cache dengan strategi penggusuran LRU (Least Recently Used)
 * dan dukungan kedaluwarsa berbasis waktu (Time-To-Live / TTL).
 *
 * @template K Tipe data key (default: string).
 * @template V Tipe data value yang disimpan.
 *
 * @example
 * ```ts
 * const cache = new MemoryCache<string, User>({ maxSize: 50, defaultTtl: 60000 });
 * cache.set('user:1', { name: 'Alex' });
 * const user = cache.get('user:1');
 * ```
 */
export class MemoryCache<K = string, V = unknown> implements ICache<K, V> {
  private readonly map = new Map<K, CacheEntry<V>>();
  private readonly maxSize: number;
  private readonly defaultTtl: number;

  constructor(options: CacheOptions = {}) {
    const { maxSize = 100, defaultTtl = 0 } = options;
    this.maxSize = Math.max(1, maxSize);
    this.defaultTtl = Math.max(0, defaultTtl);
  }

  /**
   * Mengambil item dari cache berdasarkan key.
   * Jika item telah kedaluwarsa, item akan otomatis dihapus dan mengembalikan `undefined`.
   * Jika item ditemukan, posisinya diperbarui menjadi yang paling baru digunakan (MRU).
   */
  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) {
      return undefined;
    }

    const now = Date.now();
    if (entry.expiresAt !== null && now > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }

    // Refresh urutan LRU: hapus dan set kembali agar menjadi elemen paling akhir (MRU)
    this.map.delete(key);
    this.map.set(key, entry);

    return entry.value;
  }

  /**
   * Menyimpan item ke dalam cache.
   * Jika kapasitas melebihi `maxSize`, item paling jarang digunakan (LRU) akan dikeluarkan.
   *
   * @param key Kunci unik untuk item.
   * @param value Nilai yang ingin disimpan.
   * @param ttl Waktu kedaluwarsa khusus untuk item ini dalam milidetik (opsional).
   */
  set(key: K, value: V, ttl?: number): void {
    const effectiveTtl = ttl !== undefined ? Math.max(0, ttl) : this.defaultTtl;
    const now = Date.now();
    const expiresAt = effectiveTtl > 0 ? now + effectiveTtl : null;

    // Hapus jika sudah ada agar urutannya berpindah ke paling akhir
    if (this.map.has(key)) {
      this.map.delete(key);
    }

    // Jika melebihi kapasitas maksimum, keluarkan item paling awal (LRU)
    if (this.map.size >= this.maxSize) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }

    this.map.set(key, {
      value,
      createdAt: now,
      expiresAt,
    });
  }

  /**
   * Memeriksa apakah key ada dalam cache dan masih valid (belum kedaluwarsa).
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Menghapus item berdasarkan key.
   * @returns `true` jika item berhasil ditemukan dan dihapus, atau `false` jika tidak ditemukan.
   */
  delete(key: K): boolean {
    return this.map.delete(key);
  }

  /**
   * Mengosongkan seluruh isi cache.
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Mengembalikan jumlah item yang masih valid (belum kedaluwarsa) dalam cache.
   */
  size(): number {
    this.prune();
    return this.map.size;
  }

  /**
   * Membersihkan seluruh entri yang sudah melewati waktu kedaluwarsa (TTL).
   * @returns Jumlah item yang berhasil dihapus.
   */
  prune(): number {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.map.entries()) {
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        this.map.delete(key);
        removedCount++;
      }
    }

    return removedCount;
  }

  /**
   * Mengambil seluruh daftar key yang aktif dalam urutan akses (LRU ke MRU).
   */
  keys(): K[] {
    this.prune();
    return Array.from(this.map.keys());
  }
}

/**
 * Factory helper untuk membuat instance `MemoryCache` baru.
 *
 * @param options Opsi konfigurasi cache.
 * @returns Instance baru dari MemoryCache.
 */
export function createCache<K = string, V = unknown>(
  options?: CacheOptions
): MemoryCache<K, V> {
  return new MemoryCache<K, V>(options);
}
