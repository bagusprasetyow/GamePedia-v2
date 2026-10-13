import { useRef, useCallback, useEffect } from 'react';

export interface UseVideoClickHandlerOptions {
  /**
   * Callback yang dijalankan saat terjadi klik tunggal (misal togglePlay).
   */
  onSingleClick: () => void;
  /**
   * Callback yang dijalankan saat terjadi klik ganda (misal toggleFullscreen).
   */
  onDoubleClick: () => void;
  /**
   * Ambang batas jeda waktu (dalam milidetik) untuk membedakan klik tunggal vs ganda.
   * @default 250
   */
  delay?: number;
}

export interface UseVideoClickHandlerReturn {
  handleClick: (e?: React.MouseEvent) => void;
  handleDoubleClick: (e?: React.MouseEvent) => void;
}

/**
 * Hook kustom untuk membedakan interaksi klik tunggal (single click) dan klik ganda (double click)
 * pada area pemutar video GamePedia.
 *
 * Mencegah pemutaran/jeda (togglePlay) tersendat saat pengguna melakukan klik ganda untuk masuk atau
 * keluar dari mode layar penuh (fullscreen).
 *
 * @param {UseVideoClickHandlerOptions} options - Konfigurasi callback dan delay
 * @returns {UseVideoClickHandlerReturn} Handler klik untuk elemen video / overlay
 */
export const useVideoClickHandler = ({
  onSingleClick,
  onDoubleClick,
  delay = 250,
}: UseVideoClickHandlerOptions): UseVideoClickHandlerReturn => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      if (e?.defaultPrevented) return;

      // Jika browser melaporkan detail klik > 1 (klik kedua dari urutan double click)
      if (e && e.detail > 1) {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        return;
      }

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      timerRef.current = setTimeout(() => {
        onSingleClick();
        timerRef.current = null;
      }, delay);
    },
    [onSingleClick, delay]
  );

  const handleDoubleClick = useCallback(
    (e?: React.MouseEvent) => {
      if (e?.defaultPrevented) return;

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      onDoubleClick();
    },
    [onDoubleClick]
  );

  return {
    handleClick,
    handleDoubleClick,
  };
};
