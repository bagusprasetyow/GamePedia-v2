# 🏗️ Arsitektur Sistem GamePedia v2

Dokumen ini menjelaskan rancangan arsitektur, pilihan teknologi, serta struktur folder aplikasi **GamePedia v2**.

---

## 📐 Gambaran Umum Arsitektur (Monorepo)

GamePedia v2 dirancang mengadopsi pola **Monorepo** untuk mempermudah manajemen kode, penyelarasan dependency versi, serta otomatisasi build/deploy antara komponen **Frontend** dan **Backend**.

```
GamePedia-v2/
├── .agents/              # Antigravity Workflows & Rules
│   └── workflows/       # Defined Slash Commands (/update-docs, /update-timeline, /commit-and-push)
├── backend/              # Aplikasi NestJS 12 (API Gateway & Core Logic)
│   ├── src/             # Source Code (App Module, Controller, Service)
│   ├── test/            # Vitest E2E Tests
│   ├── oxlintrc.json    # Oxlint Fast Linter Config
│   └── package.json
├── frontend/             # Aplikasi React 19 + Vite 8 (User Interface)
│   ├── src/             # Source Code (App.tsx, Components, Assets)
│   ├── index.html
│   ├── eslint.config.js # ESLint v9 Flat Config
│   └── package.json
├── doc/                  # Pusat Dokumentasi Terpisah & Terperinci
├── package.json          # Root Monorepo Configuration (Concurrently & Scripts)
└── README.md             # Dokumen Utama Proyek
```

---

## ⚡ Tech Stack & Dependensi Utama

### ⚙️ Backend Core Stack
- **Framework**: [NestJS 12](https://nestjs.com/) (Modular REST Architecture)
- **Language**: [TypeScript 6](https://www.typescriptlang.org/)
- **Test Runner**: [Vitest 4](https://vitest.dev/) (Unit & E2E Testing)
- **Linter & Formatter**: [Oxlint](https://oxc-project.github.io/) + [Prettier](https://prettier.io/)

### 🎨 Frontend Core Stack
- **Framework & SPA**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (dengan Engine CSS performa tinggi `@tailwindcss/vite`)
- **Linter**: [ESLint 10](https://eslint.org/) (dengan `typescript-eslint` dan Plugin React Hooks)

---

## 🔄 Alur Komunikasi & Integrasi System

1. **Frontend (Vite Server / Browser Client)**:
   - Berjalan pada port penguji lokal (misal `http://localhost:3003`).
   - Mengonsumsi REST API dan berlangganan **Server-Sent Events (SSE)** endpoint (`/time`) via `EventSource` untuk sinkronisasi waktu real-time.
2. **Backend (NestJS Express Engine)**:
   - Berjalan pada port API lokal (misal `http://localhost:3000`).
   - Memproses bisnis logika, validasi DTO, streaming data RxJS (SSE), serta komunikasi ke database/external API services.
3. **Monorepo Runner (`concurrently`)**:
   - Skrip root `npm run dev` menjalankan instance backend (`npm run start:dev --prefix backend`) dan frontend (`npm run dev --prefix frontend`) secara paralel dalam satu terminal dengan warna konsol terpisah (`cyan` & `magenta`).
