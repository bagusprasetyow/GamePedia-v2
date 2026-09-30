import type { ReactNode } from 'react';
import type { InputProps } from '@/components/atoms/Input/Input.types';

export type TextTransformCase = 'none' | 'lowercase' | 'uppercase' | 'capitalize' | 'titlecase';

export interface TextInputCustomProps {
  /**
   * Transformasi kasus huruf teks secara otomatis saat pengisian.
   * - 'none': Teks apa adanya
   * - 'lowercase': Mengubah seluruh teks menjadi huruf kecil
   * - 'uppercase': Mengubah seluruh teks menjadi huruf KAPITAL
   * - 'capitalize': Mengubah huruf pertama kalimat menjadi kapital
   * - 'titlecase': Mengubah Huruf Pertama Setiap Kata Menjadi Kapital
   * @default 'none'
   */
  transformCase?: TextTransformCase;

  /**
   * Menampilkan indikator penghitung karakter di pojok kanan bawah (misal: "12/50").
   * Memerlukan prop `maxLength` atau tetap dapat digunakan sebagai penunjuk jumlah karakter.
   * @default false
   */
  showCount?: boolean;

  /**
   * Apakah mengizinkan karakter spasi.
   * Jika diset `false`, karakter spasi otomatis difilter/dihapus saat mengetik.
   * @default true
   */
  allowSpaces?: boolean;

  /**
   * Otomatis memotong spasi kosong di awal dan akhir teks saat bidang kehilangan fokus (onBlur).
   * @default false
   */
  trimOnBlur?: boolean;

  /**
   * Elemen keterangan di sisi kanan bawah (misal untuk status atau bantuan khusus).
   */
  footerRight?: ReactNode;
}

export type TextInputProps = TextInputCustomProps & Omit<InputProps, keyof TextInputCustomProps>;
