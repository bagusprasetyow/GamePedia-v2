import { useState, useCallback, useRef, useEffect } from 'react';
import type { ClipboardProps } from './Clipboard.types';

export interface UseClipboardReturn {
  copied: boolean;
  isCopying: boolean;
  handleCopy: () => Promise<void>;
}

/**
 * Custom Hook: useClipboard
 *
 * Mengelola eksekusi penyalinan teks clipboard secara asinkron dengan penanganan error,
 * status visual feedback transisi (`copied`), dan pembersihan timer otomatis untuk mencegah kebocoran memori.
 *
 * @param {ClipboardProps} props - Parameter konfigurasi clipboard
 * @returns {UseClipboardReturn} State dan fungsi eksekusi clipboard
 */
export const useClipboard = ({
  text,
  duration = 2000,
  onCopy,
  onError,
}: Pick<ClipboardProps, 'text' | 'duration' | 'onCopy' | 'onError'>): UseClipboardReturn => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bersihkan timer aktif saat komponen unmount untuk mencegah kebocoran memori
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    // Bersihkan timer sebelumnya jika tombol ditekan berulang secara cepat
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = null;
    }

    setIsCopying(true);

    try {
      // Selesaikan teks jika input berupa fungsi / promise
      const textToCopy = typeof text === 'function' ? await text() : text;

      if (!textToCopy) {
        setIsCopying(false);
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else if (typeof document !== 'undefined') {
        // Fallback untuk iframe / konteks non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      onCopy?.(textToCopy);

      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, duration);
    } catch (err) {
      console.warn('[Clipboard] Gagal menyalin ke clipboard:', err);
      onError?.(err);
    } finally {
      setIsCopying(false);
    }
  }, [text, duration, onCopy, onError]);

  return {
    copied,
    isCopying,
    handleCopy,
  };
};

export default useClipboard;
