import { useState, useRef, useEffect, type FC, type ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Button, Dot, Text, Tooltip } from '@/components/atoms';
import { videoPlayerTooltipClasses } from '../VideoPlayer.styles';
import type { VideoPlayerPlaybackRateProps } from '../VideoPlayer.types';

/**
 * VideoPlayerPlaybackRate Component - Sub-Molecule Internal VideoPlayer
 *
 * Pengatur laju kecepatan pemutaran video (0.5x s/d 2x) dengan popover opsi dan gelembung Tooltip.
 */
export const VideoPlayerPlaybackRate: FC<VideoPlayerPlaybackRateProps> = ({
  playbackRate,
  rates,
  onChange,
}): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const triggerButtonClasses = cn(
    // size
    'h-8 px-2',
    // typography
    'font-poppins tabular-nums text-xs',
    // text
    'text-white',
    // interaction
    'hover:text-white hover:bg-white/10'
  );

  const popoverClasses = cn(
    // layout
    'flex flex-col gap-1',
    // position
    'absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30',
    // size
    'min-w-17.5',
    // spacing
    'p-1.5',
    // border
    'rounded-xl border border-white/10',
    // background
    'bg-black/90 backdrop-blur-md',
    // shadow & depth
    'shadow-3'
  );

  const getRadioOuterClasses = (isSelected: boolean) =>
    cn(
      // layout
      'relative inline-flex shrink-0 items-center justify-center',
      // size
      'h-3.5 w-3.5',
      // border
      'rounded-full border',
      isSelected
        ? 'border-white'
        : 'border-white/40 group-hover:border-white/70',
      // background
      'bg-transparent',
      // transition
      'transition-all duration-150'
    );

  return (
    <div ref={menuRef} className="relative">
      <Tooltip
        content="Kecepatan Pemutaran"
        placement="top"
        size="xs"
        showArrow={false}
        disabled={isOpen}
        closeOnClick={false}
        tooltipClassName={videoPlayerTooltipClasses()}
      >
        <Button
          variant="ghost"
          size="xs"
          rounded="md"
          onClick={toggleOpen}
          aria-label="Kecepatan Pemutaran"
          className={triggerButtonClasses}
        >
          <Text as="span" size="xs" weight="medium" className="text-white">
            {playbackRate}x
          </Text>
        </Button>
      </Tooltip>

      {/* Popover Opsi Kecepatan */}
      {isOpen && (
        <div className={popoverClasses}>
          {rates.map((rate) => {
            const isSelected = rate === playbackRate;

            const rateOptionClasses = cn(
              // layout
              'group w-full flex items-center justify-between select-none',
              // size
              'h-7 px-2',
              // typography
              'text-xs font-poppins tabular-nums',
              // typography weight & text
              isSelected
                ? 'font-medium !bg-white/10 !text-white'
                : '!bg-transparent !text-white/80 hover:!text-white hover:!bg-white/10'
            );

            return (
              <Button
                key={rate}
                size="xs"
                variant="ghost"
                onClick={() => {
                  onChange(rate);
                  setIsOpen(false);
                }}
                className={rateOptionClasses}
              >
                <Text
                  as="span"
                  size="xs"
                  variant="white"
                  weight={isSelected ? 'medium' : 'normal'}
                  className={isSelected ? 'text-white' : 'text-white/80'}
                >
                  {rate}x
                </Text>
                <span className={getRadioOuterClasses(isSelected)}>
                  {isSelected && <Dot size="2xs" variant="white" aria-hidden="true" />}
                </span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};
