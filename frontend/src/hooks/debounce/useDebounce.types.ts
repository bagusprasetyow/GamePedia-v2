/**
 * Return interface untuk hook useDebouncedCallback.
 */
export interface UseDebouncedCallbackReturn<TArgs extends unknown[]> {
  /**
   * Menjalankan pemanggilan fungsi dengan mekanisme jeda debounce.
   */
  run: (...args: TArgs) => void;
  /**
   * Membatalkan timer debounce yang sedang aktif.
   */
  cancel: () => void;
  /**
   * Mengeksekusi antrean pemanggilan tertunda seketika jika ada.
   */
  flush: () => void;
  /**
   * Mengetahui apakah ada pemanggilan yang sedang menunggu timer debounce.
   */
  pending: () => boolean;
}
