import { describe, expect, it } from 'vitest';
import {
  resolveDepthKey,
  depthClasses,
  variantClasses,
  sizeClasses,
  placementClasses,
} from './Tooltip.styles';

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

    it('harus mengembalikan fallback "3" untuk nilai depth yang tidak dikenal', () => {
      // @ts-expect-error - sengaja menguji nilai di luar tipe valid
      expect(resolveDepthKey('unknown-depth')).toBe('3');
    });
  });

  describe('dictionary style mappings', () => {
    it('harus memiliki definisi class shadow untuk skala kedalaman -3 s/d 3', () => {
      expect(depthClasses['-3']).toBe('shadow-n3');
      expect(depthClasses['0']).toBe('shadow-0');
      expect(depthClasses['3']).toBe('shadow-3');
    });

    it('harus memiliki konfigurasi bubble dan arrow untuk varian semantik', () => {
      expect(variantClasses.dark).toHaveProperty('bubble');
      expect(variantClasses.dark).toHaveProperty('arrow');
      expect(variantClasses.primary.bubble).toContain('bg-primary-600');
      expect(variantClasses.error.bubble).toContain('bg-error-600');
    });

    it('harus memuat preset ukuran bubble, textSize, dan iconSizePreset', () => {
      expect(sizeClasses.sm).toEqual({
        bubble: 'px-2.5 py-1 rounded-lg gap-1.5',
        textSize: 'xs',
        iconSizePreset: 'sm',
      });
      expect(sizeClasses.md.textSize).toBe('sm');
    });

    it('harus memuat class posisi penempatan placement yang valid', () => {
      expect(placementClasses.top).toContain('bottom-full');
      expect(placementClasses.bottom).toContain('top-full');
      expect(placementClasses.left).toContain('right-full');
      expect(placementClasses.right).toContain('left-full');
    });
  });
});
