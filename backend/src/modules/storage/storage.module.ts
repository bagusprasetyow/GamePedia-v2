import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageController } from './storage.controller.js';
import { StorageService } from './storage.service.js';
import { DataWatcherService } from './data-watcher.service.js';
import { MulterExceptionFilter } from './filters/multer-exception.filter.js';

/**
 * Modul penyimpanan berkas gambar untuk mengelola upload ke data/storage/image
 * dan pengawasan perubahan filesystem di data/
 */
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const maxFileSizeBytes = Number(
          configService.get<number>('STORAGE_MAX_FILE_SIZE_BYTES', 5 * 1024 * 1024)
        );
        return {
          limits: {
            fileSize: maxFileSizeBytes,
            files: 1,
            parts: 2,
          },
        };
      },
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService, DataWatcherService, MulterExceptionFilter],
  exports: [StorageService, DataWatcherService, MulterExceptionFilter],
})
export class StorageModule {}

