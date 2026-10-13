import { useState, useRef, useEffect, useCallback } from 'react';
import type { VideoPlayerTextInfoState } from './VideoPlayer.types';

export interface ShowTextInfoInput {
  message?: string;
  subMessage?: string;
}

export interface UseTextInfoReturn {
  textInfo: VideoPlayerTextInfoState;
  showTextInfo: (input: string | ShowTextInfoInput) => void;
}

/**
 * useTextInfo Hook
 *
 * Mengelola status teks overlay HUD notifikasi interaktif (TextInfo) di sudut kiri atas video player,
 * seperti 'Memutar', 'Dijeda', 'Volume: 30%', 'Maju 5s [ 01:09 (56.5%) ]', dsb.
 */
export const useTextInfo = (): UseTextInfoReturn => {
  const [textInfo, setTextInfo] = useState<VideoPlayerTextInfoState>({
    message: '',
    subMessage: '',
    visible: false,
  });
  const textInfoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTextInfo = useCallback((input: string | ShowTextInfoInput) => {
    if (textInfoTimer.current) {
      clearTimeout(textInfoTimer.current);
    }

    if (typeof input === 'string') {
      setTextInfo({ message: input, subMessage: '', visible: true });
    } else if (typeof input === 'object' && input !== null) {
      const { message = '', subMessage = '' } = input;
      setTextInfo({ message, subMessage, visible: true });
    }

    textInfoTimer.current = setTimeout(() => {
      setTextInfo((s) => ({ ...s, visible: false }));
      textInfoTimer.current = null;
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (textInfoTimer.current) {
        clearTimeout(textInfoTimer.current);
      }
    };
  }, []);

  return { textInfo, showTextInfo };
};
