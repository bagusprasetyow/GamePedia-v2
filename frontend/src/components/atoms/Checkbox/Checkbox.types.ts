import type { InputHTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import type { DepthNumeric, DepthString, DepthNamed } from '../Button/Button.types';
import type { TextSize } from '@/components/atoms/Text/Text.types';

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

export interface CheckboxIndicatorProps {
  /**
   * Apakah checkbox dalam status checked.
   * @default false
   */
  isChecked?: boolean;

  /**
   * Apakah checkbox dalam status indeterminate (garis minus).
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Skala ukuran checkbox.
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * Warna semantik tema.
   * @default 'primary'
   */
  color?: CheckboxColor;

  /**
   * Varian visual indikator ('check' atau 'solid').
   * @default 'check'
   */
  variant?: CheckboxVariant;

  /**
   * Tingkat kedalaman taktil visual (-3 s/d 3).
   * @default -1
   */
  depth?: CheckboxDepth;

  /**
   * Apakah interaksi dinonaktifkan.
   * @default false
   */
  disabled?: boolean;

  /**
   * Handler tombol keyboard (Space / Enter).
   */
  onKeyDown?: (event: KeyboardEvent<HTMLSpanElement>) => void;

  /**
   * Class kustom tambahan untuk kotak indikator.
   */
  className?: string;
}

export interface CheckboxLabelProps {
  /**
   * Teks atau node label utama checkbox.
   */
  label?: ReactNode;

  /**
   * Teks atau node deskripsi tambahan di bawah label.
   */
  description?: ReactNode;

  /**
   * Skala ukuran tipografi teks label.
   * @default 'sm'
   */
  labelSize?: TextSize;

  /**
   * Skala ukuran tipografi teks deskripsi.
   * @default 'xs'
   */
  descSize?: TextSize;

  /**
   * ClassName kustom tambahan untuk wadah label.
   */
  className?: string;
}

export type CheckboxProps = CheckboxCustomProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof CheckboxCustomProps | 'type' | 'size' | 'color'>;
