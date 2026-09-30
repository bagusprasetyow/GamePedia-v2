import type { TextInputProps } from '../TextInput/TextInput.types';

export interface EmailInputCustomProps {
  /**
   * Paksa huruf kecil pada alamat email.
   * @default true
   */
  forceLowercase?: boolean;

  /**
   * Jalankan validasi format email secara otomatis saat blur (kehilangan fokus).
   * @default true
   */
  validateOnBlur?: boolean;

  /**
   * Jalankan validasi format email secara reaktif saat mengetik.
   * @default false
   */
  validateOnChange?: boolean;

  /**
   * Pesan kesalahan kustom jika format email tidak valid.
   * @default "Format alamat email tidak valid"
   */
  invalidErrorMessage?: string;
}

export type EmailInputProps = EmailInputCustomProps &
  Omit<TextInputProps, keyof EmailInputCustomProps | 'type'>;
