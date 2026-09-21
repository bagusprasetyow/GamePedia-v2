# ⚙️ Dokumentasi Backend GamePedia v2

Dokumen ini memuat detail arsitektur dan panduan pengembangan aplikasi Backend GamePedia v2 yang dibangun menggunakan **NestJS 12**, **TypeScript 6**, **Vitest**, dan **Oxlint**.

---

## 🛠️ Stack & Perkakas Backend

- **NestJS 12**: Framework aplikasi server-side berbasis Node.js yang modular dan scalable.
- **TypeScript 6**: Type checking generasi terbaru.
- **RxJS Server-Sent Events (SSE)**: Streaming data real-time via `@Sse('time')` endpoint di `AppController`.
- **Vitest**: Test runner alternatif super cepat menggantikan Jest untuk Unit Testing dan End-to-End (E2E) testing.
- **Oxlint**: High-performance Linter berbasis Rust yang jauh lebih cepat daripada ESLint konvensional.
- **Prettier**: Formatter otomatis untuk kerapihan kode TypeScript.

---

## 📂 Struktur Folder Backend

```
backend/
├── src/
│   ├── app.controller.ts      # Controller Utama (Handling Request & Route)
│   ├── app.controller.spec.ts # Unit Test Controller (Vitest)
│   ├── app.module.ts          # Root Module Aplikasi
│   ├── app.service.ts         # Service Utama (Bisnis Logika)
│   └── main.ts                # Entry Point NestJS App
├── test/
│   └── app.e2e-spec.ts        # Testing End-to-End (Vitest)
├── .oxlintrc.json             # Konfigurasi Linter Oxlint
├── nest-cli.json              # Konfigurasi Nest CLI
├── vitest.config.ts           # Konfigurasi Unit Test Vitest
├── vitest.config.e2e.ts       # Konfigurasi E2E Test Vitest
└── tsconfig.json              # Konfigurasi TypeScript Backend
```

---

## ⚡ Perintah Penting (Commands)

```bash
# Menjalankan Backend Dev Server (Watch Mode)
npm run start:dev --prefix backend

# Menjalankan Build Kompilasi NestJS
npm run build --prefix backend

# Jalankan Fast Oxlint Linting Check
npm run lint --prefix backend

# Jalankan Unit Testing (Vitest)
npm run test --prefix backend

# Jalankan E2E Testing (Vitest)
npm run test:e2e --prefix backend
```
