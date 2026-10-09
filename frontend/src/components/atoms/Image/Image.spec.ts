import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import {
  fitClasses,
  roundedClasses,
  aspectRatioClasses,
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
  getImageContainerClasses,
  getImageElementClasses,
  getAmbientBlurClasses,
} from './Image.styles';
import type {
  ImageFit,
  ImageRounded,
  ImageAspectRatio,
  DepthNamed,
} from './Image.types';
import { Image } from './Image';
import { ImageSkeleton } from './components/ImageSkeleton';
import { ImageFallback } from './components/ImageFallback';
import { ImageAmbientBlur } from './components/ImageAmbientBlur';

describe('Image Component (Atom)', () => {
  describe('Class Maps & Style Tokens', () => {
    it('harus memuat seluruh kunci ImageFit', () => {
      const fits: ImageFit[] = ['cover', 'contain', 'fill', 'none', 'scale-down'];
      for (const fit of fits) {
        expect(fitClasses[fit]).toBeDefined();
        expect(typeof fitClasses[fit]).toBe('string');
      }
    });

    it('harus memuat seluruh kunci ImageRounded', () => {
      const rounds: ImageRounded[] = [
        'none',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        'full',
      ];
      for (const r of rounds) {
        expect(roundedClasses[r]).toBeDefined();
        expect(typeof roundedClasses[r]).toBe('string');
      }
    });

    it('harus memuat seluruh kunci ImageAspectRatio', () => {
      const ratios: ImageAspectRatio[] = [
        'square',
        'video',
        'portrait',
        'wide',
        'auto',
      ];
      for (const ratio of ratios) {
        expect(aspectRatioClasses[ratio]).toBeDefined();
        expect(typeof aspectRatioClasses[ratio]).toBe('string');
      }
    });

    it('harus memuat seluruh kunci Depth System (-3 s/d 3)', () => {
      const depths = ['-3', '-2', '-1', '0', '1', '2', '3'];
      for (const d of depths) {
        expect(depthClasses[d]).toBeDefined();
        expect(typeof depthClasses[d]).toBe('string');
      }
    });
  });

  describe('resolveDepthKey Helper', () => {
    it('harus mengembalikan string angka yang valid untuk input numerik -3 s/d 3', () => {
      expect(resolveDepthKey(-3)).toBe('-3');
      expect(resolveDepthKey(-2)).toBe('-2');
      expect(resolveDepthKey(-1)).toBe('-1');
      expect(resolveDepthKey(0)).toBe('0');
      expect(resolveDepthKey(1)).toBe('1');
      expect(resolveDepthKey(2)).toBe('2');
      expect(resolveDepthKey(3)).toBe('3');
    });

    it('harus memetakan alias named depth secara presisi', () => {
      const namedKeys: DepthNamed[] = [
        'sunken',
        'flat',
        'raised-sm',
        'raised-md',
        'raised-lg',
      ];
      for (const named of namedKeys) {
        expect(resolveDepthKey(named)).toBe(namedDepthMap[named as keyof typeof namedDepthMap]);
      }

    });

    it('harus mengembalikan fallback "0" saat depth undefined atau tidak dikenal', () => {
      expect(resolveDepthKey(undefined)).toBe('0');
      // @ts-expect-error Pengujian input tidak valid
      expect(resolveDepthKey(999)).toBe('0');
      // @ts-expect-error Pengujian string tak dikenal
      expect(resolveDepthKey('unknown')).toBe('0');
    });
  });

  describe('getImageContainerClasses & getImageElementClasses', () => {
    it('harus menyusun kelas container default dengan benar', () => {
      const cls = getImageContainerClasses({
        aspectRatio: 'video',
        rounded: 'lg',
        depth: 1,
      });
      expect(cls).toContain('aspect-video');
      expect(cls).toContain('rounded-lg');
      expect(cls).toContain('shadow-1');
      expect(cls).toContain('overflow-hidden');
    });

    it('harus menyusun kelas elemen img dengan benar', () => {
      const cls = getImageElementClasses({
        fit: 'contain',
        rounded: 'md',
        isLoaded: true,
      });
      expect(cls).toContain('object-contain');
      expect(cls).toContain('rounded-md');
      expect(cls).not.toContain('opacity-0');
    });

    it('harus menyembunyikan gambar sebelum selesai jika showSkeleton aktif', () => {
      const cls = getImageElementClasses({
        fit: 'cover',
        isLoaded: false,
      });
      expect(cls).toContain('opacity-0');
    });

    it('harus menghasilkan kelas ambient blur yang valid', () => {
      const cls = getAmbientBlurClasses();
      expect(cls).toContain('blur-2xl');
      expect(cls).toContain('absolute inset-0');
    });
  });

  describe('Komponen Sub-Atom', () => {
    it('harus merender ImageSkeleton dengan kelas animasi pulse', () => {
      const html = renderToString(
        createElement(ImageSkeleton, { rounded: 'md' })
      );
      expect(html).toContain('animate-pulse');
      expect(html).toContain('rounded-md');
    });

    it('harus merender ImageFallback default dengan icon dan teks', () => {
      const html = renderToString(
        createElement(ImageFallback, { alt: 'Gagal memuat' })
      );
      expect(html).toContain('Gagal memuat');
      expect(html).toContain('bg-muted/40');
    });

    it('harus merender ImageFallback dengan children kustom', () => {
      const html = renderToString(
        createElement(
          ImageFallback,
          { alt: 'Custom' },
          createElement('span', null, 'Fallback Khusus')
        )
      );
      expect(html).toContain('Fallback Khusus');
    });

    it('harus merender ImageAmbientBlur dengan elemen img dan kelas blur', () => {
      const html = renderToString(
        createElement(ImageAmbientBlur, { src: 'https://example.com/test.jpg' })
      );
      expect(html).toContain('src="https://example.com/test.jpg"');
      expect(html).toContain('blur-2xl');
      expect(html).toContain('aria-hidden="true"');
    });
  });

  describe('Render Komponen Image', () => {
    it('harus merender elemen img dengan atribut src dan alt', () => {
      const html = renderToString(
        createElement(Image, {
          src: 'https://example.com/foto.webp',
          alt: 'Foto Profil',
          aspectRatio: 'square',
          rounded: 'full',
          fit: 'cover',
        })
      );
      expect(html).toContain('src="https://example.com/foto.webp"');
      expect(html).toContain('alt="Foto Profil"');
      expect(html).toContain('aspect-square');
      expect(html).toContain('rounded-full');
      expect(html).toContain('object-cover');
    });

    it('harus merender ambient blur saat prop ambientBlur aktif', () => {
      const html = renderToString(
        createElement(Image, {
          src: 'https://example.com/foto.webp',
          ambientBlur: true,
        })
      );
      expect(html).toContain('blur-2xl');
    });

    it('harus merender fallback saat src tidak diberikan', () => {
      const html = renderToString(
        createElement(Image, {
          alt: 'Tidak ada gambar',
        })
      );
      expect(html).toContain('Tidak ada gambar');
    });
  });

  describe('Barrel Export', () => {
    it('harus mengekspor seluruh elemen dan helper secara lengkap', async () => {
      const barrel = await import('./index');
      expect(barrel.default).toBeDefined();
      expect(barrel.Image).toBeDefined();
      expect(barrel.ImageSkeleton).toBeDefined();
      expect(barrel.ImageFallback).toBeDefined();
      expect(barrel.ImageAmbientBlur).toBeDefined();
      expect(barrel.fitClasses).toBeDefined();
      expect(barrel.roundedClasses).toBeDefined();
      expect(barrel.aspectRatioClasses).toBeDefined();
      expect(barrel.depthClasses).toBeDefined();
      expect(barrel.resolveDepthKey).toBeDefined();
      expect(barrel.getImageContainerClasses).toBeDefined();
      expect(barrel.getImageElementClasses).toBeDefined();
      expect(barrel.getAmbientBlurClasses).toBeDefined();
    });
  });
});
