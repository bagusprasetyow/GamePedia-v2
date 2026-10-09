import type { ImgHTMLAttributes, ReactNode, SyntheticEvent } from 'react';
import type {
  DepthNumeric,
  DepthString,
  DepthNamed,
} from '@/components/atoms/Button/Button.types';

export type { DepthNamed };


export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

export type ImageRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type ImageAspectRatio = 'square' | 'video' | 'portrait' | 'wide' | 'auto';

export type ImageDepth = DepthNumeric | DepthString | DepthNamed;

export type ImageLoading = 'lazy' | 'eager';

export interface ImageCustomProps {
  /**
   * Alamat URL sumber gambar.
   */
  src?: string;

  /**
   * Teks deskripsi alternatif untuk pembaca layar dan a11y.
   * @default ''
   */
  alt?: string;

  /**
   * URL gambar cadangan jika gambar utama gagal dimuat (error 404/jaringan).
   */
  fallbackSrc?: string;

  /**
   * Elemen UI kustom yang ditampilkan saat gambar gagal dimuat.
   */
  fallbackElement?: ReactNode;

  /**
   * Gaya penyesuaian konten gambar terhadap wadah kontainernya (CSS object-fit).
   * @default 'cover'
   */
  fit?: ImageFit;

  /**
   * Radius sudut lengkungan gambar (border-radius).
   * @default 'none'
   */
  rounded?: ImageRounded;

  /**
   * Rasio aspek kontainer gambar.
   * @default 'auto'
   */
  aspectRatio?: ImageAspectRatio;

  /**
   * Skala kedalaman visual bayangan Depth System (-3 s/d 3).
   * @default 0
   */
  depth?: ImageDepth;

  /**
   * Menampilkan efek cahaya ambient blur dari gambar di lapisan belakang kontainer.
   * @default false
   */
  ambientBlur?: boolean;

  /**
   * Menampilkan animasi skeleton shimmer saat gambar sedang dalam proses pengunduhan.
   * @default false
   */
  showSkeleton?: boolean;

  /**
   * Strategi pemuatan gambar oleh peramban web (lazy load atau eager).
   * @default 'lazy'
   */
  loading?: ImageLoading;

  /**
   * ClassName tambahan untuk kontainer pembungkus gambar.
   */
  wrapperClassName?: string;

  /**
   * Callback saat berkas gambar berhasil selesai dimuat oleh peramban.
   */
  onLoad?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;

  /**
   * Callback saat pemuatan berkas gambar mengalami galat.
   */
  onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export type ImageProps = ImageCustomProps &
  Omit<ImgHTMLAttributes<HTMLImageElement>, keyof ImageCustomProps>;

// ─────────────────────────────────────────────────────────────
// Props Sub-Komponen Internal
// ─────────────────────────────────────────────────────────────

export interface ImageSkeletonProps {
  /**
   * Radius sudut skeleton agar serasi dengan gambar.
   */
  rounded?: ImageRounded;
  /**
   * ClassName tambahan untuk elemen skeleton.
   */
  className?: string;
}

export interface ImageFallbackProps {
  /**
   * Elemen alternatif kustom (jika disediakan).
   */
  children?: ReactNode;
  /**
   * Teks keterangan galat atau alt text.
   */
  alt?: string;
  /**
   * Radius sudut kontainer fallback.
   */
  rounded?: ImageRounded;
  /**
   * ClassName tambahan.
   */
  className?: string;
}

export interface ImageAmbientBlurProps {
  /**
   * URL gambar yang dijadikan ambient blur.
   */
  src: string;
  /**
   * ClassName tambahan untuk ambient blur.
   */
  className?: string;
}
