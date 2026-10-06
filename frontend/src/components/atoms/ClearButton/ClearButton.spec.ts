import { describe, expect, it } from 'vitest';
import {
  resolveDepthKey,
  depthClasses,
  defaultDepthByVariant,
  sizeClasses,
  defaultIconSizeMap,
  variantClasses,
  roundedClasses,
} from './ClearButton.styles';
import type {
  ClearButtonSize,
  ClearButtonVariant,
  ClearButtonRounded,
} from './ClearButton.types';

const allSizes: ClearButtonSize[] = ['2xs', 'xs', 'sm', 'md', 'lg'];
const allVariants: ClearButtonVariant[] = ['default', 'subtle', 'ghost', 'danger'];
const allRounded: ClearButtonRounded[] = ['none', 'sm', 'md', 'lg', 'full'];

describe('ClearButton.styles & helpers', () => {
  describe('resolveDepthKey', () => {
    it('harus memetakan skala numerik valid (-3 s/d 3) ke string key yang tepat', () => {
      [-3, -2, -1, 0, 1, 2, 3].forEach((d) => {
        expect(resolveDepthKey(d as never)).toBe(String(d));
      });
    });

    it('harus memetakan alias nama depth ke level numerik string', () => {
      expect(resolveDepthKey('sunken')).toBe('-2');
      expect(resolveDepthKey('flat')).toBe('0');
      expect(resolveDepthKey('raised-sm')).toBe('1');
      expect(resolveDepthKey('raised-md')).toBe('2');
      expect(resolveDepthKey('raised-lg')).toBe('3');
    });

    it('harus menggunakan default depth berdasarkan varian jika depth tidak diberikan', () => {
      allVariants.forEach((v) => {
        expect(resolveDepthKey(undefined, v)).toBe(String(defaultDepthByVariant[v]));
      });
    });

    it('harus fallback ke "0" untuk input tak dikenal', () => {
      expect(resolveDepthKey(undefined)).toBe('0');
      // @ts-expect-error - testing invalid runtime input
      expect(resolveDepthKey('unknown-depth')).toBe('0');
    });
  });

  describe('depthClasses', () => {
    it('harus memuat semua key -3 s/d 3', () => {
      ['-3', '-2', '-1', '0', '1', '2', '3'].forEach((k) => {
        expect(depthClasses[k]).toBeDefined();
      });
    });
  });

  describe('class maps', () => {
    it('harus memuat semua ukuran beserta pemetaan ikon bawaan', () => {
      allSizes.forEach((s) => {
        expect(sizeClasses[s]).toBeDefined();
        expect(defaultIconSizeMap[s]).toBeDefined();
      });
    });

    it('harus memuat semua varian warna', () => {
      allVariants.forEach((v) => {
        expect(variantClasses[v]).toBeDefined();
      });
    });

    it('harus memuat semua kelengkungan sudut rounded', () => {
      allRounded.forEach((r) => {
        expect(roundedClasses[r]).toBeDefined();
      });
    });
  });

  describe('barrel export', () => {
    it('harus mengekspor ClearButton, default, dan styles', async () => {
      const mod = await import('./index');
      expect(mod.ClearButton).toBeDefined();
      expect(mod.default).toBe(mod.ClearButton);
      expect(mod.resolveDepthKey).toBeDefined();
    });
  });
});
