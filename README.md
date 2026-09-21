# 🎮 GamePedia v2

GamePedia v2 adalah platform katalog dan ensiklopedia game modern berarsitektur Monorepo, dibangun dengan **NestJS 12** di sisi Backend dan **React 19 + Vite 8 + Tailwind CSS v4** di sisi Frontend. Proyek ini dilengkapi dengan pipeline otomatisasi lengkap untuk pengujian, kualitas kode (ESLint, Oxlint, Vitest), serta alur otomatisasi Agent (`/update-docs`, `/update-timeline`, `/commit-and-push`).

---

## 📌 Status Proyek Terbaru

- **Versi Saat Ini**: `0.0.1`
- **Status Monorepo**: Inisialisasi awal monorepo, konfigurasi NestJS 12 backend & React 19 frontend, integrasi 3 workflow otomatisasi agent, serta penyiapan dokumentasi terstruktur di `doc/`.

---

## 🗂️ Navigasi Dokumentasi (`doc/`)

Seluruh dokumentasi teknis dan panduan operasional proyek tersedia di folder [`doc/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md):

- 🏠 [**Pusat Dokumentasi (doc/README.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md) - Indeks utama seluruh berkas dokumentasi.
- 🏗️ [**Arsitektur Sistem (doc/ARCHITECTURE.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md) - Struktur monorepo, alur komunikasi data, dan tech stack.
- 🎨 [**Dokumentasi Frontend (doc/FRONTEND.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) - Panduan pengembangan React 19, Vite 8, Tailwind CSS v4, dan ESLint.
- ⚙️ [**Dokumentasi Backend (doc/BACKEND.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md) - Panduan NestJS 12, TS 6, Vitest unit testing, dan Oxlint.
- 🔄 [**Panduan Workflows Agent (doc/WORKFLOWS.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md) - Detail 3 workflow otomatisasi agent (`/update-docs`, `/update-timeline`, `/commit-and-push`).
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
# Linting
npm run lint --prefix backend
npm run lint --prefix frontend

# Unit Test Backend
npm run test --prefix backend

# Build seluruh proyek (Backend & Frontend)
npm run build
```
