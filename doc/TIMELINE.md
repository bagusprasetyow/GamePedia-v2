# ⏳ Timeline & Catatan Rilis GamePedia v2

Dokumen ini mencatat seluruh riwayat perubahan, penambahan fitur, perbaikan refactoring, pengujian kualitas, serta perkembangan versi aplikasi **GamePedia v2** secara terstruktur dan kronologis (rilis terbaru berada di bagian paling atas).

---

## 📊 Ringkasan Riwayat Rilis

| Versi | Tanggal & Waktu | Fokus Utama Perubahan | Status QC |
| :--- | :--- | :--- | :--- |
| [**0.0.10**](#-0010--2026-10-13-1658) | 2026-10-13 16:58 | Atom `Spinner`, molekul `VideoPlayer` (HLS/VTT, Depth -3 s/d 3), backend video streaming RFC 9110, static security middleware, isolasi fixture E2E tempdir, & ekspansi 575 unit/E2E tests | ✅ PASS 100% |
| [**0.0.9**](#-009--2026-10-09-0907) | 2026-10-09 09:07 | Modul Storage & upload Multer backend, atom `Image`, molekul `ImageUpload`, custom hook `useImageDragDrop`, utilitas gambar, & ekspansi 480 tests | ✅ PASS 100% |
| [**0.0.8**](#-008--2026-10-07-1240) | 2026-10-07 12:40 | 3 Atom baru (`ProgressBar`, `SegmentedControl`, `Slider`), custom hooks (`useDebounce`, `useCache`), utilitas cache/debounce, & ekspansi 357 unit tests | ✅ PASS 100% |
| [**0.0.7**](#-007--2026-10-06-1505) | 2026-10-06 15:05 | Atom baru (`Badge`, `Chip`, `ClearButton`), 32 dokumen individual komponen, ekspansi 199 unit tests Vitest, & workflows `/update-docs`, `/update-timeline` | ✅ PASS 100% |
| [**0.0.6**](#-006--2026-09-04-0602) | 2026-10-04 06:02 | Molekul UI baru, dekomposisi 10 Atom, ekspansi 171 unit test Vitest, dan cleanup `App.tsx` | ✅ PASS 100% |
| [**0.0.5**](#-005--2026-10-03-0852) | 2026-10-03 08:52 | Komponen Tooltip, Dot, Dropdown, dekomposisi input, integrasi Vitest frontend, & workflow `/audit-functions` | ✅ PASS 100% |
| [**0.0.4**](#-004--2026-09-30-1412) | 2026-09-30 14:12 | Fondasi Atomic Design System (8 Atoms, Form Molecules, Depth -3 s/d 3), & pemisahan folder `doc/` | ✅ PASS 100% |
| [**0.0.3**](#-003--2026-09-22-1515) | 2026-09-22 15:15 | Standarisasi Tailwind CSS v4 (OKLCH token), helper `cn()`, dynamic CORS/PORT, & dynamic JSON SSE stream | ✅ PASS 100% |
| [**0.0.2**](#-002--2026-09-21-2350) | 2026-09-21 23:50 | Streaming SSE RxJS backend, integrasi EventSource frontend, `@iconify/react`, path alias `@/*`, & Dark Mode UI | ✅ PASS 100% |
| [**0.0.1**](#-001--2026-09-21-2308) | 2026-09-21 23:08 | Inisialisasi Monorepo (NestJS 12 + React 19 Vite 8), 3 workflows otomatisasi agent, & dokumentasi awal | ✅ PASS 100% |

---

## 📌 Log Rilis & Timeline Detail

### 📦 [0.0.10] — 2026-10-13 16:58

> **Fokus Rilis**: Implementasi komponen atom baru `Spinner` dengan circular SVG ring & Iconify fallback, komponen molekul baru `VideoPlayer` berkemampuan lengkap (HLS/VTT, multi-subtitle, resolusi adaptif, thumbnail scrubbing, context menu, HUD), backend video streaming RFC 9110 (HTTP Range Requests 206/416, multi-range fallback 200 OK RFC 9110 §14.2, suffix range, allowlist media, stream error & disconnect guard, perlindungan direktori stat.isFile()), Express security middleware static serving (eksklusi SVG anti-XSS & kompatibilitas prefix `/videos/`), penyesuaian rate limit (600 req/min) untuk burst HLS, pemisahan branching retry HLS vs native, pengujian integrasi E2E mandiri dengan fixture tempdir terisolasi, ekspansi unit & E2E tests Vitest menjadi 575 tests (65 di backend [53 unit + 12 E2E], 510 di frontend), serta penyelarasan dokumentasi monorepo.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Atoms & Molecules)**:
  - **Atom `Spinner`** ([`Spinner`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Spinner/)): Indikator status pemuatan visual dengan SVG circular ring, Iconify fallback, kontrol ketebalan dan opasitas ring, Depth System (-3 s/d 3), varian warna semantik token OKLCH, sub-atom modular `SpinnerRing.tsx` dan `SpinnerLabel.tsx`, styling terenkapsulasi `Spinner.styles.ts`, serta unit test `Spinner.spec.ts` (14 tests).
  - **Molekul `VideoPlayer`** ([`VideoPlayer`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/)): Pemutar video modern terenkapsulasi berbasis Atomic Design dan Depth System (-3 s/d 3). Mendukung format video standar maupun streaming adaptif HLS (`.m3u8`), sprite thumbnail scrubbing WebVTT, pemilih trek teks terjemahan multi-bahasa, pengubah kecepatan putar (playback rate), pemilih kualitas resolusi, bilah kemajuan dengan buffer bar, pengatur volume suara, tombol lompat cepat (skip), mode *Picture-in-Picture* (PiP), dan *Fullscreen*.
- 🚀 **Layanan & Modul Backend**:
  - **Streaming Video RFC 9110** ([`StorageService.streamVideo`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/storage.service.ts)): Implementasi pengaliran berkas video dengan HTTP Range Requests lengkap (`206 Partial Content`, `200 OK`, dan `416 Range Not Satisfiable`), penanganan multi-range request (`bytes=0-10,20-30`) atau format non-bytes dengan *graceful fallback* respons `200 OK` (RFC 9110 §14.2), dukungan suffix range `bytes=-500` (mengambil N byte terakhir), prefix range `bytes=start-`, boundary clamping (`end = fileSize - 1`), validasi berkas kosong (0 byte), dan allowlist ekstensi media (`.mp4`, `.webm`, `.ogg`, `.mov`, `.mkv`, `.m3u8`, `.ts`, `.m4s`, `.vtt`, `.jpg`, `.jpeg`, `.png`, `.webp`) yang divalidasi langsung sebelum operasi disk I/O.
  - **Express Security Middleware Static Serving** ([`backend/src/main.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/main.ts)): Middleware proteksi sebelum `useStaticAssets` yang memeriksa allowlist ekstensi media dan gambar serta menolak upaya path traversal pada `/storage/image/`, `/storage/video/`, dan `/videos/` dengan status `403 Forbidden`. Ekstensi `.svg` sengaja dikecualikan dari allowlist statis gambar untuk mencegah eksekusi konten aktif (XSS). Akses berkas video statis melayani prefix `/storage/video/` serta prefix kompatibilitas `/videos/Video-Trailer/` dan `/videos/` (untuk manifest HLS bertingkat) yang seluruhnya terlindungi oleh middleware keamanan yang sama.
  - **Proteksi Direktori & Stream Disconnect Guard**: Verifikasi `stat.isFile()` menolak stream crash pada direktori, proteksi symlink escape via canonical `realpath()`, listener `res.on('close')` memutus `fileStream.destroy()` saat client disconnect, error handler stream, penataan endpoint rute streaming `GET /storage/video/*path` menggunakan named wildcard sesuai spesifikasi `path-to-regexp` v8 / NestJS 12 (mendukung resolusi berkas tunggal, array segmen bertingkat, `req.params[0]`, dan ekstraksi URL prefix) dengan rate limiting 600 req/menit di [`StorageController`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/storage.controller.ts) untuk mengakomodasi burst segment fetching HLS, serta klarifikasi JSDoc dan encoding via `encodeURIComponent` pada `listVideos()`.
- 🛠️ **Refactoring & Dekomposisi Komponen**:
  - Pemecahan 15 sub-komponen internal pada `VideoPlayer`: `VideoPlayerOverlay.tsx`, `VideoPlayerControls.tsx`, `VideoPlayerPlayButton.tsx`, `VideoPlayerSkipButton.tsx`, `VideoPlayerTimeline.tsx`, `VideoPlayerTimeDisplay.tsx`, `VideoPlayerVolume.tsx`, `VideoPlayerPlaybackRate.tsx`, `VideoPlayerQualityButton.tsx`, `VideoPlayerSubtitleButton.tsx`, `VideoPlayerSubtitles.tsx`, `VideoPlayerSettingsMenu.tsx`, `VideoPlayerContextMenu.tsx`, `VideoPlayerTextInfo.tsx`, dan `VideoPlayerFullscreenButton.tsx`.
  - Ekstraksi 4 custom hooks logika internal: [`useVideoPlayer.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoPlayer.ts), [`useVideoClickHandler.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoClickHandler.ts) (debounce klik ganda 250ms anti-stutter), [`useContextMenu.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useContextMenu.ts), dan [`useTextInfo.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useTextInfo.ts).
  - Ketahanan lifecycle & navigasi `useVideoPlayer`: reset state otomatis saat `src` berubah (pola state adjustment during rendering), guard fatal error HLS retry maksimal 3 kali (mencegah infinite loop), pemisahan logika `handleRetry` khusus HLS (`startLoad()`) vs native (`video.load()`), cleanup `removeAttribute('src')` saat unmount / pergantian sumber native Safari, normalisasi subtitle case-insensitive, pemisahan sinkronisasi props `muted` dan `loop`, serta penambahan parameter `silentTextInfo?: boolean` pada method `seek()` dan prop `onSeek` dengan feedback notifikasi HUD otomatis saat navigasi persentase tombol angka 0-9 (`Menuju [ MM:SS (X%) ]`).
- ⌨️ **Pintasan Keyboard Aksesibel & Menu Konteks**:
  - Dukungan pintasan keyboard komprehensif: Putar/Jeda (<kbd>Spasi</kbd>/<kbd>K</kbd>), Layar Penuh (<kbd>F</kbd>/<kbd>Enter</kbd>), Bisu Suara (<kbd>M</kbd>), Loop (<kbd>L</kbd>), Subtitle (<kbd>C</kbd> / <kbd>Ctrl+C</kbd>), PiP (<kbd>P</kbd>/<kbd>I</kbd> / <kbd>Ctrl+P</kbd>), Kualitas (<kbd>Ctrl+Q</kbd>), Pengaturan (<kbd>S</kbd>/<kbd>Escape</kbd>), Lompat Detik (<kbd>←</kbd>/<kbd>→</kbd>/<kbd>J</kbd>), Volume (+/-5% <kbd>↑</kbd>/<kbd>↓</kbd>), Lompat Durasi (<kbd>0</kbd>-<kbd>9</kbd>), Awal/Akhir (<kbd>Home</kbd>/<kbd>End</kbd>), serta Kecepatan (<kbd>&lt;</kbd>/<kbd>&gt;</kbd>).
  - Proteksi keyboard shortcut non-hijacking: tombol <kbd>Spasi</kbd> atau <kbd>Enter</kbd> tidak akan membajak aksi native saat elemen interaktif lain (`BUTTON`, `A`, `SELECT`, role button/slider) sedang difokuskan.
  - Custom Context Menu klik kanan dengan opsi kendali terintegrasi (Loop, PiP, Kecepatan, Subtitle, Kualitas, Salin URL, Salin URL waktu sekarang, Reset player).
- 🧪 **Pengujian Unit & Kualitas Kode (Vitest & Supertest E2E)**:
  - **Backend**: 7 test suites, 53 unit tests + 2 E2E test suites, 12 integration tests ([`storage-stream.e2e-spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/test/storage-stream.e2e-spec.ts) dengan *fixture tempdir* mandiri menguji alur manifest HLS 200 OK, playlist resolusi, segmen TS, subtitle VTT, partial range 206, suffix range 206, multi-range fallback 200 OK, out-of-bounds 416, non-existent 404, allowlist extension guard 400, dan path traversal rejection 400). Total backend: **65 tests lulus**.
  - **Frontend**: 39 test suites, 510 unit tests lulus 100% (penambahan `Spinner.spec.ts`, `VideoPlayer.spec.ts`, `useVideoPlayer.spec.tsx`, `VideoPlayer.utils.spec.ts`, `useVideoClickHandler.spec.ts`, `useContextMenu.spec.ts`, dan `useTextInfo.spec.ts`).
  - Total pengujian monorepo kini mencapai **575 tests lulus 100%**.
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Penambahan berkas dokumentasi individual baru: [`doc/frontend/components/atoms/Spinner.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Spinner.md) dan [`doc/frontend/components/molecules/VideoPlayer.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/VideoPlayer.md).
  - Sinkronisasi katalog komponen di [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md) dan [`doc/frontend/components/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/README.md).
  - Sinkronisasi modul & hooks di [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md), [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md), [`doc/backend/modules/storage.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/modules/storage.md), [`doc/backend/TESTING.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/TESTING.md), dan [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend 53 tests), Supertest E2E (Backend 12 tests), Vitest (Frontend 510 tests), dan build kompilasi (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi tetap di `0.0.10` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

---

### 📦 [0.0.9] — 2026-10-09 09:07

> **Fokus Rilis**: Implementasi modul backend `StorageModule` dengan penanganan upload berkas gambar multipart Multer, pipeline validasi 3-lapis (Extension → MIME → Actual Magic Bytes / File Signature) yang diperketat untuk format raster bitmap aman (JPEG/PNG/WebP/AVIF), proteksi exception filter khusus `MulterExceptionFilter`, proteksi ketat anti-path traversal robust berbasis `path.relative()`, pengawas filesystem `data/` real-time (`DataWatcherService`), observabilitas HTTP global via `LoggingInterceptor`, penambahan atom frontend `Image` dengan ambient blur & fallback, molekul frontend `ImageUpload` berbasis Atomic Design & Depth System (-3 s/d 3), ekstraksi & modularisasi custom hook `useImageDragDrop` ke direktori hook global (`@/hooks/image`), utilitas kompresi dan konversi format gambar di sisi klien (`@/utils/image`), serta ekspansi pengujian Vitest hingga total 480 tests (42 tests di backend, 438 tests di frontend).

#### 📋 Rincian Perubahan:
- 🚀 **Layanan & Modul Backend**:
  - **Modul Storage** ([`src/modules/storage/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/)): Endpoint pengunggahan berkas `POST /storage/upload` dengan Multer multipart form-data, pipeline validasi 3-lapis (`validateImageUpload`: verifikasi ekstensi, MIME type, dan binary magic bytes JPEG/PNG/WebP/AVIF), sanitasi path aman (`sanitizeSubPath`) anti-traversal berbasis containment `path.relative()`, penamaan berkas unik berbasis crypto UUID & timestamp, serta penulisan berkas ke direktori `data/storage/image/`.
  - **Multer Exception Filter** ([`MulterExceptionFilter`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/filters/multer-exception.filter.ts)): Exception filter terenkapsulasi untuk memetakan dan menerjemahkan galat internal Multer (`LIMIT_FILE_SIZE`, `LIMIT_FILE_COUNT`, `LIMIT_PART_COUNT`, dll.) menjadi respons HTTP standar yang informatif (`413 Payload Too Large` / `400 Bad Request`).
  - **Layanan Pengawas Filesystem Real-Time** ([`DataWatcherService`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/modules/storage/data-watcher.service.ts)): Convenience realtime watcher untuk pemantauan berkas direktori `data/` via `fs.watch` dengan mekanisme debounce (150ms) mendeteksi event pembuatan (`[CREATE]`), modifikasi (`[MODIFY]`), dan penghapusan (`[DELETE]`) secara otomatis. Ditegaskan sebagai pengawas eksternal lokal/dev dan bukan single source of truth database.
  - **Global Logging Interceptor** ([`LoggingInterceptor`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/common/interceptors/logging.interceptor.ts)): Observabilitas lalu lintas HTTP global yang mencatat method, URL, status code, latensi durasi eksekusi (ms), IP client, dan logging error terpusat, terverifikasi unit test [`logging.interceptor.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/src/common/interceptors/logging.interceptor.spec.ts).
- 🎨 **Antarmuka & Komponen UI (Atoms & Molecules)**:
  - **Atom `Image`** ([`Image`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Image/)): Primitif gambar tingkat lanjut dengan Depth System (-3 s/d 3), efek cahaya ambient blur di latar belakang (`ImageAmbientBlur.tsx`), animasi shimmer skeleton loader (`ImageSkeleton.tsx`), graceful fallback otomatis saat gagal muat (`ImageFallback.tsx`), serta unit test `Image.spec.ts` (19 tests).
  - **Molekul `ImageUpload`** ([`ImageUpload`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/)): Komponen pengunggah berkas gambar interaktif berbasis Atomic Design dengan tactile dropzone feedback, instant preview, progress bar overlay, pembersihan memori otomatis (`URL.revokeObjectURL`), integrasi Depth System (-3 s/d 3), serta dekomposisi sub-komponen `ImageUploadHeader.tsx`, `ImageUploadDropzone.tsx`, `ImageUploadPreview.tsx`, `ImageUploadProgress.tsx`, `ImageUploadInfo.tsx`, `ImageUploadActions.tsx`, custom hook `useImageUpload.ts`, konsumsi hook drag-and-drop dari `@/hooks/image`, helper `ImageUpload.utils.ts`, styling modular `ImageUpload.styles.ts`, dan unit test `ImageUpload.spec.ts` (32 tests).
- 🪝 **Custom Hooks & Utilitas Frontend**:
  - **Custom Hook Drag & Drop Gambar** ([`src/hooks/image/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/image/)): Ekstraksi dan modularisasi custom hook `useImageDragDrop` ke direktori hooks global lengkap dengan barrel export di [`hooks/image/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/image/index.ts) dan [`hooks/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/index.ts), proteksi event drag-and-drop file gambar, state feedback `isDragging`, proteksi status `disabled`, serta unit test suite mandiri [`useImageDragDrop.spec.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/image/useImageDragDrop.spec.tsx) (7 tests).
  - **Utilitas Gambar Mandiri** ([`src/utils/image/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/utils/image/)): Utilitas pengolahan gambar berbasis HTML5 Canvas untuk kompresi adaptif hingga batas ukuran tertentu (`imageCompressor.ts`), konversi instan format WebP/JPEG/PNG/AVIF (`imageConverter.ts`), client uploader dengan dynamic endpoint API base URL & progress tracking (`imageUploader.ts`), dan helper validasi MIME/blob (`image.helpers.ts`), lengkap dengan unit test `image.spec.ts` (23 tests).
- 🧪 **Pengujian Unit & Kualitas Kode (Vitest)**:
  - **Backend**: Ekspansi menjadi **7 test suites** dengan total **42 unit tests** lulus 100% (`image-validator.spec.ts` 18 tests, `storage.service.spec.ts` 12 tests, `data-watcher.service.spec.ts` 5 tests, `multer-exception.filter.spec.ts` 3 tests, `logging.interceptor.spec.ts` 2 tests, `storage.controller.spec.ts` 1 test, `app.controller.spec.ts` 1 test).
  - **Frontend**: Ekspansi menjadi **32 test suites** dengan total **438 unit tests** lulus 100% (`Image.spec.ts` 19 tests, `ImageUpload.spec.ts` 32 tests, `useImageDragDrop.spec.tsx` 7 tests, `image.spec.ts` 23 tests, dan komponen atom/molekul lainnya).
  - Total pengujian unit monorepo kini mencapai **480 tests lulus 100%**.
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Penambahan dokumentasi komponen atom baru [`doc/frontend/components/atoms/Image.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Image.md).
  - Penambahan dokumentasi modul backend [`doc/backend/modules/storage.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/modules/storage.md) dan dokumentasi molekul frontend [`doc/frontend/components/molecules/ImageUpload.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/ImageUpload.md).
  - Penambahan panduan hook gambar di [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md).
  - Penyelarasan katalog komponen di [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md) dan [`doc/frontend/components/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/README.md).
  - Sinkronisasi modul, arsitektur, dan testing pada [`doc/BACKEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md), [`doc/backend/MODULES.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/MODULES.md), [`doc/backend/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/README.md), [`doc/backend/TESTING.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/TESTING.md), [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md), [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md), [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md), dan [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend 42 tests), Vitest (Frontend 438 tests), dan build kompilasi (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.9` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

---

### 📦 [0.0.8] — 2026-10-07 12:40

> **Fokus Rilis**: Penambahan 3 komponen atom baru (`ProgressBar`, `SegmentedControl`, `Slider`), integrasi custom hooks (`useDebounce`, `useDebouncedCallback`, `useCache`), utilitas pendukung (`debounce`, `MemoryCache`), ekspansi komprehensif pengujian unit Vitest frontend hingga 357 unit tests (28 test suites), serta penyelarasan dokumentasi komponen dan hooks.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Atoms)**:
  - **Atom `ProgressBar`** ([`ProgressBar`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/)): Komponen bilah kemajuan status dengan Depth System (-3 s/d 3), mode determinate & indeterminate (animasi strip bergerak), kalkulasi persentase clamped, format kustom label (persen atau teks nilai), dekomposisi sub-komponen `ProgressBarTrack.tsx`, `ProgressBarFill.tsx`, `ProgressBarLabel.tsx`, helper `ProgressBar.utils.ts`, styling modular `ProgressBar.styles.ts`, serta unit test `ProgressBar.spec.tsx` (35 tests).
  - **Atom `SegmentedControl`** ([`SegmentedControl`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/SegmentedControl/)): Komponen sakelar segmen tunggal interaktif multi-opsi dengan keyboard navigation WAI-ARIA roving tabindex (panah kiri/kanan/home/end), rendering ikon pendamping, status disabled item, dekomposisi sub-komponen `SegmentedControlItem.tsx`, helper `SegmentedControl.utils.ts`, styling modular `SegmentedControl.styles.ts`, serta unit test `SegmentedControl.spec.tsx` (35 tests).
  - **Atom `Slider`** ([`Slider`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/)): Komponen penggeser nilai taktil kontinu/diskrit dengan alur cekung Depth System (-1 s/d -3), titik penanda (*marks*), tooltip bubble nilai aktif, navigasi keyboard (panah/PageUp/PageDown/Home/End), dekomposisi sub-komponen `SliderTrack.tsx`, `SliderRange.tsx`, `SliderThumb.tsx`, `SliderMarks.tsx`, `SliderLabel.tsx`, `SliderHelperText.tsx`, helper `Slider.utils.ts`, styling modular `Slider.styles.ts`, serta unit test `Slider.spec.tsx` (54 tests).
- 🪝 **Custom Hooks & Utilitas Frontend**:
  - **Custom Hook Debounce** ([`src/hooks/debounce/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/debounce/)): Implementasi hook `useDebounce` dan `useDebouncedCallback` untuk mengoptimalkan kinerja input dan panggilan API asinkron dengan fitur cancel, flush, pending, serta unit test `useDebounce.spec.tsx` (7 tests).
  - **Custom Hook In-Memory Cache** ([`src/hooks/cache/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/cache/)): Implementasi hook `useCache` untuk persistensi state reaktif berbasis TTL dan penggusuran LRU, lengkap dengan unit test `useCache.spec.tsx` (8 tests).
  - **Utilitas `debounce`** ([`src/utils/debounce/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/utils/debounce/)): Fungsi utilitas murni dengan opsi leading, trailing, maxWait, dan unit test `debounce.spec.ts` (9 tests).
  - **Utilitas `MemoryCache`** ([`src/utils/cache/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/utils/cache/)): Struktur data cache performa tinggi berbasis LRU dan timer kedaluwarsa TTL, lengkap dengan unit test `MemoryCache.spec.ts` (10 tests).
  - **Integrasi `SearchInput`**: Penyelarasan molekul `SearchInput.tsx` menggunakan utilitas debounce dan hook.
- 🧪 **Pengujian Unit & Kualitas Kode (Vitest)**:
  - Ekspansi pengujian frontend dari 21 file (199 tests) menjadi **28 file test suite** dengan total **357 unit tests** (lulus 100%).
  - Pengujian baru mencakup `ProgressBar.spec.tsx` (35 tests), `SegmentedControl.spec.tsx` (35 tests), `Slider.spec.tsx` (54 tests), `useDebounce.spec.tsx` (7 tests), `useCache.spec.tsx` (8 tests), `debounce.spec.ts` (9 tests), dan `MemoryCache.spec.ts` (10 tests).
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Penambahan 3 berkas spesifikasi individual di [`doc/frontend/components/atoms/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/): `ProgressBar.md`, `SegmentedControl.md`, dan `Slider.md`.
  - Penyelarasan katalog komponen di [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md) dan [`doc/frontend/components/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/README.md).
  - Penambahan panduan custom hooks debounce, cache, utilitas, dan pembaruan rekapitulasi test suite di [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md) dan [`doc/frontend/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/README.md).
  - Pembaruan status monorepo pada root [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend 1 test), Vitest (Frontend 357 tests), dan build kompilasi (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.8` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

---

### 📦 [0.0.7] — 2026-10-06 15:05

> **Fokus Rilis**: Penambahan 3 komponen atom baru (`Badge`, `Chip`, `ClearButton`), penulisan menyeluruh 32 berkas dokumentasi individual komponen (`doc/frontend/components/`), ekspansi pengujian Vitest menjadi 199 unit tests, integrasi workflow otomatisasi `/update-docs` & `/update-timeline`, serta standarisasi logo aset monorepo.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Atoms)**:
  - **Atom `Badge`** ([`Badge`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Badge/)): Komponen status indikator visual ringkas dengan ragam 8 varian warna (`neutral`, `primary`, `secondary`, `accent`, `success`, `warning`, `danger`, `info`), 3 varian visual (`solid`, `outline`, `subtle`), ukuran (`sm`, `md`, `lg`), dukungan icon (`BadgeIcon`), label (`BadgeLabel`), Depth System (`-3` s/d `3`), styling modular `Badge.styles.ts`, dan unit test `Badge.spec.ts` (10 tests).
  - **Atom `Chip`** ([`Chip`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/)): Komponen tag/chip interaktif dan dinamis dengan fitur dismiss/remove (`onRemove`), seleksi aktif (`selected`), avatar/icon (`ChipIcon`), sub-komponen `ChipLabel.tsx` & `ChipRemove.tsx`, Depth System terintegrasi, styling modular `Chip.styles.ts`, serta unit test `Chip.spec.ts` (9 tests).
  - **Atom `ClearButton`** ([`ClearButton`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ClearButton/)): Komponen tombol pembersih input modular independen dengan animasi hover/active, ukuran proporsional (`sm`, `md`, `lg`), styling terenkapsulasi `ClearButton.styles.ts`, dan unit test `ClearButton.spec.ts` (9 tests).
- 🛠️ **Refactoring & Penyelarasan Komponen**:
  - Refactoring sub-komponen `InputClearButton.tsx` pada atom `Input` agar menggunakan atom kanonik `ClearButton`.
  - Penyelarasan interaksi dan styling pada molekul `Dropdown` dan `DropdownTrigger.tsx`.
  - Standardisasi modul logo TypeScript pada [`frontend/src/assets/logo/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/assets/logo/index.ts) serta penambahan aset [`frontend/public/logo.svg`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/public/logo.svg).
- 🧪 **Pengujian Unit & Kualitas Kode (Vitest)**:
  - Ekspansi pengujian frontend menjadi **21 file test suite** dengan total **199 unit tests** (lulus 100%).
  - Penambahan unit test spesifikasi untuk atom `Badge` (10 tests), `Chip` (9 tests), dan `ClearButton` (9 tests).
- 🔄 **Alur Kerja & Otomatisasi (Workflows)**:
  - Formalisasi workflow baru [`/update-docs`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-docs.md) untuk standarisasi pembaruan dokumentasi terpecah per komponen di `doc/frontend/components/`.
  - Formalisasi workflow baru [`/update-timeline`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-timeline.md) untuk pembaruan terstandarisasi berkas `doc/TIMELINE.md`.
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Penulisan 32 berkas dokumentasi individual komponen lengkap di [`doc/frontend/components/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/):
    - 13 berkas dokumen Atoms: `Badge.md`, `Button.md`, `Checkbox.md`, `Chip.md`, `ClearButton.md`, `Dot.md`, `Icon.md`, `Input.md`, `Radio.md`, `Switch.md`, `Text.md`, `Textarea.md`, `Tooltip.md`.
    - 19 berkas dokumen Molecules: `CheckboxGroup.md`, `Clipboard.md`, `CodePreview.md`, `Dropdown.md`, `RadioGroup.md`, `ShowcasePreview.md`, `SourceCode.md`, `ThemeToggle.md`, serta 11 input form (`CodeInput.md`, `EmailInput.md`, `FullNameInput.md`, `OtpInput.md`, `PasswordInput.md`, `PhoneInput.md`, `PinInput.md`, `SearchInput.md`, `TextInput.md`, `TextareaInput.md`, `UsernameInput.md`).
  - Sinkronisasi status monorepo pada [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md), [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md), [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md), [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md), [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md), [`doc/frontend/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/README.md), dan [`doc/WORKFLOWS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), Vitest (Frontend 199 tests), dan build kompilasi (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.7` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

---

### 📦 [0.0.6] — 2026-10-04 06:02

> **Fokus Rilis**: Pengembangan 4 komponen molekul baru (`Clipboard`, `SourceCode`, `CodePreview`, `ShowcasePreview`), dekomposisi arsitektur styling dan sub-komponen seluruh 10 atom, ekspansi Vitest frontend hingga 171 tests, serta penyederhanaan root entry `App.tsx`.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Molecules)**:
  - **Molekul `Clipboard`** ([`Clipboard`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/)): Komponen aksi penyalinan teks clipboard interaktif berstandar Atomic Design dengan feedback visual transisi dinamis (`bg-success`, teks "Tersalin!"), reset otomatis, cleanup memory timer, custom hook `useClipboard.ts`, styling terenkapsulasi `Clipboard.styles.ts`, sub-komponen `ClipboardIcon.tsx` dan `ClipboardLabel.tsx`, serta pengujian Vitest `Clipboard.spec.ts`.
  - **Molekul `SourceCode`** ([`SourceCode`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/)): Komponen penampil kode sumber bergaya terminal window gelap dengan dukungan multi-tab snippet, penyorotan sintaks tokenik real-time (`renderHighlightedLine`), tombol salin terintegrasi, dekomposisi `SourceCodeHeader.tsx`, `SourceCodeBody.tsx`, hook `useSourceCode.ts`, helper `SourceCode.utils.tsx`, styles `SourceCode.styles.ts`, dan unit test `SourceCode.spec.ts`.
  - **Molekul `CodePreview`** ([`CodePreview`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/)): Unit penampil kode modular dengan penyorotan sintaks resmi bergaya **VS Code Dark+**, penomoran baris (*line numbers*), scroll horizontal, integrasi Depth System (-3 s/d 3), sub-komponen `CodePreviewLine.tsx`, hook `useCodePreview.ts`, tokenizer `CodePreview.utils.tsx`, styles `CodePreview.styles.ts`, dan unit test `CodePreview.spec.ts`.
  - **Molekul `ShowcasePreview`** ([`ShowcasePreview`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/)): Wadah kanvas preview interaktif (*sandbox canvas*) untuk menguji komponen UI pada showcase, bingkai putus-putus (`dashed border`), latar dekoratif (dots, radial, grid), indikator klik dan stempel waktu, pill badges status props aktif, sub-komponen `ShowcasePreviewBackground.tsx`, `ShowcasePreviewBadges.tsx`, `ShowcasePreviewInfo.tsx`, styles `ShowcasePreview.styles.ts`, dan unit test `ShowcasePreview.spec.ts`.
- 🛠️ **Refactoring & Dekomposisi Sub-Komponen (Atoms)**:
  - Refactoring arsitektur seluruh 10 atom untuk memisahkan class maps styling ke berkas terdedikasi `*.styles.ts` dan mengekstrak sub-komponen fungsional:
    - `Button`: Sub-komponen `ButtonLoading.tsx` & `ButtonIcon.tsx`, `Button.styles.ts`, unit test `Button.spec.ts` (19 tests).
    - `Checkbox`: Sub-komponen `CheckboxIndicator.tsx` & `CheckboxLabel.tsx`, `Checkbox.styles.ts`, unit test `Checkbox.spec.ts` (9 tests).
    - `Input`: Sub-komponen `InputLabel.tsx`, `InputHelperText.tsx`, & `InputClearButton.tsx`, `Input.styles.ts`, unit test `Input.spec.ts` (8 tests).
    - `Radio`: Sub-komponen `RadioIndicator.tsx` & `RadioLabel.tsx`, `Radio.styles.ts`, unit test `Radio.spec.ts` (8 tests).
    - `Switch`: Sub-komponen `SwitchTrack.tsx` & `SwitchLabel.tsx`, `Switch.styles.ts`, unit test `Switch.spec.ts` (8 tests).
    - `Textarea`: Sub-komponen `TextareaLabel.tsx` & `TextareaFooter.tsx`, `Textarea.styles.ts`, unit test `Textarea.spec.ts` (9 tests).
    - `Text`: Pemisahan `Text.styles.ts` dan unit test `Text.spec.ts` (9 tests).
    - `Icon`: Pemisahan `Icon.styles.ts` dan unit test `Icon.spec.ts` (4 tests).
    - `Dot`: Sub-komponen `DotCircle.tsx`, `Dot.styles.ts`, unit test `Dot.spec.ts` (11 tests).
    - `Tooltip`: Sub-komponen `components/TooltipBubble.tsx`, `Tooltip.styles.ts`, unit test `Tooltip.spec.ts` (10 tests).
  - Penyederhanaan root entry component [`App.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/App.tsx) menjadi entri root bersih yang siap diintegrasikan.
- 🧪 **Pengujian Unit Frontend (Vitest)**:
  - Penambahan dan integrasi spesifikasi pengujian unit komprehensif pada frontend hingga mencapai **18 file test suite** dengan total **171 unit tests** (lulus 100%).
  - Memverifikasi ekspor barrel, rendering sub-komponen, styling terenkapsulasi, dan fungsionalitas interaktif.
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Sinkronisasi status proyek pada [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md), [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md), dan [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md).
  - Penyelarasan katalog komponen pada [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) dan [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md).
  - Penambahan panduan custom hooks baru (`useClipboard`, `useSourceCode`, `useCodePreview`) serta rekapitulasi 18 test suite di [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), Vitest (Frontend 171 tests), serta kompilasi build (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.6` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

---

### 📦 [0.0.5] — 2026-10-03 08:52

> **Fokus Rilis**: Penambahan komponen `Tooltip`, `Dot`, `Dropdown`, dekomposisi input form, implementasi awal pengujian Vitest di frontend, pembuatan workflow `/audit-functions`, serta pembaruan dokumentasi monorepo.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Frontend)**:
  - **Atom `Tooltip`** ([`Tooltip`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/)): Komponen gelembung petunjuk interaktif dengan Depth System (skala -3 s/d 3), 12 opsi placement, panah penunjuk, dukungan trigger (hover, click, focus, manual), delay timer, serta arsitektur modular (`Tooltip.tsx`, `TooltipBubble.tsx`, `useTooltip.ts`, `Tooltip.styles.ts`, `Tooltip.spec.ts`).
  - **Atom `Dot`** ([`Dot`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Dot/)): Komponen titik status visual interaktif dengan animasi denyut halo ripple (`ping`) & kedip halus (`pulse`), efek neon ambient glow, ring pembatas kontras (`bordered`), teks label status pendamping, serta penempatan anchor overlay pada elemen anak (`Dot.tsx`, `components/DotCircle.tsx`, `Dot.styles.ts`, `Dot.spec.ts`).
  - **Molekul `Dropdown`** ([`Dropdown`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/)): Komponen dropdown seleksi serbaguna mendukung single-select & multi-select (dengan badges tag & clearable), mode ComboBox pencarian reaktif (`isComboBox` / `isSearchable`), Depth System (-3 s/d 3), navigasi keyboard penuh WAI-ARIA, serta dekomposisi sub-komponen (`DropdownTrigger`, `DropdownPopover`, `DropdownItem`, `DropdownEmptyState`, `useDropdown`, `useDropdownKeyboard`, `dropdown.utils.ts`, `dropdown.utils.spec.ts`).
- 🛠️ **Refactoring & Dekomposisi Sub-Komponen**:
  - `CodeInput`: Refactoring modular menjadi `CodeInputField.tsx`, `CodeInputResendTimer.tsx`, dan hook `useCodeInput.ts`.
  - `PasswordStrengthBar`: Ekstraksi algoritma perhitungan skor ke `passwordStrength.utils.ts` dan unit test `passwordStrength.spec.ts`.
  - `SearchInput`: Ekstraksi pemfilteran teks ke `SearchInput.utils.ts` dan unit test `SearchInput.utils.spec.ts`.
  - `PhoneInput`: Penguatan unit test `phoneUtils.spec.ts` dan hook `usePhoneInput.ts`.
- 🧪 **Pengujian Unit Frontend (Vitest)**:
  - Konfigurasi dan integrasi **Vitest 4** di `frontend/package.json` dengan skrip `npm run test`.
  - Pembuatan 6 test suite spesifikasi unit testing otomatis dengan total 42 tests yang lulus 100% (`Dot.spec.ts`, `Tooltip.spec.ts`, `dropdown.utils.spec.ts`, `passwordStrength.spec.ts`, `SearchInput.utils.spec.ts`, dan `phoneUtils.spec.ts`).
- 🔄 **Alur Kerja & Otomatisasi (Workflows)**:
  - Pembuatan workflow baru `/audit-functions` di [`.agents/workflows/audit-functions.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/audit-functions.md) untuk audit efisiensi algoritma, penanganan error, memory safety, dan async safety.
  - Perluasan dokumentasi detail seluruh 8 workflow otomatisasi di [`doc/WORKFLOWS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md).
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Pembaruan status proyek dan perintah pengujian pada [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md) dan [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md).
  - Pembaruan arsitektur sistem, struktur monorepo, dan tech stack di [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md).
  - Penyelarasan urutan 10 Atom dan dokumentasi lengkap Dropdown di [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) dan [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md).
  - Penambahan dokumentasi custom hooks dan unit testing di [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), Vitest (Frontend 42 tests), dan kompilasi build (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.5` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

---

### 📦 [0.0.4] — 2026-09-30 14:12

> **Fokus Rilis**: Fondasi Atomic Design System (8 Atoms, Form Molecules, Depth System -3 s/d 3, hook `useTheme`), pemecahan direktori dokumentasi terpisah ke `doc/frontend/` dan `doc/backend/`, serta penyelarasan QC.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Frontend)**:
  - **Atoms**: Penambahan komponen atomik terenkapsulasi penuh `<Text>`, `<Icon>`, `<Button>`, `<Switch>`, `<Input>`, `<Textarea>`, `<Checkbox>`, dan `<Radio>`.
  - **Molecules**: Penambahan komponen molekul `<CheckboxGroup>`, `<RadioGroup>`, `<ThemeToggle>`, serta kumpulan input spesifik: `<TextInput>`, `<EmailInput>`, `<PasswordInput>` (dengan `PasswordRequirements`, `PasswordStrengthBar`, `PasswordStrengthMeter`), `<UsernameInput>`, `<PhoneInput>` (dengan `phoneUtils.ts` & `usePhoneInput.ts`), `<FullNameInput>`, `<CodeInput>`, `<PinInput>`, `<OtpInput>`, `<SearchInput>`, dan `<TextareaInput>`.
  - **Depth System (-3 s/d 3)**: Penerapan kedalaman visual taktil simetris (Cekung, Rata, Timbul) pada seluruh komponen interaktif.
  - **Hooks & State**: Implementasi custom hook `useTheme` berbasis `useSyncExternalStore` dan pengalih tema reaktif global.
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Pembuatan direktori terpecah `doc/frontend/` memuat [`COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md), [`STYLING.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/STYLING.md), [`HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md), dan [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/README.md).
  - Pembuatan direktori terpecah `doc/backend/` memuat [`MODULES.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/MODULES.md), [`TESTING.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/TESTING.md), dan [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/README.md).
  - Penyesuaian [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md), [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md), [`doc/BACKEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md), [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md), dan root [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), dan Build kompilasi (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi pada 6 berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.4`.

---

### 📦 [0.0.3] — 2026-09-22 15:15

> **Fokus Rilis**: Konfigurasi dynamic backend (`@nestjs/config`, `cookie-parser`, dynamic CORS & PORT, live JSON streaming), standarisasi Tailwind CSS v4 dengan palet OKLCH dan helper `cn()`, refactoring UI `App.tsx`, serta penyelarasan dokumentasi.

#### 📋 Rincian Perubahan:
- ⚡ **Layanan & Konfigurasi Backend**:
  - Integrasi `@nestjs/config` (`ConfigModule.forRoot`) pada `AppModule` (`backend/src/app.module.ts`) untuk pengelolaan environment variable global.
  - Integrasi `cookie-parser` middleware pada `main.ts` dengan type definition `@types/cookie-parser`.
  - Pembaruan konfigurasi CORS backend di `main.ts` (Dynamic `CORS_ORIGIN`, `credentials: true`) dan dynamic `PORT`.
  - Implementasi pembacaan berkas `data/live-data.json` secara dinamis di `AppService.readLiveData()` dan disertakan pada stream payload SSE (`@Sse('time')`).
- 🎨 **Antarmuka & Komponen UI (Frontend)**:
  - Penambahan variabel skema warna OKLCH pada `@theme` di `frontend/src/index.css` (Primary palette, Neutral palette, Semantic colors: success, warning, error, info, Surface/Background).
  - Penambahan helper `cn()` (`clsx` + `tailwind-merge`) di `frontend/src/lib/` & `frontend/src/utils/`.
  - Refactoring total `App.tsx` sesuai standar Tailwind Class Organization Standard (grouping class per kategori: layout, spacing, typography, background, border, text, transition).
  - Tampilan baru untuk stream data JSON real-time (`live-data.json`) lengkap dengan badge indikator koneksi SSE (Live SSE / Reconnecting).
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Pembaruan seluruh berkas di `doc/` ([`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md), [`ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md), [`FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md), [`BACKEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md), [`TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md)) serta root [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), TypeScript & Vite build dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi pada 6 berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.3`.

---

### 📦 [0.0.2] — 2026-09-21 23:50

> **Fokus Rilis**: Implementasi SSE stream RxJS backend per 1 detik, langganan EventSource frontend dengan auto-reconnect, konfigurasi Path Alias `@/*`, ikon `@iconify/react`, dan tema Dark Mode modern.

#### 📋 Rincian Perubahan:
- ⚡ **Layanan & Streaming Data (Backend)**:
  - Implementasi endpoint `@Sse('time')` pada `AppController` (`backend/src/app.controller.ts`) yang menghasilkan stream RxJS per 1 detik (`TimePayload`: timestamp, timeString, unix) melalui `AppService.getTimeStream()`.
  - Penambahan unit test untuk endpoint streaming SSE di `AppControllerSpec` (`backend/src/app.controller.spec.ts`).
- 🎨 **Antarmuka & Komponen UI (Frontend)**:
  - Konfigurasi Path Alias `@/*` di `vite.config.ts` dan `tsconfig.app.json` untuk impor file yang lebih bersih.
  - Integrasi `@iconify/react` untuk ikon interaktif (gamepad, server, clock, timer, calendar, activity, status indicators).
  - Langganan stream SSE backend menggunakan `EventSource` di `App.tsx` dengan penanganan reconnect otomatis dan error state.
  - Pembaruan UI Dark Mode modern (Slate 950, efek glowing indigo, jam digital real-time, live tick counter).
  - Pembersihan asset lama dan penambahan `logo.svg` baru.
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), dan TypeScript build dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi pada 6 berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.2`.

---

### 📦 [0.0.1] — 2026-09-21 23:08

> **Fokus Rilis**: Inisialisasi Monorepo (NestJS 12 + React 19 Vite 8), 3 workflows otomatisasi agent awal (`update-docs`, `update-timeline`, `commit-and-push`), struktur dokumentasi awal terperinci, dan setup quality control.

#### 📋 Rincian Perubahan:
- 🚀 **Inisialisasi Monorepo & Fondasi Arsitektur**:
  - Konfigurasi Root Monorepo dengan script `concurrently` untuk menjalankan backend (NestJS 12) dan frontend (React 19 + Vite 8) secara simultan.
  - Setup TypeScript 6, Vitest 4, Oxlint pada `backend/` dan React 19, Vite 8, Tailwind CSS v4, ESLint pada `frontend/`.
- 🔄 **Alur Kerja & Otomatisasi (Workflows)**:
  - `update-docs` ([`.agents/workflows/update-docs.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-docs.md)): Otomatisasi pemeriksaan `git status` dan pembaruan dokumen terperinci di folder `doc/`.
  - `update-timeline` ([`.agents/workflows/update-timeline.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-timeline.md)): Otomatisasi perekaman ringkasan perubahan commit ke file `doc/TIMELINE.md`.
  - `commit-and-push` ([`.agents/workflows/commit-and-push.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/commit-and-push.md)): Otomatisasi quality control (lint, test, build), sinkronisasi versi pada 6 berkas `package.json` dan `package-lock.json`, penyelarasan timestamp timeline hingga menit, serta git commit dengan message bernilai versi aplikasi (`"0.0.1"`) dan git push.
- 📚 **Penyusunan Dokumentasi Proyek Awal**:
  - Root [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md) — Dokumentasi dan Quick Start Utama.
  - [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md) — Pusat Navigasi Dokumentasi.
  - [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md) — Arsitektur Monorepo & Tech Stack.
  - [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) — Panduan Frontend React 19 + Vite 8 + Tailwind CSS v4.
  - [`doc/BACKEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md) — Panduan Backend NestJS 12 + Vitest + Oxlint.
  - [`doc/WORKFLOWS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md) — Panduan Lengkap Workflows Otomatis.
  - [`doc/TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) — Catatan Rilis & Timestamp Rilis.
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh konfigurasi tooling (TypeScript, ESLint, Oxlint, Vitest) diverifikasi dan berjalan normal.
  - Menyelaraskan versi seluruh berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.1`.
