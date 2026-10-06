# 🧩 Katalog Komponen UI Frontend (Atomic Design)

Frontend GamePedia v2 menerapkan prinsip metodologi **Atomic Design** dengan enkapsulasi class name ketat, Depth System (-3 s/d 3), dan arsitektur hybrid (View vs Logic terstruktur).

Setiap komponen memiliki dokumentasi spesifikasi `.md` tersendiri dengan rincian API props, arsitektur sub-komponen, dan contoh penggunaannya.

---

## 🗂️ Navigasi Cepat Dokumentasi Komponen

- 📁 [**Pusat Indeks Komponen (doc/frontend/components/README.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/README.md)
- ⚛️ [**Koleksi Atoms (doc/frontend/components/atoms/)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/)
- 🧪 [**Koleksi Molecules (doc/frontend/components/molecules/)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/)
- ⌨️ [**Koleksi Special Inputs (doc/frontend/components/molecules/inputs/)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/)

---

## ⚛️ Atoms (`src/components/atoms/`)

| Komponen | Dokumen Spesifikasi | Deskripsi & Fitur Utama | Sub-Komponen / Utilitas |
| :--- | :--- | :--- | :--- |
| **Text** | 📄 [Text.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Text.md) | Tipografi polimorfik dasar (`as`), token warna semantik, penanganan truncate & multi-line clamp. | - |
| **Icon** | 📄 [Icon.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Icon.md) | Ikon universal Iconify, ukuran preset/kustom, varian warna semantik, animasi spin & pulse. | - |
| **Button** | 📄 [Button.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Button.md) | Tombol taktil interaktif dengan Depth System (-3 s/d 3), slot icon otomatis, status loading modular. | `ButtonLoading`, `ButtonIcon` |
| **Switch** | 📄 [Switch.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Switch.md) | Sakelar biner (toggle) dengan alur cekung Depth System (-1 s/d -3), ikon knop kustom. | `SwitchTrack`, `SwitchLabel` |
| **Input** | 📄 [Input.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Input.md) | Masukan teks dasar dengan state validasi (`error`, `success`, `warning`), ikon depan/belakang, clearable. | `InputLabel`, `InputHelperText`, `InputClearButton` |
| **Textarea** | 📄 [Textarea.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Textarea.md) | Masukan teks multi-baris dengan auto-resize, batas panjang, counter karakter, dan Depth System. | `TextareaLabel`, `TextareaFooter` |
| **Checkbox** | 📄 [Checkbox.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Checkbox.md) | Kotak centang dengan status indeterminate, varian visual (`check` & `solid`), label & deskripsi. | `CheckboxIndicator`, `CheckboxLabel` |
| **Radio** | 📄 [Radio.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Radio.md) | Tombol radio pilihan tunggal terenkapsulasi dengan varian visual (`solid` & `check`). | `RadioIndicator`, `RadioLabel` |
| **Tooltip** | 📄 [Tooltip.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Tooltip.md) | Gelembung petunjuk interaktif dengan 12 arah placement, panah penunjuk, hook `useTooltip`. | `TooltipBubble`, `useTooltip` |
| **Dot** | 📄 [Dot.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Dot.md) | Titik status dengan animasi denyut (ping ripple & pulse), ambient glow, border ring, & overlay badge. | `DotCircle` |
| **Badge** | 📄 [Badge.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Badge.md) | Lencana status non-interaktif dengan 4 appearance (`filled`, `ghost`, `outline`, `tint`) & Depth System. | `BadgeIcon`, `BadgeLabel` |
| **Chip** | 📄 [Chip.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/Chip.md) | Tag taktil serbaguna dengan status toggle/seleksi dan tombol hapus instan ("x"). | `ChipIcon`, `ChipLabel`, `ChipRemove` |
| **ClearButton**| 📄 [ClearButton.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/atoms/ClearButton.md) | Tombol silang pembersih mandiri dengan hover merah interaktif dan varian visual lengkap. | - |

---

## 🧪 Molecules (`src/components/molecules/`)

| Komponen | Dokumen Spesifikasi | Deskripsi & Fitur Utama | Sub-Komponen / Hook / Utilitas |
| :--- | :--- | :--- | :--- |
| **CheckboxGroup** | 📄 [CheckboxGroup.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/CheckboxGroup.md) | Grup kotak centang reaktif dengan orientasi vertikal/horizontal atau kolom grid. | - |
| **RadioGroup** | 📄 [RadioGroup.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/RadioGroup.md) | Grup tombol radio dengan dukungan mode controlled/uncontrolled & orientasi. | - |
| **ThemeToggle** | 📄 [ThemeToggle.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/ThemeToggle.md) | Pengalih tema aplikasi (`light`, `dark`, `system`) dengan varian icon, button, dan switch. | `useTheme` |
| **Dropdown** | 📄 [Dropdown.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/Dropdown.md) | Dropdown interaktif multi-mode (`single`, `multi`), fitur ComboBox/pencarian, keyboard navigation. | `DropdownTrigger`, `DropdownPopover`, `DropdownItem`, `DropdownEmptyState`, `useDropdown`, `useDropdownKeyboard` |
| **SourceCode** | 📄 [SourceCode.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/SourceCode.md) | Terminal penampil kode sumber gelap multi-tab dengan tombol salin interaktif. | `SourceCodeHeader`, `SourceCodeBody`, `useSourceCode`, `SourceCode.utils` |
| **CodePreview** | 📄 [CodePreview.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/CodePreview.md) | Blok kode terformat dengan penyorotan sintaks tokenik real-time VS Code Dark+. | `CodePreviewLine`, `useCodePreview`, `CodePreview.utils` |
| **Clipboard** | 📄 [Clipboard.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/Clipboard.md) | Tombol aksi salin ke papan klip dengan transisi visual sukses taktil dinamis. | `ClipboardIcon`, `ClipboardLabel`, `useClipboard` |
| **ShowcasePreview**| 📄 [ShowcasePreview.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/ShowcasePreview.md) | Kanvas pengujian interaktif untuk mendemonstrasikan komponen UI di playground. | `ShowcasePreviewBackground`, `ShowcasePreviewBadges`, `ShowcasePreviewInfo` |

---

## ⌨️ Special Inputs (`src/components/molecules/Input/`)

| Komponen | Dokumen Spesifikasi | Deskripsi & Fitur Spesifik | Sub-komponen / Hook / Utilitas |
| :--- | :--- | :--- | :--- |
| **TextInput** | 📄 [TextInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/TextInput.md) | Input teks standar dengan label, helper text, error text, dan status validasi terintegrasi. | - |
| **EmailInput** | 📄 [EmailInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/EmailInput.md) | Input email otomatis dengan ikon amplop dan validasi pola format email. | - |
| **PasswordInput** | 📄 [PasswordInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/PasswordInput.md) | Input kata sandi dengan toggle intip (`show/hide`), meteran kekuatan sandi, dan syarat keamanan. | `PasswordStrengthBar`, `PasswordStrengthMeter`, `PasswordRequirements`, `passwordStrength.utils` |
| **UsernameInput** | 📄 [UsernameInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/UsernameInput.md) | Input nama pengguna dengan prefiks simbol `@` otomatis dan filter karakter. | - |
| **PhoneInput** | 📄 [PhoneInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/PhoneInput.md) | Input nomor telepon internasional dengan pemilih bendera kode negara dan auto-format. | `phoneUtils`, `usePhoneInput` |
| **FullNameInput** | 📄 [FullNameInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/FullNameInput.md) | Input nama lengkap dengan validasi huruf & spasi serta pembersihan karakter. | - |
| **CodeInput** | 📄 [CodeInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/CodeInput.md) | Input multi-digit terkotak dengan auto-focus maju-mundur dan paste handling instan. | `CodeInputField`, `CodeInputResendTimer`, `useCodeInput` |
| **PinInput** | 📄 [PinInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/PinInput.md) | Input PIN transaksi terlindungi dengan masking otomatis berbasis `CodeInput`. | Memakai sub-komponen `CodeInput` |
| **OtpInput** | 📄 [OtpInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/OtpInput.md) | Input OTP unmasked dengan timer hitung mundur kirim ulang SMS. | Memakai `CodeInputResendTimer` |
| **SearchInput** | 📄 [SearchInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/SearchInput.md) | Input pencarian reaktif dengan debounce timer, spinner loading, dan utilitas filter. | `SearchInput.utils` |
| **TextareaInput** | 📄 [TextareaInput.md](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/components/molecules/inputs/TextareaInput.md) | Input teks multi-baris molekul berbasis atom `Textarea` dan `Text` dengan auto-resize. | - |
