# ⚙️ Pusat Dokumentasi Backend GamePedia v2

Selamat datang di pusat dokumentasi modul **Backend GamePedia v2**! Modul ini dibangun menggunakan **NestJS 12**, **TypeScript 6**, **Vitest**, dan **Oxlint**.

---

## 🗂️ Navigasi Sub-Dokumentasi Backend

Silakan klik tautan di bawah ini untuk mempelajari modul, controller, service, atau pengujian backend secara lebih terperinci:

| Dokumen | Deskripsi |
| :--- | :--- |
| 🧩 [**Struktur Module & Controller (MODULES.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/MODULES.md) | Penjelasan `AppModule`, `AppController`, `AppService`, endpoint SSE real-time (`@Sse('time')`), serta pengolahan data JSON dinamis (`live-data.json`). |
| 📦 [**Modul Storage & Watcher (modules/storage.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/modules/storage.md) | Dokumentasi detail `StorageModule`, endpoint upload gambar, sanitasi direktori aman, serta `DataWatcherService` real-time. |
| 🧪 [**Pengujian & Quality Control (TESTING.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/TESTING.md) | Panduan pengujian Unit Test & End-to-End (E2E) menggunakan **Vitest** serta linter cepat berbasis Rust **Oxlint**. |

---

## 📂 Struktur Folder `backend/`

```
backend/
├── data/
│   ├── live-data.json         # Data JSON Dinamis untuk Stream SSE
│   └── storage/image/         # Direktori Penyimpanan Unggahan Gambar
├── src/
│   ├── common/
│   │   └── interceptors/      # Global Interceptors (LoggingInterceptor)
│   ├── modules/
│   │   └── storage/           # Modul Storage, Controller, Service & Watcher
│   ├── app.controller.ts      # Controller Utama (Handling Request & Route)
│   ├── app.controller.spec.ts # Unit Test Controller (Vitest)
│   ├── app.module.ts          # Root Module Aplikasi (ConfigModule, StorageModule)
│   ├── app.service.ts         # Service Utama (Bisnis Logika & SSE Stream Reader)
│   └── main.ts                # Entry Point NestJS (CORS, Cookie Parser, Dynamic Port)
├── test/
│   └── app.e2e-spec.ts        # E2E Test (Vitest)
├── .oxlintrc.json             # Konfigurasi Linter Oxlint
├── vitest.config.ts           # Konfigurasi Unit Test Vitest
├── vitest.config.e2e.ts       # Konfigurasi E2E Test Vitest
└── tsconfig.json              # Konfigurasi TypeScript Backend
```

---

## ⚡ Perintah Utama Backend

```bash
# Menjalankan NestJS Development Server (Watch Mode)
npm run start:dev --prefix backend

# Build Kompilasi NestJS
npm run build --prefix backend

# Jalankan Oxlint Linter
npm run lint --prefix backend

# Jalankan Unit Test (Vitest)
npm run test --prefix backend

# Jalankan E2E Test (Vitest)
npm run test:e2e --prefix backend
```
