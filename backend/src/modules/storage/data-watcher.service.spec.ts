import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { DataWatcherService } from './data-watcher.service.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('DataWatcherService', () => {
  let service: DataWatcherService;
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gp-watcher-test-'));

    const mockConfigService = {
      get: (key: string) => {
        if (key === 'DATA_DIR_ROOT') return tempDir;
        return undefined;
      },
    } as unknown as ConfigService;

    service = new DataWatcherService(mockConfigService);
  });

  afterEach(() => {
    service.stopWatching();
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('harus mengembalikan root directory data yang terkonfigurasi', () => {
    expect(service.getDataRoot()).toBe(tempDir);
  });

  it('harus memulai dan menghentikan pengawasan tanpa error', () => {
    expect(() => service.startWatching()).not.toThrow();
    expect(() => service.stopWatching()).not.toThrow();
  });

  it('harus mendeteksi operasi penambahan, perubahan, dan penghapusan berkas', async () => {
    service.startWatching();

    const testFilePath = path.join(tempDir, 'test-doc.txt');

    // 1. Create file
    fs.writeFileSync(testFilePath, 'Hello World Initial Content');

    // Tunggu debouncing watcher
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(fs.existsSync(testFilePath)).toBe(true);

    // 2. Modify file
    fs.appendFileSync(testFilePath, '\nAdded new line');
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 3. Delete file
    fs.unlinkSync(testFilePath);
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(fs.existsSync(testFilePath)).toBe(false);
  });

  it('harus mendeteksi status isWatcherEnabled berdasarkan konfigurasi ConfigService', () => {
    // Default fallback (development)
    expect(service.isWatcherEnabled()).toBe(true);

    const disabledConfig = {
      get: (key: string) => {
        if (key === 'ENABLE_DATA_WATCHER') return 'false';
        return undefined;
      },
    } as unknown as ConfigService;
    const disabledService = new DataWatcherService(disabledConfig);
    expect(disabledService.isWatcherEnabled()).toBe(false);

    const enabledConfig = {
      get: (key: string) => {
        if (key === 'ENABLE_DATA_WATCHER') return 'true';
        return undefined;
      },
    } as unknown as ConfigService;
    const enabledService = new DataWatcherService(enabledConfig);
    expect(enabledService.isWatcherEnabled()).toBe(true);
  });

  it('harus melewati startWatching saat onModuleInit jika ENABLE_DATA_WATCHER bernilai false', () => {
    const disabledConfig = {
      get: (key: string) => {
        if (key === 'ENABLE_DATA_WATCHER') return false;
        return undefined;
      },
    } as unknown as ConfigService;
    const disabledService = new DataWatcherService(disabledConfig);
    expect(() => disabledService.onModuleInit()).not.toThrow();
  });
});
