import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useVideoClickHandler } from './useVideoClickHandler';

describe('useVideoClickHandler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('harus memanggil onSingleClick setelah jeda delay berakhir saat diklik sekali', () => {
    const onSingleClick = vi.fn();
    const onDoubleClick = vi.fn();
    let handler!: ReturnType<typeof useVideoClickHandler>;

    const TestComponent = () => {
      handler = useVideoClickHandler({
        onSingleClick,
        onDoubleClick,
        delay: 250,
      });
      return null;
    };

    renderToString(createElement(TestComponent));

    handler.handleClick();
    expect(onSingleClick).not.toHaveBeenCalled();

    vi.advanceTimersByTime(249);
    expect(onSingleClick).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onSingleClick).toHaveBeenCalledTimes(1);
    expect(onDoubleClick).not.toHaveBeenCalled();
  });

  it('harus membatalkan onSingleClick dan memanggil onDoubleClick saat terjadi klik ganda', () => {
    const onSingleClick = vi.fn();
    const onDoubleClick = vi.fn();
    let handler!: ReturnType<typeof useVideoClickHandler>;

    const TestComponent = () => {
      handler = useVideoClickHandler({
        onSingleClick,
        onDoubleClick,
        delay: 250,
      });
      return null;
    };

    renderToString(createElement(TestComponent));

    // Klik pertama
    handler.handleClick();
    expect(onSingleClick).not.toHaveBeenCalled();

    // Klik kedua melalui handleDoubleClick sebelum delay 250ms selesai
    vi.advanceTimersByTime(100);
    handler.handleDoubleClick();

    // Majukan waktu melewati delay awal
    vi.advanceTimersByTime(300);

    expect(onDoubleClick).toHaveBeenCalledTimes(1);
    expect(onSingleClick).not.toHaveBeenCalled();
  });

  it('harus membatalkan timer klik pertama jika browser mengirim handleClick dengan detail > 1', () => {
    const onSingleClick = vi.fn();
    const onDoubleClick = vi.fn();
    let handler!: ReturnType<typeof useVideoClickHandler>;

    const TestComponent = () => {
      handler = useVideoClickHandler({
        onSingleClick,
        onDoubleClick,
        delay: 250,
      });
      return null;
    };

    renderToString(createElement(TestComponent));

    // Klik pertama (detail = 1)
    // @ts-expect-error Mocking mouse event
    handler.handleClick({ detail: 1 });
    expect(onSingleClick).not.toHaveBeenCalled();

    // Klik kedua dari urutan double-click browser (detail = 2)
    // @ts-expect-error Mocking mouse event
    handler.handleClick({ detail: 2 });

    // Panggil double click
    handler.handleDoubleClick();

    vi.advanceTimersByTime(500);

    expect(onDoubleClick).toHaveBeenCalledTimes(1);
    expect(onSingleClick).not.toHaveBeenCalled();
  });
});
