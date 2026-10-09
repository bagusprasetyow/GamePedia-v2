import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  // Layani berkas statis gambar dari root direktori data/storage/image
  const storageRoot = storageService.getStorageRoot();
  app.useStaticAssets(storageRoot, {
    prefix: '/storage/image/',
  });
  logger.log(`Storage root gambar disetel ke: ${storageRoot}`);
  logger.log(`Static serving aktif pada prefix: /storage/image/`);

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
