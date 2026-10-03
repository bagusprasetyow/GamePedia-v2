import { describe, expect, it } from 'vitest';
import {
  sizeConfigMap,
  variantClasses,
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
} from './Switch.styles';
import type { SwitchSize, SwitchVariant } from './Switch.types';

describe('Switch.styles & helpers', () => {
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
    const allSizes: SwitchSize[] = ['sm', 'md', 'lg', 'xl'];

    it('harus mendefinisikan trek, thumb, translasi, dan ukuran ikon untuk setiap preset', () => {
      allSizes.forEach((size) => {
        expect(sizeConfigMap[size]).toBeDefined();
        expect(sizeConfigMap[size].track).toContain('h-');
        expect(sizeConfigMap[size].track).toContain('w-');
        expect(sizeConfigMap[size].thumb).toContain('h-');
        expect(sizeConfigMap[size].thumb).toContain('w-');
        expect(sizeConfigMap[size].translate).toContain('translate-x-');
        expect(sizeConfigMap[size].iconSize).toBeDefined();
      });

      expect(sizeConfigMap.sm.track).toContain('h-5');
      expect(sizeConfigMap.md.track).toContain('h-6');
      expect(sizeConfigMap.lg.track).toContain('h-7');
      expect(sizeConfigMap.xl.track).toContain('h-8');
    });
  });

  describe('variantClasses', () => {
    const allVariants: SwitchVariant[] = [
      'primary',
      'secondary',
      'accent',
      'success',
      'warning',
      'error',
      'info',
    ];

    it('harus memuat seluruh class styling varian semantik', () => {
      allVariants.forEach((variant) => {
        expect(variantClasses[variant]).toBeDefined();
      });

      expect(variantClasses.primary).toContain('bg-primary');
      expect(variantClasses.secondary).toContain('bg-secondary');
      expect(variantClasses.accent).toContain('bg-accent-600');
      expect(variantClasses.success).toContain('bg-success');
      expect(variantClasses.warning).toContain('bg-warning');
      expect(variantClasses.error).toContain('bg-destructive');
      expect(variantClasses.info).toContain('bg-info-600');
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
    it('harus mengekspor komponen Switch, sub-komponen, dan styles dari index barrel', async () => {
      const module = await import('./index');
      expect(module.Switch).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.SwitchTrack).toBeDefined();
      expect(module.SwitchLabel).toBeDefined();
      expect(module.sizeConfigMap).toBeDefined();
      expect(module.variantClasses).toBeDefined();
      expect(module.depthClasses).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
    });
  });
});
