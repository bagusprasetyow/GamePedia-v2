import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { useDebounce } from './useDebounce';
import { useDebouncedCallback } from './useDebouncedCallback';
import type { UseDebouncedCallbackReturn } from './useDebounce.types';

describe('useDebounce & useDebouncedCallback hooks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('harus diekspor dengan benar melalui barrel hooks/debounce/index.ts', async () => {
    const debounceBarrel = await import('./index');
    expect(debounceBarrel.useDebounce).toBeDefined();
    expect(debounceBarrel.useDebouncedCallback).toBeDefined();
    expect(typeof debounceBarrel.useDebounce).toBe('function');
    expect(typeof debounceBarrel.useDebouncedCallback).toBe('function');
  });

  it('harus merender nilai awal secara synchronous pada initial render useDebounce', () => {
    let capturedValue = '';

    const TestComponent = ({ val }: { val: string }) => {
      const debounced = useDebounce(val, 200);
      capturedValue = debounced;
      return <div>{debounced}</div>;
    };

    renderToString(<TestComponent val="GamePedia" />);
    expect(capturedValue).toBe('GamePedia');
  });

  it('harus menyediakan objek handler dengan run, cancel, flush, dan pending pada useDebouncedCallback', () => {
    const fn = vi.fn();
    let handlerRef: UseDebouncedCallbackReturn<[string]> | null = null;

    const TestComponent = () => {
      const debounced = useDebouncedCallback((text: string) => {
        fn(text);
      }, 250);
      handlerRef = debounced;
      return null;
    };

    renderToString(<TestComponent />);

    expect(handlerRef).not.toBeNull();
    if (!handlerRef) {
      throw new Error('handlerRef tidak boleh bernilai null');
    }

    const handler = handlerRef as UseDebouncedCallbackReturn<[string]>;
    expect(typeof handler.run).toBe('function');
    expect(typeof handler.cancel).toBe('function');
    expect(typeof handler.flush).toBe('function');
    expect(typeof handler.pending).toBe('function');

    // Uji pemanggilan run
    handler.run('testing-1');
    expect(handler.pending()).toBe(true);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(250);
    expect(fn).toHaveBeenCalledWith('testing-1');
    expect(handler.pending()).toBe(false);
  });

  it('harus membatalkan eksekusi saat .cancel() dipanggil', () => {
    const fn = vi.fn();
    let handlerRef: UseDebouncedCallbackReturn<[string]> | null = null;

    const TestComponent = () => {
      handlerRef = useDebouncedCallback(fn, 200);
      return null;
    };

    renderToString(<TestComponent />);
    expect(handlerRef).not.toBeNull();
    const handler = handlerRef!;

    handler.run('pesan');
    expect(handler.pending()).toBe(true);

    handler.cancel();
    expect(handler.pending()).toBe(false);

    vi.advanceTimersByTime(250);
    expect(fn).not.toHaveBeenCalled();
  });

  it('harus segera mengeksekusi antrean saat .flush() dipanggil', () => {
    const fn = vi.fn();
    let handlerRef: UseDebouncedCallbackReturn<[string]> | null = null;

    const TestComponent = () => {
      handlerRef = useDebouncedCallback(fn, 300);
      return null;
    };

    renderToString(<TestComponent />);
    expect(handlerRef).not.toBeNull();
    const handler = handlerRef!;

    handler.run('segera');
    expect(fn).not.toHaveBeenCalled();
    expect(handler.pending()).toBe(true);

    handler.flush();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('segera');
    expect(handler.pending()).toBe(false);

    // Pastikan tidak dipanggil ulang saat timer asli habis
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('harus mendukung opsi leading: true pada useDebouncedCallback', () => {
    const fn = vi.fn();
    let handlerRef: UseDebouncedCallbackReturn<[string]> | null = null;

    const TestComponent = () => {
      handlerRef = useDebouncedCallback(fn, 200, { leading: true, trailing: false });
      return null;
    };

    renderToString(<TestComponent />);
    expect(handlerRef).not.toBeNull();
    const handler = handlerRef!;

    handler.run('leading-call');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('leading-call');

    // Panggilan selanjutnya dalam cooldown diabaikan jika trailing: false
    handler.run('ignored-call');
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('harus mengeksekusi closure callback terbaru tanpa kehilangan sinkronisasi', () => {
    let capturedHandler: UseDebouncedCallbackReturn<[string]> | null = null;
    let messagePrefix = 'versi-1';

    const TestComponent = () => {
      capturedHandler = useDebouncedCallback((val: string) => {
        receivedValue = `${messagePrefix}:${val}`;
      }, 200);
      return null;
    };

    let receivedValue = '';
    renderToString(<TestComponent />);
    expect(capturedHandler).not.toBeNull();

    // Mutasi prefix sebelum timer expire (merefleksikan closure baru)
    messagePrefix = 'versi-2';
    capturedHandler!.run('payload');

    vi.advanceTimersByTime(200);
    expect(receivedValue).toBe('versi-2:payload');
  });
});
