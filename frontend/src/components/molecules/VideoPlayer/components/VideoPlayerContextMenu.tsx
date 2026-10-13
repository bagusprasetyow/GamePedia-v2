import {
  useRef,
  useState,
  useLayoutEffect,
  type FC,
  type ReactElement,
} from 'react';
import { cn } from '@/lib/utils';
import { Icon, Text } from '@/components/atoms';
import type {
  VideoPlayerContextMenuProps,
  VideoPlayerContextMenuGroup,
} from '../VideoPlayer.types';

/**
 * Helper untuk menyusun grup menu klik kanan berdasarkan kondisi status pemutar video saat ini.
 */
const buildContextMenuGroups = ({
  isFullscreen = false,
  isPlaying = false,
  isMuted = false,
  isLoop = false,
}: Partial<VideoPlayerContextMenuProps>): VideoPlayerContextMenuGroup[] => [
  {
    title: 'Pemutaran',
    items: [
      {
        id: 'play',
        label: isPlaying ? 'Jeda Video' : 'Putar Video',
        shortcut: 'Space',
        icon: isPlaying ? 'lucide:pause' : 'lucide:play',
      },
      {
        id: 'mute',
        label: isMuted ? 'Bunyikan Suara' : 'Bisukan Suara',
        shortcut: 'M',
        icon: isMuted ? 'lucide:volume-x' : 'lucide:volume-2',
      },
      {
        id: 'loop',
        label: isLoop ? 'Nonaktifkan Pengulangan' : 'Putar Berulang',
        shortcut: 'L',
        icon: 'lucide:repeat',
      },
    ],
  },
  {
    title: 'Pengaturan',
    items: [
      {
        id: 'speed',
        label: 'Kecepatan Pemutaran',
        shortcut: 'Ctrl + P',
        icon: 'lucide:gauge',
      },
      {
        id: 'subtitles',
        label: 'Pengaturan Subtitle',
        shortcut: 'Ctrl + C',
        icon: 'lucide:subtitles',
      },
      {
        id: 'quality',
        label: 'Kualitas Resolusi',
        shortcut: 'Ctrl + Q',
        icon: 'lucide:sliders-horizontal',
      },
    ],
  },
  {
    title: 'Tampilan',
    items: [
      {
        id: 'fullscreen',
        label: isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh',
        shortcut: 'F / Enter',
        icon: isFullscreen ? 'lucide:minimize' : 'lucide:maximize',
      },
      {
        id: 'captions',
        label: 'Subtitle (Toggle)',
        shortcut: 'C',
        icon: 'lucide:subtitles',
      },
    ],
  },
];

const getInitialCoords = (
  mouseX: number,
  mouseY: number,
  isFullscreen: boolean
): { left: number; top: number } => {
  const padding = 8;
  const approxWidth = isFullscreen ? 384 : 300;
  const approxHeight = 300;

  if (typeof window === 'undefined') {
    return { left: mouseX + padding, top: mouseY + padding };
  }

  let left = mouseX + padding;
  let top = mouseY + padding;

  if (mouseX + approxWidth + padding > window.innerWidth) {
    left = mouseX - approxWidth - padding;
  }
  if (mouseY + approxHeight + padding > window.innerHeight) {
    top = mouseY - approxHeight - padding;
  }

  return {
    left: Math.max(padding, left),
    top: Math.max(padding, top),
  };
};

/**
 * VideoPlayerContextMenu Component - Sub-Molecule Internal VideoPlayer
 *
 * Menu klik kanan kustom (Custom Context Menu) terintegrasi dengan estetika
 * dark glassmorphism modern yang selaras dengan menu Pengaturan (Settings),
 * visual shortcut cap keyboard taktil, serta penyesuaian posisi otomatis (auto-clamping).
 */
export const VideoPlayerContextMenu: FC<VideoPlayerContextMenuProps> = ({
  visible,
  x,
  y,
  isFullscreen = false,
  isPlaying = false,
  isMuted = false,
  isLoop = false,
  onAction,
  onClose,
}): ReactElement | null => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ left: number; top: number }>(() =>
    getInitialCoords(x, y, isFullscreen)
  );

  const groups = buildContextMenuGroups({
    isFullscreen,
    isPlaying,
    isMuted,
    isLoop,
  });

  useLayoutEffect(() => {
    if (!visible) return;

    if (!menuRef.current) {
      setCoords(getInitialCoords(x, y, isFullscreen));
      return;
    }

    const menu = menuRef.current;
    const { offsetWidth, offsetHeight } = menu;
    const padding = 8;

    let newLeft = x + padding;
    let newTop = y + padding;

    if (x + offsetWidth + padding > window.innerWidth) {
      newLeft = x - offsetWidth - padding;
    }

    if (y + offsetHeight + padding > window.innerHeight) {
      newTop = y - offsetHeight - padding;
    }

    setCoords({
      left: Math.max(padding, newLeft),
      top: Math.max(padding, newTop),
    });
  }, [visible, x, y, isFullscreen]);

  if (!visible) return null;

  const menuWidthClass = isFullscreen ? 'w-96' : 'w-74';

  const menuClasses = cn(
    // layout
    'flex flex-col select-none overflow-hidden font-poppins',
    // position
    'fixed z-100',
    // size
    menuWidthClass,
    // spacing
    isFullscreen ? 'p-1.5' : 'p-1',
    // border
    'rounded-xl border border-white/15',
    // background (selaras dengan panel settings)
    'bg-black/55 backdrop-blur-xl',
    // text
    'text-white',
    // shadow & depth
    'shadow-1',
    // transition
    'transition-opacity duration-100 animate-in fade-in'
  );

  const groupContainerClasses = (hasTopBorder: boolean) =>
    cn(
      // layout
      'flex flex-col',
      // spacing
      'py-0.5',
      // border
      hasTopBorder && 'border-t border-white/10'
    );

  const groupTitleClasses = cn(
    // spacing
    isFullscreen ? 'px-3 py-1.5' : 'px-2.5 py-1',
    // typography
    isFullscreen ? 'text-[11px]' : 'text-[10px]',
    'font-semibold uppercase tracking-wider font-poppins',
    // text
    'text-white/45'
  );

  const itemButtonClasses = cn(
    // layout
    'w-full flex items-center justify-between text-left select-none',
    // spacing
    isFullscreen ? 'px-3.5 py-2.5' : 'px-2.5 py-1.5',
    // border
    'rounded-lg',
    // background & text
    'bg-transparent text-white',
    // interaction
    'cursor-pointer hover:bg-white/10 active:bg-white/15',
    // focus
    'outline-none',
    // transition
    'transition-colors duration-150'
  );

  const shortcutBadgeClasses = (isSpace: boolean) =>
    cn(
      // layout
      'inline-flex items-center justify-center select-none',
      // size
      isFullscreen ? 'h-5.5' : 'h-4.5',
      isSpace ? (isFullscreen ? 'min-w-12' : 'min-w-10') : (isFullscreen ? 'min-w-6' : 'min-w-5'),
      // spacing
      'px-1.5',
      // typography
      'font-mono leading-none',
      isFullscreen ? 'text-[11px]' : 'text-[9.5px]',
      // border
      'rounded border border-white/20',
      // background
      'bg-white/10',
      // text
      'text-white/80',
      // shadow & depth
      'shadow-2xs'
    );

  const shortcutSeparatorClasses = cn(
    // spacing
    'px-0.5',
    // typography
    isFullscreen ? 'text-xs' : 'text-[10px]',
    // text
    'text-white/40'
  );

  return (
    <div
      ref={menuRef}
      style={{ left: coords.left, top: coords.top }}
      className={menuClasses}
      role="menu"
      aria-label="Menu Tindakan Video"
    >
      {groups.map((group, groupIdx) => (
        <div
          key={group.title}
          className={groupContainerClasses(groupIdx > 0)}
        >
          {/* Judul Grup Kategori */}
          <Text as="div" className={groupTitleClasses}>
            {group.title}
          </Text>

          {/* Daftar Tindakan Menu */}
          {group.items.map((item) => {
            const shortcutParts = item.shortcut
              ? item.shortcut.split(' ').map((part, i) => {
                  if (part === '+' || part === '/') {
                    return (
                      <Text as="span" key={i} className={shortcutSeparatorClasses}>
                        {part}
                      </Text>
                    );
                  }
                  const isSpace = part.toLowerCase() === 'space';
                  return (
                    <Text
                      as="span"
                      key={i}
                      className={shortcutBadgeClasses(isSpace)}
                    >
                      {part}
                    </Text>
                  );
                })
              : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onAction?.(item.id, item);
                  onClose?.();
                }}
                className={itemButtonClasses}
                role="menuitem"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.icon && (
                    <Icon
                      icon={item.icon}
                      size={isFullscreen ? 'sm' : 'xs'}
                      className="text-white shrink-0"
                    />
                  )}
                  <Text
                    as="span"
                    weight="medium"
                    size={isFullscreen ? 'sm' : 'xs'}
                    className="text-white truncate font-poppins"
                  >
                    {item.label}
                  </Text>
                </div>

                {shortcutParts && (
                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    {shortcutParts}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
