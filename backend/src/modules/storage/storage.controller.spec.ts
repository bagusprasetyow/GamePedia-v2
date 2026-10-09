import { describe, it, expect, vi } from 'vitest';
import { StorageController } from './storage.controller.js';
import type { StorageService } from './storage.service.js';
import type { StorageFileEntity } from './entities/storage-file.entity.js';

describe('StorageController', () => {
  it('harus memanggil storageService.saveImage dan mengembalikan format respons terstruktur', async () => {
    const mockResult: StorageFileEntity = {
      filename: '1712345678-abc12345.webp',
      originalName: 'cover.webp',
      subPath: 'game',
      relativeFilePath: 'data/storage/image/game/1712345678-abc12345.webp',
      url: '/storage/image/game/1712345678-abc12345.webp',
      size: 51200,
      mimeType: 'image/webp',
    };

    const saveImageSpy = vi.fn().mockResolvedValue(mockResult);
    const mockStorageService = {
      saveImage: saveImageSpy,
    } as unknown as StorageService;

    const controller = new StorageController(mockStorageService);

    const mockFile = {
      fieldname: 'file',
      originalname: 'cover.webp',
      mimetype: 'image/webp',
      buffer: Buffer.from('data'),
      size: 4,
    } as Express.Multer.File;

    const response = await controller.uploadImage(mockFile, { path: '/game' });

    expect(saveImageSpy).toHaveBeenCalledWith(mockFile, '/game');
    expect(response).toEqual({
      success: true,
      message: 'Gambar berhasil disimpan',
      data: mockResult,
    });
  });
});
