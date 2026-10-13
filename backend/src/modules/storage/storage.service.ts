import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import type { StorageFileEntity } from './entities/storage-file.entity.js';
import { validateImageUpload } from './utils/image-validator.js';

/**
 * Service pengelola berkas penyimpanan gambar dan video di direktori data/storage
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storageRoot: string;
  private readonly videoStorageRoot: string;

  constructor(private readonly configService: ConfigService) {
    this.storageRoot = this.resolveStorageRoot();
    this.ensureStorageRootExists();

    this.videoStorageRoot = this.resolveVideoStorageRoot();
    this.ensureVideoStorageRootExists();
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
   * Menentukan path root penyimpanan data/storage/video
   */
  public resolveVideoStorageRoot(): string {
    const configuredPath = this.configService.get<string>('STORAGE_VIDEO_ROOT');
    if (configuredPath) {
      return path.isAbsolute(configuredPath)
        ? configuredPath
        : path.resolve(process.cwd(), configuredPath);
    }

    // Auto-detection untuk root monorepo
    const candidateA = path.resolve(process.cwd(), '../data/storage/video');
    const candidateB = path.resolve(process.cwd(), 'data/storage/video');

    if (fs.existsSync(candidateA)) {
      return candidateA;
    }
    if (fs.existsSync(candidateB)) {
      return candidateB;
    }

    return candidateA;
  }

  /**
   * Mengembalikan path absolut root penyimpanan gambar
   */
  public getStorageRoot(): string {
    return this.storageRoot;
  }

  /**
   * Mengembalikan path absolut root penyimpanan video
   */
  public getVideoStorageRoot(): string {
    return this.videoStorageRoot;
  }

  /**
   * Memastikan direktori root storage gambar sudah dibuat
   */
  private ensureStorageRootExists(): void {
    if (!fs.existsSync(this.storageRoot)) {
      this.logger.log(`Membuat direktori root storage gambar: ${this.storageRoot}`);
      fs.mkdirSync(this.storageRoot, { recursive: true });
    }
  }

  /**
   * Memastikan direktori root storage video sudah dibuat
   */
  private ensureVideoStorageRootExists(): void {
    if (!fs.existsSync(this.videoStorageRoot)) {
      this.logger.log(`Membuat direktori root storage video: ${this.videoStorageRoot}`);
      fs.mkdirSync(this.videoStorageRoot, { recursive: true });
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

  /**
   * Mengalirkan berkas video dari data/storage/video dengan dukungan HTTP Range Requests (206 Partial Content)
   *
   * @param filename Nama berkas video yang diminta (contoh: "test.mp4")
   * @param rangeHeader Header Range dari permintaan client (contoh: "bytes=0-1024000")
   * @param res Objek response Express
   */
  public async streamVideo(
    filename: string,
    rangeHeader: string | undefined,
    res: Response
  ): Promise<void> {
    if (!filename) {
      throw new BadRequestException('Nama berkas video wajib disertakan');
    }

    // Sanitasi nama berkas video
    const cleaned = filename
      .trim()
      .replace(/\\/g, '/')
      .replace(/^storage\/video\//, '')
      .replace(/^data\/storage\/video\//, '')
      .replace(/^\/+/, '');

    if (cleaned.includes('..')) {
      throw new BadRequestException('Path traversal (..) tidak diizinkan');
    }

    // Tentukan Content-Type dan validasi allowlist ekstensi media sebelum operasi I/O disk
    const ext = path.extname(cleaned).toLowerCase();
    const allowedMediaMimeTypes: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mov': 'video/quicktime',
      '.mkv': 'video/x-matroska',
      '.m3u8': 'application/vnd.apple.mpegurl',
      '.ts': 'video/mp2t',
      '.m4s': 'video/iso.segment',
      '.vtt': 'text/vtt',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    };

    const contentType = allowedMediaMimeTypes[ext];
    if (!contentType) {
      this.logger.warn(`Permintaan ekstensi di luar allowlist media ditolak: "${ext}"`);
      throw new BadRequestException(
        `Tipe berkas "${ext || 'tanpa ekstensi'}" tidak diizinkan untuk streaming media`
      );
    }

    const normalizedRoot = path.resolve(this.videoStorageRoot);
    const targetFilePath = path.resolve(normalizedRoot, cleaned);

    const relative = path.relative(normalizedRoot, targetFilePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new BadRequestException('Akses berkas video di luar ruang penyimpanan ditolak');
    }

    if (!fs.existsSync(targetFilePath)) {
      this.logger.warn(`Berkas video tidak ditemukan: "${cleaned}" (${targetFilePath})`);
      throw new NotFoundException(`Berkas video "${cleaned}" tidak ditemukan`);
    }

    // Verifikasi realpath
    const canonicalRoot = fs.existsSync(normalizedRoot)
      ? await fs.promises.realpath(normalizedRoot)
      : normalizedRoot;
    const canonicalTarget = await fs.promises.realpath(targetFilePath);
    const relativeCanonical = path.relative(canonicalRoot, canonicalTarget);

    if (relativeCanonical.startsWith('..') || path.isAbsolute(relativeCanonical)) {
      throw new BadRequestException('Akses berkas video di luar ruang penyimpanan ditolak');
    }

    const stat = await fs.promises.stat(targetFilePath);
    if (!stat.isFile()) {
      this.logger.warn(`Target streaming bukan berkas reguler: "${targetFilePath}"`);
      throw new NotFoundException(`Berkas "${cleaned}" bukan berkas reguler`);
    }

    const fileSize = stat.size;

    if (rangeHeader) {
      // Tangani berkas kosong (0 byte)
      if (fileSize === 0) {
        res.status(416).setHeader('Content-Range', 'bytes */0').end();
        return;
      }

      // Parser HTTP Range (RFC 9110): bytes=start-end, bytes=start-, bytes=-suffix
      // Multi-range (bytes=0-10,20-30) dan unit non-bytes diabaikan → fallback 200 (RFC 9110 §14.2)
      const rangeMatch = rangeHeader.trim().match(/^bytes=(\d*)-(\d*)$/);

      if (rangeMatch) {
        const rawStart = rangeMatch[1];
        const rawEnd = rangeMatch[2];

        let start: number;
        let end: number;

        if (rawStart === '' && rawEnd === '') {
          // Range malformed: "bytes=-"
          res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
          return;
        } else if (rawStart === '') {
          // Suffix range: bytes=-500 (mengambil N byte terakhir)
          const suffix = parseInt(rawEnd, 10);
          if (isNaN(suffix) || suffix <= 0) {
            res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
            return;
          }
          start = Math.max(0, fileSize - suffix);
          end = fileSize - 1;
        } else {
          start = parseInt(rawStart, 10);
          if (isNaN(start) || start < 0 || start >= fileSize) {
            res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
            return;
          }

          if (rawEnd === '') {
            // Prefix range: bytes=start-
            end = fileSize - 1;
          } else {
            end = parseInt(rawEnd, 10);
            if (isNaN(end) || end < start) {
              res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
              return;
            }
            // Potong jika melampaui batas akhir berkas sesuai RFC 9110
            if (end >= fileSize) {
              end = fileSize - 1;
            }
          }
        }

        const chunkSize = end - start + 1;
        const fileStream = fs.createReadStream(targetFilePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': contentType,
        });

        // Penanganan error stream & client disconnection
        fileStream.on('error', (err) => {
          this.logger.error(`Error pada ReadStream video: ${err.message}`);
          if (!res.headersSent) {
            res.status(500).end();
          } else {
            res.destroy(err);
          }
        });

        res.on('close', () => {
          fileStream.destroy();
        });

        fileStream.pipe(res);
        return;
      }
      // Format range tidak dikenali → jatuh ke 200 OK di bawah (ignore range)
    }

    // Sajikan berkas lengkap: tanpa header Range, atau format Range tidak dikenali
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
    });

    if (fileSize === 0) {
      res.end();
      return;
    }

    const fileStream = fs.createReadStream(targetFilePath);

    fileStream.on('error', (err) => {
      this.logger.error(`Error pada ReadStream video: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).end();
      } else {
        res.destroy(err);
      }
    });

    res.on('close', () => {
      fileStream.destroy();
    });

    fileStream.pipe(res);
  }

  /**
   * Mengambil daftar berkas video tunggal yang tersedia di direktori root data/storage/video
   *
   * **Scope**: Hanya file di level root direktori (bukan subdirektori atau katalog HLS bertingkat).
   * Berkas HLS seperti `Genshin-Impact/master.m3u8` tidak muncul di sini karena berada di subfolder.
   * Endpoint ini ditujukan untuk file video tunggal seperti `.mp4`, `.webm`, `.mkv`, dll.
   *
   * Jika dibutuhkan katalog HLS bertingkat, gunakan endpoint streaming langsung:
   * `GET /storage/video/<nama-folder>/<manifest>.m3u8`
   */
  public async listVideos(): Promise<Array<{ filename: string; size: number; url: string }>> {
    if (!fs.existsSync(this.videoStorageRoot)) {
      return [];
    }

    const entries = await fs.promises.readdir(this.videoStorageRoot, { withFileTypes: true });
    const allowedExts = new Set(['.mp4', '.webm', '.ogg', '.mov', '.mkv']);

    const videoList: Array<{ filename: string; size: number; url: string }> = [];

    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (allowedExts.has(ext)) {
          const filePath = path.join(this.videoStorageRoot, entry.name);
          const stat = await fs.promises.stat(filePath);
          const encodedFilename = encodeURIComponent(entry.name);
          videoList.push({
            filename: entry.name,
            size: stat.size,
            url: `/storage/video/${encodedFilename}`,
          });
        }
      }
    }

    return videoList;
  }
}
