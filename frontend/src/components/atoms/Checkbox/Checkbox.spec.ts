import { describe, expect, it } from 'vitest';
import {
  resolveDepthKey,
  depthClasses,
  sizeConfigMap,
  colorStyleMap,
} from './Checkbox.styles';
import type { CheckboxSize, CheckboxColor } from './Checkbox.types';

describe('Checkbox.styles & helpers', () => {
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

    it('harus mengembalikan default "-1" (cekung) untuk nilai undefined, null, atau tidak dikenal', () => {
      expect(resolveDepthKey(undefined)).toBe('-1');
      expect(resolveDepthKey(null as unknown as undefined)).toBe('-1');
      // @ts-expect-error - testing invalid runtime input
      expect(resolveDepthKey('unknown-depth')).toBe('-1');
    });
  });

  describe('sizeConfigMap', () => {
    const allSizes: CheckboxSize[] = ['sm', 'md', 'lg'];

    it('harus memuat konfigurasi ukuran lengkap (box, iconSize, solidSize, labelSize, descSize)', () => {
      allSizes.forEach((size) => {
        const config = sizeConfigMap[size];
        expect(config).toBeDefined();
        expect(config.box).toBeDefined();
        expect(config.iconSize).toBeDefined();
        expect(config.solidSize).toBeDefined();
        expect(config.labelSize).toBeDefined();
        expect(config.descSize).toBeDefined();
      });
      expect(sizeConfigMap.sm.iconSize).toBe('2xs');
      expect(sizeConfigMap.md.iconSize).toBe('xs');
      expect(sizeConfigMap.lg.iconSize).toBe('sm');
    });

    it('harus memetakan ukuran tipografi label dan deskripsi yang proporsional', () => {
      expect(sizeConfigMap.sm.labelSize).toBe('xs');
      expect(sizeConfigMap.md.labelSize).toBe('sm');
      expect(sizeConfigMap.lg.labelSize).toBe('base');
    });
  });

  describe('colorStyleMap', () => {
    const allColors: CheckboxColor[] = [
      'primary',
      'secondary',
      'accent',
      'success',
      'warning',
      'error',
      'info',
    ];

    it('harus mendefinisikan seluruh properti style visual untuk setiap warna tema', () => {
      allColors.forEach((color) => {
        const style = colorStyleMap[color];
        expect(style).toBeDefined();
        expect(style.border).toBeDefined();
        expect(style.dot).toBeDefined();
        expect(style.hoverBorder).toBeDefined();
        expect(style.ring).toBeDefined();
        expect(style.checkBg).toBeDefined();
        expect(style.checkBorder).toBeDefined();
        expect(style.checkText).toBeDefined();
      });
    });

    it('harus memetakan token warna semantik yang tepat', () => {
      expect(colorStyleMap.primary.dot).toBe('bg-primary');
      expect(colorStyleMap.primary.checkText).toBe('text-primary-foreground');
      expect(colorStyleMap.secondary.dot).toBe('bg-secondary');
      expect(colorStyleMap.error.dot).toBe('bg-destructive');
      expect(colorStyleMap.error.border).toBe('border-destructive');
      expect(colorStyleMap.warning.checkText).toBe('text-neutral-950');
      expect(colorStyleMap.success.dot).toBe('bg-success');
    });
  });

  describe('depthClasses', () => {
    it('harus memiliki mapping shadow untuk Depth System -3 s/d 3', () => {
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
    it('harus mengekspor komponen Checkbox dan sub-komponen CheckboxIndicator serta CheckboxLabel dengan benar', async () => {
      const module = await import('./index');
      expect(module.Checkbox).toBeDefined();
      expect(module.CheckboxIndicator).toBeDefined();
      expect(module.CheckboxLabel).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
      expect(module.sizeConfigMap).toBeDefined();
      expect(module.colorStyleMap).toBeDefined();
    });
  });
});
