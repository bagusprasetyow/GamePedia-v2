import { describe, expect, it } from 'vitest';
import {
  sizeClasses,
  variantClasses,
  weightClasses,
  alignClasses,
  transformClasses,
  leadingClasses,
  trackingClasses,
  clampClasses,
} from './Text.styles';
import type {
  TextSize,
  TextVariant,
  TextWeight,
  TextAlign,
  TextTransform,
  TextLeading,
  TextTracking,
  TextClamp,
} from './Text.types';

describe('Text.styles', () => {
  describe('sizeClasses', () => {
    const allSizes: TextSize[] = [
      'xs',
      'sm',
      'base',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
    ];

    it('harus memetakan seluruh preset ukuran tipografi Tailwind', () => {
      allSizes.forEach((size) => {
        expect(sizeClasses[size]).toBeDefined();
        expect(sizeClasses[size]).toContain('text-');
      });

      expect(sizeClasses.xs).toBe('text-xs');
      expect(sizeClasses.sm).toBe('text-sm');
      expect(sizeClasses.base).toBe('text-base');
      expect(sizeClasses.md).toBe('text-base');
      expect(sizeClasses['6xl']).toBe('text-6xl');
    });
  });

  describe('variantClasses', () => {
    const allVariants: TextVariant[] = [
      'default',
      'muted',
      'subtle',
      'primary',
      'secondary',
      'accent',
      'success',
      'warning',
      'error',
      'info',
      'contrast',
      'white',
      'inherit',
    ];

    it('harus memetakan seluruh varian warna teks tema semantik OKLCH', () => {
      allVariants.forEach((variant) => {
        expect(variantClasses[variant]).toBeDefined();
        expect(variantClasses[variant]).toContain('text-');
      });

      expect(variantClasses.default).toBe('text-foreground');
      expect(variantClasses.muted).toBe('text-muted-foreground');
      expect(variantClasses.primary).toBe('text-primary');
      expect(variantClasses.secondary).toBe('text-secondary-foreground');
      expect(variantClasses.accent).toContain('text-accent-600');
      expect(variantClasses.error).toBe('text-destructive');
    });
  });

  describe('weightClasses', () => {
    const allWeights: TextWeight[] = [
      'light',
      'normal',
      'medium',
      'semibold',
      'bold',
      'extrabold',
      'black',
    ];

    it('harus memetakan seluruh varian ketebalan font', () => {
      allWeights.forEach((weight) => {
        expect(weightClasses[weight]).toBeDefined();
        expect(weightClasses[weight]).toContain('font-');
      });

      expect(weightClasses.normal).toBe('font-normal');
      expect(weightClasses.medium).toBe('font-medium');
      expect(weightClasses.bold).toBe('font-bold');
    });
  });

  describe('alignClasses', () => {
    const allAligns: TextAlign[] = ['left', 'center', 'right', 'justify'];

    it('harus memetakan seluruh perataan horizontal teks', () => {
      allAligns.forEach((align) => {
        expect(alignClasses[align]).toBeDefined();
        expect(alignClasses[align]).toContain('text-');
      });

      expect(alignClasses.left).toBe('text-left');
      expect(alignClasses.center).toBe('text-center');
      expect(alignClasses.right).toBe('text-right');
      expect(alignClasses.justify).toBe('text-justify');
    });
  });

  describe('transformClasses', () => {
    const allTransforms: TextTransform[] = [
      'none',
      'capitalize',
      'uppercase',
      'lowercase',
    ];

    it('harus memetakan seluruh utilitas transformasi teks', () => {
      allTransforms.forEach((transform) => {
        expect(transformClasses[transform]).toBeDefined();
      });

      expect(transformClasses.none).toBe('normal-case');
      expect(transformClasses.capitalize).toBe('capitalize');
      expect(transformClasses.uppercase).toBe('uppercase');
      expect(transformClasses.lowercase).toBe('lowercase');
    });
  });

  describe('leadingClasses', () => {
    const allLeadings: TextLeading[] = [
      'none',
      'tight',
      'snug',
      'normal',
      'relaxed',
      'loose',
    ];

    it('harus memetakan seluruh jarak baris teks vertikal', () => {
      allLeadings.forEach((leading) => {
        expect(leadingClasses[leading]).toBeDefined();
        expect(leadingClasses[leading]).toContain('leading-');
      });

      expect(leadingClasses.none).toBe('leading-none');
      expect(leadingClasses.normal).toBe('leading-normal');
    });
  });

  describe('trackingClasses', () => {
    const allTrackings: TextTracking[] = [
      'tighter',
      'tight',
      'normal',
      'wide',
      'wider',
      'widest',
    ];

    it('harus memetakan seluruh jarak antar huruf horizontal', () => {
      allTrackings.forEach((tracking) => {
        expect(trackingClasses[tracking]).toBeDefined();
        expect(trackingClasses[tracking]).toContain('tracking-');
      });

      expect(trackingClasses.tight).toBe('tracking-tight');
      expect(trackingClasses.normal).toBe('tracking-normal');
      expect(trackingClasses.wide).toBe('tracking-wide');
    });
  });

  describe('clampClasses', () => {
    const allClamps: TextClamp[] = [1, 2, 3, 4, 5, 6];

    it('harus memetakan seluruh batas pemotongan multi-baris CSS', () => {
      allClamps.forEach((clamp) => {
        expect(clampClasses[clamp]).toBeDefined();
        expect(clampClasses[clamp]).toBe(`line-clamp-${clamp}`);
      });
    });
  });

  describe('Exports', () => {
    it('harus mengekspor komponen Text dan class maps dari index barrel', async () => {
      const module = await import('./index');
      expect(module.Text).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.sizeClasses).toBeDefined();
      expect(module.variantClasses).toBeDefined();
      expect(module.weightClasses).toBeDefined();
      expect(module.alignClasses).toBeDefined();
      expect(module.transformClasses).toBeDefined();
      expect(module.leadingClasses).toBeDefined();
      expect(module.trackingClasses).toBeDefined();
      expect(module.clampClasses).toBeDefined();
    });
  });
});
