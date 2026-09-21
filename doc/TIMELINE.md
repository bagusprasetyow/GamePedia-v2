# ⏳ Timeline & Catatan Rilis GamePedia v2

Dokumen ini mencatat seluruh riwayat perubahan, penambahan fitur, perbaikan, serta perkembangan versi aplikasi **GamePedia v2**.

---

## 📌 Log Rilis & Timeline

### 📦 [0.0.1] - 2026-09-21 23:08

**Ringkasan Perubahan pada Commit Ini:**
- 🚀 **Inisialisasi Monorepo & Integrasi Backend-Frontend**:
  - Konfigurasi Root Monorepo dengan script `concurrently` untuk menjalankan backend (NestJS 12) dan frontend (React 19 + Vite 8) secara simultan.
  - Setup TypeScript 6, Vitest 4, Oxlint pada `backend/` dan React 19, Vite 8, Tailwind CSS v4, ESLint pada `frontend/`.
- 🤖 **Pembangunan 3 Workflows Otomatisasi Agent**:
  - `update-docs` (`.agents/workflows/update-docs.md`): Otomatisasi pemeriksaan `git status` dan pembaruan dokumen terperinci di folder `doc/`.
  - `update-timeline` (`.agents/workflows/update-timeline.md`): Otomatisasi perekaman ringkasan perubahan commit ke file `doc/TIMELINE.md`.
  - `commit-and-push` (`.agents/workflows/commit-and-push.md`): Otomatisasi quality control (lint, test, build), sinkronisasi versi pada 6 berkas `package.json` dan `package-lock.json`, penyelarasan timestamp timeline hingga menit, serta git commit dengan message bernilai versi aplikasi (`"0.0.1"`) dan git push.
- 📚 **Penyusunan Dokumentasi Terpisah & Terperinci (`doc/` & root `README.md`)**:
  - Root [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md) - Dokumentasi dan Quick Start Utama.
  - [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md) - Pusat Navigasi Dokumentasi.
  - [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md) - Arsitektur Monorepo & Tech Stack.
  - [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) - Panduan Frontend React 19 + Vite 8 + Tailwind CSS v4.
  - [`doc/BACKEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md) - Panduan Backend NestJS 12 + Vitest + Oxlint.
  - [`doc/WORKFLOWS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md) - Panduan Lengkap 3 Workflows Otomatis.
  - [`doc/TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) - Catatan Rilis & Timestamp Rilis.
- ⚙️ **Penyelarasan Versi**:
  - Menyinkronkan versi seluruh berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.1`.
