import { describe, it, expect } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import {
  detectImageSignature,
  validateImageUpload,
} from './image-validator.js';

describe('image-validator', () => {
  // Helper membuat mock Multer File
  const createMockFile = (options: {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
  }): Express.Multer.File => ({
    fieldname: 'file',
    originalname: options.originalname,
    encoding: '7bit',
    mimetype: options.mimetype,
    buffer: options.buffer,
    size: options.buffer.length,
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
  });

  // Valid buffers
  const validPngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  ]);
  const validJpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
  const validGifBuffer = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00');
  const validWebpBuffer = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // RIFF
    0x24, 0x00, 0x00, 0x00, // Size
    0x57, 0x45, 0x42, 0x50, // WEBP
    0x56, 0x50, 0x38, 0x20, // VP8
  ]);
  const validAvifBuffer = Buffer.from([
    0x00, 0x00, 0x00, 0x1c, // size
    0x66, 0x74, 0x79, 0x70, // ftyp
    0x61, 0x76, 0x69, 0x66, // avif
  ]);
  const validSvgBuffer = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>'
  );

  describe('detectImageSignature', () => {
    it('mendeteksi format PNG dengan benar', () => {
      expect(detectImageSignature(validPngBuffer)).toBe('png');
    });

    it('mendeteksi format JPEG dengan benar', () => {
      expect(detectImageSignature(validJpegBuffer)).toBe('jpeg');
    });

    it('mendeteksi format WebP dengan benar', () => {
      expect(detectImageSignature(validWebpBuffer)).toBe('webp');
    });

    it('mendeteksi format AVIF dengan benar', () => {
      expect(detectImageSignature(validAvifBuffer)).toBe('avif');
    });

    it('mengembalikan null untuk buffer SVG karena format tidak lagi didukung', () => {
      expect(detectImageSignature(validSvgBuffer)).toBeNull();
    });

    it('mengembalikan null untuk buffer GIF karena format tidak lagi didukung', () => {
      expect(detectImageSignature(validGifBuffer)).toBeNull();
    });

    it('mengembalikan null untuk buffer acak / bukan gambar', () => {
      expect(detectImageSignature(Buffer.from('hello world plain text'))).toBeNull();
      expect(detectImageSignature(Buffer.from([0x00, 0x01, 0x02, 0x03]))).toBeNull();
    });
  });

  describe('validateImageUpload (3-layer pipeline)', () => {
    it('melempar error jika file tidak ada atau buffer kosong', () => {
      expect(() => validateImageUpload(undefined)).toThrow(BadRequestException);
      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'test.png',
            mimetype: 'image/png',
            buffer: Buffer.alloc(0),
          })
        )
      ).toThrow('Berkas gambar tidak ditemukan atau kosong');
    });

    it('Lapis 1: menolak ekstensi yang tidak diizinkan (.exe, .pdf, .sh, .svg, .gif)', () => {
      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'malicious.exe',
            mimetype: 'image/png',
            buffer: validPngBuffer,
          })
        )
      ).toThrow(/Ekstensi berkas "\.exe" tidak diizinkan/);

      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'document.pdf',
            mimetype: 'application/pdf',
            buffer: Buffer.from('%PDF-1.4'),
          })
        )
      ).toThrow(/Ekstensi berkas "\.pdf" tidak diizinkan/);

      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'vector.svg',
            mimetype: 'image/svg+xml',
            buffer: validSvgBuffer,
          })
        )
      ).toThrow(/Ekstensi berkas "\.svg" tidak diizinkan/);

      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'animation.gif',
            mimetype: 'image/gif',
            buffer: validGifBuffer,
          })
        )
      ).toThrow(/Ekstensi berkas "\.gif" tidak diizinkan/);
    });

    it('Lapis 2: menolak MIME type yang bukan gambar', () => {
      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'file.png',
            mimetype: 'application/octet-stream',
            buffer: validPngBuffer,
          })
        )
      ).toThrow(/Tipe MIME/);
    });

    it('Lapis 2: menolak ketidakcocokan antara ekstensi dan MIME type', () => {
      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'cover.jpg',
            mimetype: 'image/png',
            buffer: validPngBuffer,
          })
        )
      ).toThrow(/Ketidakcocokan format/);
    });

    it('Lapis 3: menolak file teks yang disamarkan dengan MIME image/png', () => {
      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'fake.png',
            mimetype: 'image/png',
            buffer: Buffer.from('echo "malicious payload"'),
          })
        )
      ).toThrow(/Isi berkas tidak valid/);
    });

    it('Lapis 3: menolak file JPEG yang disamarkan sebagai PNG (MIME spoofing)', () => {
      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'spoofed.png',
            mimetype: 'image/png',
            buffer: validJpegBuffer,
          })
        )
      ).toThrow(/Pemalsuan berkas terdeteksi/);
    });

    it('berhasil meloloskan gambar PNG valid', () => {
      const result = validateImageUpload(
        createMockFile({
          originalname: 'avatar.png',
          mimetype: 'image/png',
          buffer: validPngBuffer,
        })
      );
      expect(result.format).toBe('png');
      expect(result.mimeType).toBe('image/png');
      expect(result.extension).toBe('.png');
    });

    it('berhasil meloloskan gambar WebP valid', () => {
      const result = validateImageUpload(
        createMockFile({
          originalname: 'screenshot.webp',
          mimetype: 'image/webp',
          buffer: validWebpBuffer,
        })
      );
      expect(result.format).toBe('webp');
      expect(result.mimeType).toBe('image/webp');
      expect(result.extension).toBe('.webp');
    });

    it('berhasil menentukan ekstensi default jika originalname tidak memiliki ekstensi', () => {
      const result = validateImageUpload(
        createMockFile({
          originalname: 'blob-image',
          mimetype: 'image/jpeg',
          buffer: validJpegBuffer,
        })
      );
      expect(result.format).toBe('jpeg');
      expect(result.extension).toBe('.jpg');
    });

    it('Lapis 4: mengekstrak dimensi PNG dari IHDR dan meloloskan dimensi valid', () => {
      const pngWithIhdr = Buffer.concat([
        validPngBuffer.subarray(0, 8),
        Buffer.from([0x00, 0x00, 0x00, 0x0d]), // length 13
        Buffer.from('IHDR', 'ascii'),
        Buffer.from([0x00, 0x00, 0x07, 0x80]), // width: 1920
        Buffer.from([0x00, 0x00, 0x04, 0x38]), // height: 1080
      ]);

      const result = validateImageUpload(
        createMockFile({
          originalname: 'screen.png',
          mimetype: 'image/png',
          buffer: pngWithIhdr,
        })
      );

      expect(result.dimensions).toEqual({ width: 1920, height: 1080 });
    });

    it('Lapis 4: menolak gambar yang melebihi batas resolusi piksel (pixel bomb)', () => {
      const bombPng = Buffer.concat([
        validPngBuffer.subarray(0, 8),
        Buffer.from([0x00, 0x00, 0x00, 0x0d]),
        Buffer.from('IHDR', 'ascii'),
        Buffer.from([0x00, 0x00, 0x27, 0x10]), // width: 10000 (> 8192)
        Buffer.from([0x00, 0x00, 0x27, 0x10]), // height: 10000 (> 8192)
      ]);

      expect(() =>
        validateImageUpload(
          createMockFile({
            originalname: 'bomb.png',
            mimetype: 'image/png',
            buffer: bombPng,
          })
        )
      ).toThrow(/melebihi batas maksimum 8192x8192/);
    });
  });
});
