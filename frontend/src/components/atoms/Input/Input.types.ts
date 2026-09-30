import type { InputHTMLAttributes, ReactNode } from 'react';
import type { DepthNumeric, DepthString, DepthNamed } from '../Button/Button.types';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputVariant = 'outline' | 'filled' | 'ghost';

export type InputDepth = DepthNumeric | DepthString | DepthNamed;

export interface InputCustomProps {
  /**
   * Skala ukuran input.
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Varian gaya visual input:
   * - 'outline': Border tegas dengan background bersih (standar form modern)
   * - 'filled': Background terisi lembut dengan border halus
   * - 'ghost': Tanpa border saat idle, aktif saat fokus
   * @default 'outline'
   */
  variant?: InputVariant;

  /**
   * Tingkat kedalaman visual taktil (Depth System: -3 s/d 3).
   * Nilai negatif (-1 s/d -3) memberikan efek kedalaman cekung (sunken/recessed) yang ideal untuk field input formulir.
   * @default -1
   */
  depth?: InputDepth;

  /**
   * Label teks di atas bidang input.
   */
  label?: ReactNode;

  /**
   * Keterangan atau teks petunjuk di bawah input.
   */
  description?: ReactNode;

  /**
   * Pesan kesalahan validasi (error message).
   * Bila diisi, field input otomatis berganti ke status visual error/invalid.
   */
  error?: ReactNode;

  /**
   * Status sukses / validasi berhasil.
   * Bila true, field input akan menampilkan border dan ring hijau (success).
   */
  success?: boolean;

  /**
   * Posisi penempatan pesan error / helper text di bawah input.
   * - 'absolute': Pesan melayang secara absolute di bawah input tanpa mendorong elemen di bawahnya
   * - 'relative': Pesan berada dalam alur dokumen (mendorong elemen di bawahnya)
   * @default 'absolute'
   */
  errorPosition?: 'absolute' | 'relative';

  /**
   * Ikon Iconify di sisi kiri input (contoh: 'mdi:email', 'mdi:lock', 'mdi:magnify').
   */
  startIcon?: string;

  /**
   * Ikon Iconify di sisi kanan input.
   */
  endIcon?: string;

  /**
   * Elemen React kustom di sisi kiri input (prefix, badge mata uang, dropdown, dll).
   */
  startAdornment?: ReactNode;

  /**
   * Elemen React kustom di sisi kanan input (tombol aksi, suffix, visibility toggle, dll).
   */
  endAdornment?: ReactNode;

  /**
   * Menampilkan tombol pembersih cepat (clear button) ketika input berisi nilai.
   * @default false
   */
  clearable?: boolean;

  /**
   * Callback saat tombol pembersih (clear button) diklik.
   */
  onClear?: () => void;

  /**
   * Apakah input membentang selebar kontainer (100% width).
   * @default true
   */
  fullWidth?: boolean;

  /**
   * ClassName tambahan khusus untuk pembungkus terluar (outer wrapper).
   */
  wrapperClassName?: string;
}

export type InputProps = InputCustomProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputCustomProps | 'size'>;
