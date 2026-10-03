import type { TextareaHTMLAttributes, ReactNode } from 'react';
import type { InputSize, InputVariant, InputDepth } from '@/components/atoms/Input/Input.types';

export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaLabelProps {
  /**
   * ID textarea terkait untuk atribut htmlFor.
   */
  textareaId: string;

  /**
   * Label judul bidang teks di atas textarea.
   */
  label?: ReactNode;

  /**
   * Menampilkan tanda bintang merah (*) tanda wajib diisi.
   * @default false
   */
  required?: boolean;

  /**
   * ClassName kustom tambahan untuk wadah label.
   */
  className?: string;
}

export interface TextareaFooterProps {
  /**
   * Pesan kesalahan validasi (error message / status).
   */
  error?: ReactNode;

  /**
   * Deskripsi atau petunjuk tambahan di bawah textarea.
   */
  description?: ReactNode;

  /**
   * ID elemen pesan error untuk relasi aksesibilitas aria-describedby.
   */
  errorId?: string;

  /**
   * ID elemen deskripsi untuk relasi aksesibilitas aria-describedby.
   */
  descId?: string;

  /**
   * Jumlah karakter saat ini.
   */
  charCount: number;

  /**
   * Batas maksimal karakter.
   */
  maxLength?: number;

  /**
   * Menampilkan penghitung karakter.
   */
  displayCharacterCount: boolean;

  /**
   * ClassName kustom tambahan untuk wadah footer.
   */
  className?: string;
}

export interface TextareaCustomProps {
  /**
   * Skala ukuran textarea ('sm' | 'md' | 'lg').
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Varian visual textarea ('outline' | 'filled' | 'ghost').
   * @default 'outline'
   */
  variant?: InputVariant;

  /**
   * Tingkat kedalaman visual taktil (Depth System: -3 s/d 3).
   * Nilai negatif (-1 s/d -3) memberikan efek kedalaman cekung (sunken/recessed).
   * @default -1
   */
  depth?: InputDepth;

  /**
   * Label judul bidang teks di atas textarea.
   */
  label?: ReactNode;

  /**
   * Deskripsi atau petunjuk tambahan di bawah textarea.
   */
  description?: ReactNode;

  /**
   * Pesan kesalahan validasi (error message / status).
   */
  error?: ReactNode;

  /**
   * Status sukses validasi (border & ring hijau).
   * @default false
   */
  success?: boolean;

  /**
   * Pengaturan perataan tinggi otomatis (auto-resize height) saat teks bertambah.
   * @default false
   */
  autoResize?: boolean;

  /**
   * Menampilkan jumlah karakter aktual & batas maksimal karakter di sudut kanan bawah.
   * @default false
   */
  showCharacterCount?: boolean;

  /**
   * Alias untuk showCharacterCount (kompatibel dengan TextInput).
   * @default false
   */
  showCount?: boolean;

  /**
   * Kontrol pengubahan ukuran elemen (CSS resize: 'none' | 'vertical' | 'horizontal' | 'both').
   * @default 'none'
   */
  resize?: TextareaResize;

  /**
   * Mengaktifkan penyesuaian ukuran manual (resize handle) oleh pengguna.
   * @default false
   */
  resizable?: boolean;

  /**
   * Apakah textarea membentang selebar kontainer (100% width).
   * @default true
   */
  fullWidth?: boolean;

  /**
   * ClassName tambahan khusus untuk pembungkus terluar (wrapper).
   */
  wrapperClassName?: string;
}

export type TextareaProps = TextareaCustomProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof TextareaCustomProps>;
