# 🧩 Katalog Komponen UI Frontend (Atomic Design)

Frontend GamePedia v2 menerapkan prinsip metodologi **Atomic Design** dengan enkapsulasi class name ketat, Depth System (-3 s/d 3), dan arsitektur hybrid (View vs Logic terstruktur).

---

## ⚛️ Atoms (`src/components/atoms/`)

### 1. Text (`src/components/atoms/Text/`)
Komponen tipografi polimorfik dasar dengan enkapsulasi styling Tailwind CSS v4 penuh dan varian warna semantik token tema GamePedia.
- **File**: `Text.tsx`, `Text.types.ts`, `index.ts`
- **Props Utama**: `as` (`p`, `span`, `h1`-`h6`, `label`, `div`, dll.), `size` (`xs` s/d `6xl`), `variant` (`default`, `muted`, `subtle`, `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`, `contrast`, `white`), `weight`, `align`, `transform`, `leading`, `tracking`, `truncate`, `clamp`.

### 2. Icon (`src/components/atoms/Icon/`)
Komponen ikon universal berbasis `@iconify/react` dengan enkapsulasi varian warna semantik, ukuran preset, dan animasi.
- **File**: `Icon.tsx`, `Icon.types.ts`, `index.ts`
- **Props Utama**: `icon` (string Iconify), `size` (`2xs` s/d `4xl` / custom), `variant`, `spin`, `pulse`.

### 3. Button (`src/components/atoms/Button/`)
Komponen tombol interaktif terenkapsulasi penuh dengan **Depth System taktil (-3 s/d 3)**, integrasi ikon otomatis (`startIcon`, `endIcon`, `icon`), status loading, dan dimensi fleksibel.
- **File**: `Button.tsx`, `Button.types.ts`, `index.ts`
- **Props Utama**: `variant` (`primary`, `secondary`, `accent`, `outline`, `ghost`, `contrast`, `success`, `warning`, `error`, `info`, `close`), `size`, `depth` (-3 s/d 3), `width`, `rounded`, `isLoading`, `loadingText`, `startIcon`, `endIcon`, `icon`.

### 4. Switch / Toggle (`src/components/atoms/Switch/`)
Komponen sakelar biner (toggle switch) interaktif dengan Depth System (alur cekung -1 s/d -3), varian warna semantik, dan dukungan ikon terintegrasi di knop/thumb.
- **File**: `Switch.tsx`, `Switch.types.ts`, `index.ts`
- **Props Utama**: `checked`, `defaultChecked`, `onCheckedChange`, `size`, `variant`, `depth`, `label`, `description`, `labelPosition`, `thumbCheckedIcon`, `thumbUncheckedIcon`.

### 5. Input (`src/components/atoms/Input/`)
Komponen bidang masukan teks dasar terenkapsulasi dengan varian status (`default`, `error`, `success`, `warning`), ikon depan/belakang, tombol hapus teks (`clearable`), dan Depth System.
- **File**: `Input.tsx`, `Input.types.ts`, `index.ts`
- **Props Utama**: `size`, `variant`, `depth`, `startIcon`, `endIcon`, `clearable`, `isInvalid`, `state`.

### 6. Textarea (`src/components/atoms/Textarea/`)
Komponen bidang masukan teks multi-baris reaktif dengan penyesuaian tinggi otomatis (`autoResize`), batas & penghitung karakter (`showCharacterCount`), dan Depth System.
- **File**: `Textarea.tsx`, `Textarea.types.ts`, `index.ts`
- **Props Utama**: `autoResize`, `showCharacterCount`, `rows`, `resize`, `resizable`, `depth`, `variant`, `size`.

### 7. Checkbox (`src/components/atoms/Checkbox/`)
Komponen kotak centang interaktif dengan indikator centang/indeterminate, varian warna semantik, dan Depth System.
- **File**: `Checkbox.tsx`, `Checkbox.types.ts`, `index.ts`
- **Props Utama**: `checked`, `indeterminate`, `onCheckedChange`, `label`, `description`, `variant`, `depth`, `size`.

### 8. Radio (`src/components/atoms/Radio/`)
Komponen tombol radio pilihan tunggal dengan styling terenkapsulasi dan Depth System.
- **File**: `Radio.tsx`, `Radio.types.ts`, `index.ts`
- **Props Utama**: `checked`, `onChange`, `label`, `description`, `variant`, `depth`, `size`.

---

## 🧪 Molecules (`src/components/molecules/`)

### 1. CheckboxGroup (`src/components/molecules/CheckboxGroup/`)
Grup pilihan kotak centang dengan opsi select-all, tata letak fleksibel (horizontal/vertical), serta penanganan nilai array reaktif.
- **File**: `CheckboxGroup.tsx`, `CheckboxGroup.types.ts`, `index.ts`
- **Props Utama**: `options`, `value`, `onChange`, `selectAllOption`, `orientation`, `label`, `error`.

### 2. RadioGroup (`src/components/molecules/RadioGroup/`)
Grup tombol radio pilihan tunggal dengan tata letak horizontal/vertikal dan penanganan error state.
- **File**: `RadioGroup.tsx`, `RadioGroup.types.ts`, `index.ts`
- **Props Utama**: `options`, `value`, `onChange`, `orientation`, `label`, `error`, `name`.

### 3. ThemeToggle (`src/components/molecules/ThemeToggle/`)
Komponen pengalih tema (`light` / `dark` / `system`) terintegrasi dengan hook `useTheme`.
- **File**: `ThemeToggle.tsx`, `ThemeToggle.types.ts`, `index.ts`
- **Props Utama**: `variant` (`switch`, `button`, `dropdown`), `showLabel`.

### 4. Special Inputs (`src/components/molecules/Input/`)

| Komponen | Deskripsi & Fitur Spesifik | File |
| :--- | :--- | :--- |
| **TextInput** | Bidang masukan teks umum dengan label, helper text, error text, dan status validasi. | `TextInput/` |
| **EmailInput** | Bidang masukan email otomatis dengan ikon amplop dan pengvalidasi format email real-time. | `EmailInput/` |
| **PasswordInput** | Bidang masukan kata sandi dengan toggle intip (`show/hide password`), `PasswordStrengthMeter`, `PasswordStrengthBar`, dan `PasswordRequirements`. | `PasswordInput/` |
| **UsernameInput** | Bidang masukan nama pengguna dengan prefix `@` otomatis dan sanitasi karakter. | `UsernameInput/` |
| **PhoneInput** | Bidang masukan nomor telepon dengan pemilih kode negara, bendera, dan format otomatis (`phoneUtils.ts`, `usePhoneInput.ts`). | `PhoneInput/` |
| **FullNameInput** | Bidang masukan nama lengkap dengan validasi huruf & spasi. | `FullNameInput/` |
| **CodeInput** | Komponen dasar masukan kode multi-digit (PIN / OTP) dengan auto-focus & transfer clipboard. | `CodeInput/` |
| **PinInput** | Masukan kode PIN transaksi berbasis `CodeInput` dengan fitur masking karakter (`mask=true`). | `PinInput/` |
| **OtpInput** | Masukan kode OTP berbasis `CodeInput` unmasked dengan tombol & timer kirim ulang (`onResend`). | `OtpInput/` |
| **SearchInput** | Bidang pencarian reaktif dengan fitur debounce, indikator loading spinner, dan clear button. | `SearchInput/` |
| **TextareaInput** | Bidang masukan teks multi-baris molekul berbasis atom `Textarea` dan `Text`. | `TextareaInput/` |
