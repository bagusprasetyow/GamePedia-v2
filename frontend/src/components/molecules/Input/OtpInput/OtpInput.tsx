import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Button, Text, Icon } from '@/components/atoms';
import { CodeInput } from '../CodeInput';
import type { OtpInputProps } from './OtpInput.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

/**
 * OtpInput Component - Molecule UI Element
 * 
 * Komponen masukan kode verifikasi / OTP (One-Time Password) berbasis `CodeInput`.
 * Karakter secara default ditampilkan jelas (`mask=false`). Mendukung fitur kirim ulang kode OTP
 * (resend timer & callback) dengan gaya visual taktil (Depth System).
 * 
 * @param {number} [props.length=6] - Jumlah digit OTP (default 6)
 * @param {boolean} [props.mask=false] - Menyembunyikan digit kode (default false)
 * @param {number} [props.resendTimer=0] - Waktu hitung mundur kirim ulang dalam detik
 * @param {() => void} [props.onResend] - Callback aksi kirim ulang OTP
 * @param {boolean} [props.showResend=false] - Menampilkan tombol kirim ulang OTP di bawah
 */
export const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(({
  type = 'alphanumeric',
  mask = false,
  length = 8,
  separator = '-',
  uppercase = true,
  resendTimer = 0,
  onResend,
  resendLabel = 'Kirim Ulang',
  isResending = false,
  showResend = false,
  align = 'left',
  disabled = false,
  ...restProps
}, ref) => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations & State Helpers
  // ─────────────────────────────────────────────────────────────
  const isResendDisabled = disabled || isResending || resendTimer > 0;

  const resendContainerClasses = cn(
    'flex items-center gap-1.5 mt-2',
    align === 'center' && 'justify-center w-full',
    align === 'right' && 'justify-end w-full'
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output (Atomic Component Compliant)
  // ─────────────────────────────────────────────────────────────
  return (
    <CodeInput
      ref={ref}
      type={type}
      mask={mask}
      length={length}
      separator={separator}
      uppercase={uppercase}
      align={align}
      disabled={disabled}
      {...restProps}
    >
      {showResend && (
        <div className={resendContainerClasses}>
          <Text as="span" size="xs" variant="muted">
            Tidak menerima kode?
          </Text>
          <Button
            variant="ghost"
            size="sm"
            depth={0}
            disabled={isResendDisabled}
            onClick={onResend}
            className="h-auto px-1 py-0.5 text-xs text-primary font-semibold hover:underline"
          >
            {isResending ? (
              <Icon icon="mdi:loading" size="2xs" className="animate-spin mr-1" />
            ) : null}
            {resendLabel}
            {resendTimer > 0 ? ` (${resendTimer}s)` : ''}
          </Button>
        </div>
      )}
    </CodeInput>
  );
});

OtpInput.displayName = 'OtpInput';

export default OtpInput;
