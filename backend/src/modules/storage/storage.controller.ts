import {
  Controller,
  Post,
  Get,
  Delete,
  Req,
  Headers,
  Res,
  Query,
  UploadedFile,
  UseInterceptors,
  UseFilters,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
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

  /**
   * Mengambil daftar berkas video yang tersimpan di direktori data/storage/video
   */
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Get('video')
  public async getVideos(): Promise<{
    success: boolean;
    data: Array<{ filename: string; size: number; url: string }>;
  }> {
    const videos = await this.storageService.listVideos();
    return {
      success: true,
      data: videos,
    };
  }

  /**
   * Mengalirkan berkas video dengan dukungan chunking & HTTP Range requests (206 Partial Content)
   * Mendukung berkas tunggal maupun berkas bertingkat dalam folder (seperti Genshin-Impact/master.m3u8)
   * Dilindungi rate limiting (maksimal 600 chunk request per menit) untuk burst segmen HLS
   */
  @Throttle({ default: { limit: 600, ttl: 60_000 } })
  @Get('video/*path')
  public async streamVideo(
    @Req() req: Request,
    @Headers('range') range: string | undefined,
    @Res() res: Response
  ): Promise<void> {
    // Dukungan multi-format routing Express:
    // Pada Express 5 / path-to-regexp v8+, parameter wildcard (*path) menghasilkan array string jika bertingkat
    // atau string jika berkas tunggal. Disediakan fallback ke req.params[0] dan ekstraksi langsung dari req.url.
    const paramPath = (req.params as Record<string, string | string[] | undefined>)?.path;
    let rawPath = Array.isArray(paramPath)
      ? paramPath.join('/')
      : typeof paramPath === 'string'
        ? paramPath
        : (req.params as Record<string, string | undefined>)?.[0];

    if (!rawPath) {
      const prefix = '/storage/video/';
      const urlPath = req.url.split('?')[0];
      const idx = urlPath.indexOf(prefix);
      if (idx !== -1) {
        rawPath = urlPath.substring(idx + prefix.length);
      }
    }

    let decodedPath = rawPath || '';
    try {
      decodedPath = decodeURIComponent(decodedPath);
    } catch {
      // Fallback jika string bukan format URI encoding yang valid
    }

    await this.storageService.streamVideo(decodedPath, range, res);
  }
}

