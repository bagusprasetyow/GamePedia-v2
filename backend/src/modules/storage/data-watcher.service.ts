import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface FileSnapshot {
  size: number;
  mtimeMs: number;
  isDirectory: boolean;
}

/**
 * DataWatcherService
 *
 * Dirancang sebagai CONVENIENCE REALTIME WATCHER (best-effort pengamat berkas eksternal)
 * terutama untuk local/development workflow dan observasi perubahan berkas manual di luar aplikasi.
 *
 * PENTING (Architectural Boundary):
 * - Service ini BUKAN sumber kebenaran utama (Single Source of Truth) bagi database atau core event system.
 * - Mutasi data bisnis penting GamePedia harus selalu berasal dari Application/Domain Event
 *   atau persistence repository layer secara eksplisit.
 * - fs.watch() memiliki semantik berbeda di berbagai platform OS/container/cloud/VM;
 *   oleh karena itu, service ini bersifat non-blocking dan kegagalan inisialisasi fs.watch()
 *   tidak akan menggagalkan startup aplikasi server.
 */
@Injectable()
export class DataWatcherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('DataWatcher');
  private readonly dataRoot: string;
  private watcher: fs.FSWatcher | null = null;
  private readonly knownFiles = new Map<string, FileSnapshot>();
  private readonly pendingDebounces = new Map<string, NodeJS.Timeout>();

  constructor(private readonly configService: ConfigService) {
    this.dataRoot = this.resolveDataRoot();
  }

  /**
   * Menentukan lokasi absolut direktori data/ monorepo
   */
  public resolveDataRoot(): string {
    const configuredPath = this.configService.get<string>('DATA_DIR_ROOT');
    if (configuredPath) {
      return path.isAbsolute(configuredPath)
        ? configuredPath
        : path.resolve(process.cwd(), configuredPath);
    }

    const candidateA = path.resolve(process.cwd(), '../data');
    const candidateB = path.resolve(process.cwd(), 'data');

    if (fs.existsSync(candidateA)) {
      return candidateA;
    }
    if (fs.existsSync(candidateB)) {
      return candidateB;
    }

    return candidateA;
  }

  /**
   * Mengembalikan path absolut direktori data
   */
  public getDataRoot(): string {
    return this.dataRoot;
  }

  /**
   * Memeriksa apakah pengawasan filesystem diaktifkan berdasarkan konfigurasi
   * Default: aktif di development, non-aktif di production
   */
  public isWatcherEnabled(): boolean {
    const configured = this.configService.get<string | boolean>('ENABLE_DATA_WATCHER');
    if (configured !== undefined && configured !== null) {
      if (typeof configured === 'boolean') {
        return configured;
      }
      return String(configured).toLowerCase() === 'true';
    }

    return process.env.NODE_ENV !== 'production';
  }

  /**
   * Menginisialisasi pemindaian awal dan memulai watcher saat modul dimuat
   */
  public onModuleInit(): void {
    if (!this.isWatcherEnabled()) {
      this.logger.log(
        'DataWatcher dinonaktifkan berdasarkan konfigurasi ENABLE_DATA_WATCHER'
      );
      return;
    }
    this.startWatching();
  }

  /**
   * Menghentikan watcher saat modul dihentikan
   */
  onModuleDestroy(): void {
    this.stopWatching();
  }

  /**
   * Memindai seluruh berkas di dalam data/ untuk membangun baseline state
   */
  private scanDirectoryBaseline(dir: string): void {
    try {
      if (!fs.existsSync(dir)) return;

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(this.dataRoot, fullPath).replace(/\\/g, '/');

        try {
          const stat = fs.statSync(fullPath);
          this.knownFiles.set(relPath, {
            size: stat.size,
            mtimeMs: stat.mtimeMs,
            isDirectory: stat.isDirectory(),
          });

          if (stat.isDirectory()) {
            this.scanDirectoryBaseline(fullPath);
          }
        } catch {
          // Abaikan berkas sementara atau yang terkunci
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Gagal memindai baseline direktori "${dir}": ${errMsg}`);
    }
  }

  /**
   * Memulai pengawasan berkas di direktori data/
   */
  public startWatching(): void {
    if (!fs.existsSync(this.dataRoot)) {
      try {
        fs.mkdirSync(this.dataRoot, { recursive: true });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        this.logger.error(`Gagal membuat direktori data: ${errMsg}`);
        return;
      }
    }

    // Bangun pemetaan baseline berkas eksisting
    this.scanDirectoryBaseline(this.dataRoot);

    try {
      this.watcher = fs.watch(
        this.dataRoot,
        { recursive: true },
        (_eventType: string, filename: string | null) => {
          if (!filename) return;
          this.handleFileChangeDebounced(filename);
        }
      );

      this.logger.log(`✓ Pengawas filesystem aktif memantau direktori: ${this.dataRoot}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Gagal menginisialisasi fs.watch pada "${this.dataRoot}": ${errMsg}`);
    }
  }

  /**
   * Menghentikan pengawasan berkas
   */
  public stopWatching(): void {
    // Bersihkan timer debounce yang masih tertunda
    for (const timer of this.pendingDebounces.values()) {
      clearTimeout(timer);
    }
    this.pendingDebounces.clear();

    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      this.logger.log('Pengawas filesystem data/ telah dihentikan');
    }
  }

  /**
   * Menangani event perubahan berkas dengan peredam debounce (150ms)
   */
  private handleFileChangeDebounced(rawFilename: string): void {
    const relPath = rawFilename.replace(/\\/g, '/');

    // Batalkan timer sebelumnya jika berkas yang sama menerima rentetan event
    const existingTimer = this.pendingDebounces.get(relPath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.pendingDebounces.delete(relPath);
      this.processFileEvent(relPath);
    }, 150);

    this.pendingDebounces.set(relPath, timer);
  }

  /**
   * Memproses dan mengklasifikasikan event CRUD pada berkas
   */
  private processFileEvent(relPath: string): void {
    const fullPath = path.join(this.dataRoot, relPath);
    const displayPath = `data/${relPath}`;
    const previousSnapshot = this.knownFiles.get(relPath);

    const exists = fs.existsSync(fullPath);

    if (!exists) {
      // 1. DELETE EVENT
      if (previousSnapshot) {
        this.knownFiles.delete(relPath);
        const typeLabel = previousSnapshot.isDirectory ? 'Direktori' : 'Berkas';
        this.logger.warn(`[DELETE] ${typeLabel} dihapus: "${displayPath}"`);
      }
      return;
    }

    try {
      const stat = fs.statSync(fullPath);
      const isDirectory = stat.isDirectory();
      const currentSnapshot: FileSnapshot = {
        size: stat.size,
        mtimeMs: stat.mtimeMs,
        isDirectory,
      };

      if (!previousSnapshot) {
        // 2. CREATE EVENT
        this.knownFiles.set(relPath, currentSnapshot);
        const sizeInfo = isDirectory
          ? 'Direktori'
          : `${(stat.size / 1024).toFixed(1)} KB`;
        this.logger.log(`[CREATE] ${isDirectory ? 'Direktori baru' : 'Berkas baru'} terdeteksi: "${displayPath}" (${sizeInfo})`);
      } else {
        // 3. MODIFY EVENT
        const isModified =
          stat.mtimeMs !== previousSnapshot.mtimeMs ||
          stat.size !== previousSnapshot.size;

        if (isModified && !isDirectory) {
          this.knownFiles.set(relPath, currentSnapshot);
          const sizeInfo = `${(stat.size / 1024).toFixed(1)} KB`;
          this.logger.log(`[MODIFY] Berkas diubah: "${displayPath}" (${sizeInfo})`);
        }
      }
    } catch {
      // Penanganan berkas sementara yang langsung hilang
    }
  }
}
