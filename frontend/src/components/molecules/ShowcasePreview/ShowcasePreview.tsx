import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { ShowcasePreviewProps } from './ShowcasePreview.types';
import {
  borderStyleClasses,
  roundedClasses,
  minHeightClasses,
  depthClasses,
  resolveDepthKey,
} from './ShowcasePreview.styles';
import { ShowcasePreviewBackground } from './components/ShowcasePreviewBackground';
import { ShowcasePreviewInfo } from './components/ShowcasePreviewInfo';
import { ShowcasePreviewBadges } from './components/ShowcasePreviewBadges';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps (diekspor dari ShowcasePreview.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * ShowcasePreview Component - Developer Showcase Sandbox Canvas
 *
 * Komponen wadah interaktif untuk pratinjau komponen UI secara real-time pada halaman
 * showcase GamePedia. Menyediakan border putus-putus, dekorasi aksen halus,
 * indikator status interaksi klik di kiri atas, serta pil indikator props aktif di kanan atas.
 *
 * @param {ReactNode} props.children - Komponen atau elemen UI yang dipratinjau
 * @param {number} [props.clickCount] - Jumlah interaksi klik yang tercatat
 * @param {string} [props.lastClickedAt] - Timestamp interaksi klik terakhir
 * @param {ReactNode} [props.info] - Node info kustom alternatif untuk kiri atas
 * @param {ShowcasePreviewBadgesInput} [props.badges] - Koleksi props aktif untuk pil kanan atas
 * @param {ReactNode} [props.badgesNode] - Node kustom untuk pil kanan atas
 * @param {ShowcasePreviewBorderStyle} [props.borderStyle='dashed'] - Gaya garis bingkai kontainer
 * @param {ShowcasePreviewRounded} [props.rounded='2xl'] - Kelengkungan sudut bingkai kontainer
 * @param {ShowcasePreviewBackground} [props.background='dots'] - Efek aksen latar belakang
 * @param {ShowcasePreviewMinHeight} [props.minHeight='md'] - Ukuran tinggi minimum kanvas
 * @param {boolean} [props.fullWidth=false] - Apakah konten membentang 100% lebar
 * @param {ShowcasePreviewDepth} [props.depth=0] - Kedalaman visual bayangan Depth System (-3 s/d 3)
 * @param {string} [props.className] - Class styling tambahan wadah terluar
 * @param {string} [props.contentClassName] - Class styling tambahan wadah konten anak
 *
 * @returns {ReactElement} Elemen kanvas pratinjau komponen
 */
export const ShowcasePreview: FC<ShowcasePreviewProps> = ({
  children,
  clickCount,
  lastClickedAt,
  info,
  badges,
  badgesNode,
  borderStyle = 'dashed',
  rounded = '2xl',
  background = 'dots',
  minHeight = 'md',
  fullWidth = false,
  depth = 0,
  className = '',
  contentClassName = '',
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA
  // ─────────────────────────────────────────────────────────────
  const resolvedDepthKey = resolveDepthKey(depth);
  const resolvedDepthClass = depthClasses[resolvedDepthKey] || depthClasses['0'];

  const safeBorderStyle = borderStyleClasses[borderStyle] ? borderStyle : 'dashed';
  const safeRounded = roundedClasses[rounded] ? rounded : '2xl';
  const safeMinHeight = minHeightClasses[minHeight] ? minHeight : 'md';

  const containerClasses = cn(
    // layout & positioning
    'relative flex flex-col items-center justify-center p-8 overflow-hidden transition-all duration-200',
    // background
    'bg-muted/20',
    // border
    'border',
    borderStyleClasses[safeBorderStyle],
    roundedClasses[safeRounded],
    // height
    minHeightClasses[safeMinHeight],
    // depth & shadow
    resolvedDepthClass,
    className
  );

  const contentWrapperClasses = cn(
    // layout & alignment
    'flex items-center justify-center p-4 transition-all duration-200',
    // width
    fullWidth ? 'w-full' : '',
    contentClassName
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses} {...restProps}>
      {/* 1. Latar Belakang Dekoratif */}
      <ShowcasePreviewBackground variant={background} />

      {/* 2. Indikator Interaksi / Info Pojok Kiri Atas */}
      <ShowcasePreviewInfo clickCount={clickCount} lastClickedAt={lastClickedAt} info={info} />

      {/* 3. Indikator Props Aktif / Badges Pojok Kanan Atas */}
      <ShowcasePreviewBadges badges={badges} badgesNode={badgesNode} />

      {/* 4. Konten Pratinjau Komponen */}
      <div className={contentWrapperClasses}>
        {children}
      </div>
    </div>
  );
};

export default ShowcasePreview;
