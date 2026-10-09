# 🧪 Pengujian & Quality Control Backend

Dokumen ini memuat panduan pengujian perangkat lunak, unit testing, E2E testing, dan linter pada Backend GamePedia v2.

---

## ⚡ Vitest Test Runner (`vitest.config.ts` & `vitest.config.e2e.ts`)

Backend GamePedia v2 menggunakan **Vitest 4** sebagai test runner utama pengganti Jest karena kecepatan eksekusi dan integrasi native dengan TypeScript.

### 1. Unit Testing (`src/**/*.spec.ts`)
- **Konfigurasi**: `vitest.config.ts`
- **Tujuan**: Menguji isolasi logika pada controller, service, data watcher, dan utilitas.
- **Test Suites Aktif (7 Suites, 42 Tests Passed)**:
  - `image-validator.spec.ts` (18 tests): Verifikasi validasi 3-lapis (ekstensi, MIME, dan magic bytes biner untuk JPEG, PNG, WebP, AVIF, serta proteksi anti-XSS SVG dan MIME spoofing).
  - `storage.service.spec.ts` (12 tests): Validasi pencegahan path traversal (`..`), karakter terlarang, containment path, validasi berkas kosong, integrasi image validator, pembuatan nama berkas unik, penghapusan berkas, dan penulisan berkas ke filesystem.
  - `data-watcher.service.spec.ts` (5 tests): Verifikasi penemuan root data, inisialisasi baseline snapshot, konfigurasi `ENABLE_DATA_WATCHER`, serta deteksi reaktif operasi penambahan, perubahan, dan penghapusan berkas dengan debounce.
  - `multer-exception.filter.spec.ts` (3 tests): Verifikasi penanganan exception Multer (`LIMIT_FILE_SIZE`, `LIMIT_FILE_COUNT`, `LIMIT_PART_COUNT`) menjadi respons HTTP terstandarisasi.
  - `logging.interceptor.spec.ts` (2 tests): Verifikasi interceptor logging HTTP request, latensi, dan penanganan galat error.
  - `storage.controller.spec.ts` (1 test): Verifikasi penanganan endpoint `POST /storage/upload`.
  - `app.controller.spec.ts` (1 test): Verifikasi endpoint salam default root controller.
- **Perintah Exec**:
  ```bash
  npm run test --prefix backend
  ```

### 2. End-to-End (E2E) Testing (`test/**/*.e2e-spec.ts`)
- **Konfigurasi**: `vitest.config.e2e.ts`
- **Tujuan**: Menguji integrasi alur HTTP request, route, dan SSE streaming secara langsung pada instance aplikasi NestJS.
- **Perintah Exec**:
  ```bash
  npm run test:e2e --prefix backend
  ```

---

## 🚀 Oxlint Linter (`.oxlintrc.json`)

**Oxlint** digunakan sebagai linter backend berperforma tinggi berbasis Rust yang mampu mengeksekusi linting puluhan kali lebih cepat daripada ESLint standar.

- **Perintah Exec**:
  ```bash
  npm run lint --prefix backend
  ```
