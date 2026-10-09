import type { FC, ReactElement } from 'react';
import { Input, Text } from '@/components/atoms';
import {
  type ImageUploadProps,
  DEFAULT_ACCEPTED_IMAGE_TYPES,
} from './ImageUpload.types';
import {
  sizeClasses,
  aspectRatioClasses,
  getWrapperClasses,
  getDropzoneContainerClasses,
} from './ImageUpload.styles';
import { ImageUploadHeader } from './components/ImageUploadHeader';
import { ImageUploadDropzone } from './components/ImageUploadDropzone';
import { ImageUploadPreview } from './components/ImageUploadPreview';
import { ImageUploadProgress } from './components/ImageUploadProgress';
import { ImageUploadInfo } from './components/ImageUploadInfo';
import { useImageUpload } from './useImageUpload';


// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

/**
 * ImageUpload Component - Molecule UI
 *
 * Komponen pengunggah berkas gambar interaktif berbasis Atomic Design GamePedia.
 * Mendukung drag-and-drop, validasi format/ukuran berkas, pratinjau gambar instan,
 * Depth System (-3 s/d 3), indikator progress bar terpadu, dan pencegahan memory leak.
 *
 * @param {string | File | null} [props.value] - URL gambar atau objek File (controlled)
 * @param {string | File | null} [props.defaultValue] - Nilai awal default gambar (uncontrolled)
 * @param {(file: File | null, url: string | null) => void} [props.onChange] - Callback berkas berubah
 * @param {(err: string) => void} [props.onError] - Callback pesan error validasi
 * @param {string} [props.accept='image/jpeg, image/png, image/webp, image/avif'] - Ekstensi MIME yang diizinkan (Single Source of Truth)
 * @param {number} [props.maxSizeMB=5] - Ukuran maksimum dalam Megabyte
 * @param {ImageUploadSize} [props.size='md'] - Skala dimensi kotak pengunggahan
 * @param {ImageUploadVariant} [props.variant='dashed'] - Varian visual (dashed, solid, ghost)
 * @param {ImageUploadRounded} [props.rounded='lg'] - Radius sudut
 * @param {ImageUploadAspectRatio} [props.aspectRatio='video'] - Rasio aspek pratinjau
 * @param {ImageUploadDepth} [props.depth=0] - Tingkat kedalaman Depth System (-3 s/d 3)
 * @param {ReactNode} [props.label] - Label teks di atas bidang unggah
 * @param {ReactNode} [props.description] - Teks petunjuk keterangan
 * @param {ReactNode} [props.error] - Pesan galat validasi
 * @param {boolean} [props.success=false] - Status validasi berhasil
 * @param {boolean} [props.disabled=false] - Menonaktifkan bidang unggah
 * @param {boolean} [props.isUploading=false] - Status proses pengunggahan
 * @param {number} [props.progress=0] - Persentase pengunggahan (0-100)
 * @param {boolean} [props.clearable=true] - Mengizinkan penghapusan gambar
 * @param {boolean} [props.showFileInfo=true] - Menampilkan metadata berkas terpilih
 * @param {string} [props.icon='lucide:upload-cloud'] - Ikon dropzone
 * @param {string} [props.alt='Pratinjau gambar terunggah'] - Teks alternatif gambar
 * @param {string} [props.wrapperClassName=''] - ClassName tambahan untuk kontainer luar
 * @param {boolean | CompressImageOptions} [props.compress=false] - Opsi/flag kompresi otomatis gambar
 * @param {TargetImageFormat | ConvertImageOptions} [props.convertTo] - Opsi/format konversi otomatis gambar
 * @param {(isProcessing: boolean) => void} [props.onProcessingChange] - Callback status kompresi/konversi gambar
 * @param {string} [props.className=''] - ClassName tambahan untuk dropzone
 *
 * @returns {ReactElement} Elemen ImageUpload
 */
export const ImageUpload: FC<ImageUploadProps> = (props): ReactElement => {
  const {
    value,
    defaultValue,
    onChange,
    onError,
    maxSizeMB = 5,
    size = 'md',
    variant = 'dashed',
    rounded = 'lg',
    aspectRatio = 'video',
    depth = 0,
    label,
    description,
    error: externalError,
    success = false,
    disabled = false,
    isUploading = false,
    progress = 0,
    compress,
    convertTo,
    onProcessingChange,
    uploadPath,
    uploadUrl,
    autoUpload,
    onUploadSuccess,
    onUploadError,
    clearable = true,
    showFileInfo = true,
    placeholderTitle = 'Pilih atau seret gambar ke sini',
    placeholderSubtitle = 'Mendukung PNG, JPG, WEBP, AVIF hingga 5MB',
    icon = 'lucide:upload-cloud',
    alt = 'Pratinjau gambar terunggah',
    wrapperClassName = '',
    className = '',
    accept = DEFAULT_ACCEPTED_IMAGE_TYPES,
    ...restProps
  } = props;

  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State Management & Event Handlers
  // ─────────────────────────────────────────────────────────────
  const {
    fileInputRef,
    previewUrl,
    fileDetails,
    isDragging,
    validationError,
    isProcessing,
    isUploading: isUploadingState,
    progress: uploadProgressState,
    handleBrowse,
    handleClear,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useImageUpload({
    value,
    defaultValue,
    onChange,
    onError,
    accept,
    maxSizeMB,
    disabled,
    isUploading,
    progress,
    compress,
    convertTo,
    onProcessingChange,
    uploadPath,
    uploadUrl,
    autoUpload,
    onUploadSuccess,
    onUploadError,
  });

  const activeError = externalError || validationError;
  const isInvalid = Boolean(activeError);

  const safeSize = sizeClasses[size] ? size : 'md';
  const safeAspectRatio = aspectRatioClasses[aspectRatio] ? aspectRatio : 'video';

  const outerWrapperClasses = getWrapperClasses(wrapperClassName);

  const dropzoneContainerClasses = getDropzoneContainerClasses({
    size,
    variant,
    rounded,
    aspectRatio,
    depth,
    isInvalid,
    success,
    disabled,
    className,
  });

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean Atomic JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={outerWrapperClasses} {...restProps}>
      {/* Label & Description Header */}
      <ImageUploadHeader label={label} description={description} />


      {/* Hidden File Input (Membungkus Atom Input untuk A11y & File Dialog) */}
      <Input
        type="file"
        ref={fileInputRef}
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
        tabIndex={-1}
        className="hidden"
        wrapperClassName="hidden"
        aria-hidden="true"
      />

      {/* Interactive Dropzone / Preview Area */}
      <div
        className={dropzoneContainerClasses}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <>
            <ImageUploadPreview
              previewUrl={previewUrl}
              alt={alt}
              aspectRatio={safeAspectRatio}
              disabled={disabled}
              isUploading={isUploadingState || isProcessing}
              onBrowse={handleBrowse}
              onClear={handleClear}
              clearable={clearable}
            />

            {/* Selected File Metadata Floating di Atas (Dalam) Gambar */}
            {showFileInfo && fileDetails && !isUploadingState && !isProcessing && (
              <ImageUploadInfo fileDetails={fileDetails} />
            )}
          </>
        ) : (
          <ImageUploadDropzone
            icon={icon}
            title={placeholderTitle}
            subtitle={placeholderSubtitle}
            size={safeSize}
            disabled={disabled}
            isDragging={isDragging}
            onBrowse={handleBrowse}
          />
        )}

        {/* Loading / Upload / Compression Progress Overlay */}
        {(isUploadingState || isProcessing) && (
          <ImageUploadProgress
            progress={uploadProgressState}
            indeterminate={isProcessing && !isUploadingState}
            label={
              isProcessing
                ? 'Memproses gambar...'
                : isUploadingState
                  ? 'Mengunggah gambar...'
                  : undefined
            }
          />
        )}
      </div>

      {/* Error Message */}
      {isInvalid && (
        <Text as="p" size="xs" variant="error" className="mt-0.5">
          {activeError}
        </Text>
      )}
    </div>
  );
};

export default ImageUpload;
