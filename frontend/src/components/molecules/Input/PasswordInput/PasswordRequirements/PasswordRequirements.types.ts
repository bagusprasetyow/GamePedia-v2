import type { HTMLAttributes } from 'react';
import type { CheckboxSize, CheckboxVariant } from '@/components/atoms/Checkbox/Checkbox.types';

export interface PasswordRequirementsProps extends HTMLAttributes<HTMLDivElement> {
  /** Nilai kata sandi yang dievaluasi */
  value?: string;
  /** Panjang minimum kata sandi (default: 8) */
  minLength?: number;
  /** Ukuran checkbox (default: 'sm') */
  size?: CheckboxSize;
  /** Varian visual checkbox ('check' | 'solid') */
  variant?: CheckboxVariant;
  /** Custom class name */
  className?: string;
}
