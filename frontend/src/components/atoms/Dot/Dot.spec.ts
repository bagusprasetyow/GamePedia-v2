import { describe, expect, it } from 'vitest';
import {
  resolveDepthKey,
  depthClasses,
  variantClasses,
  sizeClasses,
  sizeLabelMap,
  placementClasses,
} from './Dot.styles';
import type { DotVariant, DotSize } from './Dot.types';

describe('Dot.styles & helpers', () => {
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

    it('harus mengembalikan default "0" untuk nilai undefined, null, atau tidak dikenal', () => {
      expect(resolveDepthKey(undefined)).toBe('0');
      // @ts-expect-error - testing invalid runtime input
      expect(resolveDepthKey('unknown-depth')).toBe('0');
    });
  });

  describe('sizeClasses & sizeLabelMap', () => {
    const allSizes: DotSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];

    it('harus memuat kelas ukuran w-* dan h-* untuk semua preset ukuran', () => {
      allSizes.forEach((size) => {
        expect(sizeClasses[size]).toBeDefined();
        expect(sizeClasses[size]).toContain('w-');
        expect(sizeClasses[size]).toContain('h-');
      });
      expect(sizeClasses['2xs']).toBe('w-1.5 h-1.5 min-w-1.5 min-h-1.5');
      expect(sizeClasses.md).toBe('w-3 h-3 min-w-3 min-h-3');
      expect(sizeClasses.xl).toBe('w-4 h-4 min-w-4 min-h-4');
    });

    it('harus memiliki konfigurasi label (textSize dan gap) untuk setiap ukuran', () => {
      allSizes.forEach((size) => {
        expect(sizeLabelMap[size]).toBeDefined();
        expect(sizeLabelMap[size].textSize).toBeDefined();
        expect(sizeLabelMap[size].gap).toContain('gap-');
      });
      expect(sizeLabelMap['2xs'].textSize).toBe('xs');
      expect(sizeLabelMap.md.textSize).toBe('sm');
      expect(sizeLabelMap.xl.textSize).toBe('base');
    });
  });

  describe('variantClasses', () => {
    const allVariants: DotVariant[] = [
      'primary',
      'secondary',
      'accent',
      'neutral',
      'success',
      'warning',
      'error',
      'info',
      'contrast',
      'white',
    ];

    it('harus mendefinisikan properti dot, ping, dan glow untuk setiap varian semantik', () => {
      allVariants.forEach((variant) => {
        expect(variantClasses[variant]).toBeDefined();
        expect(variantClasses[variant]).toHaveProperty('dot');
        expect(variantClasses[variant]).toHaveProperty('ping');
        expect(variantClasses[variant]).toHaveProperty('glow');
      });
    });

    it('harus memetakan token warna yang tepat ke kelas background', () => {
      expect(variantClasses.primary.dot).toBe('bg-primary');
      expect(variantClasses.success.dot).toBe('bg-success');
      expect(variantClasses.warning.dot).toBe('bg-warning');
      expect(variantClasses.error.dot).toBe('bg-destructive');
      expect(variantClasses.accent.dot).toBe('bg-accent-500');
      expect(variantClasses.info.dot).toBe('bg-info');
      expect(variantClasses.white.glow).toBe('shadow-[0_0_8px_oklch(1_0_0)]');
    });
  });

  describe('depthClasses & placementClasses', () => {
    it('harus memiliki mapping shadow untuk Depth System -3 s/d 3', () => {
      expect(depthClasses['-3']).toBe('shadow-n3');
      expect(depthClasses['-2']).toBe('shadow-n2');
      expect(depthClasses['-1']).toBe('shadow-n1');
      expect(depthClasses['0']).toBe('shadow-0');
      expect(depthClasses['1']).toBe('shadow-1');
      expect(depthClasses['2']).toBe('shadow-2');
      expect(depthClasses['3']).toBe('shadow-3');
    });

    it('harus memuat kelas koordinat posisi penempatan (placement)', () => {
      expect(placementClasses['top-right']).toContain('top-0');
      expect(placementClasses['top-right']).toContain('right-0');
      expect(placementClasses['top-left']).toContain('top-0');
      expect(placementClasses['top-left']).toContain('left-0');
      expect(placementClasses['bottom-right']).toContain('bottom-0');
      expect(placementClasses['bottom-right']).toContain('right-0');
      expect(placementClasses['bottom-left']).toContain('bottom-0');
      expect(placementClasses['bottom-left']).toContain('left-0');
    });
  });

  describe('Exports', () => {
    it('harus mengekspor komponen Dot dan sub-komponen DotCircle dengan benar', async () => {
      const module = await import('./index');
      expect(module.Dot).toBeDefined();
      expect(module.DotCircle).toBeDefined();
    });
  });
});

