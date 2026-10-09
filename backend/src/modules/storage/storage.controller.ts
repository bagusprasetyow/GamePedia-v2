import {
  Controller,
  Post,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UseFilters,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { StorageService } from './storage.service.js';
import { UploadImageDto } from './dto/upload-image.dto.js';
import type { StorageFileEntity } from './entities/storage-file.entity.js';
import { MulterExceptionFilter } from './filters/multer-exception.filter.js';

/**
 * Controller penyedia API pengunggahan berkas gambar ke sistem penyimpanan GamePedia
 */
@Controller('storage')
@UseFilters(MulterExceptionFilter)
export class StorageController {
  private readonly logger = new Logger(StorageController.name);

  constructor(private readonly storageService: StorageService) {}

  /**
   * Mengunggah berkas gambar tunggal ke sub-path direktori data/storage/image
   * Dilindungi rate limiting (maksimal 20 upload per menit) untuk mencegah abuse & disk exhaustion
   */
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadImageDto
  ): Promise<{
    success: boolean;
    message: string;
    data: StorageFileEntity;
  }> {
    this.logger.log(
      `Endpoint POST /storage/upload dipanggil (target path: "${dto?.path || '/'}")`
    );

    const result = await this.storageService.saveImage(file, dto?.path);

    return {
      success: true,
      message: 'Gambar berhasil disimpan',
      data: result,
    };
  }

  /**
   * Menghapus berkas dari direktori penyimpanan
   * Berguna untuk lifecycle orphan cleanup saat pengguna membatalkan atau mengganti gambar
   */
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Delete('file')
  @HttpCode(HttpStatus.OK)
  public async deleteFile(
    @Query('path') filePath: string
  ): Promise<{
    success: boolean;
    message: string;
    data: { deleted: boolean; path: string };
  }> {
    this.logger.log(`Endpoint DELETE /storage/file dipanggil untuk: "${filePath}"`);
    const deleted = await this.storageService.deleteFile(filePath);

    return {
      success: true,
      message: deleted ? 'Berkas berhasil dihapus' : 'Berkas tidak ditemukan',
      data: { deleted, path: filePath },
    };
  }
}

