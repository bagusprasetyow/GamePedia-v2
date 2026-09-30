import type { InputHTMLAttributes, ReactNode } from 'react';
import type { DepthNumeric, DepthString, DepthNamed } from '../Button/Button.types';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export type CheckboxColor = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info';

export type CheckboxVariant = 'check' | 'solid';

export type CheckboxDepth = DepthNumeric | DepthString | DepthNamed;

export interface CheckboxCustomProps {
  /**
   * Status checked untuk mode controlled.
   */
  checked?: boolean;

  /**
   * Status default checked untuk mode uncontrolled.
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Status indeterminate (garis minus horizontal).
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Callback ketika status checkbox berubah.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Skala ukuran checkbox.
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * Warna semantik tema saat checkbox tercentang.
   * @default 'primary'
   */
  color?: CheckboxColor;

  /**
   * Varian visual indikator centang:
   * - 'check': Tanda centang checklist (v)
   * - 'solid': Kotak isi penuh solid di dalam box
   * @default 'check'
   */
  variant?: CheckboxVariant;

  /**
   * Tingkat kedalaman taktil visual (Depth System: -3 s/d 3).
   * Nilai negatif (-1 s/d -3) memberikan efek kotak cekung/sunken.
   * @default -1
   */
  depth?: CheckboxDepth;

  /**
   * Label teks pendamping checkbox.
   */
  label?: ReactNode;

  /**
   * Deskripsi keterangan tambahan di bawah label.
   */
  description?: ReactNode;

  /**
   * Posisi letak label terhadap checkbox ('left' atau 'right').
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Apakah checkbox dinonaktifkan (disabled).
   * @default false
   */
  disabled?: boolean;

  /**
   * ClassName kustom tambahan untuk wadah pembungkus luar.
   */
  className?: string;
}

export type CheckboxProps = CheckboxCustomProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof CheckboxCustomProps | 'type' | 'size' | 'color'>;
