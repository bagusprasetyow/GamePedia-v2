import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { MemoryCache, createCache } from './MemoryCache';

describe('MemoryCache utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('harus mengekspor MemoryCache dan createCache dari barrel index', async () => {
    const barrel = await import('./index');
    expect(barrel.MemoryCache).toBeDefined();
    expect(barrel.createCache).toBeDefined();
  });

  it('harus dapat menyimpan dan mengambil nilai dengan benar', () => {
    const cache = new MemoryCache<string, number>();
    cache.set('skor', 100);

    expect(cache.get('skor')).toBe(100);
    expect(cache.has('skor')).toBe(true);
    expect(cache.size()).toBe(1);
  });

  it('harus mengembalikan undefined jika key tidak ditemukan', () => {
    const cache = new MemoryCache<string, string>();
    expect(cache.get('tidak-ada')).toBeUndefined();
    expect(cache.has('tidak-ada')).toBe(false);
  });

  it('harus dapat menghapus item dengan delete()', () => {
    const cache = new MemoryCache<string, string>();
    cache.set('a', 'alpha');

    expect(cache.delete('a')).toBe(true);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.delete('a')).toBe(false);
    expect(cache.size()).toBe(0);
  });

  it('harus dapat mengosongkan seluruh isi cache dengan clear()', () => {
    const cache = new MemoryCache<string, string>();
    cache.set('k1', 'v1');
    cache.set('k2', 'v2');

    expect(cache.size()).toBe(2);
    cache.clear();
    expect(cache.size()).toBe(0);
    expect(cache.get('k1')).toBeUndefined();
  });

  it('harus menerapkan strategi penggusuran LRU saat melebihi maxSize', () => {
    // Cache dengan kapasitas 3
    const cache = new MemoryCache<string, string>({ maxSize: 3 });

    cache.set('a', '1');
    cache.set('b', '2');
    cache.set('c', '3');

    // Mengakses 'a' agar posisinya diperbarui menjadi yang paling baru digunakan (MRU)
    expect(cache.get('a')).toBe('1');

    // Menambahkan 'd', sehingga 'b' yang paling jarang digunakan (LRU) harus dikeluarkan
    cache.set('d', '4');

    expect(cache.get('b')).toBeUndefined(); // 'b' telah di-evict
    expect(cache.get('a')).toBe('1');
    expect(cache.get('c')).toBe('3');
    expect(cache.get('d')).toBe('4');
    expect(cache.size()).toBe(3);
  });

  it('harus mendukung batas waktu kedaluwarsa (TTL)', () => {
    const cache = new MemoryCache<string, string>({ defaultTtl: 1000 });

    cache.set('item1', 'cepat expired');
    cache.set('item2', 'lama expired', 5000);

    expect(cache.get('item1')).toBe('cepat expired');
    expect(cache.get('item2')).toBe('lama expired');

    // Maju 1500ms
    vi.advanceTimersByTime(1500);

    // item1 sudah kedaluwarsa
    expect(cache.get('item1')).toBeUndefined();
    expect(cache.has('item1')).toBe(false);

    // item2 masih aktif
    expect(cache.get('item2')).toBe('lama expired');
    expect(cache.has('item2')).toBe(true);

    // Maju 4000ms lagi
    vi.advanceTimersByTime(4000);
    expect(cache.get('item2')).toBeUndefined();
  });

  it('harus dapat membersihkan item kedaluwarsa secara manual menggunakan prune()', () => {
    const cache = new MemoryCache<string, string>({ defaultTtl: 500 });
    cache.set('k1', 'v1');
    cache.set('k2', 'v2');
    cache.set('k3', 'v3', 2000);

    vi.advanceTimersByTime(600);

    const prunedCount = cache.prune();
    expect(prunedCount).toBe(2);
    expect(cache.size()).toBe(1);
    expect(cache.get('k3')).toBe('v3');
  });

  it('harus mengembalikan daftar key yang valid melalui keys()', () => {
    const cache = new MemoryCache<string, string>();
    cache.set('k1', 'v1');
    cache.set('k2', 'v2');

    expect(cache.keys()).toEqual(['k1', 'k2']);
  });

  it('harus dapat dibuat menggunakan helper createCache', () => {
    const cache = createCache<string, number>({ maxSize: 10 });
    cache.set('hitung', 42);

    expect(cache.get('hitung')).toBe(42);
    expect(cache instanceof MemoryCache).toBe(true);
  });
});
