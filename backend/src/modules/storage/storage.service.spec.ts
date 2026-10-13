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
  let tempVideoDir: string;

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
    tempVideoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gp-video-test-'));

    const mockConfigService = {
      get: (key: string) => {
        if (key === 'STORAGE_IMAGE_ROOT') return tempStorageDir;
        if (key === 'STORAGE_VIDEO_ROOT') return tempVideoDir;
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
    if (fs.existsSync(tempVideoDir)) {
      fs.rmSync(tempVideoDir, { recursive: true, force: true });
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

  describe('video storage', () => {
    it('harus mengembalikan video storage root yang valid', () => {
      const videoRoot = service.getVideoStorageRoot();
      expect(videoRoot).toBeDefined();
      expect(typeof videoRoot).toBe('string');
      expect(fs.existsSync(videoRoot)).toBe(true);
    });

    it('harus dapat membaca daftar berkas video via listVideos dan melakukan encode URI', async () => {
      const testFile = path.join(tempVideoDir, 'sample video test.mp4');
      fs.writeFileSync(testFile, 'dummy-video-content');

      const list = await service.listVideos();
      expect(Array.isArray(list)).toBe(true);
      const found = list.find((v) => v.filename === 'sample video test.mp4');
      expect(found).toBeDefined();
      expect(found?.url).toBe('/storage/video/sample%20video%20test.mp4');
    });

    it('harus menolak upaya path traversal pada streaming video', async () => {
      const mockRes = {
        writeHead: () => {},
        status: () => ({ setHeader: () => ({ end: () => {} }) }),
      } as unknown as any;

      await expect(service.streamVideo('../etc/passwd', undefined, mockRes)).rejects.toThrow(
        BadRequestException
      );
    });

    it('harus menolak berkas dengan ekstensi di luar allowlist media', async () => {
      const disallowedFile = path.join(tempVideoDir, 'secret.env');
      fs.writeFileSync(disallowedFile, 'SECRET_KEY=12345');

      const mockRes = {
        writeHead: () => {},
        status: () => ({ setHeader: () => ({ end: () => {} }) }),
      } as unknown as any;

      await expect(service.streamVideo('secret.env', undefined, mockRes)).rejects.toThrow(
        /tidak diizinkan untuk streaming media/
      );
    });

    it('harus menolak target jika berupa direktori (bukan file reguler)', async () => {
      const subDir = path.join(tempVideoDir, 'subfolder.mp4');
      fs.mkdirSync(subDir);

      const mockRes = {
        writeHead: () => {},
        status: () => ({ setHeader: () => ({ end: () => {} }) }),
      } as unknown as any;

      await expect(service.streamVideo('subfolder.mp4', undefined, mockRes)).rejects.toThrow(
        /bukan berkas reguler/
      );
    });

    it('harus melayani video 200 OK lengkap saat tidak ada header Range', async () => {
      const testFile = path.join(tempVideoDir, 'movie.mp4');
      const content = Buffer.alloc(1000, 1);
      fs.writeFileSync(testFile, content);

      let writtenStatus = 0;
      let writtenHeaders: any = {};
      const chunks: Buffer[] = [];

      const mockRes: any = new (await import('node:stream')).PassThrough();
      mockRes.writeHead = (status: number, headers: any) => {
        writtenStatus = status;
        writtenHeaders = headers;
      };
      mockRes.on('data', (c: Buffer) => chunks.push(c));

      await service.streamVideo('movie.mp4', undefined, mockRes);

      // Tunggu stream selesai
      await new Promise((resolve) => mockRes.on('finish', resolve));

      expect(writtenStatus).toBe(200);
      expect(writtenHeaders['Content-Length']).toBe(1000);
      expect(writtenHeaders['Content-Type']).toBe('video/mp4');
      expect(writtenHeaders['Accept-Ranges']).toBe('bytes');
      expect(Buffer.concat(chunks).length).toBe(1000);
    });

    it('harus melayani 206 Partial Content dengan HTTP Range normal', async () => {
      const testFile = path.join(tempVideoDir, 'clip.mp4');
      const content = Buffer.alloc(1000, 7);
      fs.writeFileSync(testFile, content);

      let writtenStatus = 0;
      let writtenHeaders: any = {};
      const chunks: Buffer[] = [];

      const mockRes: any = new (await import('node:stream')).PassThrough();
      mockRes.writeHead = (status: number, headers: any) => {
        writtenStatus = status;
        writtenHeaders = headers;
      };
      mockRes.on('data', (c: Buffer) => chunks.push(c));

      await service.streamVideo('clip.mp4', 'bytes=100-299', mockRes);
      await new Promise((resolve) => mockRes.on('finish', resolve));

      expect(writtenStatus).toBe(206);
      expect(writtenHeaders['Content-Range']).toBe('bytes 100-299/1000');
      expect(writtenHeaders['Content-Length']).toBe(200);
      expect(writtenHeaders['Content-Type']).toBe('video/mp4');
      expect(Buffer.concat(chunks).length).toBe(200);
    });

    it('harus melayani suffix Range bytes=-500 (mengambil N byte terakhir)', async () => {
      const testFile = path.join(tempVideoDir, 'suffix.mp4');
      const content = Buffer.alloc(1000, 9);
      fs.writeFileSync(testFile, content);

      let writtenStatus = 0;
      let writtenHeaders: any = {};
      const chunks: Buffer[] = [];

      const mockRes: any = new (await import('node:stream')).PassThrough();
      mockRes.writeHead = (status: number, headers: any) => {
        writtenStatus = status;
        writtenHeaders = headers;
      };
      mockRes.on('data', (c: Buffer) => chunks.push(c));

      await service.streamVideo('suffix.mp4', 'bytes=-500', mockRes);
      await new Promise((resolve) => mockRes.on('finish', resolve));

      expect(writtenStatus).toBe(206);
      expect(writtenHeaders['Content-Range']).toBe('bytes 500-999/1000');
      expect(writtenHeaders['Content-Length']).toBe(500);
      expect(Buffer.concat(chunks).length).toBe(500);
    });

    it('harus memotong range yang melebihi ukuran file (bytes=0-999999 pada file 1000 byte) sesuai RFC 9110', async () => {
      const testFile = path.join(tempVideoDir, 'clamp.mp4');
      const content = Buffer.alloc(1000, 2);
      fs.writeFileSync(testFile, content);

      let writtenStatus = 0;
      let writtenHeaders: any = {};
      const chunks: Buffer[] = [];

      const mockRes: any = new (await import('node:stream')).PassThrough();
      mockRes.writeHead = (status: number, headers: any) => {
        writtenStatus = status;
        writtenHeaders = headers;
      };
      mockRes.on('data', (c: Buffer) => chunks.push(c));

      await service.streamVideo('clamp.mp4', 'bytes=0-999999', mockRes);
      await new Promise((resolve) => mockRes.on('finish', resolve));

      expect(writtenStatus).toBe(206);
      expect(writtenHeaders['Content-Range']).toBe('bytes 0-999/1000');
      expect(writtenHeaders['Content-Length']).toBe(1000);
      expect(Buffer.concat(chunks).length).toBe(1000);
    });

    it('harus mengembalikan 416 Range Not Satisfiable saat Range di luar batas berkas', async () => {
      const testFile = path.join(tempVideoDir, 'out.mp4');
      const content = Buffer.alloc(100, 3);
      fs.writeFileSync(testFile, content);

      let statusCode = 0;
      let headers: Record<string, string> = {};
      let ended = false;

      const mockRes = {
        status: (code: number) => {
          statusCode = code;
          return {
            setHeader: (k: string, v: string) => {
              headers[k] = v;
              return {
                end: () => {
                  ended = true;
                },
              };
            },
          };
        },
      } as unknown as any;

      await service.streamVideo('out.mp4', 'bytes=500-600', mockRes);

      expect(statusCode).toBe(416);
      expect(headers['Content-Range']).toBe('bytes */100');
      expect(ended).toBe(true);
    });

    it('harus mengembalikan 416 Range Not Satisfiable jika berkas berukuran 0 byte saat dipanggil dengan Range', async () => {
      const testFile = path.join(tempVideoDir, 'empty.mp4');
      fs.writeFileSync(testFile, Buffer.alloc(0));

      let statusCode = 0;
      let headers: Record<string, string> = {};
      let ended = false;

      const mockRes = {
        status: (code: number) => {
          statusCode = code;
          return {
            setHeader: (k: string, v: string) => {
              headers[k] = v;
              return {
                end: () => {
                  ended = true;
                },
              };
            },
          };
        },
      } as unknown as any;

      await service.streamVideo('empty.mp4', 'bytes=0-100', mockRes);

      expect(statusCode).toBe(416);
      expect(headers['Content-Range']).toBe('bytes */0');
      expect(ended).toBe(true);
    });
  });
});
