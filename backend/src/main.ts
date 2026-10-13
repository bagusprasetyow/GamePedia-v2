import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module.js';
import { StorageService } from './modules/storage/index.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const storageService = app.get(StorageService);

  // Pasang interceptor global untuk logging seluruh request/response HTTP
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Middleware keamanan: proteksi allowlist ekstensi dan path traversal untuk static serving
  // SVG sengaja dikecualikan (dapat memuat konten aktif dari origin sama → risiko XSS)
  const ALLOWED_VIDEO_STATIC_REGEX =
    /\.(mp4|webm|ogg|mov|mkv|m3u8|ts|m4s|vtt|jpe?g|png|webp)$/i;
  const ALLOWED_IMAGE_STATIC_REGEX = /\.(jpe?g|png|webp|gif|avif)$/i;

  app.use((req: Request, res: Response, next: NextFunction) => {
    const rawPath = req.path || '';
    if (rawPath.startsWith('/storage/image/')) {
      if (rawPath.includes('..') || rawPath.includes('%2e') || rawPath.includes('%2E')) {
        res.status(403).json({ statusCode: 403, message: 'Akses terlarang' });
        return;
      }
      if (!ALLOWED_IMAGE_STATIC_REGEX.test(rawPath)) {
        res.status(403).json({ statusCode: 403, message: 'Ekstensi berkas gambar tidak diizinkan' });
        return;
      }
    } else if (rawPath.startsWith('/storage/video/') || rawPath.startsWith('/videos/')) {
      if (rawPath.includes('..') || rawPath.includes('%2e') || rawPath.includes('%2E')) {
        res.status(403).json({ statusCode: 403, message: 'Akses terlarang' });
        return;
      }
      if (!ALLOWED_VIDEO_STATIC_REGEX.test(rawPath)) {
        res.status(403).json({ statusCode: 403, message: 'Ekstensi berkas media tidak diizinkan' });
        return;
      }
    }
    next();
  });

  // Layani berkas statis gambar dari root direktori data/storage/image
  const storageRoot = storageService.getStorageRoot();
  app.useStaticAssets(storageRoot, {
    prefix: '/storage/image/',
  });
  logger.log(`Storage root gambar disetel ke: ${storageRoot}`);
  logger.log(`Static serving aktif pada prefix: /storage/image/`);

  // Layani berkas statis video dari root direktori data/storage/video
  // Catatan: static serving hanya untuk performa HLS/VTT.
  // Validasi ekstensi & traversal dilakukan oleh middleware di atas.
  // Symlink risk dimitigasi dengan memastikan direktori videoStorageRoot bersih (tanpa symlink ke luar).
  const videoStorageRoot = storageService.getVideoStorageRoot();
  app.useStaticAssets(videoStorageRoot, {
    prefix: '/storage/video/',
  });
  // Dukungan kompatibilitas berkas manifest HLS / VTT dengan prefix internal /videos/Video-Trailer/ dan /videos/
  app.useStaticAssets(videoStorageRoot, {
    prefix: '/videos/Video-Trailer/',
  });
  app.useStaticAssets(videoStorageRoot, {
    prefix: '/videos/',
  });
  logger.log(`Storage root video disetel ke: ${videoStorageRoot}`);
  logger.log(`Static serving aktif pada prefix: /storage/video/ dan /videos/`);

  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3003'),
    credentials: true,
  });

  const port = configService.get<number>('PORT', 4003);
  await app.listen(port);
  logger.log(`GamePedia Backend berjalan di http://localhost:${port}`);
}
await bootstrap();
