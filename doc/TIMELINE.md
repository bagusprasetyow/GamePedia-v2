# ⏳ Timeline & Catatan Rilis GamePedia v2

Dokumen ini mencatat seluruh riwayat perubahan, penambahan fitur, perbaikan, serta perkembangan versi aplikasi **GamePedia v2**.

---

## 📌 Log Rilis & Timeline

### 📦 [0.0.6] - 2026-10-04 06:02

**Ringkasan Perubahan pada Commit Ini:**
- 🎨 **Pengembangan Komponen UI Baru (Molecules)**:
  - **Molekul `Clipboard` (`src/components/molecules/Clipboard/`)**: Komponen tombol aksi penyalinan teks clipboard interaktif berstandar Atomic Design dengan feedback visual transisi dinamis (`bg-success`, teks "Tersalin!"), reset otomatis, cleanup memory timer, custom hook `useClipboard.ts`, styling terenkapsulasi `Clipboard.styles.ts`, sub-komponen `ClipboardIcon.tsx` dan `ClipboardLabel.tsx`, serta pengujian Vitest `Clipboard.spec.ts`.
  - **Molekul `SourceCode` (`src/components/molecules/SourceCode/`)**: Komponen penampil kode sumber bergaya terminal window gelap dengan dukungan multi-tab snippet, penyorotan sintaks tokenik real-time (`renderHighlightedLine`), tombol salin terintegrasi, dekomposisi `SourceCodeHeader.tsx`, `SourceCodeBody.tsx`, hook `useSourceCode.ts`, helper `SourceCode.utils.tsx`, styles `SourceCode.styles.ts`, dan unit test `SourceCode.spec.ts`.
  - **Molekul `CodePreview` (`src/components/molecules/SourceCode/CodePreview/`)**: Unit penampil kode modular dengan penyorotan sintaks resmi bergaya **VS Code Dark+**, penomoran baris (*line numbers*), scroll horizontal, dan integrasi Depth System (-3 s/d 3), sub-komponen `CodePreviewLine.tsx`, hook `useCodePreview.ts`, tokenizer `CodePreview.utils.tsx`, styles `CodePreview.styles.ts`, dan unit test `CodePreview.spec.ts`.
  - **Molekul `ShowcasePreview` (`src/components/molecules/ShowcasePreview/`)**: Wadah kanvas preview interaktif (*sandbox canvas*) untuk menguji komponen UI pada lingkungan showcase, dilengkapi bingkai putus-putus (`dashed border`), latar dekoratif (dots, radial, grid), indikator klik dan stempel waktu, pill badges status props aktif, sub-komponen `ShowcasePreviewBackground.tsx`, `ShowcasePreviewBadges.tsx`, `ShowcasePreviewInfo.tsx`, styles `ShowcasePreview.styles.ts`, dan unit test `ShowcasePreview.spec.ts`.
- 🛠️ **Dekomposisi Sub-Komponen & Modularitas Styling pada Seluruh Atoms**:
  - Refactoring arsitektur seluruh 10 atom untuk memisahkan class maps styling ke file terdedikasi `*.styles.ts` dan mengekstrak sub-komponen fungsional:
    - `Button`: Sub-komponen `ButtonLoading.tsx` & `ButtonIcon.tsx`, `Button.styles.ts`, unit test `Button.spec.ts` (19 tests).
    - `Checkbox`: Sub-komponen `CheckboxIndicator.tsx` & `CheckboxLabel.tsx`, `Checkbox.styles.ts`, unit test `Checkbox.spec.ts` (9 tests).
    - `Input`: Sub-komponen `InputLabel.tsx`, `InputHelperText.tsx`, & `InputClearButton.tsx`, `Input.styles.ts`, unit test `Input.spec.ts` (8 tests).
    - `Radio`: Sub-komponen `RadioIndicator.tsx` & `RadioLabel.tsx`, `Radio.styles.ts`, unit test `Radio.spec.ts` (8 tests).
    - `Switch`: Sub-komponen `SwitchTrack.tsx` & `SwitchLabel.tsx`, `Switch.styles.ts`, unit test `Switch.spec.ts` (8 tests).
    - `Textarea`: Sub-komponen `TextareaLabel.tsx` & `TextareaFooter.tsx`, `Textarea.styles.ts`, unit test `Textarea.spec.ts` (9 tests).
    - `Text`: Pemisahan `Text.styles.ts` dan unit test `Text.spec.ts` (9 tests).
    - `Icon`: Pemisahan `Icon.styles.ts` dan unit test `Icon.spec.ts` (4 tests).
    - `Dot`: Sub-komponen `DotCircle.tsx`, `Dot.styles.ts`, unit test `Dot.spec.ts` (11 tests).
    - `Tooltip`: Sub-komponen `components/TooltipBubble.tsx`, `Tooltip.styles.ts`, unit test `Tooltip.spec.ts` (10 tests).
- 🧪 **Ekspansi Vitest Unit Testing di Frontend**:
  - Penambahan dan integrasi spesifikasi pengujian unit komprehensif pada frontend hingga mencapai **18 file test suite** dengan total **171 unit tests** (lulus 100%).
  - Memverifikasi ekspor barrel, rendering sub-komponen, styling terenkapsulasi, dan fungsionalitas interaktif.
- 🧹 **Pembersihan Root Entry Component (`App.tsx`)**:
  - Penyederhanaan komponen `App.tsx` menjadi entri root bersih yang siap diintegrasikan.
- 📚 **Pembaruan Dokumentasi Proyek Terpecah (`doc/` & Root `README.md`)**:
  - Sinkronisasi status proyek pada `README.md`, `doc/README.md`, dan `doc/ARCHITECTURE.md`.
  - Penyelarasan katalog komponen pada `doc/FRONTEND.md` dan `doc/frontend/COMPONENTS.md`.
  - Penambahan panduan custom hooks baru (`useClipboard`, `useSourceCode`, `useCodePreview`) serta rekapitulasi 18 test suite di `doc/frontend/HOOKS_AND_STORE.md`.
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), Vitest (Frontend 171 tests), serta kompilasi build (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.6` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

### 📦 [0.0.5] - 2026-10-03 08:52

**Ringkasan Perubahan pada Commit Ini:**
- 🎨 **Komponen Atomic Design Baru & Dekomposisi UI (Frontend)**:
  - **Atom `Tooltip` (`src/components/atoms/Tooltip/`)**: Komponen gelembung petunjuk interaktif dengan Depth System (skala -3 s/d 3), 12 opsi placement, panah penunjuk, dukungan trigger (hover, click, focus, manual), delay timer, serta arsitektur modular (`Tooltip.tsx`, `TooltipBubble.tsx`, `useTooltip.ts`, `Tooltip.styles.ts`, `Tooltip.spec.ts`).
  - **Atom `Dot` (`src/components/atoms/Dot/`)**: Komponen titik status visual interaktif dengan animasi denyut halo ripple (`ping`) & kedip halus (`pulse`), efek neon ambient glow, ring pembatas kontras (`bordered`), teks label status pendamping, serta penempatan anchor overlay pada anak (avatar/icon/button) (`Dot.tsx`, `components/DotCircle.tsx`, `Dot.styles.ts`, `Dot.spec.ts`).
  - **Molekul `Dropdown` (`src/components/molecules/Dropdown/`)**: Komponen dropdown seleksi serbaguna mendukung single-select & multi-select (dengan badges tag & clearable), mode ComboBox pencarian reaktif (`isComboBox` / `isSearchable`), Depth System (-3 s/d 3), navigasi keyboard penuh WAI-ARIA, serta dekomposisi sub-komponen (`DropdownTrigger`, `DropdownPopover`, `DropdownItem`, `DropdownEmptyState`, `useDropdown`, `useDropdownKeyboard`, `dropdown.utils.ts`, `dropdown.utils.spec.ts`).
  - **Dekomposisi Sub-Komponen & Utilitas Input**:
    - `CodeInput`: Refactoring modular menjadi `CodeInputField.tsx`, `CodeInputResendTimer.tsx`, dan hook `useCodeInput.ts`.
    - `PasswordStrengthBar`: Ekstraksi algoritma perhitungan skor ke `passwordStrength.utils.ts` dan unit test `passwordStrength.spec.ts`.
    - `SearchInput`: Ekstraksi pemfilteran teks ke `SearchInput.utils.ts` dan unit test `SearchInput.utils.spec.ts`.
    - `PhoneInput`: Penguatan unit test `phoneUtils.spec.ts` dan hook `usePhoneInput.ts`.
- 🧪 **Implementasi Vitest Unit Testing di Frontend**:
  - Konfigurasi dan integrasi **Vitest 4** di `frontend/package.json` dengan skrip `npm run test`.
  - Pembuatan 6 test suite spesifikasi unit testing otomatis dengan total 42 tests yang lulus 100% (`Dot.spec.ts`, `Tooltip.spec.ts`, `dropdown.utils.spec.ts`, `passwordStrength.spec.ts`, `SearchInput.utils.spec.ts`, dan `phoneUtils.spec.ts`).
- 🔄 **Workflow Baru & Penyelarasan Otomatisasi Agent**:
  - Pembuatan workflow baru `/audit-functions` di `.agents/workflows/audit-functions.md` untuk audit efisiensi algoritma, penanganan error, memory safety, dan async safety.
  - Perluasan dokumentasi detail seluruh 8 workflow otomatisasi di [`doc/WORKFLOWS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md).
- 📚 **Pembaruan Menyeluruh Dokumentasi Proyek (`doc/` & Root)**:
  - Pembaruan status proyek dan perintah pengujian pada [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md) dan [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md).
  - Pembaruan arsitektur sistem, struktur monorepo, dan tech stack di [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md).
  - Penyelarasan urutan 10 Atom dan dokumentasi lengkap Dropdown di [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) dan [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md).
  - Penambahan dokumentasi custom hooks dan unit testing di [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), Vitest (Frontend 42 tests), dan kompilasi build (NestJS + Vite React) dinyatakan PASS (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.5` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

### 📦 [0.0.4] - 2026-09-30 14:12

**Ringkasan Perubahan pada Commit Ini:**
- 🎨 **Implementasi Atomic Design System & Component Library (Frontend)**:
  - **Atoms**: Penambahan komponen atomik terenkapsulasi penuh `<Text>`, `<Icon>`, `<Button>`, `<Switch>`, `<Input>`, `<Textarea>`, `<Checkbox>`, dan `<Radio>`.
  - **Molecules**: Penambahan komponen molekul `<CheckboxGroup>`, `<RadioGroup>`, `<ThemeToggle>`, serta kumpulan input spesifik: `<TextInput>`, `<EmailInput>`, `<PasswordInput>` (dengan `PasswordRequirements`, `PasswordStrengthBar`, `PasswordStrengthMeter`), `<UsernameInput>`, `<PhoneInput>` (dengan `phoneUtils.ts` & `usePhoneInput.ts`), `<FullNameInput>`, `<CodeInput>`, `<PinInput>`, `<OtpInput>`, `<SearchInput>`, dan `<TextareaInput>`.
  - **Depth System (-3 s/d 3)**: Penerapan kedalaman visual taktil simetris (Cekung, Rata, Timbul) pada seluruh komponen interaktif.
  - **Hooks & State**: Implementasi custom hook `useTheme` berbasis `useSyncExternalStore` dan pengalih tema reaktif global.
- 📚 **Modularisasi & Pemecahan Dokumentasi Terpisah (`doc/`)**:
  - Pembuatan direktori terpecah `doc/frontend/` memuat [`COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md), [`STYLING.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/STYLING.md), [`HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md), dan [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/README.md).
  - Pembuatan direktori terpecah `doc/backend/` memuat [`MODULES.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/MODULES.md), [`TESTING.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/TESTING.md), dan [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/README.md).
  - Penyesuaian `doc/README.md`, `doc/FRONTEND.md`, `doc/BACKEND.md`, `doc/ARCHITECTURE.md`, dan root `README.md`.
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), dan Build kompilasi (NestJS + Vite React) PASS 100%.
  - Menyinkronkan versi aplikasi pada 6 berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.4`.

### 📦 [0.0.3] - 2026-09-22 15:15

**Ringkasan Perubahan pada Commit Ini:**
- ⚙️ **Konfigurasi Backend & Dinamis Data JSON Stream**:
  - Integrasi `@nestjs/config` (`ConfigModule.forRoot`) pada `AppModule` (`backend/src/app.module.ts`) untuk pengelolaan environment variable global.
  - Integrasi `cookie-parser` middleware pada `main.ts` dengan type definition `@types/cookie-parser`.
  - Pembaruan konfigurasi CORS backend di `main.ts` (Dynamic `CORS_ORIGIN`, `credentials: true`) dan dynamic `PORT`.
  - Implementasi pembacaan file `data/live-data.json` secara dinamis di `AppService.readLiveData()` dan disertakan pada stream payload SSE (`@Sse('time')`).
- 🎨 **Standarisasi Styling Tailwind CSS v4 & Frontend UI Refactoring**:
  - Penambahan variabel skema warna OKLCH pada `@theme` di `frontend/src/index.css` (Primary palette, Neutral palette, Semantic colors: success, warning, error, info, Surface/Background).
  - Penambahan helper `cn()` (`clsx` + `tailwind-merge`) di `frontend/src/lib/` & `frontend/src/utils/`.
  - Refactoring total `App.tsx` sesuai standar Tailwind Class Organization Standard (grouping class per kategori: layout, spacing, typography, background, border, text, transition).
  - Tampilan baru untuk stream data JSON real-time (`live-data.json`) lengkap dengan badge indikator koneksi SSE (Live SSE / Reconnecting).
- 📚 **Pembaruan Dokumentasi & Quality Control**:
  - Pembaruan seluruh berkas di `doc/` (`README.md`, `ARCHITECTURE.md`, `FRONTEND.md`, `BACKEND.md`, `TIMELINE.md`) serta root `README.md`.
  - Seluruh pre-commit check (Oxlint backend, ESLint frontend, Vitest unit test, TypeScript & Vite build) PASS 100%.
  - Menyinkronkan versi aplikasi pada 6 berkas package ke versi `0.0.3`.

### 📦 [0.0.2] - 2026-09-21 23:50

**Ringkasan Perubahan pada Commit Ini:**
- ⚡ **Backend Stream SSE (Server-Sent Events)**:
  - Implementasi endpoint `@Sse('time')` pada `AppController` (`backend/src/app.controller.ts`) yang menghasilkan stream RxJS per 1 detik (`TimePayload`: timestamp, timeString, unix) melalui `AppService.getTimeStream()`.
  - Penambahan unit test untuk endpoint streaming SSE di `AppControllerSpec` (`backend/src/app.controller.spec.ts`).
- 🎨 **Frontend Real-Time UI & Modern Styling**:
  - Konfigurasi Path Alias `@/*` di `vite.config.ts` dan `tsconfig.app.json` untuk impor file yang lebih bersih.
  - Integrasi `@iconify/react` untuk ikon interaktif (gamepad, server, clock, timer, calendar, activity, status indicators).
  - Langganan stream SSE backend menggunakan `EventSource` di `App.tsx` dengan penanganan reconnect otomatis dan error state.
  - Pembaruan UI Dark Mode modern (Slate 950, efek glowing indigo, jam digital real-time, live tick counter).
  - Pembersihan asset lama dan penambahan `logo.svg` baru.
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), dan TypeScript build (Root, Backend, Frontend) dinyatakan PASS (0 errors).
  - Menyinkronkan versi 6 berkas (`package.json` & `package-lock.json` di Root, Backend, dan Frontend) ke versi `0.0.2`.

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
