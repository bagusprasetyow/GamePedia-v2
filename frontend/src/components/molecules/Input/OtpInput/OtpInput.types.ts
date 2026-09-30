import type { ReactNode } from 'react';
import type { CodeInputProps, CodeInputType, CodeInputJustify, CodeInputAlign, CodeInputMaxWidth } from '../CodeInput/CodeInput.types';

export type OtpInputType = CodeInputType;
export type OtpInputJustify = CodeInputJustify;
export type OtpInputAlign = CodeInputAlign;
export type OtpInputMaxWidth = CodeInputMaxWidth;

export interface OtpInputCustomProps {
  /**
   * Durasi detik hitung mundur tombol resend OTP. Bila > 0, tombol resend dinonaktifkan sampai waktu habis.
   */
  resendTimer?: number;

  /**
   * Callback saat tombol "Kirim Ulang OTP" diklik.
   */
  onResend?: () => void;

  /**
   * Teks label tombol kirim ulang kode OTP.
   * @default 'Kirim Ulang'
   */
  resendLabel?: ReactNode;

  /**
   * Status pemrosesan pengiriman ulang OTP.
   * @default false
   */
  isResending?: boolean;

  /**
   * Menampilkan seksi info / tombol kirim ulang OTP di bagian bawah.
   * @default false
   */
  showResend?: boolean;
}

export type OtpInputProps = CodeInputProps & OtpInputCustomProps;
