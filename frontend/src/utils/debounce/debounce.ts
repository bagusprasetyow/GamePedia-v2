import type { DebounceOptions, DebouncedFunction } from './debounce.types';

/**
 * Membuat fungsi debounced yang menunda pemanggilan fungsi target hingga jeda waktu
 * `wait` milidetik telah berlalu sejak pemanggilan terakhir.
 *
 * Dilengkapi dengan metode kontrol:
 * - `.cancel()`: Membatalkan timer yang sedang aktif.
 * - `.flush()`: Mengeksekusi fungsi segera jika ada pemanggilan yang tertunda.
 * - `.pending()`: Mengecek apakah terdapat eksekusi yang sedang menunggu timer.
 *
 * @template TArgs Tipe parameter fungsi target.
 * @param fn Fungsi target yang akan didebounce.
 * @param wait Waktu jeda penundaan dalam milidetik (default: 0).
 * @param options Opsi perilaku tambahan (`leading`, `trailing`, `maxWait`).
 * @returns Fungsi debounced dengan metode kontrol (`.cancel`, `.flush`, `.pending`).
 *
 * @example
 * ```ts
 * const handleSearch = debounce((query: string) => {
 *   console.log('Mencari:', query);
 * }, 300);
 *
 * handleSearch('game');
 * handleSearch('gamepedia'); // Hanya 'gamepedia' yang dieksekusi setelah jeda 300ms
 * handleSearch.cancel(); // Batalkan eksekusi jika tidak lagi dibutuhkan
 * ```
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait = 0,
  options: DebounceOptions = {}
): DebouncedFunction<TArgs> {
  const { leading = false, trailing = true, maxWait } = options;
  const delay = Math.max(0, wait);

  let timerId: ReturnType<typeof setTimeout> | null = null;
  let maxTimerId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: TArgs | null = null;

  const invokeFn = () => {
    if (lastArgs !== null) {
      const argsToInvoke = lastArgs;
      lastArgs = null;
      if (maxTimerId) {
        clearTimeout(maxTimerId);
        maxTimerId = null;
      }
      fn(...argsToInvoke);
    }
  };

  const cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    if (maxTimerId) {
      clearTimeout(maxTimerId);
      maxTimerId = null;
    }
    lastArgs = null;
  };

  const flush = () => {
    if (timerId || maxTimerId) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      invokeFn();
    }
  };

  const pending = (): boolean => {
    return timerId !== null || maxTimerId !== null;
  };

  const debounced = (...args: TArgs): void => {
    lastArgs = args;

    const isLeadingInvoked = leading && !timerId;

    if (timerId) {
      clearTimeout(timerId);
    }

    if (isLeadingInvoked) {
      const argsToInvoke = lastArgs;
      lastArgs = null;
      fn(...argsToInvoke);
    }

    if (trailing || (leading && !isLeadingInvoked)) {
      timerId = setTimeout(() => {
        timerId = null;
        if (trailing && lastArgs !== null) {
          invokeFn();
        } else {
          lastArgs = null;
          if (maxTimerId) {
            clearTimeout(maxTimerId);
            maxTimerId = null;
          }
        }
      }, delay);
    } else {
      timerId = setTimeout(() => {
        timerId = null;
      }, delay);
    }

    if (maxWait !== undefined && maxWait >= 0 && !maxTimerId && !isLeadingInvoked) {
      maxTimerId = setTimeout(() => {
        maxTimerId = null;
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        if (trailing && lastArgs !== null) {
          invokeFn();
        }
      }, maxWait);
    }
  };

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}
