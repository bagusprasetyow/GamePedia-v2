import type { TextInputProps } from '../TextInput/TextInput.types';

export type UsernameAvailability = 'idle' | 'checking' | 'available' | 'taken';

export interface UsernameInputCustomProps {
  /**
   * Status ketersediaan username (opsional untuk integrasi API pengecekan username):
   * - 'idle': Tidak ada indikator khusus
   * - 'checking': Menampilkan indikator memuat/mengecek (spinner)
   * - 'available': Menampilkan indikator centang hijau (username dapat digunakan)
   * - 'taken': Menampilkan indikator silang merah (username sudah terpakai)
   * @default 'idle'
   */
  availability?: UsernameAvailability;

  /**
   * Pesan kustom saat username terbukti sudah terpakai (`availability='taken'`).
   * @default 'Username ini sudah digunakan'
   */
  takenErrorMessage?: string;

  /**
   * Simbol prefix di awal bidang input.
   * @default '@'
   */
  prefixSymbol?: string;

  /**
   * Tampilkan simbol prefix '@' di awal input.
   * @default true
   */
  showPrefix?: boolean;

  /**
   * Otomatis memunculkan indikator status ketersediaan di sisi kanan input.
   * @default true
   */
  showAvailabilityIndicator?: boolean;

  /**
   * Otomatis mengonversi seluruh huruf menjadi kecil (lowercase).
   * @default true
   */
  forceLowercase?: boolean;

  /**
   * Apakah mengizinkan karakter tanda titik (.).
   * @default true
   */
  allowDot?: boolean;

  /**
   * Apakah mengizinkan karakter garis bawah (_).
   * @default true
   */
  allowUnderscore?: boolean;

  /**
   * Apakah mengizinkan karakter tanda hubung (-).
   * @default true
   */
  allowHyphen?: boolean;
}

export type UsernameInputProps = UsernameInputCustomProps & Omit<TextInputProps, keyof UsernameInputCustomProps>;
