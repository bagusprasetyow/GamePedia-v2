# 📦 Modul Backend: Storage (`src/modules/storage`)

Modul backend GamePedia v2 untuk menangani pengunggahan, validasi bertingkat, dan penyimpanan berkas gambar ke direktori `data/storage/image`, serta pengawasan perubahan filesystem `data/` secara real-time via `DataWatcherService`.

---

## 📍 Lokasi Berkas & Arsitektur

- **Root Modul**: [`backend/src/modules/storage/storage.module.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/storage.module.ts)
- **Controller**: [`backend/src/modules/storage/storage.controller.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/storage.controller.ts)
- **Storage Service**: [`backend/src/modules/storage/storage.service.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/storage.service.ts)
- **Image Validator**: [`backend/src/modules/storage/utils/image-validator.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/utils/image-validator.ts)
- **Filesystem Watcher Service**: [`backend/src/modules/storage/data-watcher.service.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/data-watcher.service.ts)
- **Multer Exception Filter**: [`backend/src/modules/storage/filters/multer-exception.filter.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/filters/multer-exception.filter.ts)
- **DTO**: [`backend/src/modules/storage/dto/upload-image.dto.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/dto/upload-image.dto.ts)
- **Entity**: [`backend/src/modules/storage/entities/storage-file.entity.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/entities/storage-file.entity.ts)
- **Unit Tests (Vitest)**:
  - [`backend/src/modules/storage/storage.controller.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/storage.controller.spec.ts)
  - [`backend/src/modules/storage/storage.service.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/storage.service.spec.ts)
  - [`backend/src/modules/storage/utils/image-validator.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/utils/image-validator.spec.ts)
  - [`backend/src/modules/storage/filters/multer-exception.filter.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/filters/multer-exception.filter.spec.ts)
  - [`backend/src/modules/storage/data-watcher.service.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/data-watcher.service.spec.ts)
- **Integration Tests (Vitest E2E)**:
  - [`backend/test/storage-stream.e2e-spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/test/storage-stream.e2e-spec.ts)
- **Barrel Export**: [`backend/src/modules/storage/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/index.ts)

---

## 🌐 Endpoint API

### `POST /storage/upload`
Mengunggah berkas gambar tunggal dengan multipart form-data.

- **Headers**: `Content-Type: multipart/form-data`
- **Body Fields**:
  - `file` (*Binary / File*, Wajib): Berkas gambar yang diunggah.
  - `path` (*String*, Opsional): Sub-direktori tujuan di dalam `data/storage/image/` (contoh: `game`, `avatar`, `covers`).

#### Format Respons Sukses (`201 Created`):
```json
{
  "success": true,
  "message": "Gambar berhasil disimpan",
  "data": {
    "filename": "1791397216608-a451e4e2.webp",
    "originalName": "screenshot.webp",
    "subPath": "game",
    "relativeFilePath": "data/storage/image/game/1791397216608-a451e4e2.webp",
    "url": "/storage/image/game/1791397216608-a451e4e2.webp",
    "size": 102400,
    "mimeType": "image/webp"
  }
}
```

### `GET /storage/video`
Mengambil daftar berkas video yang tersimpan di direktori `data/storage/video/`.

#### Format Respons Sukses (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "filename": "test.mp4",
      "size": 153473805,
      "url": "/storage/video/test.mp4"
    }
  ]
}
```

### `GET /storage/video/*path`
Mengalirkan berkas video tunggal maupun bertingkat (HLS playlist `.m3u8`, segmen `.ts`/`.m4s`, subtitle `.vtt`, poster) dari direktori `data/storage/video/` dengan dukungan HTTP Range Requests RFC 9110 (`206 Partial Content`, `200 OK`, dan `416 Range Not Satisfiable`). Sesuai spesifikasi `path-to-regexp` v8 dan NestJS 12, parameter rute menggunakan named wildcard `*path`.

- **Rate Limiting**: Dilindungi Throttling maksimal 600 chunk requests per menit (mengakomodasi burst fetching segmen HLS resolusi tinggi).
- **Headers Request**:
  - `Range`: `bytes=0-1024000` (atau prefix `bytes=1000-`, suffix `bytes=-500`)
- **Response Headers**:
  - `Content-Range`: `bytes start-end/fileSize` (pada status 206) atau `bytes */fileSize` (pada status 416)
  - `Accept-Ranges`: `bytes`
  - `Content-Type`: MIME sesuai allowlist (`video/mp4`, `application/vnd.apple.mpegurl`, `video/mp2t`, `text/vtt`, dll.)
  - `Content-Length`: ukuran chunk yang dikirim
- **Keamanan & Stabilitas**:
  - Allowlist ekstensi media (hanya `.mp4`, `.webm`, `.ogg`, `.mov`, `.mkv`, `.m3u8`, `.ts`, `.m4s`, `.vtt`, `.jpg`, `.jpeg`, `.png`, `.webp`) divalidasi sebelum akses filesystem.
  - Multi-range requests (misal `bytes=0-10,20-30`) atau format unit di luar `bytes` diabaikan secara anggun (*graceful fallback*) dengan respons `200 OK` menyajikan berkas lengkap sesuai spesifikasi RFC 9110 §14.2 alih-alih melempar 416.
  - Express security middleware di [`backend/src/main.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/main.ts) memblokir berkas statis di luar allowlist dan path traversal (`403 Forbidden`). Berkas `.svg` sengaja dikecualikan dari allowlist statis gambar demi mencegah injeksi konten aktif (XSS).
  - Akses statis video melayani prefix `/storage/video/` serta prefix kompatibilitas `/videos/Video-Trailer/` dan `/videos/` (untuk berkas manifest HLS bertingkat) yang dilindungi oleh security middleware yang sama.
  - Verifikasi berkas reguler via `stat.isFile()` mencegah stream crash pada direktori.
  - Listener `res.on('close')` memutus `fileStream.destroy()` saat client disconnect untuk mencegah file descriptor leak.
  - Pengujian E2E integrasi (`backend/test/storage-stream.e2e-spec.ts`) menggunakan *fixture tempdir* terisolasi buatan sendiri tanpa dependensi berkas lokal fisik.

---

## 🛡️ Fitur Keamanan & Validasi Storage

### 1. Pipeline Validasi 3-Lapis (Extension → MIME → Magic Bytes)
Untuk mencegah upload file berbahaya dan MIME spoofing:
1. **Lapis 1 (Extension Check)**: Memeriksa ekstensi berkas raster aman (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`). Format vektor atau animasi yang rentan risiko keamanan atau di luar cakupan standar penyimpanan (`.svg`, `.gif`, `.exe`, `.sh`, `.php`, `.pdf`, dll.) langsung ditolak.
2. **Lapis 2 (MIME Check)**: Memeriksa header `Content-Type` yang dikirim client harus terdaftar dalam tipe gambar yang didukung (`image/jpeg`, `image/png`, `image/webp`, `image/avif`) dan konsisten dengan ekstensinya.
3. **Lapis 3 (Actual Image Validation / Magic Bytes)**:
   - Memeriksa header biner asli file (`Buffer` magic bytes) untuk format raster:
     - JPEG: `FF D8 FF`
     - PNG: `89 50 4E 47 0D 0A 1A 0A`
     - WebP: `RIFF....WEBP`
     - AVIF: `ftypavif` / `ftypavis`

### 2. Penanganan Galat Multer (`MulterExceptionFilter`)
- Terpasang secara scoped pada controller melalui `@UseFilters(MulterExceptionFilter)`.
- Mengonversi galat internal Multer menjadi format respons JSON terstandarisasi:
  - `LIMIT_FILE_SIZE` -> HTTP `413 Payload Too Large` ("Ukuran berkas melebihi batas maksimum yang diizinkan").
  - `LIMIT_FILE_COUNT` -> HTTP `400 Bad Request` ("Hanya satu berkas yang diizinkan untuk diunggah sekaligus").
  - `LIMIT_PART_COUNT` -> HTTP `400 Bad Request` ("Jumlah parameter request melebihi batas yang diizinkan").
  - `LIMIT_UNEXPECTED_FILE` -> HTTP `400 Bad Request` ("Field unggahan tidak terduga").

### 3. Pencegahan Path Traversal Robust
- Sanitasi input `subPath` membuang leading/trailing slash dan karakter ilegal di luar `^[a-zA-Z0-9_\-/]+$`.
- Validasi containment menggunakan `path.relative(normalizedRoot, targetPath)` untuk memastikan target direktori dan target berkas benar-benar merupakan turunan dari direktori root penyimpanan, sehingga kebal terhadap edge-case prefix collision (`/root/storage` vs `/root/storage-evil`).

### 4. Pemberian Nama Berkas Unik
- Format nama berkas: `<timestamp>-<crypto-uuid-8char>.<ext>` untuk mencegah *file overwrite* dan tabrakan nama berkas.

---

## 👁️ DataWatcherService & Architectural Boundary

Service pemantau direktori `data/` via `fs.watch`:
- **Status Arsitektur**: Berfungsi sebagai **Convenience Realtime Watcher** (best-effort observer).
- **Boundary**:
  - Service ini ditujukan untuk alur pengembangan lokal (developer workflow) dan observasi perubahan berkas manual dari luar aplikasi (OS explorer/CLI).
  - Service ini **BUKAN** sumber kebenaran utama (*Single Source of Truth*) database atau core event system GamePedia.
  - Perubahan data bisnis penting (misal metadata game, status user, catalog) harus selalu berasal dari **Application / Domain Event** atau *Repository layer* aplikasi, bukan mengandalkan event filesystem.
- **Toleransi Lingkungan**: Dilengkapi penanganan error yang anggun (*graceful fallback*); jika dijalankan di container atau sistem cloud yang membatasi recursive watching, server tetap berjalan normal tanpa kegagalan startup.
- **Debounce**: Dilengkapi buffer debounce 150ms untuk menstabilkan event berturut-turut dari OS.
