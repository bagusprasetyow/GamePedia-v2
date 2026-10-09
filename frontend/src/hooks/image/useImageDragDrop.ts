import { useState, useCallback } from 'react';
import type { DragEvent } from 'react';

/**
 * useImageDragDrop Hook - Internal Hook
 *
 * Mengelola interaksi dan state visual drag-and-drop untuk area dropzone berkas gambar.
 *
 * @param {boolean} disabled - Status apakah area drag-and-drop dinonaktifkan
 * @param {(file: File) => void} onDropFile - Callback saat berkas berhasil di-drop
 * @returns Objek state `isDragging` dan event handlers drag
 */
export function useImageDragDrop(
  disabled: boolean,
  onDropFile: (file: File) => void
) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
        const droppedFile = droppedFiles[0];
        if (droppedFile) {
          onDropFile(droppedFile);
        }
      }
    },
    [disabled, onDropFile]
  );

  return {
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
