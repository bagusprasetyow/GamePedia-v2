import { cn } from '@/lib/utils';
import type { CodePreviewVariant, CodePreviewDepth } from './CodePreview.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Depth System Skala -3 s/d 3 & Syntax Token Maps
// ─────────────────────────────────────────────────────────────

/**
 * Pemetaan Depth System skala -3 s/d 3 untuk kontainer CodePreview.
 */
export const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2',
  '-1': 'shadow-n1',
  '0': 'shadow-0',
  '1': 'shadow-1',
  '2': 'shadow-2',
  '3': 'shadow-3',
};

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Memetakan nilai depth ke string key depthClasses yang valid.
 */
export const resolveDepthKey = (depth?: CodePreviewDepth | number | string): string => {
  if (depth === undefined || depth === null) return '0';
  const key = String(depth);
  if (key in namedDepthMap) return namedDepthMap[key];
  if (key in depthClasses) return key;
  return '0';
};

/**
 * Menyelesaikan class shadow kedalaman berdasarkan prop depth.
 */
export const resolveDepthClass = (depth?: CodePreviewDepth | number | string): string => {
  const key = resolveDepthKey(depth);
  return depthClasses[key] || depthClasses['0'];
};

/**
 * Pemetaan kelas varian kontainer CodePreview.
 */
export const variantClasses: Record<CodePreviewVariant, string> = {
  terminal: cn(
    // background
    'bg-neutral-950'
  ),
  inset: cn(
    // border
    'border border-neutral-800',
    // background
    'bg-neutral-950',
    // shadow & depth
    'shadow-n1'
  ),
  flat: cn(
    // background
    'bg-neutral-950',
    // shadow & depth
    'shadow-0'
  ),
  raised: cn(
    // border
    'border border-neutral-800',
    // background
    'bg-neutral-950',
    // shadow & depth
    'shadow-2'
  ),
};

/**
 * Pemetaan kelas warna khusus untuk syntax highlighting bergaya resmi VS Code Dark+.
 * Menghasilkan kontras tinggi dan akurasi estetika di atas latar belakang gelap.
 */
export const syntaxTokenClasses = {
  comment: 'text-[#6A9955] italic font-mono',
  plainText: 'text-[#D4D4D4] font-medium font-mono',
  tag: 'text-[#569CD6] font-semibold font-mono',
  attribute: 'text-[#9CDCFE] font-mono',
  string: 'text-[#CE9178] font-mono',
  number: 'text-[#B5CEA8] font-semibold font-mono',
  punctuation: 'text-[#808080] font-mono',
  boolean: 'text-[#569CD6] font-mono',
};

/**
 * Class styling untuk baris nomor kode.
 */
export const lineNumberClasses = cn(
  // layout
  'shrink-0',
  // size
  'w-8',
  // spacing
  'pr-4',
  // typography
  'font-mono text-xs text-right',
  // text
  'text-neutral-600',
  // interaction
  'select-none'
);

/**
 * Class styling untuk elemen pre dan code.
 */
export const preClasses = cn(
  // layout
  'overflow-x-auto whitespace-pre',
  // typography
  'font-mono text-sm leading-relaxed'
);

/**
 * Class name generator untuk wadah blok kode.
 */
export const getContainerClasses = (
  variant: CodePreviewVariant = 'terminal',
  depth?: CodePreviewDepth,
  className: string = ''
): string =>
  cn(
    // layout
    'overflow-x-auto',
    // spacing
    'p-5 pt-4',
    // typography
    'font-mono text-sm leading-relaxed',
    // background & border variant
    variantClasses[variant] || variantClasses.terminal,
    // shadow & depth
    resolveDepthClass(depth),
    // interaction
    'select-all scrollbar-thin',
    className
  );
