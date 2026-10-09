import { useState, useEffect, forwardRef } from 'react';
import type { ReactElement, SyntheticEvent } from 'react';
import type { ImageProps } from './Image.types';
import {
  fitClasses,
  roundedClasses,
  aspectRatioClasses,
  getImageContainerClasses,
  getImageElementClasses,
} from './Image.styles';
import { ImageSkeleton } from './components/ImageSkeleton';
import { ImageFallback } from './components/ImageFallback';
import { ImageAmbientBlur } from './components/ImageAmbientBlur';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Tokens
// (Didefinisikan dan diekspor secara modular di Image.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Image Component - Atomic UI Element
 *
 * Komponen gambar atom standar monorepo GamePedia.
 * Menyediakan enkapsulasi rasio aspek (aspect-ratio), object-fit, radius sudut,
 * Depth System (-3 s/d 3), fallback visual saat error, efek ambient blur,
 * dan animasi skeleton loading terpadu.
 *
 * @param {string} [props.src] - Alamat URL berkas gambar
 * @param {string} [props.alt=''] - Teks alternatif untuk aksesibilitas (a11y)
 * @param {string} [props.fallbackSrc] - URL gambar cadangan jika sumber utama gagal
 * @param {ReactNode} [props.fallbackElement] - Elemen kustom saat gambar gagal dimuat
 * @param {ImageFit} [props.fit='cover'] - Pengaturan CSS object-fit ('cover', 'contain', 'fill', 'none', 'scale-down')
 * @param {ImageRounded} [props.rounded='none'] - Radius sudut pembungkus dan gambar
 * @param {ImageAspectRatio} [props.aspectRatio='auto'] - Rasio aspek tampilan ('square', 'video', 'portrait', 'wide', 'auto')
 * @param {ImageDepth} [props.depth=0] - Tingkat kedalaman bayangan taktil (-3 s/d 3)
 * @param {boolean} [props.ambientBlur=false] - Mengaktifkan latar belakang ambient blur
 * @param {boolean} [props.showSkeleton=false] - Menampilkan animasi placeholder saat memuat
 * @param {ImageLoading} [props.loading='lazy'] - Strategi lazy load gambar oleh peramban
 * @param {string} [props.wrapperClassName=''] - ClassName tambahan untuk kontainer pembungkus
 * @param {string} [props.className=''] - ClassName tambahan untuk elemen gambar
 * @param {(e: SyntheticEvent<HTMLImageElement, Event>) => void} [props.onLoad] - Callback saat berhasil dimuat
 * @param {(e: SyntheticEvent<HTMLImageElement, Event>) => void} [props.onError] - Callback saat terjadi galat
 *
 * @returns {ReactElement} Elemen gambar atom React
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref): ReactElement => {
  const {
    src,
    alt = '',
    fallbackSrc,
    fallbackElement,
    fit = 'cover',
    rounded = 'none',
    aspectRatio = 'auto',
    depth = 0,
    ambientBlur = false,
    showSkeleton = false,
    loading = 'lazy',
    wrapperClassName = '',
    className = '',
    onLoad,
    onError,
    ...restProps
  } = props;

  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management & Handlers
  // ─────────────────────────────────────────────────────────────
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);

  // Reset state bila sumber gambar berubah
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    // Jika ada fallbackSrc dan belum dicoba, gunakan fallbackSrc terlebih dahulu
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    setHasError(true);
    setIsLoaded(true);
    onError?.(e);
  };

  const safeFit = fitClasses[fit] ? fit : 'cover';
  const safeRounded = roundedClasses[rounded] ? rounded : 'none';
  const safeAspectRatio = aspectRatioClasses[aspectRatio] ? aspectRatio : 'auto';

  const shouldRenderAmbientBlur = Boolean(ambientBlur && currentSrc && !hasError);
  const shouldRenderSkeleton = Boolean(showSkeleton && !isLoaded && !hasError);

  const containerClasses = getImageContainerClasses({
    aspectRatio: safeAspectRatio,
    rounded: safeRounded,
    depth,
    hasAmbientBlur: shouldRenderAmbientBlur,
    className: wrapperClassName,
  });

  const imageElementClasses = getImageElementClasses({
    fit: safeFit,
    rounded: safeRounded,
    isLoaded: !showSkeleton || isLoaded,
    hasAmbientBlur: shouldRenderAmbientBlur,
    className,
  });

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean Atomic JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* 1. Ambient Glow Backdrop jika diaktifkan */}
      {shouldRenderAmbientBlur && currentSrc && (
        <ImageAmbientBlur src={currentSrc} />
      )}

      {/* 2. Skeleton Loading Shimmer jika aktif dan belum selesai */}
      {shouldRenderSkeleton && (
        <ImageSkeleton rounded={safeRounded} />
      )}

      {/* 3. Tampilan Fallback jika gambar gagal dimuat */}
      {hasError ? (
        <ImageFallback alt={alt} rounded={safeRounded}>
          {fallbackElement}
        </ImageFallback>
      ) : currentSrc ? (
        /* 4. Elemen Gambar Utama */
        <img
          ref={ref}
          src={currentSrc}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={imageElementClasses}
          {...restProps}
        />
      ) : (
        /* 5. Placeholder jika src tidak ada sama sekali */
        <ImageFallback alt={alt} rounded={safeRounded}>
          {fallbackElement}
        </ImageFallback>
      )}
    </div>
  );
});

Image.displayName = 'Image';

export default Image;
