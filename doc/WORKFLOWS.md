# 🔄 Panduan Workflows Otomatisasi GamePedia v2

Dokumen ini menjelaskan secara terperinci tata cara penggunaan dan aturan internal dari **Workflows Utama** yang dirancang untuk membantu pengembang dan AI Agent dalam mengelola komponen, audit kelayakan kode, dokumentasi, timeline, serta proses commit/push aplikasi GamePedia v2.

---

## 📋 Ringkasan Workflows

| Slash Command | Nama Workflow | Berkas Workflow | Tujuan Utama |
| :--- | :--- | :--- | :--- |
| `/create-component` | Membuat Komponen | [`.agents/workflows/create-component.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/create-component.md) | Membuat komponen React berbasis Atomic Design, Depth Scale, View vs Logic, & Custom Components mandate |
| `/audit` | Audit Kualitas Kode | [`.agents/workflows/audit.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/audit.md) | Melakukan audit kelayakan kode (Custom Components vs HTML primitives, OKLCH, Depth Scale, Lint, Build) |
| `/audit-components` | Audit Dekomposisi Komponen | [`.agents/workflows/audit-components.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/audit-components.md) | Mengecek komponen monolitik/kompleks yang dapat dipecah menjadi sub-komponen lebih kecil dan modular |
| `/audit-tailwind` | Audit Composition Class | [`.agents/workflows/audit-tailwind.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/audit-tailwind.md) | Memeriksa penerapan `cn()`, komentar kategori (15 urutan), dan enkapsulasi variabel class |
| `/audit-functions` | Audit Efisiensi & Kinerja Fungsi | [`.agents/workflows/audit-functions.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/audit-functions.md) | Memeriksa efisiensi algoritma, penanganan error, leak memori, async safety, serta unit test Vitest |
| `/update-docs` | Update Dokumentasi | [`.agents/workflows/update-docs.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-docs.md) | Mengecek `git status` dan memecah/memperbarui seluruh file dokumentasi terperinci di folder `doc/` |
| `/update-timeline` | Update Timeline | [`.agents/workflows/update-timeline.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-timeline.md) | Mencatat ringkasan detail perubahan/commit saat ini pada log rilis `doc/TIMELINE.md` |
| `/commit-and-push` | Commit & Push Quality Control | [`.agents/workflows/commit-and-push.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/commit-and-push.md) | Memeriksa build/lint/test, menyelaraskan versi di 6 berkas `package.json` & `package-lock.json`, mensinkronkan timestamp timeline, serta melakukan git commit & push |
| `/discuss` | Diskusi & Brainstorming | [`.agents/workflows/discuss.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/discuss.md) | Mode diskusi, brainstorming arsitektur, dan investigasi tanpa mengubah kode (Zero Code Mutation) |

---

## 📖 Detail & Alur Kerja Setiap Workflow

### 1. Workflow: `/create-component` (Membuat Komponen Atomic Design)
Workflow standar untuk membuat komponen UI di `frontend/src/components/` berbasis **Atomic Design**, **Sistem Kedalaman UI (Depth System -3 s/d 3)**, dan **Pemisahan Tampilan vs Logika (Hybrid)**.

- **Mandat Komponen Custom**: DILARANG memakai HTML DOM primitives bawaan React/HTML murni (`<button>`, `<input>`, `<p>`, `<span>`, dll.) secara langsung di komponen bertingkat. Wajib mengimpor komponen custom (`<Text>`, `<Button>`, `<Input>`, dll.).
- **Enkapsulasi ClassName**: Semua styling disimpan di variabel internal komponen dengan helper `cn()`.
- **Pemisahan Tampilan vs Logika**:
  - Atoms & Molecules: 1 file terstruktur 3 blok (`// 1. TAMPILAN`, `// 2. LOGIKA`, `// 3. RENDER UI`).
  - Organisms, Templates, & Pages: Dipisah menjadi hook logika (`use<Component>.ts`) dan komponen presentasi (`<Component>.tsx`).
- **Depth Scale (-3 s/d 3)**: Mendukung prop `depth` dengan level -3 s/d -1 (Cekung), 0 (Rata), dan 1 s/d 3 (Timbul).

---

### 2. Workflow: `/audit` (Audit Kelayakan & Konvensi Monorepo)
Workflow untuk melakukan audit kepatuhan menyeluruh terhadap konvensi arsitektur, standar styling, dan integritas build monorepo:

- **Audit Komponen Custom**: Memindai seluruh komponen bertingkat dari penggunaan tag HTML murni.
- **Audit Hirarki Atomic Design & Isolasi Domain**: Memastikan atom & molecule tetap murni agnostik domain; domain logic GamePedia wajib dipisahkan ke `src/features/<feature>/`.
- **Audit Kebersihan Folder Global**: Memastikan `src/hooks/`, `src/lib/`, dan `src/utils/` tidak terkontaminasi oleh logika domain khusus.
- **Audit Modularitas Backend**: Memastikan endpoint & logic baru dikelompokkan ke modul domain `backend/src/modules/<domain>/` (larangan flat controller/service di root `src/`) serta pemanfaatan `common/` dan `config/`.
- **Audit Warna OKLCH & Depth System**: Memastikan seluruh styling menggunakan token `@theme` OKLCH (dilarang hardcoded Hex/RGB) dan prop `depth`.
- **Audit Path Alias**: Memastikan seluruh path import menggunakan alias `@/` tanpa relative import `../../`.
- **Verifikasi Lint & Build**: Menjalankan linting (Oxlint & ESLint), unit test (Vitest backend & frontend), dan build kompilasi monorepo.

---

### 3. Workflow: `/audit-components` (Audit Dekomposisi Komponen)
Workflow untuk menganalisis komponen UI guna mengidentifikasi komponen monolitik atau terlalu besar (> 150 baris kode atau multiple responsibilities) yang dapat dipecah menjadi sub-komponen modular:

- **Kriteria Dekomposisi**: File > 150 baris, multiple responsibilities (misal form field + validation meter + requirements list), pengulangan sub-tree JSX, atau pengelolaan > 4-5 state terpisah.
- **Strategi Pemecahan**: Membedah komponen menjadi sub-komponen atoms (elemen kecil), molecules (kombinasi elemen), atau organisms (blok seksi mandiri).
- **Hasil Nyata di GamePedia v2**:
  - `CodeInput` dipecah menjadi `CodeInputField`, `CodeInputResendTimer`, dan `useCodeInput`.
  - `Tooltip` dipecah menjadi `TooltipBubble`, `useTooltip`, dan `Tooltip.styles`.
  - `Dot` dipecah menjadi `DotCircle` dan `Dot.styles`.
  - `Dropdown` dipecah menjadi `DropdownTrigger`, `DropdownPopover`, `DropdownItem`, `DropdownEmptyState`, `useDropdown`, dan `useDropdownKeyboard`.

---

### 4. Workflow: `/audit-tailwind` (Audit Tailwind Class Composition)
Workflow untuk memverifikasi kepatuhan terhadap aturan **Tailwind CSS Class Composition Standard**:

- **Pengelompokan 15 Kategori Class**: Class kompleks wajib dikelompokkan dengan komentar terstruktur (1. `// layout`, 2. `// position`, 3. `// size`, 4. `// spacing`, 5. `// typography`, 6. `// border`, 7. `// background`, 8. `// text`, 9. `// shadow & depth`, 10. `// interaction`, 11. `// focus`, 12. `// state`, 13. `// transition`, 14. `// responsive`, 15. `// dark mode`).
- **Enkapsulasi Class Internal**: Dilarang inline wall-of-text className di dalam JSX render; simpan di variabel terenkapsulasi.
- **Larangan Wall-of-Text className Saat Pemanggilan**: Konsumen dilarang mengoper className panjang saat mengimpor komponen; gunakan semantic props (`variant`, `size`, `depth`).

---

### 5. Workflow: `/audit-functions` (Audit Efisiensi & Kinerja Fungsi)
Workflow untuk memeriksa efisiensi algoritma, normalitas runtime, memory safety, dan cakupan test unit:

- **Efisiensi Algoritma**: Menghindari bottleneck $O(N^2)$, penggunaan `useMemo` & `useCallback` yang tepat pada list besar.
- **Error Handling & Null-Safety**: Menghindari crash runtime dengan optional chaining (`?.`), nullish coalescing (`??`), dan larangan penyerapan error kosong (`catch (e) {}`).
- **Memory Safety & Clean Up**: Verifikasi fungsi cleanup pada seluruh `useEffect`, timer interval/timeout, dan koneksi streaming SSE/WebSocket.
- **Async Safety**: Penanganan race conditions dan pembatalan permintaan usang (*stale request*).
- **Verifikasi Unit Test Vitest**: Eksekusi test suite otomatis (`npm run test --prefix backend` & `npm run test --prefix frontend`).

---

### 6. Workflow: `/update-docs` (Update Dokumentasi Terpecah)
Workflow untuk menyelaraskan dan memperbarui seluruh dokumentasi proyek secara modular di direktori `doc/`:

- **Tahap 1: Inspeksi Git Status & Git Diff**: Memeriksa file yang diubah (`modified`), file baru (`untracked`), atau dihapus (`deleted`).
- **Tahap 2: Analisis Perubahan per Domain**: Dampak perubahan terhadap frontend (`frontend/`), backend (`backend/`), dan workflows (`.agents/`).
- **Tahap 3: Pembaruan Mandat Berkas `.md` Individual per Komponen & Modul**:
  - Setiap komponen UI (atom, molekul, input) di `frontend/src/components/` **wajib** memiliki/memperbarui file `.md` spesifik di `doc/frontend/components/atoms/`, `doc/frontend/components/molecules/`, atau `doc/frontend/components/molecules/inputs/`.
  - Berkas individual memuat deskripsi, lokasi file & sub-komponen, tabel API props & default, Depth System (-3 s/d 3), contoh kode JSX, dan aksesibilitas WAI-ARIA.
  - Setiap fitur bisnis di `frontend/src/features/<feature>/` wajib didokumentasikan di `doc/frontend/features/<feature>.md`.
  - Setiap modul backend di `backend/src/modules/<domain>/` wajib didokumentasikan di `doc/backend/modules/<domain>.md`.
- **Tahap 4: Pembaruan Berkas Katalog & Indeks di `doc/`**:
  - `doc/README.md` & `doc/ARCHITECTURE.md` (indeks utama & struktur monorepo).
  - `doc/frontend/components/README.md` & `doc/frontend/COMPONENTS.md` (indeks & master katalog komponen).
  - `doc/frontend/README.md`, `doc/FRONTEND.md`, `doc/frontend/STYLING.md`, `doc/frontend/HOOKS_AND_STORE.md`.
  - `doc/backend/README.md`, `doc/BACKEND.md`, `doc/backend/MODULES.md`, `doc/backend/TESTING.md`.
  - `doc/WORKFLOWS.md` & `doc/TIMELINE.md`.
- **Tahap 5: Penyelarasan README Utama**: Memastikan `README.md` di root selalu mutakhir.

---

### 7. Workflow: `/update-timeline` (Update Timeline & Catatan Rilis)
Workflow untuk mencatat log perubahan komprehensif ke berkas [`doc/TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) secara terstandarisasi:

- **Tahap 1: Analisis Perubahan**: Memeriksa `git status` dan `git diff` untuk merangkum esensi teknis commit terkini.
- **Tahap 2: Pembaruan Tabel Ringkasan Rilis**: Menambahkan baris baru di tabel `## 📊 Ringkasan Riwayat Rilis` dengan link anchor, timestamp, fokus utama, dan status QC.
- **Tahap 3: Penulisan Entri Detail Rilis**: Menyisipkan blok entri baru di bawah `## 📌 Log Rilis & Timeline Detail` dengan format judul `### 📦 [Versi] — YYYY-MM-DD HH:mm`, blok kutipan `> **Fokus Rilis**: ...`, dan rincian kategori:
  1. 🚀 / 🎨 / ⚡ **Fitur Baru, Antarmuka & Layanan** (Frontend / Backend)
  2. 🛠️ **Refactoring & Dekomposisi Komponen**
  3. 🧪 **Pengujian Unit & Kualitas Kode (Vitest)**
  4. 🔄 **Alur Kerja & Otomatisasi (Workflows)** *(jika ada)*
  5. 📚 **Pembaruan Dokumentasi Proyek**
  6. ⚙️ **Quality Control & Penyelarasan Versi**
- **Tahap 4: Pembatas & Tautan Berkas**: Seluruh path file menggunakan clickable markdown link (`file:///...`) dan diakhiri pemisah garis `---`.

---

### 8. Workflow: `/commit-and-push` (Commit & Push Quality Control)
Gerbang utama verifikasi kualitas sebelum pengiriman kode ke repository remote:

- **Tahap 1: Quality Control (Build, Lint, & Test)**:
  - Linting Oxlint backend (`npm run lint --prefix backend`).
  - Linting ESLint frontend (`npm run lint --prefix frontend`).
  - Unit test Vitest backend (`npm run test --prefix backend`).
  - Unit test Vitest frontend (`npm run test --prefix frontend`).
  - Kompilasi build monorepo (`npm run build`).
  - *Jika terdapat kegagalan pada tahap mana pun, proses commit & push WAJIB dihentikan.*
- **Tahap 2: Penyelarasan Versi Aplikasi**:
  - Update properti `version` serentak pada 6 berkas: root `package.json`, root `package-lock.json`, backend `package.json`, backend `package-lock.json`, frontend `package.json`, frontend `package-lock.json`.
- **Tahap 3: Sinkronisasi Waktu Push di Timeline**:
  - Memperbarui timestamp pada entri rilis teratas di [`doc/TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) agar identik dengan waktu eksekusi push.
- **Tahap 4: Staging, Commit, & Push**:
  - `git add .`
  - Pesan commit **HANYA berisi string versi aplikasi** (contoh: `git commit -m "0.0.5"`).
  - Eksekusi `git push origin main`.

---

### 9. Workflow: `/discuss` (Diskusi & Brainstorming Tanpa Ubah Kode)
Workflow khusus untuk konsultasi, brainstorming fitur baru, evaluasi arsitektur, atau troubleshooting konseptual dengan mandat **Zero Code Mutation**:

- **Mandat Zero Code Mutation**: Agent dilarang memodifikasi file repositori (`write_to_file`, `replace_file_content`, edit git, install package, dll.) selama sesi diskusi.
- **Investigasi Read-Only**: Agent hanya menggunakan tool inspeksi (`view_file`, `grep_search`, `list_dir`) untuk mempelajari arsitektur eksisting.
- **Penyajian Multi-Opsi & Analisis Trade-Off**: Menyajikan minimal 2 alternatif pendekatan dengan kelebihan, kekurangan, dan estimasi dampak.
- **Kode Contoh Hanya di Chat**: Segala potongan kode/types/hook hanya disajikan dalam markdown code block di respon percakapan.
- **Transisi ke Eksekusi**: Transisi ke penulisan kode baru diizinkan setelah pengguna memberikan instruksi persetujuan eksplisit.

