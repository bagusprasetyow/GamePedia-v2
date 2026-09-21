# 🔄 Panduan 3 Workflows Otomatisasi GamePedia v2

Dokumen ini menjelaskan secara terperinci tata cara penggunaan dan aturan internal dari **3 Workflows Utama** yang dirancang untuk membantu pengembang dan AI Agent dalam mengelola dokumentasi, timeline, serta proses commit/push aplikasi GamePedia v2.

---

## 📋 Ringkasan 3 Workflows

| Slash Command | Nama Workflow | Berkas Workflow | Tujuan Utama |
| :--- | :--- | :--- | :--- |
| `/update-docs` | Update Dokumentasi | [`.agents/workflows/update-docs.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-docs.md) | Mengecek `git status` dan memecah/memperbarui seluruh file dokumentasi terperinci di folder `doc/` |
| `/update-timeline` | Update Timeline | [`.agents/workflows/update-timeline.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-timeline.md) | Mencatat ringkasan detail perubahan/commit saat ini pada log rilis `doc/TIMELINE.md` |
| `/commit-and-push` | Commit & Push Quality Control | [`.agents/workflows/commit-and-push.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/commit-and-push.md) | Memeriksa build/lint/test, menyelaraskan versi di 6 berkas `package.json` & `package-lock.json`, mensinkronkan timestamp timeline, serta melakukan git commit & push |

---

## 📖 Detail & Alur Kerja Setiap Workflow

### 1. Workflow 1: `/update-docs` (Update Dokumentasi)
Workflow ini bertugas memperbarui dokumentasi secara mendalam. Tidak hanya meng-update `README.md` utama, tetapi membedah dan melengkapi seluruh file dokumentasi di direktori `doc/`.

- **Tahap 1: Inspeksi Git Status**
  - Mengksekusi `git status` untuk melihat file mana saja yang mengalami modifikasi (`modified`), file baru (`untracked`), atau penghapusan file (`deleted`).
- **Tahap 2: Analisis Kode & Fitur**
  - Menganalisis dampak perubahan terhadap komponen frontend (`frontend/src/`), backend (`backend/src/`), konfigurasi build, serta otomatisasi workflow.
- **Tahap 3: Pembaruan Berkas `doc/`**
  - Update [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md) jika ada penambahan halaman dokumen baru.
  - Update [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md) jika ada perubahan struktur folder atau aliran sistem.
  - Update [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) jika ada komponen/paket frontend baru.
  - Update [`doc/BACKEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md) jika ada modul/endpoint NestJS baru.
  - Update [`doc/WORKFLOWS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md) jika ada modifikasi skenario workflow.
  - Update [`doc/TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) untuk menyelaraskan catatan rilis dokumentasi.
- **Tahap 4: Penyelarasan README Utama**
  - Memastikan [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md) di root monorepo selalu terhubung dan menyajikan rangkuman terkini.

---

### 2. Workflow 2: `/update-timeline` (Update Timeline)
Workflow ini digunakan untuk mencatat setiap aktivitas perubahan ke dalam catatan sejarah proyek pada berkas [`doc/TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md).

- **Tahap 1: Ekstraksi Informasi Perubahan**
  - Memeriksa `git status` dan `git diff` untuk merangkum daftar perubahan secara persis.
- **Tahap 2: Penentuan Kategori Perubahan**
  - Perubahan dikelompokkan ke dalam kategori:
    - 🚀 **Fitur Baru & UI**
    - 🛠️ **Refactoring & Perbaikan Kode**
    - ⚙️ **Konfigurasi & Build System**
    - 📚 **Pembaruan Dokumentasi**
- **Tahap 3: Penulisan Entri Timeline**
  - Memasukkan entri terbaru di posisi paling atas log [`doc/TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) dengan mencantumkan:
    - **Versi App** (contoh: `0.0.1`).
    - **Waktu Presisi Membawa Menit** (Format: `YYYY-MM-DD HH:mm`).
    - **Deskripsi Perubahan**.

---

### 3. Workflow 3: `/commit-and-push` (Commit dan Push)
Workflow ini adalah gerbang utama sebelum kode dikirim (push) ke repository server untuk memastikan tidak ada kesalahan build atau ketidakcocokan versi.

- **Tahap 1: Quality Control (Build, Lint, & Test)**
  - Eksekusi linting Oxlint backend (`npm run lint --prefix backend`).
  - Eksekusi linting ESLint frontend (`npm run lint --prefix frontend`).
  - Eksekusi unit test Vitest backend (`npm run test --prefix backend`).
  - Eksekusi kompilasi build monorepo (`npm run build`).
  - *Jika terdapat kegagalan pada salah satu proses di atas, proses commit & push WAJIB dihentikan sampai error diperbaiki.*
- **Tahap 2: Penyelarasan Versi Aplikasi**
  - Tentukan versi aplikasi (misal `0.0.1`, `0.0.5`, atau `0.5.7`).
  - Update properti `version` pada **6 file secara serentak**:
    1. [`package.json`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/package.json) (Root)
    2. [`package-lock.json`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/package-lock.json) (Root)
    3. [`backend/package.json`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/package.json) (Backend)
    4. [`backend/package-lock.json`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/backend/package-lock.json) (Backend)
    5. [`frontend/package.json`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/package.json) (Frontend)
    6. [`frontend/package-lock.json`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/package-lock.json) (Frontend)
- **Tahap 3: Penyelarasan Waktu Push di Timeline**
  - Ambil timestamp lokal saat push dilakukan sampai hitungan menit (misal `2026-09-21 22:56`).
  - Perbarui bagian tanggal/waktu pada entri rilis paling atas di [`doc/TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) agar waktunya identik dengan momen push.
- **Tahap 4: Staging, Commit, & Push**
  - `git add .`
  - Buat pesan commit yang **HANYA berisi string versi aplikasi** (contoh: `git commit -m "0.0.1"`).
  - Eksekusi `git push origin main`.
