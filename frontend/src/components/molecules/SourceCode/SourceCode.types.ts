import type { ReactNode } from 'react';
import type { ButtonDepth } from '@/components/atoms/Button/Button.types';

/**
 * Interface data untuk satu tab dalam komponen SourceCode.
 */
export interface SourceCodeTab {
  /**
   * Pengenal unik untuk tab (misal: 'jsx', 'html', 'css').
   */
  id: string;

  /**
   * Label tampilan tab (misal: 'React TSX', 'Tailwind HTML').
   */
  label: string;

  /**
   * Kode sumber yang akan ditampilkan dan disalin saat tab aktif.
   */
  code: string;

  /**
   * Bahasa pemrograman untuk penyorotan sintaks (misal: 'tsx', 'jsx', 'html', 'css').
   * @default 'tsx'
   */
  language?: string;
}

/**
 * Props untuk sub-komponen header terminal SourceCode.
 */
export interface SourceCodeHeaderProps {
  /**
   * Kumpulan tab kode sumber.
   */
  tabs: SourceCodeTab[];

  /**
   * ID tab yang sedang aktif.
   */
  activeTabId: string;

  /**
   * Callback saat pengguna memilih tab.
   */
  onTabChange: (tabId: string) => void;

  /**
   * Menampilkan tombol Salin Kode di sudut kanan atas.
   * @default true
   */
  showCopyButton?: boolean;

  /**
   * Status apakah kode baru saja disalin ke clipboard.
   */
  copied: boolean;

  /**
   * Handler untuk menyalin kode ke clipboard.
   */
  onCopy: () => void;

  /**
   * Label tombol salin saat idle.
   * @default 'Salin Kode'
   */
  copyButtonText?: string;

  /**
   * Label tombol salin setelah berhasil disalin.
   * @default 'Tersalin!'
   */
  copiedText?: string;

  /**
   * Judul kustom di header jika tanpa tab.
   */
  title?: ReactNode;

  /**
   * Elemen aksi tambahan di samping tombol salin.
   */
  headerActions?: ReactNode;

  /**
   * Class name kustom tambahan untuk wadah header.
   */
  className?: string;
}

/**
 * Props untuk sub-komponen body penampil kode SourceCode.
 */
export interface SourceCodeBodyProps {
  /**
   * Teks kode sumber yang akan dirender dengan syntax highlighting.
   */
  code: string;

  /**
   * Batas tinggi maksimum kontainer kode sebelum scroll vertikal aktif.
   */
  maxHeight?: string;

  /**
   * Class name kustom tambahan untuk wadah blok kode.
   */
  className?: string;
}

/**
 * Props untuk komponen SourceCode Molecule.
 */
export interface SourceCodeProps {
  /**
   * Kumpulan tab kode sumber. Jika diberikan, tab switcher akan ditampilkan di header.
   */
  tabs?: SourceCodeTab[];

  /**
   * Kode sumber tunggal jika tidak menggunakan sistem multi-tab.
   */
  code?: string;

  /**
   * Bahasa pemrograman untuk kode tunggal.
   * @default 'tsx'
   */
  language?: string;

  /**
   * Shortcut praktis untuk tab 'React TSX'.
   */
  tsxCode?: string;

  /**
   * Shortcut praktis untuk tab 'React JSX' (alias untuk backward compatibility).
   */
  jsxCode?: string;

  /**
   * ID tab yang sedang aktif (mode controlled).
   */
  activeTabId?: string;

  /**
   * ID tab default yang aktif saat pertama kali dimuat.
   * @default 'tsx'
   */
  defaultTabId?: string;

  /**
   * Callback saat pengguna beralih tab.
   */
  onTabChange?: (tabId: string) => void;

  /**
   * Menampilkan tombol Salin Kode di sudut kanan atas.
   * @default true
   */
  showCopyButton?: boolean;

  /**
   * Teks label tombol salin saat idle.
   * @default 'Salin Kode'
   */
  copyButtonText?: string;

  /**
   * Teks label tombol salin saat berhasil disalin.
   * @default 'Tersalin!'
   */
  copiedText?: string;

  /**
   * Durasi tampilan status tersalin dalam milidetik.
   * @default 2000
   */
  copiedDuration?: number;

  /**
   * Tingkat kedalaman visual kartu terminal (skala -3 s/d 3).
   * @default 2
   */
  depth?: ButtonDepth;

  /**
   * Judul kustom di header jika tidak menggunakan tab (misal: ikon + teks).
   */
  title?: ReactNode;

  /**
   * Elemen aksi tambahan di baris header sebelah kanan (di samping tombol salin).
   */
  headerActions?: ReactNode;

  /**
   * Batas tinggi maksimum kontainer kode sebelum scroll aktif (misal: '400px').
   */
  maxHeight?: string;

  /**
   * Class name kustom tambahan untuk wadah terluar.
   */
  className?: string;
}
