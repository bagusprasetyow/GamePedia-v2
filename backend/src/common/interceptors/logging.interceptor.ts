import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';

/**
 * Global Logging Interceptor
 *
 * Mencatat seluruh request dan response HTTP yang masuk ke backend,
 * termasuk method, URL rute, kode status HTTP, dan durasi eksekusi (latency ms).
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    if (!req) {
      return next.handle();
    }

    const { method, path: reqPath, originalUrl, ip } = req;
    const requestPath = reqPath || originalUrl?.split('?')[0] || '/';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = res.statusCode;
          this.logger.log(
            `[${method}] ${requestPath} -> ${statusCode} (${duration}ms) - IP: ${ip || '127.0.0.1'}`
          );
        },
        error: (error: Error & { status?: number }) => {
          const duration = Date.now() - startTime;
          const status = error?.status || 500;
          this.logger.error(
            `[${method}] ${requestPath} -> ${status} (${duration}ms) - Error: ${error.message}`
          );
        },
      })
    );
  }
}
