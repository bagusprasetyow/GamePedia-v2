import { describe, expect, it } from 'vitest';
import {
  sizeStyles,
  variantStyles,
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
} from './Input.styles';
import type { InputSize, InputVariant } from './Input.types';

describe('Input.styles & helpers', () => {
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

  describe('sizeStyles', () => {
    const allSizes: InputSize[] = ['sm', 'md', 'lg'];

    it('harus mendefinisikan seluruh properti ukuran untuk setiap preset', () => {
      allSizes.forEach((size) => {
        expect(sizeStyles[size]).toBeDefined();
        expect(sizeStyles[size].container).toContain('h-');
        expect(sizeStyles[size].input).toContain('text-');
        expect(sizeStyles[size].iconSize).toBeDefined();
        expect(sizeStyles[size].clearIconSize).toBeDefined();
        expect(sizeStyles[size].adornmentGap).toContain('gap-');
      });

      expect(sizeStyles.sm.container).toContain('h-8');
      expect(sizeStyles.md.container).toContain('h-10');
      expect(sizeStyles.lg.container).toContain('h-12');
    });
  });

  describe('variantStyles', () => {
    const allVariants: InputVariant[] = ['outline', 'filled', 'ghost'];

    it('harus mendefinisikan kelas styling untuk setiap varian visual', () => {
      allVariants.forEach((variant) => {
        expect(variantStyles[variant]).toBeDefined();
        expect(variantStyles[variant]).toContain('focus-within:border-primary');
      });

      expect(variantStyles.outline).toContain('border-border');
      expect(variantStyles.filled).toContain('bg-muted');
      expect(variantStyles.ghost).toContain('bg-transparent');
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
    it('harus mengekspor komponen Input, sub-komponen, dan styles dari index barrel', async () => {
      const module = await import('./index');
      expect(module.Input).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.InputLabel).toBeDefined();
      expect(module.InputClearButton).toBeDefined();
      expect(module.InputHelperText).toBeDefined();
      expect(module.sizeStyles).toBeDefined();
      expect(module.variantStyles).toBeDefined();
      expect(module.depthClasses).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
    });
  });
});
