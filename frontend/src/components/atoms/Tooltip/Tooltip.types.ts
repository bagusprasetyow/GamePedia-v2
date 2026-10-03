import type { ReactNode } from 'react';
import type { IconSize } from '../Icon/Icon.types';
import type { DepthNumeric, DepthString, DepthNamed } from '../Button/Button.types';

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export type TooltipVariant =
  | 'dark'
  | 'light'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'contrast'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type TooltipSize = 'xs' | 'sm' | 'md' | 'lg';

export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

export type TooltipDepth = DepthNumeric | DepthString | DepthNamed;

export interface TooltipProps {
  /**
   * Konten pesan atau elemen yang ditampilkan di dalam tooltip.
   */
  content: ReactNode;

  /**
   * Elemen target pemicu (trigger) yang dibungkus oleh tooltip.
   */
  children: ReactNode;

  /**
   * Posisi kemunculan gelembung tooltip relatif terhadap pemicu.
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * Varian warna semantik tema tooltip.
   * @default 'dark'
   */
  variant?: TooltipVariant;

  /**
   * Skala ukuran tooltip (padding & font size).
   * @default 'md'
   */
  size?: TooltipSize;

  /**
   * Tingkat kedalaman visual gelembung (Depth System: -3 s/d 3).
   * - -3 s/d -1: Cekung (Sunken)
   * -  0: Rata (Flat)
   * -  1 s/d  3: Timbul (Raised / Elevated)
   * @default 3
   */
  depth?: TooltipDepth;

  /**
   * Mode pemicu untuk membuka tooltip.
   * - 'hover': Terbuka saat mengarahkan kursor mouse
   * - 'click': Terbuka saat mengeklik pemicu
   * - 'focus': Terbuka saat pemicu menerima fokus keyboard/input
   * - 'manual': Dikontrol penuh melalui prop `isOpen`
   * @default 'hover'
   */
  trigger?: TooltipTrigger;

  /**
   * Status terbuka tooltip dalam mode terdeteksi (controlled mode).
   */
  isOpen?: boolean;

  /**
   * Status terbuka default awal (uncontrolled mode).
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback reaktif ketika status terbuka tooltip berubah.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Waktu jeda (delay) dalam milidetik sebelum tooltip muncul pada mode hover.
   * @default 150
   */
  delay?: number;

  /**
   * Menampilkan panah penunjuk (arrow) pada gelembung tooltip.
   * @default true
   */
  showArrow?: boolean;

  /**
   * Ikon pendamping di dalam tooltip (bisa berupa nama Iconify string atau ReactNode).
   */
  icon?: ReactNode;

  /**
   * Ukuran kustom ikon di dalam tooltip.
   */
  iconSize?: IconSize | number | string;

  /**
   * Lebar maksimum wadah gelembung tooltip.
   * @default '250px'
   */
  maxWidth?: string | number;

  /**
   * Menonaktifkan tooltip (tooltip tidak akan terbuka).
   * @default false
   */
  disabled?: boolean;

  /**
   * ClassName kustom opsional untuk wadah pemicu outer.
   */
  className?: string;

  /**
   * ClassName kustom opsional untuk gelembung tooltip.
   */
  tooltipClassName?: string;

  /**
   * ClassName kustom opsional untuk panah penunjuk (arrow).
   */
  arrowClassName?: string;
}
