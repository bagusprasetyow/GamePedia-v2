import { describe, expect, it } from 'vitest';
import {
  resolveDepthKey,
  depthClasses,
  sizeClasses,
  removableSizeClasses,
  sizeIconMap,
  sizeTextMap,
  removeButtonClasses,
  removeIconSizeMap,
  roundedClasses,
  weightClasses,
  selectedClasses,
  clickableClasses,
} from './Chip.styles';
import type { ChipSize, ChipRounded, ChipWeight } from './Chip.types';

const allSizes: ChipSize[] = ['sm', 'md', 'lg'];
const allRounded: ChipRounded[] = ['sm', 'md', 'lg', 'full'];
const allWeights: ChipWeight[] = ['normal', 'medium', 'semibold', 'bold'];

describe('Chip.styles & helpers', () => {
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

    it('harus default ke "0" jika depth tidak ditentukan', () => {
      expect(resolveDepthKey(undefined)).toBe('0');
    });

    it('harus fallback ke "1" untuk input tak dikenal', () => {
      // @ts-expect-error - testing invalid runtime input
      expect(resolveDepthKey('unknown-depth')).toBe('1');
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
    it('harus memuat semua ukuran beserta varian removable, ikon, teks, dan tombol hapus', () => {
      allSizes.forEach((s) => {
        expect(sizeClasses[s]).toBeDefined();
        expect(removableSizeClasses[s]).toBeDefined();
        expect(sizeIconMap[s]).toBeDefined();
        expect(sizeTextMap[s]).toBeDefined();
        expect(removeIconSizeMap[s]).toBeDefined();
      });
      expect(removeButtonClasses).toContain('rounded-full');
    });

    it('harus memuat semua rounded dan weight', () => {
      allRounded.forEach((r) => expect(roundedClasses[r]).toBeDefined());
      allWeights.forEach((w) => expect(weightClasses[w]).toBeDefined());
    });

    it('harus memuat class status selected dan clickable', () => {
      expect(selectedClasses).toContain('ring');
      expect(clickableClasses).toContain('cursor-pointer');
    });
  });

  describe('barrel export', () => {
    it('harus mengekspor Chip, sub-komponen, dan styles', async () => {
      const mod = await import('./index');
      expect(mod.Chip).toBeDefined();
      expect(mod.default).toBe(mod.Chip);
      expect(mod.ChipIcon).toBeDefined();
      expect(mod.ChipLabel).toBeDefined();
      expect(mod.ChipRemove).toBeDefined();
      expect(mod.resolveDepthKey).toBeDefined();
    });
  });
});
