import { useCallback, type FC, type ReactElement } from 'react';
import { Button } from '@/components/atoms';
import type { ClipboardProps } from './Clipboard.types';
import { useClipboard } from './useClipboard';
import { getClipboardClasses } from './Clipboard.styles';
import { ClipboardIcon } from './components/ClipboardIcon';
import { ClipboardLabel } from './components/ClipboardLabel';

/**
 * Clipboard Component - Molecule UI
 *
 * Komponen tombol aksi penyalinan teks ke clipboard berbasis Atomic Design,
 * dilengkapi visual feedback taktil (perubahan warna hijau dan teks saat ditekan/disalin),
 * dukungan Depth System (skala -3 s/d 3), fallback clipboard asinkron, dan pencegahan memory leak.
 *
 * @param {string | (() => string | Promise<string>)} props.text - Teks yang akan disalin
 * @param {ReactNode} [props.label='Salin'] - Label teks idle
 * @param {ReactNode} [props.copiedLabel='Tersalin!'] - Label teks saat berhasil disalin
 * @param {string | ReactNode} [props.icon='mdi:content-copy'] - Ikon idle
 * @param {string | ReactNode} [props.copiedIcon='mdi:check'] - Ikon saat berhasil disalin
 * @param {boolean} [props.isIconOnly=false] - Hanya merender ikon tanpa teks
 * @param {ClipboardVariant} [props.variant='terminal'] - Varian visual tombol ('terminal', 'ghost', 'outline', dll.)
 * @param {ButtonSize} [props.size='xs'] - Ukuran tombol
 * @param {ButtonDepth} [props.depth=0] - Tingkat kedalaman shadow (-3 s/d 3)
 * @param {ButtonRounded} [props.rounded='lg'] - Radius kelengkungan sudut
 * @param {number} [props.duration=2000] - Durasi status copied dalam milidetik
 * @param {boolean} [props.disabled=false] - Status nonaktif tombol
 * @param {(copiedText: string) => void} [props.onCopy] - Callback sukses
 * @param {(error: unknown) => void} [props.onError] - Callback gagal
 * @param {string} [props.className=''] - ClassName kustom tambahan
 *
 * @returns {ReactElement} Elemen tombol Clipboard
 */
export const Clipboard: FC<ClipboardProps> = (props): ReactElement => {
  const {
    label = 'Salin',
    copiedLabel = 'Tersalin!',
    icon = 'mdi:content-copy',
    copiedIcon = 'mdi:check',
    isIconOnly = false,
    variant = 'terminal',
    size = 'xs',
    depth = 0,
    rounded = 'lg',
    disabled = false,
    className = '',
  } = props;

  // ─────────────────────────────────────────────────────────────
  // 1. LOGIKA: State Clipboard & Asynchronous Copy Handler
  // ─────────────────────────────────────────────────────────────
  const { copied: internalCopied, isCopying, handleCopy: internalHandleCopy } = useClipboard(props);
  const isControlled = props.copied !== undefined;
  const copied = isControlled ? Boolean(props.copied) : internalCopied;

  const { onClick, text } = props;
  const handleClick = useCallback(() => {
    onClick?.();
    if (text) {
      void internalHandleCopy();
    }
  }, [onClick, text, internalHandleCopy]);

  // ─────────────────────────────────────────────────────────────
  // 2. TAMPILAN: Resolusi Class Maps & Sub-Komponen Nodes
  // ─────────────────────────────────────────────────────────────
  const containerClasses = getClipboardClasses(variant, copied, depth, className);
  const activeLabel = copied ? copiedLabel : label;

  const iconNode = (
    <ClipboardIcon
      copied={copied}
      variant={variant}
      size={size}
      icon={icon}
      copiedIcon={copiedIcon}
    />
  );

  const labelNode = (
    <ClipboardLabel
      copied={copied}
      label={label}
      copiedLabel={copiedLabel}
    />
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean Atomic JSX Output
  // ─────────────────────────────────────────────────────────────
  if (isIconOnly) {
    return (
      <Button
        size={size}
        variant="ghost"
        depth={0}
        rounded={rounded}
        disabled={disabled || isCopying}
        onClick={handleClick}
        className={containerClasses}
        icon={iconNode}
        aria-label={typeof activeLabel === 'string' ? activeLabel : 'Salin ke clipboard'}
      />
    );
  }

  return (
    <Button
      size={size}
      variant="ghost"
      depth={0}
      rounded={rounded}
      disabled={disabled || isCopying}
      onClick={handleClick}
      className={containerClasses}
      startIcon={iconNode}
    >
      {labelNode}
    </Button>
  );
};

export default Clipboard;
