import type { HTMLAttributes, ReactNode } from 'react';
import type { InputSize, InputVariant, InputDepth } from '@/components/atoms/Input/Input.types';

export type CodeInputType = 'numeric' | 'alphanumeric';
export type CodeInputJustify = 'between' | 'center' | 'start' | 'end' | 'around';
export type CodeInputAlign = 'left' | 'center' | 'right';
export type CodeInputMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'full' | 'none' | string;

export interface CodeInputCustomProps {
  /**
   * Jumlah digit/kotak kode (default: 6).
   */
  length?: number;

  /**
   * Nilai kode terformat (controlled mode).
   */
  value?: string;

  /**
   * Nilai kode default awal (uncontrolled mode).
   */
  defaultValue?: string;

  /**
   * Callback saat isi kode berubah.
   */
  onChange?: (value: string) => void;

  /**
   * Callback otomatis saat semua digit kode telah diisi penuh.
   */
  onComplete?: (value: string) => void;

  /**
   * Tipe masukan karakter yang diizinkan ('numeric' | 'alphanumeric').
   * @default 'numeric'
   */
  type?: CodeInputType;

  /**
   * Menyembunyikan karakter kode menggunakan mode password / bulatan mask.
   * @default false
   */
  mask?: boolean;

  /**
   * Penjajaran tata letak antar kotak kode ('between' | 'center' | 'start' | 'end' | 'around').
   * @default 'between'
   */
  justify?: CodeInputJustify;

  /**
   * Perataan teks label dan deskripsi ('left' | 'center' | 'right').
   * @default 'left'
   */
  align?: CodeInputAlign;

  /**
   * Batas lebar maksimum wadah baris kotak kode ('xs', 'sm', 'md', 'lg', 'full', 'none', atau custom).
   * @default 'xs'
   */
  maxWidth?: CodeInputMaxWidth;

  /**
   * Ukuran kotak input ('sm', 'md', atau 'lg').
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Varian visual kotak input ('outline', 'filled', atau 'ghost').
   * @default 'outline'
   */
  variant?: InputVariant;

  /**
   * Tingkat kedalaman visual taktil (Depth System: -3 s/d 3).
   * @default -1
   */
  depth?: InputDepth;

  /**
   * Label judul bidang input kode.
   */
  label?: ReactNode;

  /**
   * Deskripsi atau pesan bantuan di bawah bidang input kode.
   */
  description?: ReactNode;

  /**
   * Pesan kesalahan validasi (error message / status).
   */
  error?: ReactNode;

  /**
   * Status sukses validasi.
   * @default false
   */
  success?: boolean;

  /**
   * Menonaktifkan seluruh kotak input kode.
   * @default false
   */
  disabled?: boolean;

  /**
   * Mode hanya-baca.
   * @default false
   */
  readOnly?: boolean;

  /**
   * Otomatis fokus ke kotak pertama saat komponen di-mount.
   * @default false
   */
  autoFocus?: boolean;

  /**
   * ClassName kustom tambahan untuk pembungkus terluar.
   */
  className?: string;

  /**
   * Karakter / elemen pemisah antar kelompok digit (misal: '-').
   */
  separator?: ReactNode;

  /**
   * Posisi indeks kotak tempat pemisah disisipkan (default: di tengah / length / 2).
   */
  separatorPosition?: number;

  /**
   * Mengubah semua masukan huruf menjadi huruf kapital / besar (uppercase).
   * @default false
   */
  uppercase?: boolean;

  /**
   * Elemen pendukung kustom opsional di bagian bawah wadah (misal: tombol resend OTP).
   */
  children?: ReactNode;
}

export type CodeInputProps = CodeInputCustomProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof CodeInputCustomProps>;
