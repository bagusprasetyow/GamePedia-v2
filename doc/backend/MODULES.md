# 🧩 Struktur Module & Controller Backend

Dokumen ini memuat detail teknis dari komponen arsitektur utama di Backend GamePedia v2.

---

## 🏢 Root Module (`src/app.module.ts`)

Root module bertanggung jawab mengimpor dan mengonfigurasi modul-modul utama aplikasi:

- **`ConfigModule.forRoot({ isGlobal: true })`**: Mengonfigurasi variabel lingkungan secara terpusat dari file `.env` di root backend.

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

## ⚙️ Service Utama (`src/app.service.ts`)

Mengelola logika bisnis dan IO:

- **`getHello(): string`**: Mengembalikan pesan teks default.
- **`getTimeStream(): Observable<MessageEvent>`**: Membentuk interval stream RxJS (`interval(1000)`) yang mengaitkan timestamp server dengan isi data dinamis dari file `data/live-data.json`.
- **`readLiveData(): any`**: Membaca file `data/live-data.json` secara dinamis pada tiap interval tick sehingga perubahan data JSON secara live langsung terrefleksi ke stream SSE tanpa perlu merestart server.

---

## 🚀 Entry Point (`src/main.ts`)

- **CORS Configuration**: Menggunakan preferensi origin dinamis dari `CORS_ORIGIN` atau wildcard `*` dan mengizinkan pengiriman `credentials: true`.
- **Cookie Parser**: Middleware `cookie-parser()` diaktifkan untuk membaca cookie request.
- **Port Management**: Menggunakan `process.env.PORT` atau fallback port `3000`.
