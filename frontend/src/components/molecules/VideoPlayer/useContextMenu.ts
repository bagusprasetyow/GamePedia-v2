import { useEffect, useState, useCallback, type RefObject } from 'react';

export interface UseContextMenuReturn {
  visible: boolean;
  coords: { x: number; y: number };
  show: (clientX: number, clientY: number) => void;
  hide: () => void;
}

/**
 * Hook `useContextMenu` untuk menangani menu klik kanan kustom pada VideoPlayer.
 *
 * Mencegah context menu bawaan peramban di area kontainer pemutar video,
 * menangkap koordinat kursor mouse, dan menutup menu secara otomatis saat
 * pengguna mengklik di luar area, menekan tombol Escape, atau menggulir layar.
 *
 * @param {RefObject<HTMLDivElement | null>} containerRef - Ref kontainer utama VideoPlayer
 * @param {boolean} [enabled=true] - Status apakah context menu kustom aktif
 * @returns {UseContextMenuReturn} State dan pengendali visibilitas context menu
 */
export const useContextMenu = (
  containerRef: RefObject<HTMLDivElement | null>,
  enabled: boolean = true
): UseContextMenuReturn => {
  const [visible, setVisible] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const show = useCallback((clientX: number, clientY: number) => {
    setCoords({ x: clientX, y: clientY });
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (container.contains(e.target as Node)) {
        e.preventDefault();
        show(e.clientX, e.clientY);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Jika context menu terbuka dan pengguna menekan di luar menu
      const target = e.target as HTMLElement | null;
      if (target?.closest('[role="menu"]')) {
        return;
      }
      hide();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hide();
      }
    };

    const handleScroll = () => {
      hide();
    };

    const handleBlur = () => {
      hide();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('blur', handleBlur);
    };
  }, [containerRef, enabled, hide, show]);

  return { visible, coords, show, hide };
};
