import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('StorageService', () => {
  let service: StorageService;
  let tempStorageDir: string;

  // Buffer biner valid dengan magic bytes
  const validWebpBuffer = Buffer.from([
    0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
  ]);
  const validPngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  ]);

  beforeEach(() => {
    // Buat direktori temporary untuk pengujian terisolasi
    tempStorageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gp-storage-test-'));

    const mockConfigService = {
      get: (key: string) => {
        if (key === 'STORAGE_IMAGE_ROOT') return tempStorageDir;
        return undefined;
      },
    } as unknown as ConfigService;

    service = new StorageService(mockConfigService);
  });

  afterEach(() => {
    // Bersihkan temporary directory
    if (fs.existsSync(tempStorageDir)) {
      fs.rmSync(tempStorageDir, { recursive: true, force: true });
    }
  });

  describe('sanitizeSubPath', () => {
    it('harus mengembalikan string kosong jika path tidak didefinisikan', () => {
      expect(service.sanitizeSubPath()).toBe('');
      expect(service.sanitizeSubPath('')).toBe('');
    });

    it('harus membersihkan leading dan trailing slashes', () => {
      expect(service.sanitizeSubPath('/game/')).toBe('game');
      expect(service.sanitizeSubPath('///game/covers///')).toBe('game/covers');
    });

    it('harus mengubah backslash Windows menjadi forward slash', () => {
      expect(service.sanitizeSubPath('game\\covers')).toBe('game/covers');
    });

    it('harus menolak upaya path traversal (..) dengan BadRequestException', () => {
      expect(() => service.sanitizeSubPath('../database')).toThrow(BadRequestException);
      expect(() => service.sanitizeSubPath('game/../../etc')).toThrow(BadRequestException);
    });

    it('harus menolak karakter terlarang dengan BadRequestException', () => {
      expect(() => service.sanitizeSubPath('game$<script>')).toThrow(BadRequestException);
      expect(() => service.sanitizeSubPath('game:cover*')).toThrow(BadRequestException);
    });
  });

  describe('saveImage', () => {
    it('harus melempar error jika berkas tidak disediakan', async () => {
      await expect(service.saveImage(undefined)).rejects.toThrow(
        'Berkas gambar tidak ditemukan atau kosong'
      );
    });

    it('harus melempar error jika MIME type bukan gambar', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'document.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('dummy-content'),
        size: 13,
      } as Express.Multer.File;

      await expect(service.saveImage(mockFile)).rejects.toThrow(
        /Ekstensi berkas "\.pdf" tidak diizinkan/
      );
    });

    it('harus menolak berkas yang memalsukan MIME tanpa magic bytes yang sesuai', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'fake.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('plain text pretend to be png'),
        size: 29,
      } as Express.Multer.File;

      await expect(service.saveImage(mockFile)).rejects.toThrow(
        /Isi berkas tidak valid/
      );
    });

    it('harus berhasil menyimpan gambar ke sub-path direktori yang ditentukan', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'screenshot.webp',
        encoding: '7bit',
        mimetype: 'image/webp',
        buffer: validWebpBuffer,
        size: validWebpBuffer.length,
      } as Express.Multer.File;

      const result = await service.saveImage(mockFile, '/game');

      expect(result).toBeDefined();
      expect(result.originalName).toBe('screenshot.webp');
      expect(result.subPath).toBe('game');
      expect(result.mimeType).toBe('image/webp');
      expect(result.size).toBe(validWebpBuffer.length);
      expect(result.url).toMatch(/^\/storage\/image\/game\/\d+-[a-f0-9]+\.webp$/);
      expect(result.relativeFilePath).toMatch(
        /^data\/storage\/image\/game\/\d+-[a-f0-9]+\.webp$/
      );

      // Verifikasi fisik berkas di filesystem
      const savedFilePath = path.join(tempStorageDir, 'game', result.filename);
      expect(fs.existsSync(savedFilePath)).toBe(true);
      const savedData = fs.readFileSync(savedFilePath);
      expect(savedData.equals(validWebpBuffer)).toBe(true);
    });

    it('harus menyimpan di root storage jika sub-path tidak diisi', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'avatar.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: validPngBuffer,
        size: validPngBuffer.length,
      } as Express.Multer.File;

      const result = await service.saveImage(mockFile);

      expect(result.subPath).toBe('');
      expect(result.url).toMatch(/^\/storage\/image\/\d+-[a-f0-9]+\.png$/);
      expect(result.relativeFilePath).toMatch(/^data\/storage\/image\/\d+-[a-f0-9]+\.png$/);

      const savedFilePath = path.join(tempStorageDir, result.filename);
      expect(fs.existsSync(savedFilePath)).toBe(true);
    });

    it('harus berhasil menghapus berkas yang telah disimpan via deleteFile', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'to-delete.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: validPngBuffer,
        size: validPngBuffer.length,
      } as Express.Multer.File;

      const uploadResult = await service.saveImage(mockFile, 'temp');
      const filePath = path.join(tempStorageDir, 'temp', uploadResult.filename);
      expect(fs.existsSync(filePath)).toBe(true);

      const deleted = await service.deleteFile(uploadResult.url);
      expect(deleted).toBe(true);
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('menolak upaya path traversal saat memanggil deleteFile', async () => {
      await expect(service.deleteFile('../outside.txt')).rejects.toThrow(
        /Path traversal/
      );
    });
  });
});
