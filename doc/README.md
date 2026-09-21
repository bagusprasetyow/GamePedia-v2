# 📚 Pusat Dokumentasi GamePedia v2

Selamat datang di pusat dokumentasi resmi **GamePedia v2**! Seluruh informasi teknis, arsitektur, panduan pengkodingan, hingga alur kerja otomatisasi (workflows) dipisahkan secara rapi di dalam direktori `doc/` ini.

---

## 🗂️ Navigasi Berkas Dokumentasi

Silakan klik tautan di bawah ini untuk menuju ke dokumentasi spesifik yang Anda butuhkan:

| Berkas | Deskripsi | Target Pembaca |
| :--- | :--- | :--- |
| 🏗️ [**Arsitektur Sistem (doc/ARCHITECTURE.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md) | Penjelasan arsitektur Monorepo, struktur folder, alur komunikasi antar modul, dan tech stack | Architect, Core Developer |
| 🎨 [**Dokumentasi Frontend (doc/FRONTEND.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) | Panduan pengembangan frontend (React 19 + Vite 8 + Tailwind CSS v4 + ESLint) | Frontend Developer |
| ⚙️ [**Dokumentasi Backend (doc/BACKEND.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md) | Panduan pengembangan backend (NestJS 12 + TS 6 + Vitest + Oxlint) | Backend Developer |
| 🔄 [**Panduan 3 Workflows (doc/WORKFLOWS.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md) | Panduan lengkap otomatisasi Agent: `/update-docs`, `/update-timeline`, dan `/commit-and-push` | Semua Contributor & Agent |
| ⏳ [**Timeline & Catatan Rilis (doc/TIMELINE.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) | Log histori rilis, versi aplikasi, serta rincian fitur & perbaikan per commit | Project Manager, Release Lead |

---

## 🛠️ Ringkasan Menjalankan Proyek

```bash
# 1. Install dependencies di root monorepo
npm install

# 2. Jalankan Backend & Frontend secara bersamaan (dev mode)
npm run dev

# 3. Menjalankan linting seluruh proyek
npm run lint --prefix backend
npm run lint --prefix frontend

# 4. Menjalankan test & build
npm run test --prefix backend
npm run build
```
