# 🏗️ Arsitektur Sistem GamePedia v2

Dokumen ini menjelaskan rancangan arsitektur, pilihan teknologi, serta struktur folder aplikasi **GamePedia v2**.

---

## 📐 Gambaran Umum Arsitektur (Monorepo)

GamePedia v2 dirancang mengadopsi pola **Monorepo** untuk mempermudah manajemen kode, penyelarasan dependency versi, serta otomatisasi build/deploy antara komponen **Frontend** dan **Backend**.

```
GamePedia-v2/
├── .agents/              # Antigravity Workflows & Rules
│   └── workflows/       # Defined Slash Commands (/create-component, /audit, /audit-components, /audit-tailwind, /audit-functions, /update-docs, /update-timeline, /commit-and-push)
├── backend/              # Aplikasi NestJS 12 (API Gateway & Core Logic)
│   ├── src/
│   │   ├── modules/     # Domain Feature Modules (games, auth, users, reviews, wishlist, search)
│   │   ├── common/      # Cross-Cutting Concerns (guards, interceptors, filters, pipes, decorators)
│   │   ├── config/      # Centralized Configuration & Environment Validation
│   │   ├── app.module.ts# Root Orchestrator Module
│   │   └── main.ts      # Bootstrap Entry Point
│   ├── test/            # Vitest E2E Tests
│   ├── .env.example     # Environment Variables Template
│   ├── oxlintrc.json    # Oxlint Fast Linter Config
│   └── package.json
├── frontend/             # Aplikasi React 19 + Vite 8 (User Interface)
│   ├── src/
│   │   ├── assets/      # Static Assets
│   │   ├── components/  # Atomic Design System (Agnostik Domain Bisnis)
│   │   │   ├── atoms/   # Text, Icon, Button, Switch, Input, Textarea, Checkbox, Radio, Tooltip, Dot, ProgressBar, Slider
│   │   │   └── molecules/# CheckboxGroup, RadioGroup, ThemeToggle, Inputs, Dropdown, SourceCode, Clipboard, ShowcasePreview
│   │   ├── features/    # Feature-Driven Business Logic (games, auth, reviews, wishlist, search)
│   │   │   └── <feature>/ # components/, hooks/, services/, types/, utils/
│   │   ├── hooks/       # Global Reusable Hooks (useTheme)
│   │   ├── lib/         # Infrastructure & Client Setup
│   │   ├── utils/       # Pure Generic Utilities (cn)
│   │   ├── App.tsx      # Main Application Entry Component
│   │   └── index.css    # OKLCH Theme Palette & Tailwind CSS v4
│   ├── eslint.config.js # ESLint Flat Config
│   └── package.json
├── doc/                  # Pusat Dokumentasi Terpisah & Terperinci
│   ├── frontend/        # Sub-dokumentasi Frontend (COMPONENTS.md, STYLING.md, HOOKS_AND_STORE.md)
│   └── backend/         # Sub-dokumentasi Backend (MODULES.md, TESTING.md)
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
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (dengan Engine CSS performa tinggi `@tailwindcss/vite` & Palette OKLCH)
- **Design System**: Atomic Design (Atoms & Molecules terenkapsulasi dengan Depth Scale -3 s/d 3)
- **Test Runner**: [Vitest 4](https://vitest.dev/) (18 test suite otomatis, 171 tests lulus 100% untuk logika komponen, sub-komponen, dan utility functions)
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

---

## 🏛️ Pola Arsitektur Skalabilitas (Target Architecture)

Berdasarkan evaluasi arsitektur GamePedia-v2, sistem menerapkan prinsip pemisahan tegas untuk menjaga skalabilitas seiring bertambahnya fitur bisnis:

### 1. Frontend: Design System vs Feature-Driven
- **`frontend/src/components/` (Design System)**:
  - Berbasis *Atomic Design* (`atoms`, `molecules`, `organisms`, `templates`).
  - **Murni agnostik domain**: Komponen UI tidak mengenal model bisnis GamePedia (`wishlist`, `reviews`, `gamePrice`).
- **`frontend/src/features/` (Domain Business Logic)**:
  - Seluruh fitur bisnis GamePedia dikelompokkan per modul (`games/`, `auth/`, `reviews/`, `wishlist/`, `search/`).
  - Setiap folder fitur memiliki struktur mandiri: `components/`, `hooks/`, `services/`, `types/`, dan `utils/`.
  - Komponen fitur mengonsumsi komponen atom & molecule dari `@/components/`.
- **Disiplin Direktori Global**:
  - `src/hooks/`: Hanya untuk utility hooks global (misal `useTheme`).
  - `src/lib/`: Hanya untuk setup library/infrastruktur (misal `apiClient`).
  - `src/utils/`: Hanya untuk generic pure utilities (`cn.ts`).

### 2. Backend: Modular NestJS Domain
- **`backend/src/modules/<domain>/`**:
  - Menghindari struktur flat di root `backend/src/`.
  - Setiap domain (misal `games`, `auth`, `users`, `reviews`) memiliki modul mandiri dengan `.module.ts`, controller, service, DTO validasi, dan testing.
- **`backend/src/common/`**:
  - Pusat *cross-cutting concerns* (guards, filters, interceptors, pipes, decorators).
- **`backend/src/config/`**:
  - Konfigurasi terpusat dan validasi environment variable berbasis `ConfigService`.
