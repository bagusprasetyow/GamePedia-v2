import { describe, expect, it } from 'vitest';
import {
  resolveDepthKey,
  depthClasses,
  variantClasses,
  sizeClasses,
  placementClasses,
  arrowPlacementClasses,
} from './Tooltip.styles';
import type {
  TooltipVariant,
  TooltipSize,
  TooltipPlacement,
} from './Tooltip.types';

describe('Tooltip.styles & helpers', () => {
  describe('resolveDepthKey', () => {
    it('harus memetakan skala numerik valid (-3 s/d 3) ke key string yang sesuai', () => {
      expect(resolveDepthKey(-3)).toBe('-3');
      expect(resolveDepthKey(-1)).toBe('-1');
      expect(resolveDepthKey(0)).toBe('0');
      expect(resolveDepthKey(2)).toBe('2');
      expect(resolveDepthKey(3)).toBe('3');
    });

    it('harus memetakan named depth ke key string numerik yang tepat', () => {
      expect(resolveDepthKey('sunken')).toBe('-2');
      expect(resolveDepthKey('flat')).toBe('0');
      expect(resolveDepthKey('raised-sm')).toBe('1');
      expect(resolveDepthKey('raised-md')).toBe('2');
      expect(resolveDepthKey('raised-lg')).toBe('3');
    });

    it('harus mengembalikan fallback "3" saat depth tidak didefinisikan (undefined/null)', () => {
      expect(resolveDepthKey(undefined)).toBe('3');
      expect(resolveDepthKey(null as unknown as undefined)).toBe('3');
    });

    it('harus mengembalikan fallback "3" untuk nilai depth yang tidak dikenal', () => {
      // @ts-expect-error - sengaja menguji nilai di luar tipe valid
      expect(resolveDepthKey('unknown-depth')).toBe('3');
    });
  });

  describe('dictionary style mappings & depth maps', () => {
    const allVariants: TooltipVariant[] = [
      'dark',
      'light',
      'primary',
      'secondary',
      'accent',
      'contrast',
      'info',
      'success',
      'warning',
      'error',
    ];

    const allSizes: TooltipSize[] = ['xs', 'sm', 'md', 'lg'];

    const allPlacements: TooltipPlacement[] = [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ];

    it('harus memiliki definisi class shadow untuk skala kedalaman -3 s/d 3', () => {
      expect(depthClasses['-3']).toBe('shadow-n3');
      expect(depthClasses['0']).toBe('shadow-0');
      expect(depthClasses['3']).toBe('shadow-3');
    });

    it('harus memiliki namedDepthMap dan alias depthNamedMap yang konsisten', async () => {
      const { namedDepthMap, depthNamedMap } = await import('./Tooltip.styles');
      expect(namedDepthMap).toBeDefined();
      expect(depthNamedMap).toBe(namedDepthMap);
      expect(namedDepthMap['sunken']).toBe('-2');
      expect(namedDepthMap['flat']).toBe('0');
      expect(namedDepthMap['raised-lg']).toBe('3');
    });

    it('harus mendefinisikan konfigurasi bubble dan arrow untuk seluruh varian semantik', () => {
      allVariants.forEach((variant) => {
        expect(variantClasses[variant]).toBeDefined();
        expect(variantClasses[variant].bubble).toBeTruthy();
        expect(variantClasses[variant].arrow).toBeTruthy();
      });
      expect(variantClasses.primary.bubble).toContain('bg-primary-600');
      expect(variantClasses.error.bubble).toContain('bg-error-600');
    });

    it('harus memuat preset ukuran bubble, textSize, dan iconSizePreset untuk seluruh ukuran', () => {
      allSizes.forEach((size) => {
        expect(sizeClasses[size]).toBeDefined();
        expect(sizeClasses[size].bubble).toBeTruthy();
        expect(sizeClasses[size].textSize).toBeTruthy();
        expect(sizeClasses[size].iconSizePreset).toBeTruthy();
      });
      expect(sizeClasses.sm).toEqual({
        bubble: 'px-2.5 py-1 rounded-lg gap-1.5',
        textSize: 'xs',
        iconSizePreset: 'sm',
      });
      expect(sizeClasses.md.textSize).toBe('sm');
    });

    it('harus memuat class posisi penempatan placement dan arrow untuk seluruh orientasi', () => {
      allPlacements.forEach((placement) => {
        expect(placementClasses[placement]).toBeDefined();
        expect(arrowPlacementClasses[placement]).toBeDefined();
      });
      expect(placementClasses.top).toContain('bottom-full');
      expect(placementClasses.bottom).toContain('top-full');
      expect(placementClasses.left).toContain('right-full');
      expect(placementClasses.right).toContain('left-full');
    });
  });

  describe('barrel exports', () => {
    it('harus mengekspor komponen utama, sub-komponen, hook, dan styles dari index', async () => {
      const indexModule = await import('./index');
      expect(indexModule.Tooltip).toBeDefined();
      expect(indexModule.default).toBe(indexModule.Tooltip);
      expect(indexModule.TooltipBubble).toBeDefined();
      expect(indexModule.useTooltip).toBeDefined();
      expect(indexModule.depthClasses).toBeDefined();
      expect(indexModule.resolveDepthKey).toBeDefined();
    });
  });
});
