import type { InputHTMLAttributes, ReactNode, KeyboardEvent } from 'react';
import type { DepthNumeric, DepthString, DepthNamed } from '@/components/atoms/Button/Button.types';

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

/**
 * Props untuk sub-komponen internal RadioIndicator.
 */
export interface RadioIndicatorProps {
  /**
   * Skala ukuran lingkaran radio.
   * @default 'md'
   */
  size?: RadioSize;

  /**
   * Varian warna semantik tema.
   * @default 'primary'
   */
  color?: RadioColor;

  /**
   * Varian visual indikator ('solid' atau 'check').
   * @default 'solid'
   */
  variant?: RadioVariant;

  /**
   * Skala kedalaman Depth System (-3 s/d 3).
   * @default -1
   */
  depth?: RadioDepth;

  /**
   * Status apakah radio button sedang terpilih.
   */
  isChecked?: boolean;

  /**
   * Apakah radio button dalam status dinonaktifkan.
   * @default false
   */
  disabled?: boolean;

  /**
   * Handler event keyboard (Space / Enter) pada indikator visual.
   */
  onKeyDown?: (event: KeyboardEvent<HTMLSpanElement>) => void;

  /**
   * ClassName tambahan untuk indikator visual.
   */
  className?: string;
}

/**
 * Props untuk sub-komponen internal RadioLabel.
 */
export interface RadioLabelProps {
  /**
   * Teks atau elemen label utama.
   */
  label?: ReactNode;

  /**
   * Teks atau elemen deskripsi keterangan di bawah label.
   */
  description?: ReactNode;

  /**
   * ClassName tambahan untuk pembungkus label.
   */
  className?: string;
}
