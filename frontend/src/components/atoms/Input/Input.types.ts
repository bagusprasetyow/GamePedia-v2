import type { InputHTMLAttributes, ReactNode, MouseEvent } from 'react';
import type { DepthNumeric, DepthString, DepthNamed } from '@/components/atoms/Button/Button.types';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';

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

/**
 * Props untuk sub-komponen internal InputLabel.
 */
export interface InputLabelProps {
  /**
   * ID input yang diasosiasikan dengan atribut htmlFor.
   */
  inputId: string;

  /**
   * Konten label teks/elemen.
   */
  label: ReactNode;

  /**
   * Menampilkan indikator tanda bintang wajib (*).
   * @default false
   */
  required?: boolean;

  /**
   * ClassName tambahan untuk elemen label.
   */
  className?: string;
}

/**
 * Props untuk sub-komponen internal InputClearButton.
 */
export interface InputClearButtonProps {
  /**
   * Ukuran ikon tombol pembersih.
   */
  size: IconSize;

  /**
   * Handler saat tombol diklik.
   */
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;

  /**
   * ClassName tambahan untuk tombol pembersih.
   */
  className?: string;
}

/**
 * Props untuk sub-komponen internal InputHelperText.
 */
export interface InputHelperTextProps {
  /**
   * Pesan kesalahan validasi jika ada.
   */
  error?: ReactNode;

  /**
   * Teks deskripsi keterangan jika tidak dalam kondisi error.
   */
  description?: ReactNode;

  /**
   * ID elemen pesan error untuk a11y `aria-describedby`.
   */
  errorId: string;

  /**
   * ID elemen teks deskripsi untuk a11y `aria-describedby`.
   */
  descId: string;

  /**
   * Mode penempatan posisi ('absolute' atau 'relative').
   * @default 'absolute'
   */
  errorPosition?: 'absolute' | 'relative';
}
