import { useEffect, useRef, useCallback, useMemo } from 'react';
import type { DebounceOptions } from '@/utils/debounce';
import type { UseDebouncedCallbackReturn } from './useDebounce.types';

/**
 * React Hook untuk membuat fungsi callback yang didebounce dan stabil.
 * Callback selalu mereferensikan closure terbaru tanpa memicu pembuatan ulang debounce timer.
 * Dilengkapi dengan pembersihan otomatis (.cancel) saat komponen unmount untuk mencegah memory leak.
 *
 * @template TArgs Tipe parameter callback.
 * @param callback Fungsi target yang akan dieksekusi setelah jeda debounce.
 * @param delay Waktu jeda penundaan dalam milidetik (default: 300ms).
 * @param options Opsi perilaku tambahan (`leading`, `trailing`, `maxWait`).
 * @returns Objek handler debounced stabil yang berisi method `run`, `cancel`, `flush`, dan `pending`.
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   api.search(query);
 * }, 300);
 *
 * <input onChange={(e) => debouncedSearch.run(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 300,
  options: DebounceOptions = {}
): UseDebouncedCallbackReturn<TArgs> {
  const { leading = false, trailing = true, maxWait } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const argsRef = useRef<TArgs | null>(null);

  // Perbarui referensi callback pada effect agar closure selalu terbaru
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    argsRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current || maxTimeoutRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
        maxTimeoutRef.current = null;
      }
      if (argsRef.current) {
        const currentArgs = argsRef.current;
        argsRef.current = null;
        callbackRef.current(...currentArgs);
      }
    }
  }, []);

  const pending = useCallback((): boolean => {
    return timeoutRef.current !== null || maxTimeoutRef.current !== null;
  }, []);

  const run = useCallback(
    (...args: TArgs) => {
      argsRef.current = args;
      const isLeading = leading && !timeoutRef.current;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (isLeading) {
        argsRef.current = null;
        callbackRef.current(...args);
      }

      if (trailing || (leading && !isLeading)) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          if (trailing && argsRef.current) {
            const currentArgs = argsRef.current;
            argsRef.current = null;
            if (maxTimeoutRef.current) {
              clearTimeout(maxTimeoutRef.current);
              maxTimeoutRef.current = null;
            }
            callbackRef.current(...currentArgs);
          } else {
            argsRef.current = null;
            if (maxTimeoutRef.current) {
              clearTimeout(maxTimeoutRef.current);
              maxTimeoutRef.current = null;
            }
          }
        }, Math.max(0, delay));
      } else {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
        }, Math.max(0, delay));
      }

      if (maxWait !== undefined && maxWait >= 0 && !maxTimeoutRef.current && !isLeading) {
        maxTimeoutRef.current = setTimeout(() => {
          maxTimeoutRef.current = null;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (trailing && argsRef.current) {
            const currentArgs = argsRef.current;
            argsRef.current = null;
            callbackRef.current(...currentArgs);
          }
        }, maxWait);
      }
    },
    [delay, leading, trailing, maxWait]
  );

  // Bersihkan timer pending saat komponen unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return useMemo(
    () => ({
      run,
      cancel,
      flush,
      pending,
    }),
    [run, cancel, flush, pending]
  );
}
