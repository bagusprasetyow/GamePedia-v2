import { describe, expect, it } from 'vitest';
import {
  resolveDepthKey,
  depthClasses,
  defaultDepthByVariant,
  variantClasses,
  sizeClasses,
  sizeNumericMap,
  thicknessStrokeMap,
  trackOpacityClasses,
  speedClasses,
  labelPositionClasses,
  sizeLabelTextMap,
} from './Spinner.styles';
import type {
  SpinnerVariant,
  SpinnerSize,
  SpinnerThickness,
  SpinnerSpeed,
  SpinnerTrackOpacity,
  SpinnerLabelPosition,
} from './Spinner.types';

describe('Spinner.styles & helpers', () => {
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
      expect(resolveDepthKey(undefined, 'primary')).toBe('0');
      expect(resolveDepthKey(undefined, 'accent')).toBe('0');
      expect(resolveDepthKey(undefined, 'contrast')).toBe('0');
      expect(resolveDepthKey(undefined, 'muted')).toBe('0');
    });

    it('harus mengembalikan default "0" untuk nilai undefined tanpa varian atau input tidak dikenal', () => {
      expect(resolveDepthKey(undefined)).toBe('0');
      // @ts-expect-error - testing invalid runtime input
      expect(resolveDepthKey('unknown-depth')).toBe('0');
    });
  });

  describe('sizeClasses & sizeNumericMap', () => {
    const allSizes: SpinnerSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];

    it('harus memuat kelas ukuran Tailwind size-* untuk semua preset', () => {
      allSizes.forEach((size) => {
        expect(sizeClasses[size]).toBeDefined();
        expect(sizeClasses[size]).toContain('size-');
      });
      expect(sizeClasses['2xs']).toBe('size-3');
      expect(sizeClasses.md).toBe('size-5');
      expect(sizeClasses['2xl']).toBe('size-10');
    });

    it('harus memuat nilai numerik pixel yang proporsional untuk perhitungan SVG', () => {
      allSizes.forEach((size) => {
        expect(sizeNumericMap[size]).toBeDefined();
        expect(sizeNumericMap[size]).toBeGreaterThan(0);
      });
      expect(sizeNumericMap['2xs']).toBe(12);
      expect(sizeNumericMap.md).toBe(20);
      expect(sizeNumericMap['2xl']).toBe(40);
    });

    it('harus memetakan ukuran teks label bawaan untuk setiap ukuran spinner', () => {
      allSizes.forEach((size) => {
        expect(sizeLabelTextMap[size]).toBeDefined();
      });
      expect(sizeLabelTextMap['2xs']).toBe('xs');
      expect(sizeLabelTextMap.md).toBe('sm');
      expect(sizeLabelTextMap['2xl']).toBe('lg');
    });
  });

  describe('variantClasses & defaultDepthByVariant', () => {
    const allVariants: SpinnerVariant[] = [
      'primary',
      'secondary',
      'accent',
      'contrast',
      'muted',
      'white',
      'success',
      'warning',
      'error',
      'info',
      'inherit',
    ];

    it('harus memetakan warna teks semantik OKLCH untuk semua varian', () => {
      allVariants.forEach((variant) => {
        expect(variantClasses[variant]).toBeDefined();
        expect(defaultDepthByVariant[variant]).toBeDefined();
      });
      expect(variantClasses.primary).toBe('text-primary');
      expect(variantClasses.accent).toBe('text-accent-500');
      expect(variantClasses.error).toBe('text-destructive');
      expect(variantClasses.inherit).toBe('text-current');
    });
  });

  describe('thicknessStrokeMap & trackOpacityClasses', () => {
    const allThicknesses: SpinnerThickness[] = ['thin', 'normal', 'thick'];
    const allTrackOpacities: SpinnerTrackOpacity[] = ['faint', 'light', 'normal', 'transparent'];

    it('harus memuat ketebalan stroke valid untuk semua pilihan thickness', () => {
      allThicknesses.forEach((th) => {
        expect(thicknessStrokeMap[th]).toBeGreaterThan(0);
      });
      expect(thicknessStrokeMap.thin).toBe(2);
      expect(thicknessStrokeMap.normal).toBe(3);
      expect(thicknessStrokeMap.thick).toBe(4);
    });

    it('harus memuat class opasitas valid untuk track opacity', () => {
      allTrackOpacities.forEach((op) => {
        expect(trackOpacityClasses[op]).toBeDefined();
        expect(trackOpacityClasses[op]).toContain('opacity-');
      });
      expect(trackOpacityClasses.transparent).toBe('opacity-0');
      expect(trackOpacityClasses.light).toBe('opacity-20');
    });
  });

  describe('speedClasses & labelPositionClasses', () => {
    const allSpeeds: SpinnerSpeed[] = ['slow', 'normal', 'fast'];
    const allPositions: SpinnerLabelPosition[] = ['right', 'bottom', 'top', 'left'];

    it('harus memuat durasi animasi kustom untuk semua kecepatan', () => {
      allSpeeds.forEach((speed) => {
        expect(speedClasses[speed]).toBeDefined();
        expect(speedClasses[speed]).toContain('animation-duration');
      });
    });

    it('harus memetakan orientasi flexbox untuk setiap posisi label', () => {
      allPositions.forEach((pos) => {
        expect(labelPositionClasses[pos]).toBeDefined();
        expect(labelPositionClasses[pos]).toContain('flex-');
      });
      expect(labelPositionClasses.right).toContain('flex-row');
      expect(labelPositionClasses.bottom).toContain('flex-col');
    });
  });

  describe('depthClasses scale', () => {
    it('harus memiliki definisi class untuk semua skala kedalaman -3 s/d 3', () => {
      const keys = ['-3', '-2', '-1', '0', '1', '2', '3'];
      keys.forEach((key) => {
        expect(depthClasses[key]).toBeDefined();
        expect(depthClasses[key]).toContain('shadow-');
      });
    });
  });

  describe('barrel export (index.ts)', () => {
    it('harus mengekspor komponen utama, sub-komponen, dan styles tanpa error', async () => {
      const module = await import('./index');
      expect(module.default).toBeDefined();
      expect(module.Spinner).toBeDefined();
      expect(module.SpinnerRing).toBeDefined();
      expect(module.SpinnerLabel).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
      expect(module.sizeClasses).toBeDefined();
      expect(module.variantClasses).toBeDefined();
    });
  });
});
