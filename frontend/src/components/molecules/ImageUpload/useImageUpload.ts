import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import type {
  ImageUploadCustomProps,
  ImageUploadFileDetails,
} from './ImageUpload.types';
import { DEFAULT_ACCEPTED_IMAGE_TYPES } from './ImageUpload.types';
import {
  extractFileDetails,
  processImageFilePipeline,
} from './ImageUpload.utils';
import { useImageDragDrop } from '@/hooks/image';
import { uploadImageToServer } from '@/utils/image';


/**
 * useImageUpload Hook
 *
 * Hook logika pengelola berkas gambar, drag-and-drop, validasi format/ukuran,
 * kompresi otomatis, konversi format, pembuatan preview URL asinkron dengan pembersihan memory leak.
 */
export function useImageUpload(props: ImageUploadCustomProps) {
  const {
    value,
    defaultValue,
    onChange,
    onError,
    accept = DEFAULT_ACCEPTED_IMAGE_TYPES,
    maxSizeMB = 5,
    disabled = false,
    isUploading: externalIsUploading = false,
    progress: externalProgress,
    compress,
    convertTo,
    onProcessingChange,
    uploadPath,
    uploadUrl,
    autoUpload,
    onUploadSuccess,
    onUploadError,
  } = props;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeBlobUrlRef = useRef<string | null>(null);
  const processIdRef = useRef<number>(0);
  const uploadAbortControllerRef = useRef<AbortController | null>(null);

  // Inisialisasi awal tanpa membaca ref saat render
  const initialDefaultString = typeof defaultValue === 'string' ? defaultValue : null;
  const initialDefaultFile = defaultValue instanceof File ? defaultValue : null;

  const [internalFile, setInternalFile] = useState<File | null>(initialDefaultFile);
  const [internalBlobUrl, setInternalBlobUrl] = useState<string | null>(initialDefaultString);
  const [internalDetails, setInternalDetails] = useState<ImageUploadFileDetails | null>(() => {
    return initialDefaultFile ? extractFileDetails(initialDefaultFile) : null;
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isUploadingToServer, setIsUploadingToServer] = useState<boolean>(false);
  const [serverUploadProgress, setServerUploadProgress] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const isControlled = value !== undefined;

  // Sinkronisasi object URL controlled File jika dipasok dari luar komponen
  const controlledBlobUrl = useMemo(() => {
    if (isControlled && value instanceof File && value !== internalFile) {
      return URL.createObjectURL(value);
    }
    return null;
  }, [isControlled, value, internalFile]);

  useEffect(() => {
    return () => {
      if (controlledBlobUrl) {
        URL.revokeObjectURL(controlledBlobUrl);
      }
    };
  }, [controlledBlobUrl]);

  // Bersihkan object URL dan batalkan operasi aktif saat unmount
  useEffect(() => {
    return () => {
      processIdRef.current += 1;
      if (uploadAbortControllerRef.current) {
        uploadAbortControllerRef.current.abort();
        uploadAbortControllerRef.current = null;
      }
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
    };
  }, []);

  // Pemrosesan File saat dipilih atau di-drop
  const processFile = useCallback(
    async (file: File) => {
      // Batalkan proses upload aktif sebelumnya jika ada
      if (uploadAbortControllerRef.current) {
        uploadAbortControllerRef.current.abort();
        uploadAbortControllerRef.current = null;
      }

      const currentProcessId = (processIdRef.current += 1);
      const needsProcessing = Boolean(convertTo || compress);

      if (needsProcessing) {
        setIsProcessing(true);
        onProcessingChange?.(true);
      }

      let processedFile: File;
      try {
        processedFile = await processImageFilePipeline({
          file,
          accept,
          maxSizeMB,
          compress,
          convertTo,
        });

        // Abaikan jika proses telah dibatalkan oleh upload baru atau handleClear
        if (currentProcessId !== processIdRef.current) {
          return;
        }

        setValidationError(null);
      } catch (error) {
        // Jangan timpa error jika proses telah digantikan oleh proses yang lebih baru
        if (currentProcessId !== processIdRef.current) {
          return;
        }

        const errorMsg = error instanceof Error ? error.message : 'Gagal memproses berkas gambar';
        setValidationError(errorMsg);
        onError?.(errorMsg);
        return;
      } finally {
        if (currentProcessId === processIdRef.current && needsProcessing) {
          setIsProcessing(false);
          onProcessingChange?.(false);
        }
      }

      // Cabut URL sebelumnya jika ada
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }

      const newBlobUrl = URL.createObjectURL(processedFile);
      activeBlobUrlRef.current = newBlobUrl;

      const details = extractFileDetails(processedFile, file);
      setInternalFile(processedFile);
      setInternalBlobUrl(newBlobUrl);
      setInternalDetails(details);

      onChange?.(processedFile, newBlobUrl);

      // Jalankan auto-upload ke backend storage jika uploadPath atau autoUpload aktif
      const shouldAutoUpload =
        (Boolean(uploadPath) || Boolean(uploadUrl)) && autoUpload !== false;

      if (shouldAutoUpload) {
        setIsUploadingToServer(true);
        setServerUploadProgress(0);

        const abortController = new AbortController();
        uploadAbortControllerRef.current = abortController;

        try {
          const uploadRes = await uploadImageToServer({
            file: processedFile,
            path: uploadPath,
            uploadUrl,
            signal: abortController.signal,
            onProgress: (pct) => {
              if (currentProcessId === processIdRef.current) {
                setServerUploadProgress(pct);
              }
            },
          });

          if (currentProcessId === processIdRef.current) {
            onUploadSuccess?.(uploadRes);
          }
        } catch (uploadError) {
          if (
            uploadError instanceof Error &&
            (uploadError.name === 'AbortError' || uploadError.message.includes('dibatalkan'))
          ) {
            // Upload sengaja dibatalkan oleh user atau diganti file baru
            return;
          }

          if (currentProcessId === processIdRef.current) {
            const errorMsg =
              uploadError instanceof Error
                ? uploadError.message
                : 'Gagal mengunggah gambar ke server penyimpanan';
            setValidationError(errorMsg);
            onUploadError?.(
              uploadError instanceof Error ? uploadError : errorMsg
            );
            onError?.(errorMsg);
          }
        } finally {
          if (currentProcessId === processIdRef.current) {
            setIsUploadingToServer(false);
          }
        }
      }
    },
    [
      accept,
      maxSizeMB,
      compress,
      convertTo,
      uploadPath,
      uploadUrl,
      autoUpload,
      onChange,
      onError,
      onProcessingChange,
      onUploadSuccess,
      onUploadError,
    ]
  );

  // Sub-hook Drag & Drop
  const {
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useImageDragDrop(disabled, processFile);

  // File Input Change
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        const file = selectedFiles[0];
        if (file) {
          processFile(file);
        }
      }
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    },
    [processFile]
  );

  // Membuka dialog pemilih file
  const handleBrowse = useCallback(() => {
    if (disabled) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Mereset dan menghapus berkas
  const handleClear = useCallback(() => {
    if (disabled) return;
    processIdRef.current += 1;
    if (uploadAbortControllerRef.current) {
      uploadAbortControllerRef.current.abort();
      uploadAbortControllerRef.current = null;
    }
    setIsProcessing(false);
    setIsUploadingToServer(false);
    setServerUploadProgress(0);
    onProcessingChange?.(false);

    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setInternalFile(null);
    setInternalBlobUrl(null);
    setInternalDetails(null);
    setValidationError(null);

    onChange?.(null, null);
  }, [disabled, onChange, onProcessingChange]);

  // Resolusi nilai aktif terhitung
  const activePreviewUrl = useMemo((): string | null => {
    if (!isControlled) return internalBlobUrl;
    if (value === null) return null;
    if (typeof value === 'string') return value;
    if (value instanceof File) {
      return value === internalFile ? internalBlobUrl : controlledBlobUrl;
    }
    return null;
  }, [isControlled, value, internalBlobUrl, internalFile, controlledBlobUrl]);

  const activeFile = isControlled
    ? value instanceof File
      ? value
      : null
    : internalFile;

  const activeDetails = useMemo((): ImageUploadFileDetails | null => {
    if (activeFile) {
      if (activeFile === internalFile && internalDetails) {
        return internalDetails;
      }
      return extractFileDetails(activeFile);
    }
    return internalDetails;
  }, [activeFile, internalFile, internalDetails]);

  return {
    fileInputRef,
    previewUrl: activePreviewUrl,
    currentFile: activeFile,
    fileDetails: activeDetails,
    isDragging,
    validationError,
    isUploading: externalIsUploading || isUploadingToServer,
    isProcessing,
    progress:
      externalProgress !== undefined
        ? externalProgress
        : serverUploadProgress,
    handleBrowse,
    handleClear,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
