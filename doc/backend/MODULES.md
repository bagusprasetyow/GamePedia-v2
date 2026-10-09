# 🧩 Struktur Module & Controller Backend

Dokumen ini memuat detail teknis dari komponen arsitektur utama di Backend GamePedia v2.

---

## 🏢 Root Module (`src/app.module.ts`)

Root module bertanggung jawab mengimpor dan mengonfigurasi modul-modul utama aplikasi:

- **`ConfigModule.forRoot({ isGlobal: true })`**: Mengonfigurasi variabel lingkungan secara terpusat dari file `.env` di root backend.
- **`StorageModule`**: Modul manajemen penyimpanan berkas gambar ke direktori `data/storage/image` dan pengawas filesystem `data/` real-time. Dokumentasi lengkap: [`doc/backend/modules/storage.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/modules/storage.md).

---

## 🚦 Controller Utama (`src/app.controller.ts`)

Handling endpoint dan route utama backend:

- **`GET /`**: Mengembalikan string ucapan salam atau status backend melalui `AppService.getHello()`.
- **`GET /time` (`@Sse('time')`)**: Endpoint Server-Sent Events (SSE) streaming data real-time berbasis RxJS `Observable<MessageEvent>`.
  - Mengirimkan payload objek `TimePayload` setiap 1 detik:
    ```typescript
    interface TimePayload {
      timestamp: string;
      timeString: string;
      unix: number;
      data?: any; // Content dari data/live-data.json
    }
    ```

---

## 📦 Controller & Layanan Storage (`src/modules/storage/`)

Lihat detail lengkap di [`doc/backend/modules/storage.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/modules/storage.md):
- **`POST /storage/upload`**: Endpoint upload gambar multipart (`file`, `path`).
- **`StorageService`**: Pipeline validasi 3-lapis (Extension -> MIME -> Magic Bytes Signature), sanitasi anti-path traversal robust berbasis `path.relative()`, pembuatan nama berkas unik crypto UUID, dan penulisan berkas ke `data/storage/image/`.
- **`MulterExceptionFilter`**: Exception filter untuk menangani galat upload Multer (`LIMIT_FILE_SIZE`, `LIMIT_FILE_COUNT`, `LIMIT_PART_COUNT`, dll.) menjadi respons HTTP standar.
- **`DataWatcherService`**: Convenience realtime watcher untuk filesystem `data/` via `fs.watch` dengan peredam debounce (150ms) mendeteksi operasi CRUD berkas dari OS (ditujukan untuk local/dev workflow, bukan SSOT database utama).

---

## 🛡️ Global Interceptors (`src/common/interceptors/`)

- **`LoggingInterceptor` (`logging.interceptor.ts`)**: Global NestJS interceptor yang mencatat log setiap request HTTP masuk, status code response, durasi eksekusi latensi (`ms`), IP client, dan error handling terpusat.

---

## ⚙️ Service Utama (`src/app.service.ts`)

Mengelola logika bisnis dan IO:

- **`getHello(): string`**: Mengembalikan pesan teks default.
- **`getTimeStream(): Observable<MessageEvent>`**: Membentuk interval stream RxJS (`interval(1000)`) yang mengaitkan timestamp server dengan isi data dinamis dari file `data/live-data.json`.
- **`readLiveData(): any`**: Membaca file `data/live-data.json` secara dinamis pada tiap interval tick sehingga perubahan data JSON secara live langsung terrefleksi ke stream SSE tanpa perlu merestart server.

---

## 🚀 Entry Point (`src/main.ts`)

- **CORS Configuration**: Menggunakan preferensi origin dinamis dari `CORS_ORIGIN` atau wildcard `*` dan mengizinkan pengiriman `credentials: true`.
- **Cookie Parser**: Middleware `cookie-parser()` diaktifkan untuk membaca cookie request.
- **Global Interceptor**: Mendaftarkan `app.useGlobalInterceptors(new LoggingInterceptor())` untuk observabilitas HTTP traffic.
- **Port Management**: Menggunakan `process.env.PORT` atau fallback port `3000`.

