import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { TooltipProps } from './Tooltip.types';
import { useTooltip } from './useTooltip';
import { TooltipBubble } from './components/TooltipBubble';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Layout Wrapper & Sub-Components Integration
// ─────────────────────────────────────────────────────────────

/**
 * Tooltip Component - Atomic UI Element
 *
 * Komponen gelembung petunjuk interaktif dengan Depth System (skala -3 s/d 3),
 * arsitektur modular yang terdekomposisi (useTooltip & TooltipBubble), dan aksesibilitas lengkap.
 *
 * @param {TooltipProps} props - Properti konfigurasi komponen Tooltip
 * @returns {ReactElement} Elemen pembungkus interaktif dengan gelembung tooltip
 */
export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  variant = 'dark',
  size = 'md',
  depth = 3,
  trigger = 'hover',
  isOpen,
  defaultOpen = false,
  onOpenChange,
  delay = 150,
  showArrow = true,
  icon,
  iconSize,
  maxWidth = '250px',
  disabled = false,
  className = '',
  tooltipClassName = '',
  arrowClassName = '',
}: TooltipProps): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Custom Hook State & Event Handlers
  // ─────────────────────────────────────────────────────────────
  const {
    tooltipId,
    visible,
    containerRef,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    handleFocus,
    handleBlur,
  } = useTooltip({
    trigger,
    isOpen,
    defaultOpen,
    onOpenChange,
    delay,
    disabled,
  });

  const wrapperClasses = cn(
    // layout
    'inline-flex items-center',
    // position
    'relative',
    // size
    'max-w-fit',
    // custom overrides
    className
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean Declarative JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={wrapperClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-describedby={visible ? tooltipId : undefined}
    >
      {children}

      <TooltipBubble
        id={tooltipId}
        visible={visible}
        content={content}
        placement={placement}
        variant={variant}
        size={size}
        depth={depth}
        showArrow={showArrow}
        icon={icon}
        iconSize={iconSize}
        maxWidth={maxWidth}
        tooltipClassName={tooltipClassName}
        arrowClassName={arrowClassName}
      />
    </div>
  );
};

export default Tooltip;
