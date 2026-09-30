import type { TextInputProps } from '../TextInput/TextInput.types';

export type PasswordInputMode = 'create' | 'login' | 'membuat' | 'menggunakan' | 'use';

export interface PasswordInputCustomProps {
  /**
   * Mode / varian penggunaan kata sandi:
   * - 'create' / 'membuat': Mode pembuatan kata sandi baru (menampilkan strength meter & requirements secara default)
   * - 'login' / 'menggunakan' / 'use': Mode login / pengisian kata sandi (hanya input kata sandi & toggle eye icon)
   * @default 'login'
   */
  mode?: PasswordInputMode;

  /**
   * Menampilkan tombol sakelar visibilitas kata sandi (mata terbuka / tertutup).
   * @default true
   */
  showTogglePassword?: boolean;

  /**
   * Menampilkan indikator meteran kekuatan kata sandi (password strength meter).
   * @default false
   */
  showStrengthMeter?: boolean;

  /**
   * Menampilkan daftar centang persyaratan kata sandi (min 8 karakter, huruf besar, angka, simbol).
   * @default false
   */
  showRequirements?: boolean;

  /**
   * Batas minimal karakter kata sandi.
   * @default 8
   */
  minLength?: number;
}

export type PasswordInputProps = PasswordInputCustomProps &
  Omit<TextInputProps, keyof PasswordInputCustomProps | 'type'>;
