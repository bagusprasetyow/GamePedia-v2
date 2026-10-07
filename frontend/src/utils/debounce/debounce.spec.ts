import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('harus menunda pemanggilan fungsi hingga delay tercapai', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced('halo');
    expect(fn).not.toHaveBeenCalled();
    expect(debounced.pending()).toBe(true);

    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('halo');
    expect(debounced.pending()).toBe(false);
  });

  it('harus hanya mengeksekusi pemanggilan terakhir saat dipanggil beruntun (trailing default)', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('panggilan 1');
    vi.advanceTimersByTime(100);
    debounced('panggilan 2');
    vi.advanceTimersByTime(100);
    debounced('panggilan 3');

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('panggilan 3');
  });

  it('harus membatalkan eksekusi jika .cancel() dipanggil', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced('test');
    expect(debounced.pending()).toBe(true);

    debounced.cancel();
    expect(debounced.pending()).toBe(false);

    vi.advanceTimersByTime(300);
    expect(fn).not.toHaveBeenCalled();
  });

  it('harus segera mengeksekusi antrean jika .flush() dipanggil', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('segera');
    expect(fn).not.toHaveBeenCalled();
    expect(debounced.pending()).toBe(true);

    debounced.flush();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('segera');
    expect(debounced.pending()).toBe(false);

    // Pastikan tidak dipanggil dua kali saat timer normal berakhir
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('harus mendukung opsi leading: true untuk pemanggilan langsung di awal', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200, { leading: true, trailing: false });

    debounced('pertama');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('pertama');

    // Panggilan selanjutnya dalam masa jeda diabaikan jika trailing: false
    debounced('kedua');
    vi.advanceTimersByTime(100);
    debounced('ketiga');
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);

    // Setelah jeda selesai, pemanggilan berikutnya kembali menjadi leading
    debounced('keempat');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('keempat');
  });

  it('harus mendukung kombinasi leading: true dan trailing: true', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200, { leading: true, trailing: true });

    debounced('awal');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('awal');

    debounced('tengah');
    debounced('akhir');

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('akhir');
  });

  it('harus mengeksekusi fungsi jika batas maxWait terlampaui', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100, { maxWait: 250 });

    debounced('call 1');
    vi.advanceTimersByTime(80);
    debounced('call 2');
    vi.advanceTimersByTime(80);
    debounced('call 3');
    vi.advanceTimersByTime(80);
    debounced('call 4'); // total waktu berlalu = 240ms

    expect(fn).not.toHaveBeenCalled();

    // Memasuki 250ms (maxWait terlampaui)
    vi.advanceTimersByTime(10);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('call 4');
  });

  it('harus menangani delay 0 atau nilai negatif dengan aman', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, -50);

    debounced('aman');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledWith('aman');
  });

  it('harus meneruskan parameter jamak (multiple arguments) secara tepat', () => {
    const fn = vi.fn();
    const debounced = debounce((a: string, b: number, c: boolean) => {
      fn(a, b, c);
    }, 150);

    debounced('game', 42, true);
    vi.advanceTimersByTime(150);

    expect(fn).toHaveBeenCalledWith('game', 42, true);
  });
});
