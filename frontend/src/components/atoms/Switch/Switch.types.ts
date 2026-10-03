import type { InputHTMLAttributes, ReactNode, KeyboardEvent } from 'react';
import type { DepthNumeric, DepthString, DepthNamed } from '@/components/atoms/Button/Button.types';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';

export type SwitchSize = 'sm' | 'md' | 'lg' | 'xl';

export type SwitchVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info';

export type SwitchDepth = DepthNumeric | DepthString | DepthNamed;

export interface SwitchSizeConfig {
  track: string;
  thumb: string;
  translate: string;
  iconSize: IconSize;
}

export interface SwitchTrackProps {
  /**
   * Status aktif (checked) dari switch.
   */
  isChecked: boolean;

  /**
   * Apakah switch dinonaktifkan (disabled).
   * @default false
   */
  disabled?: boolean;

  /**
   * Skala ukuran preset switch.
   * @default 'md'
   */
  size?: SwitchSize;

  /**
   * Varian warna semantik saat switch aktif (ON).
   * @default 'primary'
   */
  variant?: SwitchVariant;

  /**
   * Kedalaman visual taktil (Depth System: -3 s/d 3) untuk trek switch.
   * @default -1
   */
  depth?: SwitchDepth;

  /**
   * Ikon kustom di dalam thumb ketika switch aktif (ON).
   */
  thumbCheckedIcon?: ReactNode;

  /**
   * Ikon kustom di dalam thumb ketika switch tidak aktif (OFF).
   */
  thumbUncheckedIcon?: ReactNode;

  /**
   * Event handler tombol keyboard pada elemen track sakelar.
   */
  onKeyDown?: (event: KeyboardEvent<HTMLSpanElement>) => void;

  /**
   * ClassName kustom tambahan untuk track switch.
   */
  className?: string;
}

export interface SwitchLabelProps {
  /**
   * Label teks di samping switch.
   */
  label?: ReactNode;

  /**
   * Deskripsi keterangan tambahan di bawah label.
   */
  description?: ReactNode;

  /**
   * ClassName kustom tambahan untuk kontainer pembungkus label.
   */
  className?: string;
}

export interface SwitchCustomProps {
  /**
   * Status aktif (checked) untuk mode controlled component.
   */
  checked?: boolean;

  /**
   * Status aktif bawaan saat pertama kali render (uncontrolled mode).
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Callback saat status switch berubah.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Ukuran switch preset.
   * @default 'md'
   */
  size?: SwitchSize;

  /**
   * Varian warna semantik saat switch aktif (ON).
   * @default 'primary'
   */
  variant?: SwitchVariant;

  /**
   * Tingkat kedalaman visual taktil (Depth System: -3 s/d 3) untuk trek switch.
   * Nilai negatif (-1 s/d -3) memberikan efek alur cekung/sunken yang realistis.
   * @default -1
   */
  depth?: SwitchDepth;

  /**
   * Label teks di samping switch.
   */
  label?: ReactNode;

  /**
   * Deskripsi keterangan tambahan di bawah label.
   */
  description?: ReactNode;

  /**
   * Posisi letak label terhadap komponen switch.
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Ikon di dalam thumb ketika switch aktif (ON).
   */
  thumbCheckedIcon?: ReactNode;

  /**
   * Ikon di dalam thumb ketika switch tidak aktif (OFF).
   */
  thumbUncheckedIcon?: ReactNode;

  /**
   * Apakah switch dinonaktifkan (disabled).
   * @default false
   */
  disabled?: boolean;

  /**
   * ClassName kustom tambahan untuk wadah pembungkus luar.
   */
  className?: string;
}

export type SwitchProps = SwitchCustomProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof SwitchCustomProps | 'type' | 'size'>;
