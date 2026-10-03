import { useMemo } from 'react';
import type { CodePreviewProps } from './CodePreview.types';

export interface UseCodePreviewReturn {
  lines: string[];
  totalLines: number;
}

/**
 * Custom Hook: useCodePreview
 *
 * Mengelola pemisahan string kode menjadi baris-baris terstruktur serta memoization komputasi
 * baris untuk mencegah pemrosesan ulang tokenizer yang tidak perlu saat terjadi re-render.
 *
 * @param {CodePreviewProps} props - Parameter konfigurasi CodePreview
 * @returns {UseCodePreviewReturn} Array baris dan total baris kode
 */
export const useCodePreview = ({
  code,
}: Pick<CodePreviewProps, 'code'>): UseCodePreviewReturn => {
  const lines = useMemo(() => {
    if (!code) return [''];
    return code.split('\n');
  }, [code]);

  const totalLines = lines.length;

  return {
    lines,
    totalLines,
  };
};

export default useCodePreview;
