import {
  useState,
  useEffect,
  useRef,
  useId,
  useCallback,
  type MouseEvent as ReactMouseEvent,
  type FocusEvent as ReactFocusEvent,
  type RefObject,
} from 'react';
import type { TooltipTrigger } from './Tooltip.types';

export interface UseTooltipParams {
  trigger?: TooltipTrigger;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
  disabled?: boolean;
}

export interface UseTooltipReturn {
  tooltipId: string;
  visible: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleClick: (e: ReactMouseEvent) => void;
  handleFocus: (e: ReactFocusEvent) => void;
  handleBlur: (e: ReactFocusEvent) => void;
}

export const useTooltip = ({
  trigger = 'hover',
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  delay = 150,
  disabled = false,
}: UseTooltipParams): UseTooltipReturn => {
  const tooltipId = useId();
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isControlled = controlledIsOpen !== undefined;
  const visible = disabled ? false : isControlled ? controlledIsOpen : internalOpen;

  const setVisibleState = useCallback(
    (nextOpen: boolean) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [disabled, isControlled, onOpenChange]
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (trigger !== 'hover' || disabled) return;
    clearTimer();
    if (delay > 0) {
      timerRef.current = setTimeout(() => {
        setVisibleState(true);
      }, delay);
    } else {
      setVisibleState(true);
    }
  }, [trigger, disabled, clearTimer, delay, setVisibleState]);

  const handleMouseLeave = useCallback(() => {
    if (trigger !== 'hover' || disabled) return;
    clearTimer();
    setVisibleState(false);
  }, [trigger, disabled, clearTimer, setVisibleState]);

  const handleClick = useCallback(
    (e: ReactMouseEvent) => {
      if (trigger !== 'click' || disabled) return;
      e.stopPropagation();
      setVisibleState(!visible);
    },
    [trigger, disabled, visible, setVisibleState]
  );

  const handleFocus = useCallback(
    (e: ReactFocusEvent) => {
      if (trigger !== 'focus' || disabled) return;
      e.stopPropagation();
      setVisibleState(true);
    },
    [trigger, disabled, setVisibleState]
  );

  const handleBlur = useCallback(
    (e: ReactFocusEvent) => {
      if (trigger !== 'focus' || disabled) return;
      e.stopPropagation();
      setVisibleState(false);
    },
    [trigger, disabled, setVisibleState]
  );

  // Close on Outside Click (Click mode)
  useEffect(() => {
    if (trigger !== 'click' || !visible) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setVisibleState(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [trigger, visible, setVisibleState]);

  // Close on Escape key
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setVisibleState(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, setVisibleState]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    tooltipId,
    visible,
    containerRef,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    handleFocus,
    handleBlur,
  };
};
