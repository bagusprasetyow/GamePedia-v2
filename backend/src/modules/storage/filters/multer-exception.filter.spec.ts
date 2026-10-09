import { describe, it, expect, vi } from 'vitest';
import { HttpStatus, type ArgumentsHost } from '@nestjs/common';
import multer from 'multer';
import { MulterExceptionFilter } from './multer-exception.filter.js';

describe('MulterExceptionFilter', () => {
  const createMockArgumentsHost = () => {
    const mockJson = vi.fn();
    const mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    const mockResponse = {
      status: mockStatus,
    };

    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    return { host, mockStatus, mockJson };
  };

  it('harus memetakan LIMIT_FILE_SIZE ke status 413 Payload Too Large', () => {
    const filter = new MulterExceptionFilter();
    const { host, mockStatus, mockJson } = createMockArgumentsHost();

    const exception = new multer.MulterError('LIMIT_FILE_SIZE');

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.PAYLOAD_TOO_LARGE);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 413,
        error: 'Payload Too Large',
        message: expect.stringContaining('Ukuran berkas melebihi batas maksimum'),
      })
    );
  });

  it('harus memetakan LIMIT_FILE_COUNT ke status 400 Bad Request', () => {
    const filter = new MulterExceptionFilter();
    const { host, mockStatus, mockJson } = createMockArgumentsHost();

    const exception = new multer.MulterError('LIMIT_FILE_COUNT');

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
        message: expect.stringContaining('Hanya satu berkas'),
      })
    );
  });

  it('harus memetakan error Multer lainnya ke status 400 Bad Request secara graceful', () => {
    const filter = new MulterExceptionFilter();
    const { host, mockStatus, mockJson } = createMockArgumentsHost();

    const exception = new multer.MulterError('LIMIT_PART_COUNT');

    filter.catch(exception, host);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
      })
    );
  });
});
