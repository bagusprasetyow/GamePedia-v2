import { cn } from '@/lib/utils';
import type { ButtonDepth } from '@/components/atoms/Button/Button.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Depth System Skala -3 s/d 3 & Terminal Theme Maps (OKLCH)
// ─────────────────────────────────────────────────────────────

/**
 * Pemetaan Depth System skala -3 s/d 3 untuk kontainer SourceCode.
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
 * Memetakan nilai depth (numerik, string, atau named alias) ke string key depthClasses yang valid.
 */
export const resolveDepthKey = (depth?: ButtonDepth | number | string): string => {
  if (depth === undefined || depth === null) return '2';
  const key = String(depth);
  if (key in namedDepthMap) return namedDepthMap[key];
  if (key in depthClasses) return key;
  return '2';
};

/**
 * Menyelesaikan class shadow kedalaman berdasarkan input prop depth.
 */
export const resolveDepthClass = (depth?: ButtonDepth | number | string): string => {
  const key = resolveDepthKey(depth);
  return depthClasses[key] || depthClasses['2'];
};

/**
 * Class name generator untuk wadah terluar kartu SourceCode terminal.
 */
export const getContainerClasses = (depth?: ButtonDepth, className: string = ''): string =>
  cn(
    // layout
    'overflow-hidden',
    // border
    'rounded-2xl border border-neutral-800',
    // background
    'bg-neutral-950',
    // shadow & depth
    resolveDepthClass(depth),
    // transition
    'transition-all duration-200',
    className
  );

/**
 * Class styling untuk baris header terminal.
 */
export const headerClasses = cn(
  // layout
  'flex items-center justify-between',
  // spacing
  'px-4 py-2.5',
  // border
  'border-b border-neutral-800/80',
  // background
  'bg-neutral-900/90'
);

/**
 * Class styling untuk daftar tab.
 */
export const tabListClasses = cn(
  // layout
  'flex items-center gap-2'
);

/**
 * Class generator untuk tombol tab bahasa (active vs inactive).
 */
export const getTabButtonClasses = (isActive: boolean): string =>
  cn(
    // size
    'h-7',
    // spacing
    'px-3.5 py-1',
    // typography
    'text-xs font-semibold',
    // border
    'rounded-lg',
    // interaction
    'cursor-pointer select-none',
    // transition
    'transition-all duration-150',
    isActive
      ? cn(
          // border
          'border border-primary-500/40',
          // background
          'bg-primary-950/60 active:bg-primary-900/80',
          // text
          'text-primary-300 active:text-primary-200',
          // shadow & depth
          'shadow-xs'
        )
      : cn(
          // border
          'border border-transparent',
          // background
          'bg-transparent hover:bg-neutral-800/60 active:bg-neutral-800',
          // text
          'text-neutral-400 hover:text-neutral-200 active:text-neutral-200'
        )
  );

/**
 * Class styling untuk tombol salin kode di sudut kanan header.
 */
export const copyButtonClasses = cn(
  // layout
  'group',
  // size
  'h-7',
  // spacing
  'px-3 py-1',
  // typography
  'text-xs font-medium',
  // border
  'rounded-lg border border-neutral-700/80 active:border-success',
  // background
  'bg-neutral-850 hover:bg-neutral-800 active:bg-success',
  // text
  'text-neutral-200 active:text-white',
  // interaction
  'cursor-pointer select-none',
  // transition
  'transition-all'
);

/**
 * Class styling untuk wadah blok kode monospace.
 */
export const codeContainerClasses = cn(
  // layout
  'overflow-x-auto',
  // spacing
  'p-5 pt-4',
  // typography
  'font-mono text-sm leading-relaxed',
  // background
  'bg-neutral-950',
  // interaction
  'select-all scrollbar-thin'
);

/**
 * Pemetaan warna kelas token khusus untuk syntax highlighting bergaya Modern IDE (VS Code Dark+).
 * Memastikan warna token tetap kontras, cerah, dan konsisten di atas latar belakang terminal gelap (bg-neutral-950),
 * tanpa terpengaruh perubahan mode tema global (light/dark).
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
