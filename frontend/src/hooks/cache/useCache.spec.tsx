import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { useCache } from './useCache';
import { createCache } from '@/utils/cache';
import type { UseCacheReturn } from './useCache.types';

describe('useCache hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('harus diekspor dengan benar melalui barrel hooks/cache/index.ts', async () => {
    const barrel = await import('./index');
    expect(barrel.useCache).toBeDefined();
    expect(typeof barrel.useCache).toBe('function');
  });

  it('harus langsung mengembalikan data secara sinkron jika cache sudah memiliki nilai (cache hit)', () => {
    const customCache = createCache<string, string>();
    customCache.set('game:1', 'Elden Ring');

    let hookResult: UseCacheReturn<string> | null = null;

    const TestComponent = () => {
      const cacheState = useCache(
        'game:1',
        () => 'Data Baru yang Tak Terpanggil',
        { cache: customCache }
      );
      hookResult = cacheState;
      return null;
    };

    renderToString(<TestComponent />);

    expect(hookResult).not.toBeNull();
    const result = hookResult!;
    expect(result.data).toBe('Elden Ring');
    expect(result.isCached).toBe(true);
    expect(result.isLoading).toBe(false);
  });

  it('harus menggunakan initialData jika cache belum memiliki nilai', () => {
    let hookResult: UseCacheReturn<string> | null = null;
    const customCache = createCache<string, string>();

    const TestComponent = () => {
      const cacheState = useCache(
        'game:baru',
        () => 'Fetched',
        {
          cache: customCache,
          enabled: false,
          initialData: 'Fallback Awal',
        }
      );
      hookResult = cacheState;
      return null;
    };

    renderToString(<TestComponent />);

    expect(hookResult).not.toBeNull();
    const result = hookResult!;
    expect(result.data).toBe('Fallback Awal');
    expect(result.isCached).toBe(false);
    expect(result.isLoading).toBe(false);
  });

  it('harus dapat melakukan mutate secara langsung ke state dan cache', () => {
    const customCache = createCache<string, number>();
    let hookResult: UseCacheReturn<number> | null = null;

    const TestComponent = () => {
      const cacheState = useCache('score:1', () => 50, {
        cache: customCache,
        enabled: false,
        initialData: 10,
      });
      hookResult = cacheState;
      return null;
    };

    renderToString(<TestComponent />);
    expect(hookResult).not.toBeNull();
    const result = hookResult!;

    result.mutate(99);
    expect(customCache.get('score:1')).toBe(99);
  });

  it('harus dapat melakukan invalidate untuk menghapus item dari cache', () => {
    const customCache = createCache<string, string>();
    customCache.set('token', 'abc-123');

    let hookResult: UseCacheReturn<string> | null = null;

    const TestComponent = () => {
      const cacheState = useCache('token', () => 'baru', {
        cache: customCache,
      });
      hookResult = cacheState;
      return null;
    };

    renderToString(<TestComponent />);
    expect(hookResult).not.toBeNull();
    const result = hookResult!;

    expect(customCache.has('token')).toBe(true);
    result.invalidate();
    expect(customCache.has('token')).toBe(false);
  });

  it('harus dapat mengambil data baru dan memperbarui cache melalui refresh()', async () => {
    const customCache = createCache<string, string>();
    customCache.set('item:1', 'Versi Lama');

    let hookResult: UseCacheReturn<string> | null = null;
    let fetchCount = 0;

    const TestComponent = () => {
      hookResult = useCache(
        'item:1',
        async () => {
          fetchCount++;
          return `Versi Baru ${fetchCount}`;
        },
        { cache: customCache }
      );
      return null;
    };

    renderToString(<TestComponent />);
    expect(hookResult).not.toBeNull();
    const result = hookResult!;

    expect(result.data).toBe('Versi Lama');

    // Panggil refresh()
    const refreshedPromise = result.refresh();
    const refreshedData = await refreshedPromise;

    expect(refreshedData).toBe('Versi Baru 1');
    expect(customCache.get('item:1')).toBe('Versi Baru 1');
  });

  it('harus menangani error dan mengisi state error jika fetcher gagal saat refresh()', async () => {
    const customCache = createCache<string, string>();
    let hookResult: UseCacheReturn<string> | null = null;

    const TestComponent = () => {
      hookResult = useCache(
        'item:err',
        async () => {
          throw new Error('Jaringan terputus');
        },
        { cache: customCache, enabled: false }
      );
      return null;
    };

    renderToString(<TestComponent />);
    expect(hookResult).not.toBeNull();
    const result = hookResult!;

    await expect(result.refresh()).rejects.toThrow('Jaringan terputus');
  });

  it('harus meneruskan AbortSignal ke fungsi fetcher', async () => {
    const controller = new AbortController();
    const customCache = createCache<string, string>();
    let receivedSignal: AbortSignal | undefined;
    let hookResult: UseCacheReturn<string> | null = null;

    const TestComponent = () => {
      hookResult = useCache(
        'item:signal',
        (signal) => {
          receivedSignal = signal;
          return 'OK';
        },
        { cache: customCache, enabled: false }
      );
      return null;
    };

    renderToString(<TestComponent />);
    expect(hookResult).not.toBeNull();
    await hookResult!.refresh(controller.signal);
    expect(receivedSignal).toBeDefined();
    expect(receivedSignal?.aborted).toBe(false);
  });
});
