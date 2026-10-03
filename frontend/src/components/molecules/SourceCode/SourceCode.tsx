import type { FC, ReactElement } from 'react';
import type { SourceCodeProps } from './SourceCode.types';
import { useSourceCode } from './useSourceCode';
import { getContainerClasses } from './SourceCode.styles';
import { SourceCodeHeader } from './components/SourceCodeHeader';
import { SourceCodeBody } from './components/SourceCodeBody';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di SourceCode.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * SourceCode Component - Molecule
 *
 * Komponen penampil kode sumber bergaya terminal window gelap dengan dukungan multi-tab,
 * penyorotan sintaks tokenik real-time, aksi penyalinan ke clipboard dengan visual feedback,
 * palet warna OKLCH, dan Depth System (-3 s/d 3).
 *
 * @param {SourceCodeTab[]} [props.tabs] - Kumpulan tab kode sumber kustom
 * @param {string} [props.code] - Kode sumber tunggal jika tanpa tab
 * @param {string} [props.tsxCode] - Shortcut cepat untuk kode React TSX
 * @param {string} [props.jsxCode] - Shortcut alternatif untuk kode React TSX (backward compatibility)
 * @param {ButtonDepth} [props.depth=2] - Kedalaman visual shadow kartu terminal (-3 s/d 3)
 * @param {boolean} [props.showCopyButton=true] - Menampilkan tombol salin kode
 * @param {string} [props.copyButtonText='Salin Kode'] - Label tombol salin idle
 * @param {string} [props.copiedText='Tersalin!'] - Label tombol setelah disalin
 * @param {ReactNode} [props.title] - Judul kustom di baris header (jika tanpa tab)
 * @param {ReactNode} [props.headerActions] - Kontrol aksi tambahan di header
 * @param {string} [props.maxHeight] - Batas tinggi maksimum kontainer kode
 * @param {string} [props.className] - Class kustom tambahan untuk wadah luar
 *
 * @returns {ReactElement} Kartu penampil kode terminal
 */
export const SourceCode: FC<SourceCodeProps> = (props): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers (via useSourceCode)
  // ─────────────────────────────────────────────────────────────
  const {
    depth = 2,
    showCopyButton = true,
    copyButtonText = 'Salin Kode',
    copiedText = 'Tersalin!',
    title,
    headerActions,
    maxHeight,
    className = '',
  } = props;

  const {
    tabs,
    activeTabId,
    activeCode,
    copied,
    handleTabChange,
    handleCopy,
  } = useSourceCode(props);

  const containerClasses = getContainerClasses(depth, className);

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean Modular JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* Baris Header Terminal */}
      <SourceCodeHeader
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={handleTabChange}
        showCopyButton={showCopyButton}
        copied={copied}
        onCopy={handleCopy}
        copyButtonText={copyButtonText}
        copiedText={copiedText}
        title={title}
        headerActions={headerActions}
      />

      {/* Wadah Blok Kode Monospace dengan Real-Time Syntax Highlighting */}
      <SourceCodeBody
        code={activeCode}
        maxHeight={maxHeight}
      />
    </div>
  );
};

export default SourceCode;
