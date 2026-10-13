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
  closeOnClick?: boolean;
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
  closeOnClick = true,
}: UseTooltipParams): UseTooltipReturn => {
  const tooltipId = useId();
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isControlled = controlledIsOpen !== undefined;
  const visible = disabled ? false : isControlled ? controlledIsOpen : internalOpen;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setVisibleState = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) return;
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [disabled, isControlled, onOpenChange]
  );

  // Bersihkan timer saat disabled berubah, atau pulihkan tooltip saat di-enable kembali
  // jika kursor mouse masih berada di atas elemen (hover).
  useEffect(() => {
    if (disabled) {
      clearTimer();
      return;
    }

    if (trigger === 'hover' && containerRef.current) {
      try {
        if (containerRef.current.matches(':hover')) {
          clearTimer();
          const timer = setTimeout(() => {
            setVisibleState(true);
          }, Math.max(delay, 10));
          timerRef.current = timer;
        }
      } catch {
        // Lingkungan uji aman jika matches tidak tersedia
      }
    }
  }, [disabled, trigger, delay, clearTimer, setVisibleState]);

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
    if (trigger !== 'hover') return;
    clearTimer();
    setVisibleState(false);
  }, [trigger, clearTimer, setVisibleState]);

  const handleClick = useCallback(
    (e: ReactMouseEvent) => {
      if (disabled) return;
      if (trigger === 'click') {
        e.stopPropagation();
        setVisibleState(!visible);
      } else if (trigger === 'hover') {
        if (closeOnClick) {
          clearTimer();
          setVisibleState(false);
        } else {
          clearTimer();
          setVisibleState(true);
        }
      }
    },
    [trigger, disabled, visible, setVisibleState, clearTimer, closeOnClick]
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
