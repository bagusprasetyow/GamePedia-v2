import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms';
import type { CodePreviewProps } from './CodePreview.types';
import { useCodePreview } from './useCodePreview';
import { getContainerClasses, preClasses } from './CodePreview.styles';
import { CodePreviewLine } from './components/CodePreviewLine';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di CodePreview.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * CodePreview Component - Molecule UI
 *
 * Komponen penampil blok kode sumber terformat dengan penyorotan sintaks (syntax highlighting)
 * real-time bergaya resmi VS Code Dark+, dukungan penomoran baris, scroll horizontal,
 * integrasi Sistem Kedalaman visual (Depth System skala -3 s/d 3), dan optimasi komputasi memoization.
 *
 * @param {string} props.code - Teks kode sumber yang akan ditampilkan
 * @param {string} [props.language='jsx'] - Bahasa pemrograman untuk penyorotan sintaks
 * @param {boolean} [props.showLineNumbers=false] - Menampilkan nomor baris di sisi kiri
 * @param {string} [props.maxHeight] - Batas tinggi maksimum kontainer kode
 * @param {CodePreviewDepth} [props.depth=0] - Tingkat kedalaman visual shadow (-3 s/d 3)
 * @param {CodePreviewVariant} [props.variant='terminal'] - Varian tampilan kontainer
 * @param {ReactNode} [props.header] - Header kustom opsional di atas blok kode
 * @param {string} [props.className=''] - ClassName kustom tambahan
 *
 * @returns {ReactElement} Blok kode sumber berpenyorot sintaks
 */
export const CodePreview: FC<CodePreviewProps> = ({
  code,
  showLineNumbers = false,
  maxHeight,
  depth = 0,
  variant = 'terminal',
  header,
  className = '',
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Pemisahan Baris & Memoization (via useCodePreview)
  // ─────────────────────────────────────────────────────────────
  const { lines, totalLines } = useCodePreview({ code });

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean Atomic JSX Output
  // ─────────────────────────────────────────────────────────────
  const containerClasses = getContainerClasses(variant, depth, className);

  return (
    <Text
      as="div"
      className={containerClasses}
      style={maxHeight ? { maxHeight } : undefined}
    >
      {header}
      <pre className={preClasses}>
        <code>
          {lines.map((line, idx) => (
            <CodePreviewLine
              key={idx}
              line={line}
              lineIndex={idx}
              showLineNumber={showLineNumbers}
              totalLines={totalLines}
            />
          ))}
        </code>
      </pre>
    </Text>
  );
};

export default CodePreview;
