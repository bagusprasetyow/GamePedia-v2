# 🎮 GamePedia v2

GamePedia v2 adalah platform katalog dan ensiklopedia game modern berarsitektur Monorepo, dibangun dengan **NestJS 12** di sisi Backend dan **React 19 + Vite 8 + Tailwind CSS v4** di sisi Frontend. Proyek ini menerapkan **Atomic Design System** dengan **Depth System (-3 s/d 3)**, skema warna **OKLCH**, serta pipeline otomatisasi lengkap untuk pengujian, kualitas kode (ESLint, Oxlint, Vitest), dan alur otomatisasi Agent (`/update-docs`, `/update-timeline`, `/commit-and-push`).

---

## 📌 Status Proyek Terbaru

- **Versi Saat Ini**: `0.0.8`
- **Status Monorepo**: 
  - **Frontend**: Implementasi penuh **Atomic Design System** (Atoms: Text, Icon, Button, Switch, Slider, Input, Textarea, Checkbox, Radio, Tooltip, Dot, Badge, Chip, ClearButton, ProgressBar, SegmentedControl dengan sub-komponen modular & styling terenkapsulasi | Molecules: CheckboxGroup, RadioGroup, ThemeToggle, Special Inputs, Dropdown, SourceCode, CodePreview, Clipboard, ShowcasePreview), Depth System (-3 s/d 3), custom hooks (`useTheme`, `usePhoneInput`, `useDropdown`, `useTooltip`, `useCodeInput`, `useClipboard`, `useSourceCode`, `useCodePreview`, `useDebounce`, `useCache`), utilitas (`debounce`, `MemoryCache`), serta suite pengujian unit **Vitest** (28 test suites, 357 unit tests lulus 100%).
  - **Backend**: Integrasi real-time Backend SSE dengan pengiriman data JSON dinamis (`live-data.json`), NestJS `@nestjs/config` & `cookie-parser`.
  - **Dokumentasi**: Modularisasi & pemecahan dokumentasi secara terstruktur di direktori `doc/frontend/` dan `doc/backend/`, termasuk direktori individual berkas `.md` per komponen UI di `doc/frontend/components/`.

---

## 🗂️ Navigasi Dokumentasi (`doc/`)

Seluruh dokumentasi teknis dan panduan operasional proyek tersedia secara modular di folder [`doc/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md):

- 🏠 [**Pusat Dokumentasi (doc/README.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md) - Indeks utama seluruh berkas dokumentasi.
- 🏗️ [**Arsitektur Sistem (doc/ARCHITECTURE.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md) - Struktur monorepo, alur komunikasi data, dan tech stack.
- 🎨 [**Dokumentasi Frontend (doc/FRONTEND.md & doc/frontend/)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) - Panduan React 19, Vite 8, Tailwind CSS v4, dan Atomic Design System ([Katalog Komponen](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md), [Dokumen Komponen Terpecah](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/README.md), [Styling](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/STYLING.md), [Hooks & Testing](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md)).
- ⚙️ [**Dokumentasi Backend (doc/BACKEND.md & doc/backend/)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md) - Panduan NestJS 12, TS 6, Vitest unit testing, dan Oxlint ([Modul & Controller](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/MODULES.md), [Testing](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/TESTING.md)).
- 🔄 [**Panduan Workflows Agent (doc/WORKFLOWS.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md) - Detail workflow otomatisasi agent (`/create-component`, `/audit`, `/audit-components`, `/audit-tailwind`, `/audit-functions`, `/update-docs`, `/update-timeline`, `/commit-and-push`).
- ⏳ [**Timeline & Log Rilis (doc/TIMELINE.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) - Histori versi dan log rilis per commit.

---

## 🚀 Memulai (Quick Start)

### Requirement
- **Node.js**: v20+
- **npm**: v10+

### Menjalankan Mode Pengembang (Development)
```bash
# 1. Install seluruh dependensi
npm install

# 2. Jalankan Backend (port default NestJS) dan Frontend (Vite) secara bersamaan
npm run dev
```

### Menjalankan Quality Check & Build
```bash
# Linting (Backend Oxlint & Frontend ESLint)
npm run lint --prefix backend
npm run lint --prefix frontend

# Unit Testing (Vitest Backend & Frontend)
npm run test --prefix backend
npm run test --prefix frontend

# Build seluruh proyek (Backend & Frontend)
npm run build
```
