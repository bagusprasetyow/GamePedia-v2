import { describe, expect, it } from 'vitest';
import { calculatePasswordStrength } from './passwordStrength.utils';

describe('calculatePasswordStrength', () => {
  it('harus mengembalikan skor 0 dan Sangat Lemah untuk password kosong', () => {
    const result = calculatePasswordStrength('');
    expect(result.score).toBe(0);
    expect(result.level).toBe('weak');
    expect(result.label).toBe('Sangat Lemah');
    expect(result.percent).toBe(0);
  });

  it('harus mengembalikan skor 1 dan Lemah untuk password hanya huruf kecil', () => {
    const result = calculatePasswordStrength('short');
    expect(result.score).toBe(0);
    expect(result.level).toBe('weak');

    const result8Len = calculatePasswordStrength('password');
    expect(result8Len.score).toBe(1);
    expect(result8Len.level).toBe('weak');
    expect(result8Len.label).toBe('Lemah');
    expect(result8Len.percent).toBe(25);
  });

  it('harus mengembalikan skor 2 dan Sedang untuk password dengan panjang dan angka', () => {
    const result = calculatePasswordStrength('password123');
    expect(result.score).toBe(2);
    expect(result.level).toBe('fair');
    expect(result.label).toBe('Sedang');
    expect(result.percent).toBe(50);
  });

  it('harus mengembalikan skor 3 dan Kuat untuk password dengan huruf besar, kecil, dan angka', () => {
    const result = calculatePasswordStrength('Password123');
    expect(result.score).toBe(3);
    expect(result.level).toBe('good');
    expect(result.label).toBe('Kuat');
    expect(result.percent).toBe(75);
  });

  it('harus mengembalikan skor 4 dan Sangat Kuat untuk password lengkap dengan simbol', () => {
    const result = calculatePasswordStrength('P@ssword123!');
    expect(result.score).toBe(4);
    expect(result.level).toBe('very-strong');
    expect(result.label).toBe('Sangat Kuat');
    expect(result.percent).toBe(100);
  });
});
