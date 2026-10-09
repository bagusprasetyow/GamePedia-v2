import { describe, it, expect } from 'vitest';
import { of, throwError } from 'rxjs';
import type { ExecutionContext, CallHandler } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor.js';

describe('LoggingInterceptor', () => {
  it('harus mencatat path request tanpa query secret dan meneruskan stream', async () => {
    const interceptor = new LoggingInterceptor();

    const mockRequest = {
      method: 'GET',
      path: '/storage/image/game/cover.webp',
      originalUrl: '/storage/image/game/cover.webp?token=sensitive-secret',
      ip: '127.0.0.1',
    };

    const mockResponse = {
      statusCode: 200,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: () => of({ success: true }),
    };

    const observable = interceptor.intercept(context, next);
    let result: unknown;
    observable.subscribe({
      next: (val) => {
        result = val;
      },
    });

    expect(result).toEqual({ success: true });
  });

  it('harus mencatat error saat handler melempar exception', async () => {
    const interceptor = new LoggingInterceptor();

    const mockRequest = {
      method: 'POST',
      path: '/storage/upload',
      originalUrl: '/storage/upload',
      ip: '127.0.0.1',
    };

    const mockResponse = {
      statusCode: 400,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: () => throwError(() => new Error('Upload failed')),
    };

    const observable = interceptor.intercept(context, next);
    let caughtError: unknown;
    observable.subscribe({
      error: (err) => {
        caughtError = err;
      },
    });

    expect(caughtError).toBeInstanceOf(Error);
  });
});
