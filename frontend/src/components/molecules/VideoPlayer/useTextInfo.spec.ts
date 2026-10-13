import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useTextInfo } from './useTextInfo';

describe('useTextInfo Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('harus mengembalikan state awal dan method showTextInfo saat diinisialisasi', () => {
    let hookResult!: ReturnType<typeof useTextInfo>;

    const TestComponent = () => {
      hookResult = useTextInfo();
      return null;
    };

    renderToString(createElement(TestComponent));

    expect(hookResult).toBeDefined();
    expect(typeof hookResult.showTextInfo).toBe('function');
    expect(hookResult.textInfo).toEqual({
      message: '',
      subMessage: '',
      visible: false,
    });
  });

  it('harus mengeksekusi showTextInfo dengan string tanpa error dan mengaktifkan timer', () => {
    let hookResult!: ReturnType<typeof useTextInfo>;

    const TestComponent = () => {
      hookResult = useTextInfo();
      return null;
    };

    renderToString(createElement(TestComponent));

    expect(() => {
      hookResult.showTextInfo('Memutar');
    }).not.toThrow();

    // Timer berjalan selama 2500ms
    expect(() => {
      vi.advanceTimersByTime(2500);
    }).not.toThrow();
  });

  it('harus mengeksekusi showTextInfo dengan objek message dan subMessage tanpa error', () => {
    let hookResult!: ReturnType<typeof useTextInfo>;

    const TestComponent = () => {
      hookResult = useTextInfo();
      return null;
    };

    renderToString(createElement(TestComponent));

    expect(() => {
      hookResult.showTextInfo({
        message: 'Volume:',
        subMessage: '80%',
      });
    }).not.toThrow();

    expect(() => {
      vi.advanceTimersByTime(2500);
    }).not.toThrow();
  });

  it('harus mereset timer sebelumnya saat showTextInfo dipanggil beruntun', () => {
    let hookResult!: ReturnType<typeof useTextInfo>;

    const TestComponent = () => {
      hookResult = useTextInfo();
      return null;
    };

    renderToString(createElement(TestComponent));

    // Panggilan pertama
    hookResult.showTextInfo('Langkah 1');
    vi.advanceTimersByTime(1000);

    // Panggilan kedua sebelum 2500ms habis
    hookResult.showTextInfo('Langkah 2');
    vi.advanceTimersByTime(1500);

    // Maju lagi 1000ms untuk menyelesaikan timer kedua (total 2500ms sejak panggilan kedua)
    vi.advanceTimersByTime(1000);
  });
});
