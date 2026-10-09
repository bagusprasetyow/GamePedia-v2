import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateDimensions,
  compressImage,
  loadImageElement,
  normalizeImageFormat,
  changeFileExtension,
  convertImage,
} from './index';


describe('Image Utilities', () => {
  describe('calculateDimensions', () => {
    it('harus mempertahankan dimensi asli jika tidak melebihi batas maxWidth dan maxHeight', () => {
      const dim = calculateDimensions(800, 600, 1920, 1080);
      expect(dim).toEqual({ width: 800, height: 600 });
    });

    it('harus menskalakan lebar dan tinggi proporsional saat lebar melebihi maxWidth', () => {
      // 2000 x 1000 dengan maxWidth 1000 -> 1000 x 500
      const dim = calculateDimensions(2000, 1000, 1000);
      expect(dim).toEqual({ width: 1000, height: 500 });
    });

    it('harus menskalakan lebar dan tinggi proporsional saat tinggi melebihi maxHeight', () => {
      // 1000 x 2000 dengan maxHeight 1000 -> 500 x 1000
      const dim = calculateDimensions(1000, 2000, undefined, 1000);
      expect(dim).toEqual({ width: 500, height: 1000 });
    });

    it('harus membatasi dimensi secara proporsional saat melebihi maxWidth dan maxHeight', () => {
      // 4000 x 2000 dengan maxWidth 1000 dan maxHeight 400
      // Dibatasi oleh lebar: 1000 x 500, lalu dibatasi oleh tinggi: 800 x 400
      const dim = calculateDimensions(4000, 2000, 1000, 400);
      expect(dim).toEqual({ width: 800, height: 400 });
    });

    it('harus menangani dimensi 0 atau negatif dengan fallback minimal 1x1', () => {
      const dim = calculateDimensions(0, -50, 100, 100);
      expect(dim.width).toBeGreaterThanOrEqual(1);
      expect(dim.height).toBeGreaterThanOrEqual(1);
    });
  });

  describe('normalizeImageFormat', () => {
    it('harus menormalisasi format singkatan menjadi MIME type standar', () => {
      expect(normalizeImageFormat('jpg')).toBe('image/jpeg');
      expect(normalizeImageFormat('jpeg')).toBe('image/jpeg');
      expect(normalizeImageFormat('png')).toBe('image/png');
      expect(normalizeImageFormat('webp')).toBe('image/webp');
      expect(normalizeImageFormat('avif')).toBe('image/avif');
    });

    it('harus menangani MIME type dengan case-insensitive dan spasi ekstra', () => {
      expect(normalizeImageFormat(' image/jpeg ')).toBe('image/jpeg');
      expect(normalizeImageFormat('IMAGE/PNG')).toBe('image/png');
      expect(normalizeImageFormat('WEBP')).toBe('image/webp');
    });

    it('harus memformat string umum lainnya dengan prefix image/', () => {
      expect(normalizeImageFormat('gif')).toBe('image/gif');
      expect(normalizeImageFormat('image/bmp')).toBe('image/bmp');
    });
  });

  describe('changeFileExtension', () => {
    it('harus mengganti ekstensi file dengan ekstensi MIME target', () => {
      expect(changeFileExtension('photo.png', 'image/webp')).toBe('photo.webp');
      expect(changeFileExtension('avatar.jpg', 'image/png')).toBe('avatar.png');
      expect(changeFileExtension('banner.webp', 'image/jpeg')).toBe('banner.jpg');
      expect(changeFileExtension('picture.png', 'image/avif')).toBe('picture.avif');
    });

    it('harus menangani nama berkas dengan banyak titik', () => {
      expect(changeFileExtension('my.awesome.photo.png', 'image/webp')).toBe('my.awesome.photo.webp');
    });

    it('harus menambahkan ekstensi jika nama file asal tidak memiliki ekstensi', () => {
      expect(changeFileExtension('uploaded_image', 'image/jpeg')).toBe('uploaded_image.jpg');
    });
  });

  describe('compressImage & convertImage dengan simulasi DOM Canvas', () => {
    let prevDocument: unknown;
    let prevWindow: unknown;
    let prevImage: unknown;
    let prevCreateObjectURL: unknown;
    let prevRevokeObjectURL: unknown;

    beforeEach(() => {
      prevDocument = (globalThis as Record<string, unknown>).document;
      prevWindow = (globalThis as Record<string, unknown>).window;
      prevImage = (globalThis as Record<string, unknown>).Image;
      prevCreateObjectURL = globalThis.URL?.createObjectURL;
      prevRevokeObjectURL = globalThis.URL?.revokeObjectURL;

      if (!globalThis.URL) {
        // @ts-expect-error mock URL
        globalThis.URL = {};
      }
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();

      class MockImage {
        width = 1000;
        height = 800;
        naturalWidth = 1000;
        naturalHeight = 800;
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        private _src = '';

        get src() {
          return this._src;
        }

        set src(value: string) {
          this._src = value;
          setTimeout(() => {
            if (value.includes('error-trigger')) {
              this.onerror?.();
            } else {
              this.onload?.();
            }
          }, 0);
        }
      }

      // @ts-expect-error mock Image
      globalThis.Image = MockImage;

      const mockDoc = {
        createElement: vi.fn((tagName: string) => {
          if (tagName === 'canvas') {
            const canvasObj = {
              width: 1000,
              height: 800,
              getContext: vi.fn(() => ({
                fillStyle: '',
                fillRect: vi.fn(),
                drawImage: vi.fn(),
                clearRect: vi.fn(),
              })),
              toBlob: vi.fn((callback: (blob: Blob | null) => void, mimeType?: string, quality?: number) => {
                const q = typeof quality === 'number' ? quality : 0.8;
                // Simulasi ukuran blob yang berkurang seiring penurunan kualitas atau resolusi canvas
                const dimensionFactor = Math.min(1, Math.max(0.01, (canvasObj.width * canvasObj.height) / (1000 * 800)));
                const byteSize = Math.max(1000, Math.round(150000 * q * dimensionFactor));
                const mockBlob = new Blob([new Uint8Array(byteSize)], { type: mimeType || 'image/jpeg' });
                callback(mockBlob);
              }),
            };
            return canvasObj;
          }
          return {};
        }),
      };

      (globalThis as Record<string, unknown>).document = mockDoc;
      (globalThis as Record<string, unknown>).window = globalThis;
    });

    afterEach(() => {
      (globalThis as Record<string, unknown>).document = prevDocument;
      (globalThis as Record<string, unknown>).window = prevWindow;
      (globalThis as Record<string, unknown>).Image = prevImage;
      if (prevCreateObjectURL) {
        globalThis.URL.createObjectURL = prevCreateObjectURL as typeof globalThis.URL.createObjectURL;
      }
      if (prevRevokeObjectURL) {
        globalThis.URL.revokeObjectURL = prevRevokeObjectURL as typeof globalThis.URL.revokeObjectURL;
      }
    });

    it('harus memuat elemen gambar via loadImageElement', async () => {
      const mockFile = new File(['dummy'], 'sample.png', { type: 'image/png' });
      const img = await loadImageElement(mockFile);
      expect(img).toBeDefined();
      expect(img.naturalWidth).toBe(1000);
      expect(img.naturalHeight).toBe(800);
    });

    it('harus berhasil mengompresi gambar via compressImage', async () => {
      const mockFile = new File(['dummy-content'], 'photo.jpg', { type: 'image/jpeg' });
      const compressed = await compressImage(mockFile, {
        quality: 0.7,
        maxWidth: 500,
      });

      expect(compressed).toBeInstanceOf(File);
      expect(compressed.name).toBe('photo.jpg');
      expect(compressed.type).toBe('image/jpeg');
    });

    it('harus mengompresi gambar hingga di bawah target maxSizeKB (misal < 100 KB)', async () => {
      const mockFile = new File(['large-content'], 'heavy.jpg', { type: 'image/jpeg' });
      const targetKB = 100;
      const compressed = await compressImage(mockFile, {
        maxSizeKB: targetKB,
      });

      expect(compressed).toBeInstanceOf(File);
      expect(compressed.size).toBeLessThanOrEqual(targetKB * 1024);
    });

    it('harus berhasil mengonversi format gambar via convertImage', async () => {
      const mockFile = new File(['dummy-png-content'], 'avatar.png', { type: 'image/png' });
      const converted = await convertImage(mockFile, {
        format: 'image/webp',
        quality: 0.85,
        backgroundColor: '#FFFFFF',
        maxSizeKB: 200,
      });

      expect(converted).toBeInstanceOf(File);
      expect(converted.name).toBe('avatar.webp');
      expect(converted.type).toBe('image/webp');
      expect(converted.size).toBeLessThanOrEqual(200 * 1024);
    });

    it('harus mendukung shorthand format pada convertImage', async () => {
      const mockFile = new File(['dummy-content'], 'test.png', { type: 'image/png' });
      const converted = await convertImage(mockFile, {
        format: 'jpg',
      });

      expect(converted).toBeInstanceOf(File);
      expect(converted.name).toBe('test.jpg');
      expect(converted.type).toBe('image/jpeg');
    });

    it('harus menolak promise dengan error jika pemuatan gambar gagal', async () => {
      // Mock createObjectURL untuk memicu onerror
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:error-trigger');
      const brokenFile = new File(['corrupt-data'], 'corrupt.png', { type: 'image/png' });

      await expect(loadImageElement(brokenFile)).rejects.toThrow(
        'Gagal memuat berkas gambar: corrupt.png'
      );
    });

    it('harus mendukung optimasi kompresi format lossless PNG dengan downscaling dimensi', async () => {
      const mockFile = new File(['png-data'], 'graphic.png', { type: 'image/png' });
      const targetKB = 80;
      const compressed = await compressImage(mockFile, {
        mimeType: 'image/png',
        maxSizeKB: targetKB,
      });

      expect(compressed).toBeInstanceOf(File);
      expect(compressed.type).toBe('image/png');
      expect(compressed.size).toBeLessThanOrEqual(targetKB * 1024);
    });

    it('harus melempar error di lingkungan non-browser saat document tidak tersedia', async () => {
      delete (globalThis as Record<string, unknown>).document;

      const mockFile = new File(['content'], 'test.png', { type: 'image/png' });
      await expect(loadImageElement(mockFile)).rejects.toThrow(
        'Fungsi kompresi gambar hanya didukung di lingkungan browser'
      );
    });
  });

  describe('uploadImageToServer', () => {
    it('harus berhasil mengunggah berkas dan memanggil callback progress', async () => {
      const { uploadImageToServer } = await import('./imageUploader');
      const mockFile = new File(['image-bytes'], 'game.webp', { type: 'image/webp' });

      const progressCalls: number[] = [];

      class MockSuccessXHR {
        open = vi.fn();
        setRequestHeader = vi.fn();
        upload = {
          onprogress: null as ((e: { lengthComputable: boolean; loaded: number; total: number }) => void) | null,
        };
        status = 201;
        responseText = JSON.stringify({
          success: true,
          message: 'Gambar berhasil disimpan',
          data: {
            filename: 'saved.webp',
            originalName: 'game.webp',
            subPath: 'game',
            relativeFilePath: 'data/storage/image/game/saved.webp',
            url: '/storage/image/game/saved.webp',
            size: 11,
            mimeType: 'image/webp',
          },
        });
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        ontimeout: (() => void) | null = null;

        send() {
          this.upload.onprogress?.({ lengthComputable: true, loaded: 50, total: 100 });
          this.onload?.();
        }
      }

      globalThis.XMLHttpRequest = MockSuccessXHR as unknown as typeof XMLHttpRequest;

      const result = await uploadImageToServer({
        file: mockFile,
        path: '/game',
        onProgress: (p) => progressCalls.push(p),
      });

      expect(result.success).toBe(true);
      expect(result.data.subPath).toBe('game');
      expect(progressCalls).toContain(50);
      expect(progressCalls).toContain(100);
    });

    it('harus menolak promise jika status HTTP error dikembalikan server', async () => {
      const { uploadImageToServer } = await import('./imageUploader');
      const mockFile = new File(['content'], 'test.png', { type: 'image/png' });

      class MockErrorXHR {
        open = vi.fn();
        setRequestHeader = vi.fn();
        upload = {};
        status = 400;
        responseText = JSON.stringify({ message: 'Path traversal (..) tidak diizinkan' });
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        ontimeout: (() => void) | null = null;

        send() {
          this.onload?.();
        }
      }

      globalThis.XMLHttpRequest = MockErrorXHR as unknown as typeof XMLHttpRequest;

      await expect(
        uploadImageToServer({
          file: mockFile,
          path: '../../bad',
        })
      ).rejects.toThrow('Path traversal (..) tidak diizinkan');
    });

    it('harus membatalkan pengunggahan saat signal.abort dipicu', async () => {
      const { uploadImageToServer } = await import('./imageUploader');
      const mockFile = new File(['content'], 'test.png', { type: 'image/png' });
      const controller = new AbortController();

      class MockAbortXHR {
        open = vi.fn();
        setRequestHeader = vi.fn();
        upload = {};
        timeout = 0;
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        ontimeout: (() => void) | null = null;
        onabort: (() => void) | null = null;

        send() {
          // Tidak langsung onload
        }

        abort() {
          this.onabort?.();
        }
      }

      globalThis.XMLHttpRequest = MockAbortXHR as unknown as typeof XMLHttpRequest;

      const uploadPromise = uploadImageToServer({
        file: mockFile,
        signal: controller.signal,
        timeout: 30_000,
      });

      controller.abort();

      await expect(uploadPromise).rejects.toThrow(/dibatalkan/);
    });

    it('harus berhasil memanggil API deleteImageFromServer', async () => {
      const { deleteImageFromServer } = await import('./imageUploader');

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'Berkas berhasil dihapus' }),
      });
      globalThis.fetch = mockFetch;

      const res = await deleteImageFromServer('game/cover.webp', 'http://localhost:4003');
      expect(res.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4003/storage/file?path=game%2Fcover.webp',
        { method: 'DELETE' }
      );
    });
  });
});


