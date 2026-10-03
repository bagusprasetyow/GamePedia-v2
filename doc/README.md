# 📚 Pusat Dokumentasi GamePedia v2

Selamat datang di pusat dokumentasi resmi **GamePedia v2**! Seluruh informasi teknis, arsitektur, panduan pengkodingan, hingga alur kerja otomatisasi (workflows) dipisahkan secara rapi dan terpecah di dalam direktori `doc/` ini.

---

## 🗂️ Navigasi Berkas Dokumentasi

Silakan klik tautan di bawah ini untuk menuju ke dokumentasi spesifik yang Anda butuhkan:

| Berkas / Folder | Deskripsi | Target Pembaca |
| :--- | :--- | :--- |
| 🏗️ [**Arsitektur Sistem (doc/ARCHITECTURE.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md) | Penjelasan arsitektur Monorepo, struktur folder, alur komunikasi antar modul, dan tech stack | Architect, Core Developer |
| 🎨 [**Dokumentasi Frontend (doc/FRONTEND.md & doc/frontend/)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) | Panduan utama pengembangan frontend. Sub-dokumentasi terpecah:<br>- 🧩 [Katalog Komponen (doc/frontend/COMPONENTS.md)](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md)<br>- 🎨 [Styling & Depth System (doc/frontend/STYLING.md)](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/STYLING.md)<br>- 🪝 [Hooks & Store (doc/frontend/HOOKS_AND_STORE.md)](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md) | Frontend Developer |
| ⚙️ [**Dokumentasi Backend (doc/BACKEND.md & doc/backend/)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md) | Panduan utama pengembangan backend. Sub-dokumentasi terpecah:<br>- 🧩 [Modul & Controller (doc/backend/MODULES.md)](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/MODULES.md)<br>- 🧪 [Testing & Oxlint (doc/backend/TESTING.md)](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/TESTING.md) | Backend Developer |
| 🔄 [**Panduan Workflows (doc/WORKFLOWS.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md) | Panduan lengkap otomatisasi Agent: `/update-docs`, `/update-timeline`, `/commit-and-push`, dll. | Semua Contributor & Agent |
| ⏳ [**Timeline & Catatan Rilis (doc/TIMELINE.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) | Log histori rilis, versi aplikasi, serta rincian fitur & perbaikan per commit | Project Manager, Release Lead |

---

## 🛠️ Ringkasan Menjalankan Proyek

```bash
# 1. Install dependencies di root monorepo
npm install

# 2. Jalankan Backend & Frontend secara bersamaan (dev mode)
npm run dev

# 3. Menjalankan linting seluruh proyek (Oxlint backend & ESLint frontend)
npm run lint --prefix backend
npm run lint --prefix frontend

# 4. Menjalankan unit test seluruh proyek (Vitest backend & Vitest frontend)
npm run test --prefix backend
npm run test --prefix frontend

# 5. Menjalankan build kompilasi
npm run build
```
