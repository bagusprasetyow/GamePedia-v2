import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MemoryCache } from '@/utils/cache';
import type { ICache } from '@/utils/cache';
import type { UseCacheOptions, UseCacheReturn, CacheFetcher } from './useCache.types';

// Shared In-Memory Cache default
const globalSharedCache = new MemoryCache<string, unknown>({
  maxSize: 200,
  defaultTtl: 300000, // 5 menit
});

/**
 * React Hook untuk mengelola caching data secara reaktif dan efisien.
 * Menggabungkan strategi in-memory cache dengan siklus hidup komponen React.
 *
 * Fitur:
 * - Mengembalikan data cache secara instan (zero layout-shift / no flash).
 * - Pemanggilan otomatis saat key berubah atau saat cache kosong.
 * - Pembatalan request network otomatis via AbortSignal saat unmount atau key berubah.
 * - Kontrol manual: `refresh()` (re-fetch), `invalidate()` (hapus cache), `mutate()` (update optimistik).
 *
 * @template T Tipe data yang di-cache.
 * @param key Kunci unik cache. Jika bernilai `null` atau `undefined`, query dinonaktifkan.
 * @param fetcher Fungsi untuk mengambil data (menerima AbortSignal opsional, bisa sync atau async Promise).
 * @param options Opsi konfigurasi tambahan (ttl, cache instance, enabled, initialData).
 * @returns Objek state reaktif `{ data, isLoading, error, isCached, refresh, invalidate, mutate }`.
 *
 * @example
 * ```tsx
 * const { data, isLoading, refresh } = useCache(
 *   'game:101',
 *   (signal) => api.fetchGameDetails(101, { signal }),
 *   { ttl: 60000 }
 * );
 * ```
 */
export function useCache<T>(
  key: string | null | undefined,
  fetcher: CacheFetcher<T>,
  options: UseCacheOptions<T> = {}
): UseCacheReturn<T> {
  const { ttl, cache, enabled = true, initialData } = options;
  const targetCache = (cache ?? globalSharedCache) as ICache<string, T>;

  // Ambil nilai awal secara sinkron dari cache jika sudah tersedia
  const [data, setData] = useState<T | undefined>(() => {
    if (key && targetCache.has(key)) {
      return targetCache.get(key);
    }
    return initialData;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (!key || !enabled) return false;
    return !targetCache.has(key);
  });

  const [error, setError] = useState<Error | null>(null);
  const [isCached, setIsCached] = useState<boolean>(() => {
    return Boolean(key && targetCache.has(key));
  });

  // Melacak key sebelumnya untuk sinkronisasi render langsung saat key berubah (mengeliminasi stale frame)
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    if (key && targetCache.has(key)) {
      setData(targetCache.get(key));
      setIsCached(true);
      setIsLoading(false);
      setError(null);
    } else {
      setData(initialData);
      setIsCached(false);
      setIsLoading(Boolean(key && enabled));
      setError(null);
    }
  }

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const targetCacheRef = useRef(targetCache);
  useEffect(() => {
    targetCacheRef.current = targetCache;
  }, [targetCache]);

  const refresh = useCallback(
    async (signal?: AbortSignal): Promise<T | undefined> => {
      if (!key) return undefined;

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetcherRef.current(signal);
        if (signal?.aborted) return undefined;

        targetCacheRef.current.set(key, result, ttl);
        setData(result);
        setIsCached(true);
        setIsLoading(false);
        return result;
      } catch (err) {
        if (signal?.aborted) return undefined;

        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setIsLoading(false);
        throw errorObj;
      }
    },
    [key, ttl]
  );

  const invalidate = useCallback(() => {
    if (key) {
      targetCacheRef.current.delete(key);
      setIsCached(false);
    }
  }, [key]);

  const mutate = useCallback(
    (newData: T) => {
      setData(newData);
      if (key) {
        targetCacheRef.current.set(key, newData, ttl);
        setIsCached(true);
      }
    },
    [key, ttl]
  );

  // Pengambilan data otomatis saat key atau status enabled berubah
  useEffect(() => {
    if (!key || !enabled) return;

    // Jika data sudah tersedia di cache, sinkronisasi sudah ditangani saat render
    if (targetCacheRef.current.has(key)) {
      return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;

    setIsLoading(true);
    setError(null);

    Promise.resolve()
      .then(() => fetcherRef.current(signal))
      .then((result) => {
        if (signal.aborted) return;
        targetCacheRef.current.set(key, result, ttl);
        setData(result);
        setIsCached(true);
        setIsLoading(false);
      })
      .catch((err) => {
        if (signal.aborted) return;
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setIsLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [key, enabled, ttl]);

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      isCached,
      refresh,
      invalidate,
      mutate,
    }),
    [data, isLoading, error, isCached, refresh, invalidate, mutate]
  );
}
