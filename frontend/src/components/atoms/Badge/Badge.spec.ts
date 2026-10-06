import { describe, expect, it } from 'vitest';
import {
  resolveDepthKey,
  depthClasses,
  defaultDepthByVariant,
  variantClasses,
  sizeClasses,
  sizeIconMap,
  sizeTextMap,
  roundedClasses,
  weightClasses,
  appearanceClasses,
} from './Badge.styles';
import type { BadgeVariant, BadgeSize, BadgeRounded, BadgeWeight } from './Badge.types';

const allSizes: BadgeSize[] = ['xs', 'sm', 'md', 'lg'];
const allVariants: BadgeVariant[] = [
  'brand',
  'danger',
  'important',
  'informative',
  'severe',
  'subtle',
  'primary',
  'secondary',
  'accent',
  'muted',
  'outline',
  'success',
  'warning',
  'error',
  'info',
];
const allRounded: BadgeRounded[] = ['sm', 'md', 'lg', 'full'];
const allWeights: BadgeWeight[] = ['normal', 'medium', 'semibold', 'bold'];

describe('Badge.styles & helpers', () => {
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

    it('harus menggunakan default depth berdasarkan varian', () => {
      allVariants.forEach((v) => {
        expect(resolveDepthKey(undefined, v)).toBe(String(defaultDepthByVariant[v]));
      });
    });

    it('harus fallback ke "1" untuk input tak dikenal', () => {
      expect(resolveDepthKey(undefined)).toBe('1');
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
    it('harus memuat semua ukuran beserta ikon & teks', () => {
      allSizes.forEach((s) => {
        expect(sizeClasses[s]).toBeDefined();
        expect(sizeIconMap[s]).toBeDefined();
        expect(sizeTextMap[s]).toBeDefined();
      });
    });

    it('harus memuat semua varian', () => {
      allVariants.forEach((v) => expect(variantClasses[v]).toBeDefined());
    });

    it('harus memuat semua rounded dan weight', () => {
      allRounded.forEach((r) => expect(roundedClasses[r]).toBeDefined());
      allWeights.forEach((w) => expect(weightClasses[w]).toBeDefined());
    });
  });

  describe('appearanceClasses', () => {
    it('harus memuat filled, ghost, outline, tint untuk semua varian', () => {
      allVariants.forEach((v) => {
        (['filled', 'ghost', 'outline', 'tint'] as const).forEach((a) => {
          expect(appearanceClasses[v][a]).toBeDefined();
        });
      });
    });
  });

  describe('barrel export', () => {
    it('harus mengekspor Badge, sub-komponen, dan styles', async () => {
      const mod = await import('./index');
      expect(mod.Badge).toBeDefined();
      expect(mod.default).toBe(mod.Badge);
      expect(mod.BadgeIcon).toBeDefined();
      expect(mod.BadgeLabel).toBeDefined();
      expect(mod.resolveDepthKey).toBeDefined();
    });
  });
});
