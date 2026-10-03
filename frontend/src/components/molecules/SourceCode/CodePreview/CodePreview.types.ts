import type { ReactNode } from 'react';

export type CodePreviewDepth =
  | -3
  | -2
  | -1
  | 0
  | 1
  | 2
  | 3
  | 'sunken'
  | 'flat'
  | 'raised-sm'
  | 'raised-md'
  | 'raised-lg';

export type CodePreviewVariant = 'terminal' | 'inset' | 'flat' | 'raised';

export interface CodePreviewProps {
  /**
   * Teks kode sumber yang akan dirender dengan syntax highlighting.
   */
  code: string;

  /**
   * Bahasa pemrograman untuk penyorotan sintaks (misal: 'jsx', 'html', 'tsx', 'css').
   * @default 'jsx'
   */
  language?: string;

  /**
   * Menampilkan nomor baris di sisi kiri blok kode.
   * @default false
   */
  showLineNumbers?: boolean;

  /**
   * Batas tinggi maksimum kontainer kode sebelum scroll vertikal aktif.
   */
  maxHeight?: string;

  /**
   * Tingkat kedalaman visual shadow (Depth System skala -3 s/d 3).
   * @default 0
   */
  depth?: CodePreviewDepth;

  /**
   * Varian tampilan kontainer blok kode.
   * - 'terminal': Latar belakang gelap murni (bg-neutral-950) standar terminal
   * - 'inset': Latar cekung shadow inset (shadow-n1) dengan border halus
   * - 'flat': Rata tanpa shadow elevasi
   * - 'raised': Elevasi timbul (shadow-1 / shadow-2)
   * @default 'terminal'
   */
  variant?: CodePreviewVariant;

  /**
   * Header kustom opsional di atas blok kode.
   */
  header?: ReactNode;

  /**
   * Class name kustom tambahan untuk wadah blok kode.
   */
  className?: string;
}

export interface CodePreviewLineProps {
  /**
   * Teks baris kode tunggal.
   */
  line: string;

  /**
   * Indeks baris (0-indexed).
   */
  lineIndex: number;

  /**
   * Apakah nomor baris ditampilkan.
   * @default false
   */
  showLineNumber?: boolean;

  /**
   * Total baris untuk penyesuaian lebar kolom nomor baris.
   */
  totalLines?: number;

  /**
   * Class name kustom tambahan untuk baris kode.
   */
  className?: string;
}
