import { describe, expect, it } from 'vitest';
import {
  sizeConfigMap,
  colorStyleMap,
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
} from './Radio.styles';
import type { RadioSize, RadioColor } from './Radio.types';

describe('Radio.styles & helpers', () => {
  describe('resolveDepthKey', () => {
    it('harus memetakan skala numerik valid (-3 s/d 3) ke string key yang tepat', () => {
      expect(resolveDepthKey(-3)).toBe('-3');
      expect(resolveDepthKey(-2)).toBe('-2');
      expect(resolveDepthKey(-1)).toBe('-1');
      expect(resolveDepthKey(0)).toBe('0');
      expect(resolveDepthKey(1)).toBe('1');
      expect(resolveDepthKey(2)).toBe('2');
      expect(resolveDepthKey(3)).toBe('3');
    });

    it('harus memetakan alias nama depth ke level numerik string yang sesuai', () => {
      expect(resolveDepthKey('sunken')).toBe('-2');
      expect(resolveDepthKey('flat')).toBe('0');
      expect(resolveDepthKey('raised-sm')).toBe('1');
      expect(resolveDepthKey('raised-md')).toBe('2');
      expect(resolveDepthKey('raised-lg')).toBe('3');
    });

    it('harus memiliki namedDepthMap terdefinisi dengan nilai yang sesuai', () => {
      expect(namedDepthMap).toEqual({
        sunken: '-2',
        flat: '0',
        'raised-sm': '1',
        'raised-md': '2',
        'raised-lg': '3',
      });
    });

    it('harus mengembalikan default "-1" untuk nilai undefined, null, atau tidak dikenal', () => {
      expect(resolveDepthKey(undefined)).toBe('-1');
      // @ts-expect-error - testing invalid runtime input
      expect(resolveDepthKey('unknown-depth')).toBe('-1');
    });
  });

  describe('sizeConfigMap', () => {
    const allSizes: RadioSize[] = ['sm', 'md', 'lg'];

    it('harus mendefinisikan lingkaran, dot, dan ukuran ikon untuk setiap preset', () => {
      allSizes.forEach((size) => {
        expect(sizeConfigMap[size]).toBeDefined();
        expect(sizeConfigMap[size].circle).toContain('h-');
        expect(sizeConfigMap[size].circle).toContain('w-');
        expect(sizeConfigMap[size].solidDot).toContain('h-');
        expect(sizeConfigMap[size].solidDot).toContain('w-');
        expect(sizeConfigMap[size].iconSize).toBeDefined();
      });

      expect(sizeConfigMap.sm.circle).toContain('h-4');
      expect(sizeConfigMap.md.circle).toContain('h-5');
      expect(sizeConfigMap.lg.circle).toContain('h-6');
    });
  });

  describe('colorStyleMap', () => {
    const allColors: RadioColor[] = [
      'primary',
      'secondary',
      'accent',
      'success',
      'warning',
      'error',
      'info',
    ];

    it('harus memuat seluruh konfigurasi styling warna semantik', () => {
      allColors.forEach((color) => {
        expect(colorStyleMap[color]).toBeDefined();
        expect(colorStyleMap[color]).toHaveProperty('border');
        expect(colorStyleMap[color]).toHaveProperty('dot');
        expect(colorStyleMap[color]).toHaveProperty('ring');
        expect(colorStyleMap[color]).toHaveProperty('checkBg');
      });

      expect(colorStyleMap.primary.border).toBe('border-primary');
      expect(colorStyleMap.secondary.border).toBe('border-secondary');
      expect(colorStyleMap.success.border).toBe('border-success');
      expect(colorStyleMap.warning.border).toBe('border-warning');
      expect(colorStyleMap.error.border).toBe('border-destructive');
    });
  });

  describe('depthClasses', () => {
    it('harus memiliki mapping shadow untuk Depth System skala -3 s/d 3', () => {
      expect(depthClasses['-3']).toBe('shadow-n3');
      expect(depthClasses['-2']).toBe('shadow-n2');
      expect(depthClasses['-1']).toBe('shadow-n1');
      expect(depthClasses['0']).toBe('shadow-0');
      expect(depthClasses['1']).toBe('shadow-1');
      expect(depthClasses['2']).toBe('shadow-2');
      expect(depthClasses['3']).toBe('shadow-3');
    });
  });

  describe('Exports', () => {
    it('harus mengekspor komponen Radio, sub-komponen, dan styles dari index barrel', async () => {
      const module = await import('./index');
      expect(module.Radio).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.RadioIndicator).toBeDefined();
      expect(module.RadioLabel).toBeDefined();
      expect(module.sizeConfigMap).toBeDefined();
      expect(module.colorStyleMap).toBeDefined();
      expect(module.depthClasses).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
    });
  });
});
