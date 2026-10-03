import { describe, expect, it } from 'vitest';
import {
  sizeClasses,
  wrapperRadiusClasses,
  variantClasses,
  resizeClasses,
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
} from './Textarea.styles';
import type { InputSize, InputVariant } from '@/components/atoms/Input/Input.types';
import type { TextareaResize } from './Textarea.types';

describe('Textarea.styles & helpers', () => {
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

  describe('sizeClasses & wrapperRadiusClasses', () => {
    const allSizes: InputSize[] = ['sm', 'md', 'lg'];

    it('harus mendefinisikan padding, font size, min-height, dan radius untuk setiap preset ukuran', () => {
      allSizes.forEach((size) => {
        expect(sizeClasses[size]).toBeDefined();
        expect(sizeClasses[size]).toContain('text-');
        expect(sizeClasses[size]).toContain('p-');
        expect(sizeClasses[size]).toContain('min-h-');
        expect(wrapperRadiusClasses[size]).toContain('rounded-');
      });

      expect(sizeClasses.sm).toContain('text-xs');
      expect(sizeClasses.md).toContain('text-sm');
      expect(sizeClasses.lg).toContain('text-base');
    });
  });

  describe('variantClasses', () => {
    const allVariants: InputVariant[] = ['outline', 'filled', 'ghost'];

    it('harus memuat seluruh styling varian visual textarea', () => {
      allVariants.forEach((variant) => {
        expect(variantClasses[variant]).toBeDefined();
        expect(variantClasses[variant]).toContain('border-2');
        expect(variantClasses[variant]).toContain('focus-within:ring-2');
      });

      expect(variantClasses.outline).toContain('border-border/80');
      expect(variantClasses.filled).toContain('bg-muted/70');
      expect(variantClasses.ghost).toContain('bg-transparent');
    });
  });

  describe('resizeClasses', () => {
    const allResizes: TextareaResize[] = ['none', 'vertical', 'horizontal', 'both'];

    it('harus memetakan utilitas CSS resize Tailwind', () => {
      allResizes.forEach((resize) => {
        expect(resizeClasses[resize]).toBeDefined();
      });

      expect(resizeClasses.none).toBe('resize-none');
      expect(resizeClasses.vertical).toBe('resize-y');
      expect(resizeClasses.horizontal).toBe('resize-x');
      expect(resizeClasses.both).toBe('resize');
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
    it('harus mengekspor komponen Textarea, sub-komponen, dan styles dari index barrel', async () => {
      const module = await import('./index');
      expect(module.Textarea).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.TextareaLabel).toBeDefined();
      expect(module.TextareaFooter).toBeDefined();
      expect(module.sizeClasses).toBeDefined();
      expect(module.wrapperRadiusClasses).toBeDefined();
      expect(module.variantClasses).toBeDefined();
      expect(module.resizeClasses).toBeDefined();
      expect(module.depthClasses).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
    });
  });
});
