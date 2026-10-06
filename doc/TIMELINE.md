# ⏳ Timeline & Catatan Rilis GamePedia v2

Dokumen ini mencatat seluruh riwayat perubahan, penambahan fitur, perbaikan refactoring, pengujian kualitas, serta perkembangan versi aplikasi **GamePedia v2** secara terstruktur dan kronologis (rilis terbaru berada di bagian paling atas).

---

## 📊 Ringkasan Riwayat Rilis

| Versi | Tanggal & Waktu | Fokus Utama Perubahan | Status QC |
| :--- | :--- | :--- | :--- |
| [**0.0.7**](#-007--2026-10-06-1505) | 2026-10-06 15:05 | Atom baru (`Badge`, `Chip`, `ClearButton`), 32 dokumen individual komponen, ekspansi 199 unit tests Vitest, & workflows `/update-docs`, `/update-timeline` | ✅ PASS 100% |
| [**0.0.6**](#-006--2026-10-04-0602) | 2026-10-04 06:02 | Molekul UI baru, dekomposisi 10 Atom, ekspansi 171 unit test Vitest, dan cleanup `App.tsx` | ✅ PASS 100% |
| [**0.0.5**](#-005--2026-10-03-0852) | 2026-10-03 08:52 | Komponen Tooltip, Dot, Dropdown, dekomposisi input, integrasi Vitest frontend, & workflow `/audit-functions` | ✅ PASS 100% |
| [**0.0.4**](#-004--2026-09-30-1412) | 2026-09-30 14:12 | Fondasi Atomic Design System (8 Atoms, Form Molecules, Depth -3 s/d 3), & pemisahan folder `doc/` | ✅ PASS 100% |
| [**0.0.3**](#-003--2026-09-22-1515) | 2026-09-22 15:15 | Standarisasi Tailwind CSS v4 (OKLCH token), helper `cn()`, dynamic CORS/PORT, & dynamic JSON SSE stream | ✅ PASS 100% |
| [**0.0.2**](#-002--2026-09-21-2350) | 2026-09-21 23:50 | Streaming SSE RxJS backend, integrasi EventSource frontend, `@iconify/react`, path alias `@/*`, & Dark Mode UI | ✅ PASS 100% |
| [**0.0.1**](#-001--2026-09-21-2308) | 2026-09-21 23:08 | Inisialisasi Monorepo (NestJS 12 + React 19 Vite 8), 3 workflows otomatisasi agent, & dokumentasi awal | ✅ PASS 100% |

---

## 📌 Log Rilis & Timeline Detail

### 📦 [0.0.7] — 2026-10-06 15:05

> **Fokus Rilis**: Penambahan 3 komponen atom baru (`Badge`, `Chip`, `ClearButton`), penulisan menyeluruh 32 berkas dokumentasi individual komponen (`doc/frontend/components/`), ekspansi pengujian Vitest menjadi 199 unit tests, integrasi workflow otomatisasi `/update-docs` & `/update-timeline`, serta standarisasi logo aset monorepo.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Atoms)**:
  - **Atom `Badge`** ([`Badge`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Badge/)): Komponen status indikator visual ringkas dengan ragam 8 varian warna (`neutral`, `primary`, `secondary`, `accent`, `success`, `warning`, `danger`, `info`), 3 varian visual (`solid`, `outline`, `subtle`), ukuran (`sm`, `md`, `lg`), dukungan icon (`BadgeIcon`), label (`BadgeLabel`), Depth System (`-3` s/d `3`), styling modular `Badge.styles.ts`, dan unit test `Badge.spec.ts` (10 tests).
  - **Atom `Chip`** ([`Chip`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/)): Komponen tag/chip interaktif dan dinamis dengan fitur dismiss/remove (`onRemove`), seleksi aktif (`selected`), avatar/icon (`ChipIcon`), sub-komponen `ChipLabel.tsx` & `ChipRemove.tsx`, Depth System terintegrasi, styling modular `Chip.styles.ts`, serta unit test `Chip.spec.ts` (9 tests).
  - **Atom `ClearButton`** ([`ClearButton`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ClearButton/)): Komponen tombol pembersih input modular independen dengan animasi hover/active, ukuran proporsional (`sm`, `md`, `lg`), styling terenkapsulasi `ClearButton.styles.ts`, dan unit test `ClearButton.spec.ts` (9 tests).
- 🛠️ **Refactoring & Penyelarasan Komponen**:
  - Refactoring sub-komponen `InputClearButton.tsx` pada atom `Input` agar menggunakan atom kanonik `ClearButton`.
  - Penyelarasan interaksi dan styling pada molekul `Dropdown` dan `DropdownTrigger.tsx`.
  - Standardisasi modul logo TypeScript pada [`frontend/src/assets/logo/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/assets/logo/index.ts) serta penambahan aset [`frontend/public/logo.svg`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/public/logo.svg).
- 🧪 **Pengujian Unit & Kualitas Kode (Vitest)**:
  - Ekspansi pengujian frontend menjadi **21 file test suite** dengan total **199 unit tests** (lulus 100%).
  - Penambahan unit test spesifikasi untuk atom `Badge` (10 tests), `Chip` (9 tests), dan `ClearButton` (9 tests).
- 🔄 **Alur Kerja & Otomatisasi (Workflows)**:
  - Formalisasi workflow baru [`/update-docs`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-docs.md) untuk standarisasi pembaruan dokumentasi terpecah per komponen di `doc/frontend/components/`.
  - Formalisasi workflow baru [`/update-timeline`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-timeline.md) untuk pembaruan terstandarisasi berkas `doc/TIMELINE.md`.
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Penulisan 32 berkas dokumentasi individual komponen lengkap di [`doc/frontend/components/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/):
    - 13 berkas dokumen Atoms: `Badge.md`, `Button.md`, `Checkbox.md`, `Chip.md`, `ClearButton.md`, `Dot.md`, `Icon.md`, `Input.md`, `Radio.md`, `Switch.md`, `Text.md`, `Textarea.md`, `Tooltip.md`.
    - 19 berkas dokumen Molecules: `CheckboxGroup.md`, `Clipboard.md`, `CodePreview.md`, `Dropdown.md`, `RadioGroup.md`, `ShowcasePreview.md`, `SourceCode.md`, `ThemeToggle.md`, serta 11 input form (`CodeInput.md`, `EmailInput.md`, `FullNameInput.md`, `OtpInput.md`, `PasswordInput.md`, `PhoneInput.md`, `PinInput.md`, `SearchInput.md`, `TextInput.md`, `TextareaInput.md`, `UsernameInput.md`).
  - Sinkronisasi status monorepo pada [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md), [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md), [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md), [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md), [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md), [`doc/frontend/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/README.md), dan [`doc/WORKFLOWS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), Vitest (Frontend 199 tests), dan build kompilasi (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.7` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

---

### 📦 [0.0.6] — 2026-10-04 06:02

> **Fokus Rilis**: Pengembangan 4 komponen molekul baru (`Clipboard`, `SourceCode`, `CodePreview`, `ShowcasePreview`), dekomposisi arsitektur styling dan sub-komponen seluruh 10 atom, ekspansi Vitest frontend hingga 171 tests, serta penyederhanaan root entry `App.tsx`.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Molecules)**:
  - **Molekul `Clipboard`** ([`Clipboard`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/)): Komponen aksi penyalinan teks clipboard interaktif berstandar Atomic Design dengan feedback visual transisi dinamis (`bg-success`, teks "Tersalin!"), reset otomatis, cleanup memory timer, custom hook `useClipboard.ts`, styling terenkapsulasi `Clipboard.styles.ts`, sub-komponen `ClipboardIcon.tsx` dan `ClipboardLabel.tsx`, serta pengujian Vitest `Clipboard.spec.ts`.
  - **Molekul `SourceCode`** ([`SourceCode`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/)): Komponen penampil kode sumber bergaya terminal window gelap dengan dukungan multi-tab snippet, penyorotan sintaks tokenik real-time (`renderHighlightedLine`), tombol salin terintegrasi, dekomposisi `SourceCodeHeader.tsx`, `SourceCodeBody.tsx`, hook `useSourceCode.ts`, helper `SourceCode.utils.tsx`, styles `SourceCode.styles.ts`, dan unit test `SourceCode.spec.ts`.
  - **Molekul `CodePreview`** ([`CodePreview`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/)): Unit penampil kode modular dengan penyorotan sintaks resmi bergaya **VS Code Dark+**, penomoran baris (*line numbers*), scroll horizontal, integrasi Depth System (-3 s/d 3), sub-komponen `CodePreviewLine.tsx`, hook `useCodePreview.ts`, tokenizer `CodePreview.utils.tsx`, styles `CodePreview.styles.ts`, dan unit test `CodePreview.spec.ts`.
  - **Molekul `ShowcasePreview`** ([`ShowcasePreview`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/)): Wadah kanvas preview interaktif (*sandbox canvas*) untuk menguji komponen UI pada showcase, bingkai putus-putus (`dashed border`), latar dekoratif (dots, radial, grid), indikator klik dan stempel waktu, pill badges status props aktif, sub-komponen `ShowcasePreviewBackground.tsx`, `ShowcasePreviewBadges.tsx`, `ShowcasePreviewInfo.tsx`, styles `ShowcasePreview.styles.ts`, dan unit test `ShowcasePreview.spec.ts`.
- 🛠️ **Refactoring & Dekomposisi Sub-Komponen (Atoms)**:
  - Refactoring arsitektur seluruh 10 atom untuk memisahkan class maps styling ke berkas terdedikasi `*.styles.ts` dan mengekstrak sub-komponen fungsional:
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
  - Penyederhanaan root entry component [`App.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/App.tsx) menjadi entri root bersih yang siap diintegrasikan.
- 🧪 **Pengujian Unit Frontend (Vitest)**:
  - Penambahan dan integrasi spesifikasi pengujian unit komprehensif pada frontend hingga mencapai **18 file test suite** dengan total **171 unit tests** (lulus 100%).
  - Memverifikasi ekspor barrel, rendering sub-komponen, styling terenkapsulasi, dan fungsionalitas interaktif.
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Sinkronisasi status proyek pada [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md), [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md), dan [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md).
  - Penyelarasan katalog komponen pada [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) dan [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md).
  - Penambahan panduan custom hooks baru (`useClipboard`, `useSourceCode`, `useCodePreview`) serta rekapitulasi 18 test suite di [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), Vitest (Frontend 171 tests), serta kompilasi build (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.6` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

---

### 📦 [0.0.5] — 2026-10-03 08:52

> **Fokus Rilis**: Penambahan komponen `Tooltip`, `Dot`, `Dropdown`, dekomposisi input form, implementasi awal pengujian Vitest di frontend, pembuatan workflow `/audit-functions`, serta pembaruan dokumentasi monorepo.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Frontend)**:
  - **Atom `Tooltip`** ([`Tooltip`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/)): Komponen gelembung petunjuk interaktif dengan Depth System (skala -3 s/d 3), 12 opsi placement, panah penunjuk, dukungan trigger (hover, click, focus, manual), delay timer, serta arsitektur modular (`Tooltip.tsx`, `TooltipBubble.tsx`, `useTooltip.ts`, `Tooltip.styles.ts`, `Tooltip.spec.ts`).
  - **Atom `Dot`** ([`Dot`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Dot/)): Komponen titik status visual interaktif dengan animasi denyut halo ripple (`ping`) & kedip halus (`pulse`), efek neon ambient glow, ring pembatas kontras (`bordered`), teks label status pendamping, serta penempatan anchor overlay pada elemen anak (`Dot.tsx`, `components/DotCircle.tsx`, `Dot.styles.ts`, `Dot.spec.ts`).
  - **Molekul `Dropdown`** ([`Dropdown`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/)): Komponen dropdown seleksi serbaguna mendukung single-select & multi-select (dengan badges tag & clearable), mode ComboBox pencarian reaktif (`isComboBox` / `isSearchable`), Depth System (-3 s/d 3), navigasi keyboard penuh WAI-ARIA, serta dekomposisi sub-komponen (`DropdownTrigger`, `DropdownPopover`, `DropdownItem`, `DropdownEmptyState`, `useDropdown`, `useDropdownKeyboard`, `dropdown.utils.ts`, `dropdown.utils.spec.ts`).
- 🛠️ **Refactoring & Dekomposisi Sub-Komponen**:
  - `CodeInput`: Refactoring modular menjadi `CodeInputField.tsx`, `CodeInputResendTimer.tsx`, dan hook `useCodeInput.ts`.
  - `PasswordStrengthBar`: Ekstraksi algoritma perhitungan skor ke `passwordStrength.utils.ts` dan unit test `passwordStrength.spec.ts`.
  - `SearchInput`: Ekstraksi pemfilteran teks ke `SearchInput.utils.ts` dan unit test `SearchInput.utils.spec.ts`.
  - `PhoneInput`: Penguatan unit test `phoneUtils.spec.ts` dan hook `usePhoneInput.ts`.
- 🧪 **Pengujian Unit Frontend (Vitest)**:
  - Konfigurasi dan integrasi **Vitest 4** di `frontend/package.json` dengan skrip `npm run test`.
  - Pembuatan 6 test suite spesifikasi unit testing otomatis dengan total 42 tests yang lulus 100% (`Dot.spec.ts`, `Tooltip.spec.ts`, `dropdown.utils.spec.ts`, `passwordStrength.spec.ts`, `SearchInput.utils.spec.ts`, dan `phoneUtils.spec.ts`).
- 🔄 **Alur Kerja & Otomatisasi (Workflows)**:
  - Pembuatan workflow baru `/audit-functions` di [`.agents/workflows/audit-functions.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/audit-functions.md) untuk audit efisiensi algoritma, penanganan error, memory safety, dan async safety.
  - Perluasan dokumentasi detail seluruh 8 workflow otomatisasi di [`doc/WORKFLOWS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md).
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Pembaruan status proyek dan perintah pengujian pada [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md) dan [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md).
  - Pembaruan arsitektur sistem, struktur monorepo, dan tech stack di [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md).
  - Penyelarasan urutan 10 Atom dan dokumentasi lengkap Dropdown di [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) dan [`doc/frontend/COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md).
  - Penambahan dokumentasi custom hooks dan unit testing di [`doc/frontend/HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), Vitest (Frontend 42 tests), dan kompilasi build (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi ke `0.0.5` secara serentak pada 6 berkas `package.json` dan `package-lock.json` di Root, Backend, dan Frontend.

---

### 📦 [0.0.4] — 2026-09-30 14:12

> **Fokus Rilis**: Fondasi Atomic Design System (8 Atoms, Form Molecules, Depth System -3 s/d 3, hook `useTheme`), pemecahan direktori dokumentasi terpisah ke `doc/frontend/` dan `doc/backend/`, serta penyelarasan QC.

#### 📋 Rincian Perubahan:
- 🎨 **Antarmuka & Komponen UI (Frontend)**:
  - **Atoms**: Penambahan komponen atomik terenkapsulasi penuh `<Text>`, `<Icon>`, `<Button>`, `<Switch>`, `<Input>`, `<Textarea>`, `<Checkbox>`, dan `<Radio>`.
  - **Molecules**: Penambahan komponen molekul `<CheckboxGroup>`, `<RadioGroup>`, `<ThemeToggle>`, serta kumpulan input spesifik: `<TextInput>`, `<EmailInput>`, `<PasswordInput>` (dengan `PasswordRequirements`, `PasswordStrengthBar`, `PasswordStrengthMeter`), `<UsernameInput>`, `<PhoneInput>` (dengan `phoneUtils.ts` & `usePhoneInput.ts`), `<FullNameInput>`, `<CodeInput>`, `<PinInput>`, `<OtpInput>`, `<SearchInput>`, dan `<TextareaInput>`.
  - **Depth System (-3 s/d 3)**: Penerapan kedalaman visual taktil simetris (Cekung, Rata, Timbul) pada seluruh komponen interaktif.
  - **Hooks & State**: Implementasi custom hook `useTheme` berbasis `useSyncExternalStore` dan pengalih tema reaktif global.
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Pembuatan direktori terpecah `doc/frontend/` memuat [`COMPONENTS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md), [`STYLING.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/STYLING.md), [`HOOKS_AND_STORE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md), dan [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/README.md).
  - Pembuatan direktori terpecah `doc/backend/` memuat [`MODULES.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/MODULES.md), [`TESTING.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/TESTING.md), dan [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/backend/README.md).
  - Penyesuaian [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md), [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md), [`doc/BACKEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md), [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md), dan root [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), dan Build kompilasi (NestJS + Vite React) dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi pada 6 berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.4`.

---

### 📦 [0.0.3] — 2026-09-22 15:15

> **Fokus Rilis**: Konfigurasi dynamic backend (`@nestjs/config`, `cookie-parser`, dynamic CORS & PORT, live JSON streaming), standarisasi Tailwind CSS v4 dengan palet OKLCH dan helper `cn()`, refactoring UI `App.tsx`, serta penyelarasan dokumentasi.

#### 📋 Rincian Perubahan:
- ⚡ **Layanan & Konfigurasi Backend**:
  - Integrasi `@nestjs/config` (`ConfigModule.forRoot`) pada `AppModule` (`backend/src/app.module.ts`) untuk pengelolaan environment variable global.
  - Integrasi `cookie-parser` middleware pada `main.ts` dengan type definition `@types/cookie-parser`.
  - Pembaruan konfigurasi CORS backend di `main.ts` (Dynamic `CORS_ORIGIN`, `credentials: true`) dan dynamic `PORT`.
  - Implementasi pembacaan berkas `data/live-data.json` secara dinamis di `AppService.readLiveData()` dan disertakan pada stream payload SSE (`@Sse('time')`).
- 🎨 **Antarmuka & Komponen UI (Frontend)**:
  - Penambahan variabel skema warna OKLCH pada `@theme` di `frontend/src/index.css` (Primary palette, Neutral palette, Semantic colors: success, warning, error, info, Surface/Background).
  - Penambahan helper `cn()` (`clsx` + `tailwind-merge`) di `frontend/src/lib/` & `frontend/src/utils/`.
  - Refactoring total `App.tsx` sesuai standar Tailwind Class Organization Standard (grouping class per kategori: layout, spacing, typography, background, border, text, transition).
  - Tampilan baru untuk stream data JSON real-time (`live-data.json`) lengkap dengan badge indikator koneksi SSE (Live SSE / Reconnecting).
- 📚 **Pembaruan Dokumentasi Proyek**:
  - Pembaruan seluruh berkas di `doc/` ([`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md), [`ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md), [`FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md), [`BACKEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md), [`TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md)) serta root [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md).
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), TypeScript & Vite build dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi pada 6 berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.3`.

---

### 📦 [0.0.2] — 2026-09-21 23:50

> **Fokus Rilis**: Implementasi SSE stream RxJS backend per 1 detik, langganan EventSource frontend dengan auto-reconnect, konfigurasi Path Alias `@/*`, ikon `@iconify/react`, dan tema Dark Mode modern.

#### 📋 Rincian Perubahan:
- ⚡ **Layanan & Streaming Data (Backend)**:
  - Implementasi endpoint `@Sse('time')` pada `AppController` (`backend/src/app.controller.ts`) yang menghasilkan stream RxJS per 1 detik (`TimePayload`: timestamp, timeString, unix) melalui `AppService.getTimeStream()`.
  - Penambahan unit test untuk endpoint streaming SSE di `AppControllerSpec` (`backend/src/app.controller.spec.ts`).
- 🎨 **Antarmuka & Komponen UI (Frontend)**:
  - Konfigurasi Path Alias `@/*` di `vite.config.ts` dan `tsconfig.app.json` untuk impor file yang lebih bersih.
  - Integrasi `@iconify/react` untuk ikon interaktif (gamepad, server, clock, timer, calendar, activity, status indicators).
  - Langganan stream SSE backend menggunakan `EventSource` di `App.tsx` dengan penanganan reconnect otomatis dan error state.
  - Pembaruan UI Dark Mode modern (Slate 950, efek glowing indigo, jam digital real-time, live tick counter).
  - Pembersihan asset lama dan penambahan `logo.svg` baru.
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh pengujian Oxlint (Backend), ESLint (Frontend), Vitest (Backend), dan TypeScript build dinyatakan PASS 100% (0 errors, 0 warnings).
  - Menyelaraskan versi aplikasi pada 6 berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.2`.

---

### 📦 [0.0.1] — 2026-09-21 23:08

> **Fokus Rilis**: Inisialisasi Monorepo (NestJS 12 + React 19 Vite 8), 3 workflows otomatisasi agent awal (`update-docs`, `update-timeline`, `commit-and-push`), struktur dokumentasi awal terperinci, dan setup quality control.

#### 📋 Rincian Perubahan:
- 🚀 **Inisialisasi Monorepo & Fondasi Arsitektur**:
  - Konfigurasi Root Monorepo dengan script `concurrently` untuk menjalankan backend (NestJS 12) dan frontend (React 19 + Vite 8) secara simultan.
  - Setup TypeScript 6, Vitest 4, Oxlint pada `backend/` dan React 19, Vite 8, Tailwind CSS v4, ESLint pada `frontend/`.
- 🔄 **Alur Kerja & Otomatisasi (Workflows)**:
  - `update-docs` ([`.agents/workflows/update-docs.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-docs.md)): Otomatisasi pemeriksaan `git status` dan pembaruan dokumen terperinci di folder `doc/`.
  - `update-timeline` ([`.agents/workflows/update-timeline.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/update-timeline.md)): Otomatisasi perekaman ringkasan perubahan commit ke file `doc/TIMELINE.md`.
  - `commit-and-push` ([`.agents/workflows/commit-and-push.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/.agents/workflows/commit-and-push.md)): Otomatisasi quality control (lint, test, build), sinkronisasi versi pada 6 berkas `package.json` dan `package-lock.json`, penyelarasan timestamp timeline hingga menit, serta git commit dengan message bernilai versi aplikasi (`"0.0.1"`) dan git push.
- 📚 **Penyusunan Dokumentasi Proyek Awal**:
  - Root [`README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/README.md) — Dokumentasi dan Quick Start Utama.
  - [`doc/README.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/README.md) — Pusat Navigasi Dokumentasi.
  - [`doc/ARCHITECTURE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/ARCHITECTURE.md) — Arsitektur Monorepo & Tech Stack.
  - [`doc/FRONTEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/FRONTEND.md) — Panduan Frontend React 19 + Vite 8 + Tailwind CSS v4.
  - [`doc/BACKEND.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/BACKEND.md) — Panduan Backend NestJS 12 + Vitest + Oxlint.
  - [`doc/WORKFLOWS.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/WORKFLOWS.md) — Panduan Lengkap Workflows Otomatis.
  - [`doc/TIMELINE.md`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/TIMELINE.md) — Catatan Rilis & Timestamp Rilis.
- ⚙️ **Quality Control & Penyelarasan Versi**:
  - Seluruh konfigurasi tooling (TypeScript, ESLint, Oxlint, Vitest) diverifikasi dan berjalan normal.
  - Menyelaraskan versi seluruh berkas `package.json` dan `package-lock.json` (Root, Backend, Frontend) ke versi `0.0.1`.
