import type { TextInputProps } from '../TextInput/TextInput.types';

export interface FullNameInputCustomProps {
  /**
   * Otomatis memformat setiap awal kata menjadi huruf KAPITAL (Title Case).
   * Contoh: "budi santoso" -> "Budi Santoso"
   * @default true
   */
  autoTitleCase?: boolean;

  /**
   * Apakah mengizinkan angka di dalam bidang nama lengkap.
   * Jika diset `false`, karakter angka (0-9) tidak dapat diketik.
   * @default false
   */
  allowNumbers?: boolean;

  /**
   * Apakah mengizinkan karakter simbol khusus selain spasi, tanda petik tunggal ('), dan tanda hubung (-).
   * Jika diset `false`, simbol-simbol khusus otomatis difilter.
   * @default false
   */
  allowSpecialChars?: boolean;

  /**
   * Jumlah minimal kata yang wajib diisi (misal: 2 untuk Nama Depan & Nama Belakang).
   * Bila kata kurang dari batas ini, pesan error validasi akan otomatis dipicu (jika diaktifkan).
   */
  minWords?: number;

  /**
   * Pesan kesalahan khusus jika jumlah kata kurang dari `minWords`.
   * @default 'Masukkan minimal {minWords} kata nama lengkap'
   */
  minWordsErrorMessage?: string;
}

export type FullNameInputProps = FullNameInputCustomProps & Omit<TextInputProps, keyof FullNameInputCustomProps>;
