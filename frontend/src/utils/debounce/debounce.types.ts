/**
 * Opsi konfigurasi untuk fungsi debounce.
 */
export interface DebounceOptions {
  /**
   * Jika true, fungsi akan dieksekusi segera pada panggilan pertama sebelum timer berjalan.
   * @default false
   */
  leading?: boolean;

  /**
   * Jika true, fungsi akan dieksekusi di akhir masa tunggu jeda timer.
   * @default true
   */
  trailing?: boolean;

  /**
   * Batas waktu maksimum (dalam milidetik) sebelum eksekusi fungsi dipaksa berjalan.
   */
  maxWait?: number;
}

/**
 * Interface fungsi yang telah didebounce, dilengkapi kontrol manual (.cancel, .flush, .pending).
 */
export interface DebouncedFunction<TArgs extends unknown[]> {
  /**
   * Memanggil fungsi target dengan mekanisme jeda debounce.
   */
  (...args: TArgs): void;

  /**
   * Membatalkan timer debounce yang sedang aktif dan membersihkan antrean argumen.
   */
  cancel: () => void;

  /**
   * Mengeksekusi antrean pemanggilan fungsi tertunda secara langsung jika ada.
   */
  flush: () => void;

  /**
   * Mengetahui apakah ada pemanggilan fungsi yang sedang menunggu timer debounce.
   */
  pending: () => boolean;
}
