import type { HTMLAttributes, ReactNode } from 'react';
import type {
  DepthNumeric,
  DepthString,
  DepthNamed,
} from '@/components/atoms/Button/Button.types';

export type ProgressBarSize = 'sm' | 'md' | 'lg';

export type ProgressBarColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type ProgressBarDepth = DepthNumeric | DepthString | DepthNamed;

export interface ProgressBarCustomProps {
  /**
   * Nilai progres saat ini.
   * Akan dibatasi otomatis (clamped) antara 0 dan nilai `max`.
   * @default 0
   */
  value?: number;

  /**
   * Nilai maksimum kapasitas progres.
   * Harus berupa angka positif lebih dari 0.
   * @default 100
   */
  max?: number;

  /**
   * Mode progres tak tentu (indeterminate) ketika durasi/estimasi tidak diketahui.
   * Menampilkan animasi alur kontinu dan menghapus `aria-valuenow`.
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Skala ukuran tinggi track dan tipografi pendukung.
   * - 'sm': track h-1.5
   * - 'md': track h-2.5
   * - 'lg': track h-3.5
   * @default 'md'
   */
  size?: ProgressBarSize;

  /**
   * Varian warna semantik tema GamePedia.
   * @default 'primary'
   */
  color?: ProgressBarColor;

  /**
   * Tingkat kedalaman taktil track progres (Depth System: -3 s/d 3).
   * Nilai bawaan track adalah cekung alur (-1).
   * @default -1
   */
  depth?: ProgressBarDepth;

  /**
   * Konten label judul di atas bilah progres.
   */
  label?: ReactNode;

  /**
   * Menampilkan teks nilai progres secara visual (persentase atau via formatValue).
   * Pada mode indeterminate, nilai angka disembunyikan untuk menjaga kejujuran UX.
   * @default false
   */
  showValue?: boolean;

  /**
   * Fungsi kustom untuk memformat tampilan teks nilai progres.
   * Menerima nilai aktual `value` dan batas `max`.
   */
  formatValue?: (value: number, max: number) => ReactNode;

  /**
   * Keterangan deskripsi tambahan atau petunjuk pembantu di bawah bilah progres.
   */
  description?: ReactNode;

  /**
   * Status nonaktif visual. Memberikan efek opacity redup dan cursor nonaktif.
   * @default false
   */
  disabled?: boolean;

  /**
   * Menyesuaikan bilah progres selebar wadah kontainer (100% width).
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Lebar spesifik kustom ('auto', 'full', atau nilai CSS seperti '300px').
   */
  width?: 'auto' | 'full' | string;

  /**
   * Class name kustom tambahan untuk pembungkus terluar (outer wrapper).
   */
  wrapperClassName?: string;

  /**
   * Class name kustom tambahan untuk elemen track bilah progres.
   */
  className?: string;
}

export type ProgressBarProps = ProgressBarCustomProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof ProgressBarCustomProps>;

export interface ProgressBarTrackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Skala ukuran untuk dimensi track.
   */
  size: ProgressBarSize;

  /**
   * Kedalaman taktil visual track.
   */
  depth?: ProgressBarDepth;

  /**
   * Status disabled visual.
   */
  disabled?: boolean;

  /**
   * Class name kustom untuk elemen track.
   */
  className?: string;

  /**
   * Anak elemen track (komponen Fill).
   */
  children?: ReactNode;
}

export interface ProgressBarFillProps {
  /**
   * Persentase pengisian bar (0 s/d 100).
   */
  percentage: number;

  /**
   * Varian warna semantik pengisi.
   */
  color: ProgressBarColor;

  /**
   * Mode indeterminate yang mengaktifkan animasi alur kontinu.
   */
  indeterminate?: boolean;

  /**
   * Status disabled visual.
   */
  disabled?: boolean;

  /**
   * Class name kustom untuk fill bar.
   */
  className?: string;
}

export interface ProgressBarLabelProps {
  /**
   * ID untuk elemen label guna relasi `aria-labelledby`.
   */
  id?: string;

  /**
   * Konten label deskriptif.
   */
  label?: ReactNode;

  /**
   * Flag penampil teks nilai.
   */
  showValue?: boolean;

  /**
   * Konten teks nilai yang telah diformat.
   */
  formattedValue?: ReactNode;

  /**
   * Skala ukuran untuk tipografi label & nilai.
   */
  size: ProgressBarSize;

  /**
   * Class name kustom untuk kontainer label.
   */
  className?: string;
}
