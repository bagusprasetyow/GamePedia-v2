import { describe, expect, it } from 'vitest';
import {
  resolveDepthKey,
  depthClasses,
  defaultDepthByVariant,
  variantClasses,
  sizeClasses,
  iconOnlySizeClasses,
  defaultIconSizeMap,
  defaultIconOnlySizeMap,
  sizeLoadingTextMap,
  roundedClasses,
  weightClasses,
  justifyClasses,
  gapClasses,
  cursorClasses,
} from './Button.styles';
import type { ButtonVariant, ButtonSize } from './Button.types';

describe('Button.styles & helpers', () => {
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

    it('harus menggunakan default depth berdasarkan varian jika depth tidak ditentukan', () => {
      expect(resolveDepthKey(undefined, 'primary')).toBe('1');
      expect(resolveDepthKey(undefined, 'outline')).toBe('0');
      expect(resolveDepthKey(undefined, 'ghost')).toBe('0');
      expect(resolveDepthKey(undefined, 'close')).toBe('0');
      expect(resolveDepthKey(undefined, 'secondary')).toBe('1');
    });

    it('harus mengembalikan default "1" untuk nilai undefined tanpa varian atau input tidak dikenal', () => {
      expect(resolveDepthKey(undefined)).toBe('1');
      // @ts-expect-error - testing invalid runtime input
      expect(resolveDepthKey('unknown-depth')).toBe('1');
    });
  });

  describe('sizeClasses & iconOnlySizeClasses', () => {
    const allSizes: ButtonSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];

    it('harus memuat kelas tinggi (h-*) dan padding (px-*) untuk semua preset ukuran reguler', () => {
      allSizes.forEach((size) => {
        expect(sizeClasses[size]).toBeDefined();
        expect(sizeClasses[size]).toContain('h-');
        expect(sizeClasses[size]).toContain('px-');
        expect(sizeClasses[size]).toContain('text-');
      });
      expect(sizeClasses['2xs']).toBe('h-6 px-2 text-xs');
      expect(sizeClasses.md).toBe('h-10 px-4 text-sm');
      expect(sizeClasses.xl).toBe('h-12 px-6 text-lg');
    });

    it('harus memuat kelas aspek bujur sangkar (aspect-square) untuk tombol icon-only', () => {
      allSizes.forEach((size) => {
        expect(iconOnlySizeClasses[size]).toBeDefined();
        expect(iconOnlySizeClasses[size]).toContain('aspect-square');
        expect(iconOnlySizeClasses[size]).toContain('p-0');
      });
      expect(iconOnlySizeClasses.sm).toBe('h-8 w-8 min-w-8 aspect-square p-0 shrink-0');
      expect(iconOnlySizeClasses.md).toBe('h-10 w-10 min-w-10 aspect-square p-0 shrink-0');
    });

    it('harus memetakan ukuran ikon default untuk mode reguler dan mode icon-only', () => {
      allSizes.forEach((size) => {
        expect(defaultIconSizeMap[size]).toBeDefined();
        expect(defaultIconOnlySizeMap[size]).toBeDefined();
      });
      expect(defaultIconSizeMap.md).toBe('sm');
      expect(defaultIconOnlySizeMap.md).toBe('md');
    });
  });

  describe('variantClasses & defaultDepthByVariant', () => {
    const allVariants: ButtonVariant[] = [
      'primary',
      'secondary',
      'accent',
      'outline',
      'ghost',
      'contrast',
      'success',
      'warning',
      'error',
      'info',
      'close',
    ];

    it('harus mendefinisikan kelas gaya untuk setiap varian semantik', () => {
      allVariants.forEach((variant) => {
        expect(variantClasses[variant]).toBeDefined();
        expect(typeof variantClasses[variant]).toBe('string');
      });
    });

    it('harus memiliki default depth terasosiasi untuk setiap varian', () => {
      allVariants.forEach((variant) => {
        expect(defaultDepthByVariant[variant]).toBeDefined();
      });
      expect(defaultDepthByVariant.primary).toBe(1);
      expect(defaultDepthByVariant.outline).toBe(0);
      expect(defaultDepthByVariant.ghost).toBe(0);
      expect(defaultDepthByVariant.close).toBe(0);
    });

    it('harus memetakan token warna dan interaksi yang tepat', () => {
      expect(variantClasses.primary).toContain('bg-primary');
      expect(variantClasses.primary).toContain('text-primary-foreground');
      expect(variantClasses.secondary).toContain('bg-secondary');
      expect(variantClasses.error).toContain('bg-destructive');
      expect(variantClasses.ghost).toContain('bg-transparent');
    });
  });

  describe('depthClasses', () => {
    it('harus memiliki mapping shadow untuk Depth System -3 s/d 3', () => {
      expect(depthClasses['-3']).toBe('shadow-n3');
      expect(depthClasses['-2']).toContain('shadow-n2');
      expect(depthClasses['-1']).toContain('shadow-n1');
      expect(depthClasses['0']).toBe('shadow-0');
      expect(depthClasses['1']).toContain('shadow-1');
      expect(depthClasses['2']).toContain('shadow-2');
      expect(depthClasses['3']).toContain('shadow-3');
    });

    it('harus memuat tactile feedback (active transition) pada level timbul (1, 2, 3)', () => {
      expect(depthClasses['1']).toContain('active:shadow-n1');
      expect(depthClasses['1']).toContain('active:translate-y-[1px]');
      expect(depthClasses['2']).toContain('active:shadow-n1');
      expect(depthClasses['3']).toContain('active:shadow-n2');
    });
  });

  describe('rounded, weight, justify, gap, cursor mappings', () => {
    it('harus memuat seluruh opsi border radius', () => {
      expect(roundedClasses.none).toBe('rounded-none');
      expect(roundedClasses.default).toBe('rounded-xl');
      expect(roundedClasses.full).toBe('rounded-full');
    });

    it('harus memuat seluruh opsi ketebalan teks (font weight)', () => {
      expect(weightClasses.normal).toBe('font-normal');
      expect(weightClasses.medium).toBe('font-medium');
      expect(weightClasses.semibold).toBe('font-semibold');
      expect(weightClasses.bold).toBe('font-bold');
    });

    it('harus memuat seluruh opsi perataan konten horizontal', () => {
      expect(justifyClasses.start).toBe('justify-start');
      expect(justifyClasses.center).toBe('justify-center');
      expect(justifyClasses.end).toBe('justify-end');
      expect(justifyClasses.between).toBe('justify-between');
    });

    it('harus memuat jarak celah gap', () => {
      expect(gapClasses['2xs']).toBe('gap-1');
      expect(gapClasses.sm).toBe('gap-2');
      expect(gapClasses.xl).toBe('gap-3.5');
    });

    it('harus memuat opsi kursor mouse yang aman', () => {
      expect(cursorClasses.pointer).toBe('cursor-pointer');
      expect(cursorClasses['not-allowed']).toBe('cursor-not-allowed');
    });
  });

  describe('sizeLoadingTextMap', () => {
    it('harus memetakan ukuran tombol ke TextSize yang proporsional untuk loading text', () => {
      expect(sizeLoadingTextMap['2xs']).toBe('xs');
      expect(sizeLoadingTextMap.xs).toBe('xs');
      expect(sizeLoadingTextMap.sm).toBe('sm');
      expect(sizeLoadingTextMap.md).toBe('sm');
      expect(sizeLoadingTextMap.lg).toBe('base');
      expect(sizeLoadingTextMap.xl).toBe('lg');
    });
  });

  describe('Exports', () => {
    it('harus mengekspor komponen Button dan sub-komponen ButtonLoading serta ButtonIcon dengan benar', async () => {
      const module = await import('./index');
      expect(module.Button).toBeDefined();
      expect(module.ButtonLoading).toBeDefined();
      expect(module.ButtonIcon).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
      expect(module.sizeClasses).toBeDefined();
    });
  });
});
