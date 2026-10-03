import { describe, it, expect } from 'vitest';
import {
  borderStyleClasses,
  roundedClasses,
  minHeightClasses,
  badgeVariantClasses,
  backgroundVariantClasses,
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
  normalizeBadges,
} from './ShowcasePreview.styles';
import type {
  ShowcasePreviewBorderStyle,
  ShowcasePreviewRounded,
  ShowcasePreviewMinHeight,
  ShowcasePreviewBadgeVariant,
  ShowcasePreviewBackground,
  ShowcasePreviewDepth,
} from './ShowcasePreview.types';

describe('ShowcasePreview - Unit Tests & Style Contracts', () => {
  describe('Helper: resolveDepthKey', () => {
    it('harus mengembalikan "0" jika depth kosong atau undefined', () => {
      expect(resolveDepthKey(undefined)).toBe('0');
      expect(resolveDepthKey()).toBe('0');
    });

    it('harus memetakan angka -3 sampai 3 dengan tepat', () => {
      const numericDepths: ShowcasePreviewDepth[] = [-3, -2, -1, 0, 1, 2, 3];
      numericDepths.forEach((num) => {
        expect(resolveDepthKey(num)).toBe(String(num));
      });
    });

    it('harus melakukan clamp jika angka di luar rentang -3..3', () => {
      expect(resolveDepthKey(5 as unknown as ShowcasePreviewDepth)).toBe('3');
      expect(resolveDepthKey(-10 as unknown as ShowcasePreviewDepth)).toBe('-3');
    });

    it('harus memetakan named depth alias dengan benar', () => {
      expect(resolveDepthKey('sunken')).toBe(namedDepthMap.sunken);
      expect(resolveDepthKey('flat')).toBe(namedDepthMap.flat);
      expect(resolveDepthKey('raised-sm')).toBe(namedDepthMap['raised-sm']);
      expect(resolveDepthKey('raised-md')).toBe(namedDepthMap['raised-md']);
      expect(resolveDepthKey('raised-lg')).toBe(namedDepthMap['raised-lg']);
    });

    it('harus mempertahankan string valid "-3" s/d "3"', () => {
      expect(resolveDepthKey('2')).toBe('2');
      expect(resolveDepthKey('-1')).toBe('-1');
    });

    it('harus fallback ke "0" jika string tidak valid', () => {
      expect(resolveDepthKey('invalid-key' as unknown as ShowcasePreviewDepth)).toBe('0');
    });
  });

  describe('Helper: normalizeBadges', () => {
    it('harus mengembalikan array kosong jika input badges tidak diberikan', () => {
      expect(normalizeBadges(undefined)).toEqual([]);
      expect(normalizeBadges(null as unknown as undefined)).toEqual([]);
    });

    it('harus menormalisasi array string sederhana', () => {
      const input = ['v1.0.0', 'experimental'];
      const result = normalizeBadges(input);

      expect(result).toEqual([
        { value: 'v1.0.0', variant: 'default' },
        { value: 'experimental', variant: 'default' },
      ]);
    });

    it('harus menormalisasi array objek ShowcasePreviewBadgeItem lengkap', () => {
      const input = [
        { label: 'variant', value: 'primary', variant: 'primary' as const },
        { label: 'size', value: 'md' },
      ];
      const result = normalizeBadges(input);

      expect(result).toEqual([
        { label: 'variant', value: 'primary', variant: 'primary' },
        { label: 'size', value: 'md', variant: 'default' },
      ]);
    });

    it('harus menormalisasi objek Record key-value menjadi array badges', () => {
      const recordInput = {
        variant: 'primary',
        size: 'md',
        depth: 1,
        disabled: false,
        skipMe: undefined,
        nullMe: null,
      };

      const result = normalizeBadges(recordInput);

      expect(result).toEqual([
        { label: 'variant', value: 'primary', variant: 'default' },
        { label: 'size', value: 'md', variant: 'default' },
        { label: 'depth', value: 1, variant: 'default' },
        { label: 'disabled', value: false, variant: 'default' },
      ]);
    });
  });

  describe('Class Maps Contracts', () => {
    it('harus memiliki class untuk setiap nilai ShowcasePreviewBorderStyle', () => {
      const allBorders: ShowcasePreviewBorderStyle[] = ['dashed', 'solid', 'none'];
      allBorders.forEach((style) => {
        expect(borderStyleClasses[style]).toBeDefined();
        expect(typeof borderStyleClasses[style]).toBe('string');
      });
    });

    it('harus memiliki class untuk setiap nilai ShowcasePreviewRounded', () => {
      const allRounded: ShowcasePreviewRounded[] = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'];
      allRounded.forEach((rounded) => {
        expect(roundedClasses[rounded]).toBeDefined();
        expect(typeof roundedClasses[rounded]).toBe('string');
      });
    });

    it('harus memiliki class untuk setiap nilai ShowcasePreviewMinHeight', () => {
      const allHeights: ShowcasePreviewMinHeight[] = ['none', 'sm', 'md', 'lg', 'xl'];
      allHeights.forEach((height) => {
        expect(minHeightClasses[height]).toBeDefined();
        expect(typeof minHeightClasses[height]).toBe('string');
      });
    });

    it('harus memiliki class untuk setiap nilai ShowcasePreviewBadgeVariant', () => {
      const allVariants: ShowcasePreviewBadgeVariant[] = ['default', 'primary', 'accent', 'muted'];
      allVariants.forEach((variant) => {
        expect(badgeVariantClasses[variant]).toBeDefined();
        expect(typeof badgeVariantClasses[variant]).toBe('string');
      });
    });

    it('harus memiliki class untuk setiap nilai ShowcasePreviewBackground', () => {
      const allBackgrounds: ShowcasePreviewBackground[] = ['dots', 'radial', 'grid', 'plain'];
      allBackgrounds.forEach((bg) => {
        expect(backgroundVariantClasses[bg]).toBeDefined();
        expect(typeof backgroundVariantClasses[bg]).toBe('string');
      });
      // Varian dots harus memiliki pola dot matrix
      expect(backgroundVariantClasses.dots).toContain('radial-gradient');
      expect(backgroundVariantClasses.dots).toContain('background-size');
    });

    it('harus memiliki class valid untuk semua skala depthClasses (-3 s/d 3)', () => {
      const depthKeys = ['-3', '-2', '-1', '0', '1', '2', '3'] as const;
      depthKeys.forEach((key) => {
        expect(depthClasses[key]).toBeDefined();
        expect(depthClasses[key]).toContain(`shadow-`);
      });
    });
  });

  describe('Barrel Export Integrity', () => {
    it('harus mengekspor komponen utama, sub-komponen, dan utilitas dengan lengkap', async () => {
      const indexModule = await import('./index');
      expect(indexModule.ShowcasePreview).toBeDefined();
      expect(indexModule.default).toBeDefined();
      expect(indexModule.ShowcasePreviewInfo).toBeDefined();
      expect(indexModule.ShowcasePreviewBadges).toBeDefined();
      expect(indexModule.ShowcasePreviewBackground).toBeDefined();
      expect(indexModule.resolveDepthKey).toBeDefined();
      expect(indexModule.normalizeBadges).toBeDefined();
    });
  });
});
