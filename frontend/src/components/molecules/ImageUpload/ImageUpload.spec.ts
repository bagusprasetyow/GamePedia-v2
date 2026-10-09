import { describe, it, expect } from 'vitest';
import {
  sizeClasses,
  variantClasses,
  roundedClasses,
  aspectRatioClasses,
  depthClasses,
  defaultDepthByVariant,
  namedDepthMap,
  resolveDepthKey,
  formatFileSize,
  validateImageFile,
  extractFileDetails,
  processImageFilePipeline,
  getWrapperClasses,
  getDropzoneContainerClasses,
} from './ImageUpload.styles';
import type {
  ImageUploadSize,
  ImageUploadVariant,
  ImageUploadRounded,
  ImageUploadAspectRatio,
  DepthNamed,
} from './ImageUpload.types';

describe('ImageUpload.styles', () => {
  describe('resolveDepthKey', () => {
    it('harus mengembalikan key numeric valid string untuk input numerik', () => {
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

    it('harus mengembalikan default per variant saat depth tidak didefinisikan', () => {
      expect(resolveDepthKey(undefined, 'dashed')).toBe(defaultDepthByVariant.dashed);
      expect(resolveDepthKey(undefined, 'solid')).toBe(defaultDepthByVariant.solid);
      expect(resolveDepthKey(undefined, 'ghost')).toBe(defaultDepthByVariant.ghost);
    });

    it('harus mengembalikan fallback "0" bila input depth tidak dikenali', () => {
      // @ts-expect-error Pengujian input sembarang
      expect(resolveDepthKey(999)).toBe('0');
      // @ts-expect-error Pengujian input string invalid
      expect(resolveDepthKey('invalid-key')).toBe('0');
    });
  });

  describe('formatFileSize', () => {
    it('harus menangani nilai 0 atau negatif', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(-100)).toBe('0 B');
    });

    it('harus memformat byte, KB, dan MB dengan tepat', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });
  });

  describe('validateImageFile', () => {
    it('harus meloloskan file yang sesuai batas ukuran dan tipe format', () => {
      const mockFile = new File(['dummy content'], 'avatar.png', {
        type: 'image/png',
      });
      const result = validateImageFile(mockFile, 'image/png, image/jpeg', 5);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('harus menolak file yang melebihi batas ukuran maksimum', () => {
      // Buat file fiktif dengan ukuran besar (6MB)
      const largeContent = new Uint8Array(6 * 1024 * 1024);
      const mockFile = new File([largeContent], 'big.jpg', {
        type: 'image/jpeg',
      });
      const result = validateImageFile(mockFile, 'image/jpeg', 5);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('melebihi batas maksimum 5 MB');
    });

    it('harus menolak format yang tidak terdaftar pada accept', () => {
      const mockFile = new File(['text'], 'document.pdf', {
        type: 'application/pdf',
      });
      const result = validateImageFile(mockFile, 'image/png, image/jpeg', 5);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Format berkas tidak didukung');
    });

    it('harus mendukung wildcard seperti image/*', () => {
      const mockFile = new File(['img'], 'photo.webp', {
        type: 'image/webp',
      });
      const result = validateImageFile(mockFile, 'image/*', 5);
      expect(result.valid).toBe(true);
    });
  });

  describe('extractFileDetails', () => {
    it('harus mengekstrak rincian file secara akurat', () => {
      const mockFile = new File(['konten'], 'test.png', { type: 'image/png' });
      const details = extractFileDetails(mockFile);
      expect(details.name).toBe('test.png');
      expect(details.type).toBe('image/png');
      expect(details.size).toBe(mockFile.size);
      expect(details.formattedSize).toBeDefined();
      expect(details.originalSize).toBeUndefined();
    });

    it('harus menyimpan originalSize dan originalFormattedSize saat ada perbedaan ukuran kompresi', () => {
      const originalFile = new File(['isi-lama-yang-lebih-panjang-dan-berat'], 'foto.jpg', { type: 'image/jpeg' });
      const compressedFile = new File(['ringkas'], 'foto.webp', { type: 'image/webp' });

      const details = extractFileDetails(compressedFile, originalFile);
      expect(details.name).toBe('foto.webp');
      expect(details.size).toBe(compressedFile.size);
      expect(details.originalSize).toBe(originalFile.size);
      expect(details.originalFormattedSize).toBeDefined();
      expect(details.formattedSize).toBeDefined();
    });
  });

  describe('processImageFilePipeline', () => {
    it('harus mengembalikan file yang sama jika tidak ada opsi konversi atau kompresi', async () => {
      const mockFile = new File(['valid content'], 'photo.png', {
        type: 'image/png',
      });
      const result = await processImageFilePipeline({
        file: mockFile,
        accept: 'image/png',
        maxSizeMB: 5,
      });
      expect(result).toBe(mockFile);
    });

    it('harus melempar error jika validasi awal format gagal', async () => {
      const invalidFile = new File(['doc'], 'file.pdf', {
        type: 'application/pdf',
      });
      await expect(
        processImageFilePipeline({
          file: invalidFile,
          accept: 'image/png',
          maxSizeMB: 5,
        })
      ).rejects.toThrow('Format berkas tidak didukung');
    });

    it('harus memvalidasi batas ukuran dan melempar error jika ukuran melebihi batas', async () => {
      const largeContent = new Uint8Array(6 * 1024 * 1024);
      const largeFile = new File([largeContent], 'heavy.png', {
        type: 'image/png',
      });
      await expect(
        processImageFilePipeline({
          file: largeFile,
          accept: 'image/png',
          maxSizeMB: 5,
        })
      ).rejects.toThrow('melebihi batas maksimum 5 MB');
    });
  });

  describe('Class Maps verification', () => {
    it('harus memuat seluruh kunci ImageUploadSize', () => {
      const sizes: ImageUploadSize[] = ['sm', 'md', 'lg', 'xl'];
      for (const s of sizes) {
        expect(sizeClasses[s]).toBeDefined();
        expect(typeof sizeClasses[s]).toBe('string');
      }
    });

    it('harus memuat seluruh kunci ImageUploadVariant', () => {
      const variants: ImageUploadVariant[] = ['dashed', 'solid', 'ghost'];
      for (const v of variants) {
        expect(variantClasses[v]).toBeDefined();
        expect(typeof variantClasses[v]).toBe('string');
      }
    });

    it('harus memuat seluruh kunci ImageUploadRounded', () => {
      const rounds: ImageUploadRounded[] = [
        'none',
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

    it('harus memuat seluruh kunci ImageUploadAspectRatio', () => {
      const ratios: ImageUploadAspectRatio[] = [
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

  describe('getWrapperClasses', () => {
    it('harus menghasilkan kelas wrapper default dengan konsisten', () => {
      const cls = getWrapperClasses();
      expect(cls).toContain('flex flex-col gap-1.5 w-full');
    });

    it('harus menggabungkan className tambahan konsumen', () => {
      const cls = getWrapperClasses('custom-wrapper-class');
      expect(cls).toContain('custom-wrapper-class');
    });
  });

  describe('getDropzoneContainerClasses', () => {
    it('harus menghasilkan kelas default saat diberi parameter minimal', () => {
      const cls = getDropzoneContainerClasses({
        size: 'md',
        variant: 'dashed',
        rounded: 'lg',
        aspectRatio: 'video',
      });
      expect(cls).toContain('relative');
      expect(cls).toContain('overflow-hidden');
      expect(cls).toContain('aspect-video');
      expect(cls).toContain('border-dashed');
      expect(cls).toContain('rounded-lg');
    });

    it('harus menambahkan kelas status invalid, success, dan disabled', () => {
      const invalidCls = getDropzoneContainerClasses({
        size: 'md',
        variant: 'dashed',
        rounded: 'lg',
        aspectRatio: 'video',
        isInvalid: true,
      });
      expect(invalidCls).toContain('border-destructive');

      const successCls = getDropzoneContainerClasses({
        size: 'md',
        variant: 'dashed',
        rounded: 'lg',
        aspectRatio: 'video',
        success: true,
      });
      expect(successCls).toContain('border-success');

      const disabledCls = getDropzoneContainerClasses({
        size: 'md',
        variant: 'dashed',
        rounded: 'lg',
        aspectRatio: 'video',
        disabled: true,
      });
      expect(disabledCls).toContain('cursor-not-allowed');
    });
  });

  describe('Parameter Integrations (compress & convertTo)', () => {
    it('harus menerima parameter compress dan convertTo dengan tipe boolean dan shorthand', async () => {
      const { ImageUpload } = await import('./ImageUpload');
      const { renderToString } = await import('react-dom/server');
      const { createElement } = await import('react');

      const html = renderToString(
        createElement(ImageUpload, {
          compress: true,
          convertTo: 'webp',
          label: 'Upload Gambar',
          description: 'Format otomatis dikonversi ke webp',
        })
      );

      expect(html).toContain('Upload Gambar');
      expect(html).toContain('Format otomatis dikonversi ke webp');
    });

    it('harus menerima parameter opsi konfigurasi objek detail', async () => {
      const { ImageUpload } = await import('./ImageUpload');
      const { renderToString } = await import('react-dom/server');
      const { createElement } = await import('react');

      const html = renderToString(
        createElement(ImageUpload, {
          compress: { quality: 0.75, maxWidth: 1200 },
          convertTo: { format: 'image/jpeg', backgroundColor: '#FFFFFF' },
          placeholderTitle: 'Pilih Foto HD',
        })
      );

      expect(html).toContain('Pilih Foto HD');
    });

    it('harus merender ImageUploadInfo dengan ukuran asli tercoret dan ukuran baru dengan token warna text-success', async () => {
      const { ImageUploadInfo } = await import('./components/ImageUploadInfo');
      const { renderToString } = await import('react-dom/server');
      const { createElement } = await import('react');

      const html = renderToString(
        createElement(ImageUploadInfo, {
          fileDetails: {
            name: 'banner.webp',
            size: 97 * 1024,
            formattedSize: '97.0 KB',
            type: 'image/webp',
            originalSize: 500 * 1024,
            originalFormattedSize: '500.0 KB',
          },
        })
      );

      expect(html).toContain('500.0 KB');
      expect(html).toContain('line-through');
      expect(html).toContain('97.0 KB');
      expect(html).toContain('text-success');
    });
  });

  describe('Sub-Component Style Helpers', () => {
    it('harus menghasilkan kelas dropzone dengan responsif terhadap isDragging dan disabled', async () => {
      const { getDropzoneClasses, getDropzoneIconWrapperClasses } = await import(
        './ImageUpload.styles'
      );
      const defaultCls = getDropzoneClasses();
      expect(defaultCls).toContain('cursor-pointer');
      expect(defaultCls).not.toContain('opacity-60');

      const draggingCls = getDropzoneClasses({ isDragging: true });
      expect(draggingCls).toContain('scale-[0.99]');

      const disabledCls = getDropzoneClasses({ disabled: true });
      expect(disabledCls).toContain('cursor-not-allowed opacity-60');

      const iconCls = getDropzoneIconWrapperClasses(true);
      expect(iconCls).toContain('scale-110');
    });

    it('harus menghasilkan kelas overlay gradasi dengan responsif terhadap isUploading', async () => {
      const { getGradientOverlayClasses } = await import('./ImageUpload.styles');
      const normalCls = getGradientOverlayClasses(false);
      expect(normalCls).toContain('absolute inset-x-0 top-0');
      expect(normalCls).not.toContain('hidden');

      const uploadingCls = getGradientOverlayClasses(true);
      expect(uploadingCls).toContain('hidden');
    });
  });

  describe('Barrel Export', () => {
    it('harus mengekspor komponen utama dan utilitas dengan lengkap', async () => {
      const barrel = await import('./index');
      expect(barrel.default).toBeDefined();
      expect(barrel.ImageUpload).toBeDefined();
      expect(barrel.ImageUploadHeader).toBeDefined();
      expect(barrel.ImageUploadDropzone).toBeDefined();
      expect(barrel.ImageUploadPreview).toBeDefined();
      expect(barrel.ImageUploadProgress).toBeDefined();
      expect(barrel.ImageUploadInfo).toBeDefined();
      expect(barrel.ImageUploadActions).toBeDefined();
      expect(barrel.useImageUpload).toBeDefined();
      expect(barrel.useImageDragDrop).toBeDefined();
      expect(barrel.resolveDepthKey).toBeDefined();
      expect(barrel.formatFileSize).toBeDefined();
      expect(barrel.validateImageFile).toBeDefined();
      expect(barrel.processImageFilePipeline).toBeDefined();
      expect(barrel.getWrapperClasses).toBeDefined();
      expect(barrel.getDropzoneContainerClasses).toBeDefined();
      expect(barrel.getDropzoneClasses).toBeDefined();
      expect(barrel.getDropzoneIconWrapperClasses).toBeDefined();
      expect(barrel.getGradientOverlayClasses).toBeDefined();
    });

    it('harus merender ImageUploadHeader dengan label dan description', async () => {
      const { ImageUploadHeader } = await import('./components/ImageUploadHeader');
      const { renderToString } = await import('react-dom/server');
      const { createElement } = await import('react');

      const html = renderToString(
        createElement(ImageUploadHeader, {
          label: 'Judul Label',
          description: 'Deskripsi Info',
        })
      );
      expect(html).toContain('Judul Label');
      expect(html).toContain('Deskripsi Info');
    });

    it('harus mengembalikan null saat ImageUploadHeader tanpa label dan description', async () => {
      const { ImageUploadHeader } = await import('./components/ImageUploadHeader');
      const { renderToString } = await import('react-dom/server');
      const { createElement } = await import('react');

      const html = renderToString(createElement(ImageUploadHeader, {}));
      expect(html).toBe('');
    });
  });
});


