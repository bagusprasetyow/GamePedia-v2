import type { HTMLAttributes, ReactNode } from 'react';
import type { DepthNamed, DepthNumeric, DepthString } from '@/components/atoms/Button/Button.types';

export type ShowcasePreviewBorderStyle = 'dashed' | 'solid' | 'none';

export type ShowcasePreviewRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type ShowcasePreviewBackground = 'radial' | 'grid' | 'dots' | 'plain';

export type ShowcasePreviewMinHeight = 'sm' | 'md' | 'lg' | 'xl' | 'none';

export type ShowcasePreviewBadgeVariant = 'default' | 'primary' | 'muted' | 'accent';

export type ShowcasePreviewDepth = DepthNumeric | DepthString | DepthNamed;

/**
 * Item individual penanda prop aktif pada ShowcasePreview
 */
export interface ShowcasePreviewBadgeItem {
  /** Label nama prop (misal: 'variant', 'size') */
  label?: string;
  /** Nilai prop (misal: 'primary', 1, true) */
  value: string | number | boolean;
  /** Varian warna visual badge */
  variant?: ShowcasePreviewBadgeVariant;
}

/**
 * Bentuk masukan badges yang fleksibel: bisa array of items/strings atau object record
 */
export type ShowcasePreviewBadgesInput =
  | Array<ShowcasePreviewBadgeItem | string>
  | Record<string, string | number | boolean | null | undefined>;

/**
 * Props kustom internal untuk komponen ShowcasePreviewInfo
 */
export interface ShowcasePreviewInfoProps {
  /** Jumlah interaksi klik yang tercatat */
  clickCount?: number;
  /** Catatan stempel waktu interaksi klik terakhir */
  lastClickedAt?: string | null;
  /** Node info kustom alternatif jika tidak memakai format klik default */
  info?: ReactNode;
  /** Class styling tambahan */
  className?: string;
}

/**
 * Props kustom internal untuk komponen ShowcasePreviewBadges
 */
export interface ShowcasePreviewBadgesProps {
  /** Koleksi badges props aktif (bisa berupa object record atau array) */
  badges?: ShowcasePreviewBadgesInput;
  /** Node custom jika ingin merender kontrol/badges kustom secara manual */
  badgesNode?: ReactNode;
  /** Class styling tambahan */
  className?: string;
}

/**
 * Props kustom internal untuk komponen ShowcasePreviewBackground
 */
export interface ShowcasePreviewBackgroundProps {
  /** Gaya dekorasi background kanvas preview */
  variant?: ShowcasePreviewBackground;
  /** Class styling tambahan */
  className?: string;
}

/**
 * Props kustom utama untuk komponen ShowcasePreview
 */
export interface ShowcasePreviewCustomProps {
  /**
   * Konten elemen atau komponen yang sedang diuji / dipratinjau secara langsung.
   */
  children?: ReactNode;

  /**
   * Jumlah interaksi klik pada komponen pratinjau.
   * Ditampilkan di pojok kiri atas bila disediakan.
   * @default undefined
   */
  clickCount?: number;

  /**
   * Catatan waktu terakhir kali komponen diklik.
   * @default undefined
   */
  lastClickedAt?: string | null;

  /**
   * Node kustom untuk area info pojok kiri atas (menggantikan atau mendampingi clickCount).
   * @default undefined
   */
  info?: ReactNode;

  /**
   * Daftar atau objek parameter props aktif yang sedang diterapkan.
   * Ditampilkan sebagai pill badges di pojok kanan atas.
   * Format object: `{ variant: 'primary', size: 'md', depth: 1 }`
   * Format array: `[{ label: 'variant', value: 'primary' }, 'v1.0']`
   * @default undefined
   */
  badges?: ShowcasePreviewBadgesInput;

  /**
   * Node kustom tambahan di area kanan atas (mendampingi atau menggantikan badges).
   * @default undefined
   */
  badgesNode?: ReactNode;

  /**
   * Gaya garis pembatas (border) kanvas pratinjau.
   * @default 'dashed'
   */
  borderStyle?: ShowcasePreviewBorderStyle;

  /**
   * Tingkat kelengkungan sudut kanvas (border radius).
   * @default '2xl'
   */
  rounded?: ShowcasePreviewRounded;

  /**
   * Dekorasi latar belakang kanvas.
   * @default 'dots'
   */
  background?: ShowcasePreviewBackground;

  /**
   * Tinggi minimum kanvas pratinjau.
   * @default 'md'
   */
  minHeight?: ShowcasePreviewMinHeight;

  /**
   * Apakah pembungkus konten pratinjau harus merentang penuh lebar kanvas (100% width).
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Kedalaman visual bayangan container berstandar Depth System (-3 s/d 3 / alias named).
   * @default 0
   */
  depth?: ShowcasePreviewDepth;

  /**
   * Class styling kustom tambahan untuk wadah terluar (outer container).
   */
  className?: string;

  /**
   * Class styling kustom tambahan untuk wadah konten pratinjau (inner content wrapper).
   */
  contentClassName?: string;
}

/**
 * Props lengkap ShowcasePreview mencakup atribut kontainer div HTML.
 */
export type ShowcasePreviewProps = ShowcasePreviewCustomProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof ShowcasePreviewCustomProps>;

// Aliases untuk backward compatibility
export type PreviewBorderStyle = ShowcasePreviewBorderStyle;
export type PreviewRounded = ShowcasePreviewRounded;
export type PreviewBackground = ShowcasePreviewBackground;
export type PreviewMinHeight = ShowcasePreviewMinHeight;
export type PreviewBadgeVariant = ShowcasePreviewBadgeVariant;
export type PreviewDepth = ShowcasePreviewDepth;
export type PreviewBadgeItem = ShowcasePreviewBadgeItem;
export type PreviewBadgesInput = ShowcasePreviewBadgesInput;
export type PreviewInfoProps = ShowcasePreviewInfoProps;
export type PreviewBadgesProps = ShowcasePreviewBadgesProps;
export type PreviewBackgroundProps = ShowcasePreviewBackgroundProps;
export type PreviewCustomProps = ShowcasePreviewCustomProps;
export type PreviewProps = ShowcasePreviewProps;
