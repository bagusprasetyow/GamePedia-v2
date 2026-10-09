import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import multer from 'multer';

/**
 * Filter penangkap error Multer khusus untuk endpoint unggah berkas
 * Memetakan error ukuran berkas (LIMIT_FILE_SIZE) ke status HTTP 413 Payload Too Large
 * dan error batasan lainnya ke HTTP 400 Bad Request
 */
@Catch(multer.MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MulterExceptionFilter.name);

  public catch(exception: multer.MulterError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.warn(`Multer upload error tertangkap: [${exception.code}] ${exception.message}`);

    let status = HttpStatus.BAD_REQUEST;
    let message = exception.message;

    switch (exception.code) {
      case 'LIMIT_FILE_SIZE':
        status = HttpStatus.PAYLOAD_TOO_LARGE;
        message = 'Ukuran berkas melebihi batas maksimum yang diizinkan';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Hanya satu berkas yang diizinkan untuk diunggah sekaligus';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Jumlah parameter request melebihi batas yang diizinkan (maksimal 2 bagian)';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = `Field unggahan tidak terduga: "${exception.field || 'file'}"`;
        break;
      default:
        message = `Gagal memproses berkas unggahan: ${exception.message}`;
        break;
    }

    response.status(status).json({
      statusCode: status,
      error: status === HttpStatus.PAYLOAD_TOO_LARGE ? 'Payload Too Large' : 'Bad Request',
      message,
    });
  }
}
