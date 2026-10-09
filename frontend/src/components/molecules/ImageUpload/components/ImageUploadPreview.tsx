import type { FC, ReactElement } from 'react';
import { Image } from '@/components/atoms';
import type { ImageUploadPreviewProps } from '../ImageUpload.types';
import {
  previewContainerClasses,
  ambientOverlayClasses,
  mainImageClasses,
  getGradientOverlayClasses,
  previewActionsWrapperClasses,
} from '../ImageUpload.styles';
import { ImageUploadActions } from './ImageUploadActions';

/**
 * ImageUploadPreview Component - Sub-Atom Internal ImageUpload
 *
 * Menampilkan pratinjau gambar tanpa crop (object-contain) dengan latar belakang
 * ambient blur, serta tombol kontrol aksi di sudut kanan atas yang muncul saat hover.
 */
export const ImageUploadPreview: FC<ImageUploadPreviewProps> = ({
  previewUrl,
  alt,
  disabled,
  isUploading,
  onBrowse,
  onClear,
  clearable,
}): ReactElement => {
  return (
    <div className={previewContainerClasses}>
      {/* Gambar Utama dengan Latar Belakang Ambient Blur terpadu via Atom Image */}
      <Image
        src={previewUrl}
        alt={alt}
        fit="contain"
        ambientBlur
        loading="lazy"
        className={mainImageClasses}
        wrapperClassName="w-full h-full"
      />
      <div className={ambientOverlayClasses} />

      {/* Bayangan Lembut di Bagian Atas saat Hover (Meningkatkan Kontras Tombol & Teks) */}
      <div className={getGradientOverlayClasses(isUploading)} />

      {/* Tombol Kontrol Aksi di Kanan Atas (Muncul Saat Hover) */}
      {!isUploading && (
        <ImageUploadActions
          onBrowse={onBrowse}
          onClear={onClear}
          clearable={clearable}
          disabled={disabled}
          className={previewActionsWrapperClasses}
        />
      )}
    </div>
  );
};


