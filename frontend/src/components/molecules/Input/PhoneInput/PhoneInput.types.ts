import type { ReactNode } from 'react';
import type { TextInputProps } from '../TextInput/TextInput.types';

export interface PhoneInputCustomProps {
  /**
   * Otomatis memformat nomor telepon dengan tanda hubung (-) secara reaktif saat mengetik (contoh: 812-3456-7890).
   * @default true
   */
  autoFormatHyphen?: boolean;

  /**
   * Simbol pemisah / tanda hubung yang digunakan untuk pemformatan nomor telepon (contoh: "-", " ", ".").
   * @default "-"
   */
  hyphenSymbol?: string;

  /**
   * Kode negara yang ditampilkan sebagai prefix adornment (contoh: "+62", "+1", "+65").
   * Set ke `null` atau `false` untuk menyembunyikan prefix kode negara.
   * @default "+62"
   */
  countryCode?: ReactNode;

  /**
   * Mengizinkan karakter "+" di awal nomor telepon.
   * @default true
   */
  allowPlusPrefix?: boolean;

  /**
   * Mengizinkan tanda hubung (-) untuk pemisah digit.
   * @default true
   */
  allowHyphens?: boolean;

  /**
   * Jumlah digit minimal nomor telepon yang valid (mendukung nomor call center 5 digit seperti 14045).
   * @default 5
   */
  minDigits?: number;

  /**
   * Jumlah digit maksimal nomor telepon yang valid.
   * @default 14
   */
  maxDigits?: number;

  /**
   * Jalankan validasi nomor telepon otomatis saat blur (kehilangan fokus).
   * @default true
   */
  validateOnBlur?: boolean;

  /**
   * Jalankan validasi nomor telepon secara reaktif saat mengetik.
   * @default false
   */
  validateOnChange?: boolean;

  /**
   * Pesan kesalahan kustom jika nomor telepon tidak valid.
   * Jika tidak diisi, pesan kesalahan akan dibuat secara dinamis berdasarkan jenis nomor & rentang digit (${minDigits}-${maxDigits} digit).
   */
  invalidErrorMessage?: string;
}

export type PhoneInputProps = PhoneInputCustomProps &
  Omit<TextInputProps, keyof PhoneInputCustomProps>;
