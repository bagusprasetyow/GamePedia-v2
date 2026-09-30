import type { InputHTMLAttributes, ReactNode } from 'react';
import type { DepthNumeric, DepthString, DepthNamed } from '../Button/Button.types';

export type RadioSize = 'sm' | 'md' | 'lg';

export type RadioColor = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info';

export type RadioVariant = 'solid' | 'check';

export type RadioDepth = DepthNumeric | DepthString | DepthNamed;

export interface RadioCustomProps {
  /**
   * Status terpilih (checked) untuk mode controlled.
   */
  checked?: boolean;

  /**
   * Status default terpilih untuk mode uncontrolled.
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Callback saat status radio button berubah.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Nilai value dari radio button.
   */
  value?: string | number | readonly string[];

  /**
   * Skala ukuran radio button.
   * @default 'md'
   */
  size?: RadioSize;

  /**
   * Warna semantik tema saat radio button aktif.
   * @default 'primary'
   */
  color?: RadioColor;

  /**
   * Varian visual indikator saat terpilih:
   * - 'solid': Titik bulat solid dot di tengah (standar klasik radio)
   * - 'check': Tanda centang checklist (v) di dalam lingkaran
   * @default 'solid'
   */
  variant?: RadioVariant;

  /**
   * Tingkat kedalaman taktil visual (Depth System: -3 s/d 3).
   * @default -1
   */
  depth?: RadioDepth;

  /**
   * Label teks pendamping radio button.
   */
  label?: ReactNode;

  /**
   * Deskripsi keterangan tambahan di bawah label.
   */
  description?: ReactNode;

  /**
   * Posisi letak label terhadap radio button ('left' atau 'right').
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Apakah radio button dinonaktifkan (disabled).
   * @default false
   */
  disabled?: boolean;

  /**
   * ClassName kustom tambahan untuk wadah pembungkus luar.
   */
  className?: string;
}

export type RadioProps = RadioCustomProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof RadioCustomProps | 'type' | 'size' | 'color'>;
