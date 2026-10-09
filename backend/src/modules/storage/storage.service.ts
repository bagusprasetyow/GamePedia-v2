import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import type { StorageFileEntity } from './entities/storage-file.entity.js';
import { validateImageUpload } from './utils/image-validator.js';

/**
 * Service pengelola berkas penyimpanan gambar di direktori data/storage/image
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storageRoot: string;

  constructor(private readonly configService: ConfigService) {
    this.storageRoot = this.resolveStorageRoot();
    this.ensureStorageRootExists();
  }

  /**
   * Menentukan path root penyimpanan data/storage/image
   */
  public resolveStorageRoot(): string {
    const configuredPath = this.configService.get<string>('STORAGE_IMAGE_ROOT');
    if (configuredPath) {
      return path.isAbsolute(configuredPath)
        ? configuredPath
        : path.resolve(process.cwd(), configuredPath);
    }

    // Auto-detection untuk root monorepo
    const candidateA = path.resolve(process.cwd(), '../data/storage/image');
    const candidateB = path.resolve(process.cwd(), 'data/storage/image');

    if (fs.existsSync(candidateA)) {
      return candidateA;
    }
    if (fs.existsSync(candidateB)) {
      return candidateB;
    }

    return candidateA;
  }

  /**
   * Mengembalikan path absolut root penyimpanan
   */
  public getStorageRoot(): string {
    return this.storageRoot;
  }

  /**
   * Memastikan direktori root storage sudah dibuat
   */
  private ensureStorageRootExists(): void {
    if (!fs.existsSync(this.storageRoot)) {
      this.logger.log(`Membuat direktori root storage: ${this.storageRoot}`);
      fs.mkdirSync(this.storageRoot, { recursive: true });
    }
  }

  /**
   * Menyaring dan membersihkan sub-path untuk mencegah serangan path traversal
   *
   * @param rawSubPath Sub-direktori yang dikirim oleh client (misal: '/game', 'game/cover')
   * @returns Sub-path yang telah disanitasi
   */
  public sanitizeSubPath(rawSubPath?: string): string {
    if (!rawSubPath) {
      return '';
    }

    // Normalisasi pemisah direktori dan hapus whitespace
    const normalized = rawSubPath.trim().replace(/\\/g, '/');

    // Cegah path traversal
    if (normalized.includes('..')) {
      this.logger.warn(`Upaya path traversal (..) ditolak: "${rawSubPath}"`);
      throw new BadRequestException('Path traversal (..) tidak diizinkan');
    }

    // Hapus leading dan trailing slash
    const trimmed = normalized.replace(/^\/+/, '').replace(/\/+$/, '');

    // Validasi karakter yang diizinkan (alfanumerik, dash, underscore, slash)
    if (trimmed && !/^[a-zA-Z0-9_\-/]+$/.test(trimmed)) {
      this.logger.warn(`Karakter sub-path tidak diizinkan: "${rawSubPath}"`);
      throw new BadRequestException(
        'Format path tidak valid. Hanya karakter alfanumerik, dash, underscore, dan slash yang diizinkan'
      );
    }

    return trimmed;
  }

  /**
   * Menyimpan berkas gambar yang diunggah ke sub-path direktori data/storage/image
   * Memvalidasi berkas secara ketat melalui pipeline 3-lapis:
   * 1. Extension validation
   * 2. MIME validation
   * 3. Actual image validation (binary magic bytes & signature check)
   *
   * @param file Berkas gambar dari Multer
   * @param rawSubPath Sub-direktori tujuan (contoh: 'game', '/game')
   * @returns Metadata berkas yang berhasil disimpan
   */
  public async saveImage(
    file?: Express.Multer.File,
    rawSubPath?: string
  ): Promise<StorageFileEntity> {
    // Validasi 3 lapis: Ekstensi -> MIME -> Binary Magic Bytes
    const validatedInfo = validateImageUpload(file);

    const subPath = this.sanitizeSubPath(rawSubPath);
    const targetDir = path.resolve(this.storageRoot, subPath);

    const sanitizedLogOriginalName = (file!.originalname || 'unnamed')
      .replace(/[\r\n\t]/g, ' ')
      .trim();

    this.logger.log(
      `Menerima unggahan: "${sanitizedLogOriginalName}" (${(file!.buffer.length / 1024).toFixed(1)} KB, Format: ${validatedInfo.format.toUpperCase()}, MIME: ${validatedInfo.mimeType}) -> Sub-path: "${subPath || '/'}"`
    );

    // Verifikasi keamanan absolut: direktori target harus berada di dalam root storage
    // Menggunakan path.relative() untuk mencegah prefix collision (/root/storage vs /root/storage-evil)
    const normalizedRoot = path.resolve(this.storageRoot);
    const relativeDir = path.relative(normalizedRoot, targetDir);
    const isDirInsideRoot = !relativeDir.startsWith('..') && !path.isAbsolute(relativeDir);

    if (!isDirInsideRoot) {
      this.logger.error(
        `Pelanggaran ruang direktori: Target "${targetDir}" berada di luar "${normalizedRoot}"`
      );
      throw new BadRequestException('Akses direktori di luar ruang penyimpanan ditolak');
    }

    // Buat direktori sub-path secara rekursif jika belum ada
    if (!fs.existsSync(targetDir)) {
      this.logger.log(`Membuat direktori baru di storage: ${targetDir}`);
      await fs.promises.mkdir(targetDir, { recursive: true });
    }

    // Perlindungan symlink escape: pastikan canonical realpath dari direktori target tetap berada di root storage
    const canonicalRoot = fs.existsSync(normalizedRoot)
      ? await fs.promises.realpath(normalizedRoot)
      : normalizedRoot;
    const canonicalTargetDir = await fs.promises.realpath(targetDir);
    const relativeCanonicalDir = path.relative(canonicalRoot, canonicalTargetDir);
    if (relativeCanonicalDir.startsWith('..') || path.isAbsolute(relativeCanonicalDir)) {
      this.logger.error(
        `Pelanggaran symlink escape: Canonical path "${canonicalTargetDir}" berada di luar root "${canonicalRoot}"`
      );
      throw new BadRequestException('Akses direktori di luar ruang penyimpanan ditolak');
    }

    // Format nama file unik untuk mencegah tubrukan nama
    const ext = validatedInfo.extension;
    const randomHex = crypto.randomUUID().slice(0, 8);
    const uniqueFilename = `${Date.now()}-${randomHex}${ext}`;
    const targetFilePath = path.join(targetDir, uniqueFilename);

    // Verifikasi keamanan target file agar tetap di dalam root storage
    const relativeFile = path.relative(normalizedRoot, targetFilePath);
    if (relativeFile.startsWith('..') || path.isAbsolute(relativeFile)) {
      this.logger.error(
        `Pelanggaran ruang direktori: File "${targetFilePath}" berada di luar "${normalizedRoot}"`
      );
      throw new BadRequestException('Akses berkas di luar ruang penyimpanan ditolak');
    }

    // Tulis berkas ke filesystem secara atomic menggunakan file sementara (.tmp) lalu rename
    const tempFilePath = `${targetFilePath}.${crypto.randomUUID().slice(0, 8)}.tmp`;
    try {
      await fs.promises.writeFile(tempFilePath, file!.buffer);
      await fs.promises.rename(tempFilePath, targetFilePath);
    } catch (writeErr) {
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath).catch(() => {});
      }
      throw writeErr;
    }

    // Format URL publik dan path relatif
    const urlSubPath = subPath ? `${subPath}/` : '';
    const publicUrl = `/storage/image/${urlSubPath}${uniqueFilename}`;
    const relativePath = `data/storage/image/${urlSubPath}${uniqueFilename}`;

    this.logger.log(
      `✓ Berkas berhasil disimpan: "${uniqueFilename}" -> Relatif: "${relativePath}" -> URL: "${publicUrl}"`
    );

    return {
      filename: uniqueFilename,
      originalName: file!.originalname,
      subPath,
      relativeFilePath: relativePath,
      url: publicUrl,
      size: file!.buffer.length,
      mimeType: validatedInfo.mimeType,
    };
  }

  /**
   * Menghapus berkas dari ruang penyimpanan berdasarkan path relatifnya
   * Dilengkapi sanitasi path traversal dan verifikasi symlink canonical path
   *
   * @param rawFilePath Path berkas relatif dari storage (contoh: "game/17200-abc.webp" atau "/storage/image/game/17200-abc.webp")
   * @returns true jika berkas berhasil dihapus, false jika berkas tidak ditemukan
   */
  public async deleteFile(rawFilePath: string): Promise<boolean> {
    if (!rawFilePath || typeof rawFilePath !== 'string') {
      throw new BadRequestException('Path berkas yang akan dihapus wajib diisi');
    }

    // Bersihkan prefix URL umum jika disertakan client (/storage/image/ atau data/storage/image/)
    let cleaned = rawFilePath
      .trim()
      .replace(/\\/g, '/')
      .replace(/^\/?storage\/image\//, '')
      .replace(/^data\/storage\/image\//, '')
      .replace(/^\/+/, '');

    if (cleaned.includes('..')) {
      throw new BadRequestException('Path traversal (..) tidak diizinkan');
    }

    const normalizedRoot = path.resolve(this.storageRoot);
    const targetFilePath = path.resolve(normalizedRoot, cleaned);

    const relative = path.relative(normalizedRoot, targetFilePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new BadRequestException('Akses penghapusan berkas di luar ruang penyimpanan ditolak');
    }

    if (!fs.existsSync(targetFilePath)) {
      return false;
    }

    // Verifikasi realpath symlink
    const canonicalRoot = fs.existsSync(normalizedRoot)
      ? await fs.promises.realpath(normalizedRoot)
      : normalizedRoot;
    const canonicalTarget = await fs.promises.realpath(targetFilePath);
    const relativeCanonical = path.relative(canonicalRoot, canonicalTarget);

    if (relativeCanonical.startsWith('..') || path.isAbsolute(relativeCanonical)) {
      throw new BadRequestException('Akses penghapusan berkas di luar ruang penyimpanan ditolak');
    }

    await fs.promises.unlink(targetFilePath);
    this.logger.log(`✓ Berkas storage berhasil dihapus: "${cleaned}"`);
    return true;
  }
}
