import type {
  FC,
  ReactElement,
  KeyboardEvent,
  WheelEvent,
} from "react";
import { cn } from "@/lib/utils";
import { Icon, Text } from "@/components/atoms";
import type { VideoPlayerVolumeProps } from "../VideoPlayer.types";

/**
 * VideoPlayerVolume Component - Sub-Molecule Internal VideoPlayer
 *
 * Pengatur volume suara taktil dengan tombol bisu (Mute) dan indikator teks
 * persentase volume di sebelah kanan ikon speaker, serta dukungan interaksi scroll wheel.
 */
export const VideoPlayerVolume: FC<VideoPlayerVolumeProps> = ({
  volume,
  isMuted,
  onChange,
  onToggleMute,
  isFullscreen = false,
}): ReactElement => {
  const effectiveVolume = isMuted ? 0 : volume;
  const volumePercent = Math.round(effectiveVolume * 100);
  const formattedPercent = `${volumePercent}%`;

  const icon =
    isMuted || volume === 0
      ? "lucide:volume-x"
      : volume < 0.5
        ? "lucide:volume-1"
        : "lucide:volume-2";

  const label = isMuted ? "Nyalakan Suara (M)" : "Matikan Suara (M)";

  const handleIconKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggleMute?.();
    }
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!onChange) return;
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    const nextVol = Math.max(0, Math.min(1, volume + delta));
    onChange(nextVol);
  };

  const iconClasses = cn(
    // layout
    "flex items-center justify-center",
    // size
    isFullscreen ? "w-6 h-6" : "w-4.5 h-4.5",
    // text & color
    "text-white/80 hover:text-white",
    // interaction
    "cursor-pointer select-none",
    // focus
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded-xs",
    // transition
    "transition-colors duration-150"
  );

  const volumeBarClasses = cn(
    // layout
    "flex items-center justify-center gap-1.5 select-none shrink-0",
    // size
    isFullscreen ? "w-21" : "w-17.5",
    // spacing
    "px-2 py-1",
    // border
    "rounded-full",
    // background
    "bg-black/60 backdrop-blur-sm",
    // transition
    "transition-colors duration-150"
  );

  const percentTextClasses = cn(
    // layout
    "shrink-0 select-none text-right",
    // size
    isFullscreen ? "w-8 text-xs" : "w-7 text-[11px]",
    // typography
    "font-poppins tabular-nums leading-none",
    // text
    "text-white/80"
  );

  return (
    <div
      className={volumeBarClasses}
      onWheel={handleWheel}
    >
      {/* 1. Ikon Tombol Mute / Unmute */}
      <Icon
        icon={icon}
        size={isFullscreen ? "sm" : "xs"}
        aria-label={label}
        role="button"
        tabIndex={0}
        onClick={onToggleMute}
        onKeyDown={handleIconKeyDown}
        className={iconClasses}
      />

      {/* 2. Teks Persentase Volume di Sebelah Kanan Ikon Speaker */}
      <Text
        as="span"
        size={isFullscreen ? "sm" : "xs"}
        weight="medium"
        variant="white"
        align="right"
        className={percentTextClasses}
        aria-label={`Volume ${volumePercent}%`}
      >
        {formattedPercent}
      </Text>
    </div>
  );
};
