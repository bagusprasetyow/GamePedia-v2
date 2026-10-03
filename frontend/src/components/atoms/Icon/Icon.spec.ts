import { describe, expect, it } from 'vitest';
import { sizeClasses, variantClasses } from './Icon.styles';
import type { IconSize, IconVariant } from './Icon.types';

describe('Icon.styles & definitions', () => {
  describe('sizeClasses', () => {
    const allSizes: IconSize[] = [
      '2xs',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
    ];

    it('harus memuat kelas ukuran w-*, h-*, dan text-* untuk semua preset ukuran', () => {
      allSizes.forEach((size) => {
        expect(sizeClasses[size]).toBeDefined();
        expect(sizeClasses[size]).toContain('w-');
        expect(sizeClasses[size]).toContain('h-');
        expect(sizeClasses[size]).toContain('text-');
      });

      expect(sizeClasses['2xs']).toBe('w-3 h-3 text-xs');
      expect(sizeClasses.md).toBe('w-5 h-5 text-base');
      expect(sizeClasses['4xl']).toBe('w-12 h-12 text-4xl');
    });
  });

  describe('variantClasses', () => {
    const allVariants: IconVariant[] = [
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

    it('harus mendefinisikan kelas text-* untuk setiap varian semantik', () => {
      allVariants.forEach((variant) => {
        expect(variantClasses[variant]).toBeDefined();
        expect(variantClasses[variant]).toContain('text-');
      });
    });

    it('harus memetakan token warna semantik OKLCH tema GamePedia dengan benar', () => {
      expect(variantClasses.default).toBe('text-foreground');
      expect(variantClasses.muted).toBe('text-muted-foreground');
      expect(variantClasses.primary).toBe('text-primary');
      expect(variantClasses.secondary).toBe('text-secondary-foreground');
      expect(variantClasses.success).toBe('text-success');
      expect(variantClasses.warning).toBe('text-warning');
      expect(variantClasses.error).toBe('text-destructive');
      expect(variantClasses.contrast).toBe('text-foreground');
      expect(variantClasses.white).toBe('text-white');
      expect(variantClasses.inherit).toBe('text-inherit');
    });
  });

  describe('Exports', () => {
    it('harus mengekspor komponen Icon dan class maps dari index barrel', async () => {
      const module = await import('./index');
      expect(module.Icon).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.sizeClasses).toBeDefined();
      expect(module.variantClasses).toBeDefined();
    });
  });
});
