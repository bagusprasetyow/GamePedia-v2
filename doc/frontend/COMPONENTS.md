# 🧩 Katalog Komponen UI Frontend (Atomic Design)

Frontend GamePedia v2 menerapkan prinsip metodologi **Atomic Design** dengan enkapsulasi class name ketat, Depth System (-3 s/d 3), dan arsitektur hybrid (View vs Logic terstruktur).

---

## ⚛️ Atoms (`src/components/atoms/`)

### 1. Text (`src/components/atoms/Text/`)
Komponen tipografi polimorfik dasar dengan enkapsulasi styling Tailwind CSS v4 penuh, varian warna semantik token tema GamePedia, dan unit test Vitest terintegrasi.
- **File**: `Text.tsx`, `Text.types.ts`, `Text.styles.ts`, `Text.spec.ts`, `index.ts`
- **Props Utama**: `as` (`p`, `span`, `h1`-`h6`, `label`, `div`, dll.), `size` (`xs` s/d `6xl`), `variant` (`default`, `muted`, `subtle`, `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`, `contrast`, `white`), `weight`, `align`, `transform`, `leading`, `tracking`, `truncate`, `clamp`.

### 2. Icon (`src/components/atoms/Icon/`)
Komponen ikon universal berbasis `@iconify/react` dengan enkapsulasi varian warna semantik, ukuran preset, animasi, styling modular, dan unit test Vitest.
- **File**: `Icon.tsx`, `Icon.styles.ts`, `Icon.spec.ts`, `index.ts`
- **Props Utama**: `icon` (string Iconify), `size` (`2xs` s/d `4xl` / custom), `variant`, `spin`, `pulse`.

### 3. Button (`src/components/atoms/Button/`)
Komponen tombol interaktif terenkapsulasi penuh dengan **Depth System taktil (-3 s/d 3)**, integrasi ikon otomatis (`startIcon`, `endIcon`, `icon`), status loading modular (`ButtonLoading`), sub-atom ikon (`ButtonIcon`), dan dimensi fleksibel.
- **File**: `Button.tsx`, `Button.types.ts`, `Button.styles.ts`, `components/ButtonLoading.tsx`, `components/ButtonIcon.tsx`, `Button.spec.ts`, `index.ts`
- **Props Utama**: `variant` (`primary`, `secondary`, `accent`, `outline`, `ghost`, `contrast`, `success`, `warning`, `error`, `info`, `close`), `size`, `depth` (-3 s/d 3), `width`, `rounded`, `isLoading`, `loadingText`, `startIcon`, `endIcon`, `icon`.

### 4. Switch / Toggle (`src/components/atoms/Switch/`)
Komponen sakelar biner (toggle switch) interaktif dengan Depth System (alur cekung -1 s/d -3), varian warna semantik, sub-komponen modular (`SwitchTrack`, `SwitchLabel`), dan dukungan ikon terintegrasi di knop/thumb.
- **File**: `Switch.tsx`, `Switch.types.ts`, `Switch.styles.ts`, `components/SwitchTrack.tsx`, `components/SwitchLabel.tsx`, `Switch.spec.ts`, `index.ts`
- **Props Utama**: `checked`, `defaultChecked`, `onCheckedChange`, `size`, `variant`, `depth`, `label`, `description`, `labelPosition`, `thumbCheckedIcon`, `thumbUncheckedIcon`.

### 5. Input (`src/components/atoms/Input/`)
Komponen bidang masukan teks dasar terenkapsulasi dengan varian status (`default`, `error`, `success`, `warning`), sub-komponen terdekomposisi (`InputLabel`, `InputHelperText`, `InputClearButton`), ikon depan/belakang, tombol hapus teks (`clearable`), dan Depth System.
- **File**: `Input.tsx`, `Input.types.ts`, `Input.styles.ts`, `components/InputLabel.tsx`, `components/InputHelperText.tsx`, `components/InputClearButton.tsx`, `Input.spec.ts`, `index.ts`
- **Props Utama**: `size`, `variant`, `depth`, `startIcon`, `endIcon`, `clearable`, `isInvalid`, `state`.

### 6. Textarea (`src/components/atoms/Textarea/`)
Komponen bidang masukan teks multi-baris reaktif dengan penyesuaian tinggi otomatis (`autoResize`), batas & penghitung karakter via sub-komponen `TextareaFooter`, label modular `TextareaLabel`, styling terpisah, dan Depth System.
- **File**: `Textarea.tsx`, `Textarea.types.ts`, `Textarea.styles.ts`, `components/TextareaLabel.tsx`, `components/TextareaFooter.tsx`, `Textarea.spec.ts`, `index.ts`
- **Props Utama**: `autoResize`, `showCharacterCount`, `rows`, `resize`, `resizable`, `depth`, `variant`, `size`.

### 7. Checkbox (`src/components/atoms/Checkbox/`)
Komponen kotak centang interaktif dengan indikator centang/indeterminate via sub-atom `CheckboxIndicator`, varian visual (`check` & `solid`), varian warna semantik token tema, teks label/deskripsi berbasis sub-atom `CheckboxLabel`, dan Depth System.
- **File**: `Checkbox.tsx`, `Checkbox.types.ts`, `Checkbox.styles.ts`, `components/CheckboxIndicator.tsx`, `components/CheckboxLabel.tsx`, `Checkbox.spec.ts`, `index.ts`
- **Props Utama**: `checked`, `defaultChecked`, `indeterminate`, `onCheckedChange`, `label`, `description`, `labelPosition`, `variant`, `color`, `depth`, `size`.

### 8. Radio (`src/components/atoms/Radio/`)
Komponen tombol radio pilihan tunggal dengan sub-atom `RadioIndicator` dan `RadioLabel`, styling terenkapsulasi, unit test Vitest, dan Depth System.
- **File**: `Radio.tsx`, `Radio.types.ts`, `Radio.styles.ts`, `components/RadioIndicator.tsx`, `components/RadioLabel.tsx`, `Radio.spec.ts`, `index.ts`
- **Props Utama**: `checked`, `onChange`, `label`, `description`, `variant`, `depth`, `size`.

### 9. Tooltip (`src/components/atoms/Tooltip/`)
Komponen gelembung petunjuk interaktif dengan Depth System (skala -3 s/d 3), varian warna semantik, 12 pilihan arah kemunculan (`placement`), panah penunjuk (`showArrow`), ikon pendamping, dan dukungan mode pemicu (`hover`, `click`, `focus`, `manual`). Arsitektur modular dengan sub-komponen `TooltipBubble`, hook logika `useTooltip`, styling terpisah, dan unit testing Vitest.
- **File**: `Tooltip.tsx`, `components/TooltipBubble.tsx`, `useTooltip.ts`, `Tooltip.styles.ts`, `Tooltip.types.ts`, `Tooltip.spec.ts`, `index.ts`
- **Props Utama**: `content`, `children`, `placement` (`top`, `bottom`, `left`, `right`, dll.), `variant` (`dark`, `light`, `primary`, `secondary`, `accent`, `contrast`, `info`, `success`, `warning`, `error`), `size` (`xs`, `sm`, `md`, `lg`), `depth` (-3 s/d 3), `trigger` (`hover`, `click`, `focus`, `manual`), `isOpen`, `defaultOpen`, `onOpenChange`, `delay`, `showArrow`, `icon`, `iconSize`, `maxWidth`, `disabled`.

### 10. Dot (`src/components/atoms/Dot/`)
Komponen titik status visual terenkapsulasi penuh dengan Depth System (skala -3 s/d 3), sub-atom `DotCircle`, varian warna semantik token tema GamePedia, animasi denyut (ping halo ripple & pulse), efek ambient neon glow, cincin pembatas kontras (`bordered`), teks label status pendamping, serta penempatan anchor overlay pada elemen anak (avatar/icon/button). Didukung unit test komprehensif Vitest.
- **File**: `Dot.tsx`, `components/DotCircle.tsx`, `Dot.styles.ts`, `Dot.types.ts`, `Dot.spec.ts`, `index.ts`
- **Props Utama**: `size` (`2xs`, `xs`, `sm`, `md`, `lg`, `xl`), `variant` (`primary`, `secondary`, `accent`, `neutral`, `success`, `warning`, `error`, `info`, `contrast`, `white`), `depth` (-3 s/d 3), `ping` (halo berdenyut), `pulse`, `glow`, `bordered` (ring kontras pemisah), `label`, `labelPosition` (`left` | `right`), `labelSize`, `labelClassName`, `placement` (`top-right`, `top-left`, `bottom-right`, `bottom-left`), `invisible`, `children`, `className`, `dotClassName`.

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

| Komponen | Deskripsi & Fitur Spesifik | Sub-komponen / Utilitas Terdekomposisi | File |
| :--- | :--- | :--- | :--- |
| **TextInput** | Bidang masukan teks umum dengan label, helper text, error text, dan status validasi. | - | `TextInput/` |
| **EmailInput** | Bidang masukan email otomatis dengan ikon amplop dan pengvalidasi format email real-time. | - | `EmailInput/` |
| **PasswordInput** | Bidang masukan kata sandi dengan toggle intip (`show/hide`), `PasswordRequirements`, dan meter kekuatan sandi teruji. | `PasswordStrengthBar/passwordStrength.utils.ts`, `passwordStrength.spec.ts` | `PasswordInput/` |
| **UsernameInput** | Bidang masukan nama pengguna dengan prefix `@` otomatis dan sanitasi karakter. | - | `UsernameInput/` |
| **PhoneInput** | Bidang masukan nomor telepon dengan pemilih kode negara, bendera, dan format otomatis teruji Vitest. | `phoneUtils.ts`, `phoneUtils.spec.ts`, `usePhoneInput.ts` | `PhoneInput/` |
| **FullNameInput** | Bidang masukan nama lengkap dengan validasi huruf & spasi serta title-case otomatis. | - | `FullNameInput/` |
| **CodeInput** | Komponen dasar masukan multi-digit dengan auto-focus, paste handling, dan navigasi keyboard. | `components/CodeInputField.tsx`, `components/CodeInputResendTimer.tsx`, `useCodeInput.ts` | `CodeInput/` |
| **PinInput** | Masukan kode PIN transaksi berbasis `CodeInput` dengan fitur masking karakter (`mask=true`). | Memakai sub-komponen `CodeInput` | `PinInput/` |
| **OtpInput** | Masukan kode OTP berbasis `CodeInput` unmasked dengan tombol & timer hitung mundur kirim ulang. | Memakai `CodeInputResendTimer` | `OtpInput/` |
| **SearchInput** | Bidang pencarian reaktif dengan fitur debounce, indikator loading spinner, dan filter utils teruji Vitest. | `SearchInput.utils.ts`, `SearchInput.utils.spec.ts` | `SearchInput/` |
| **TextareaInput** | Bidang masukan teks multi-baris molekul berbasis atom `Textarea` dan `Text`. | - | `TextareaInput/` |

### 5. Dropdown (`src/components/molecules/Dropdown/`)
Komponen dropdown interaktif serbaguna yang mendukung 2 varian seleksi (**`single`** & **`multi`**), mode **ComboBox / pencarian reaktif (`isComboBox` / `isSearchable`)**, Depth System taktil visual (-3 s/d 3), serta aksesibilitas keyboard dan form standar GamePedia. Didekomposisi menjadi sub-komponen modular, custom hook, dan utility teruji Vitest.
- **File**: `Dropdown.tsx`, `components/DropdownTrigger.tsx`, `components/DropdownPopover.tsx`, `components/DropdownItem.tsx`, `components/DropdownEmptyState.tsx`, `useDropdown.ts`, `useDropdownKeyboard.ts`, `dropdown.utils.ts`, `dropdown.utils.spec.ts`, `Dropdown.types.ts`, `index.ts`
- **Props Utama**: `variant` (`single`, `multi`), `options`, `isComboBox` / `isSearchable`, `value`, `defaultValue`, `onChange`, `size`, `depth`, `label`, `description`, `error`, `clearable`, `startIcon`, `searchPlaceholder`, `placeholder`, `maxTagCount`, `notFoundText`.

### 6. SourceCode (`src/components/molecules/SourceCode/`)
Komponen penampil kode sumber bergaya terminal window gelap dengan dukungan multi-tab kode, penyorotan sintaks tokenik real-time (`renderHighlightedLine`), tombol salin ke clipboard dengan feedback visual (`Tersalin!`), serta Depth System skala -3 s/d 3. Dibangun secara modular menggunakan custom hook `useSourceCode`, styling terenkapsulasi, dan teruji secara komprehensif dengan Vitest.
- **File**: `SourceCode.tsx`, `components/SourceCodeHeader.tsx`, `components/SourceCodeBody.tsx`, `useSourceCode.ts`, `SourceCode.utils.tsx`, `SourceCode.styles.ts`, `SourceCode.types.ts`, `SourceCode.spec.ts`, `index.ts`
- **Props Utama**: `tabs`, `code`, `language`, `jsxCode`, `activeTabId`, `defaultTabId`, `onTabChange`, `showCopyButton`, `copyButtonText`, `copiedText`, `copiedDuration`, `depth` (-3 s/d 3), `title`, `headerActions`, `maxHeight`, `className`.

### 7. Clipboard (`src/components/molecules/Clipboard/`)
Komponen tombol aksi penyalinan teks ke clipboard interaktif berbasis Atomic Design. Dilengkapi feedback taktil dinamis (transisi warna hijau `bg-success` dan teks putih `text-white` saat ditekan dan tersalin), integrasi Depth System (-3 s/d 3), pencegahan memory leak (timer cleanup), dan dukungan mode terkontrol (*controlled*) maupun mandiri (*uncontrolled*).
- **File**: `Clipboard.tsx`, `components/ClipboardIcon.tsx`, `components/ClipboardLabel.tsx`, `useClipboard.ts`, `Clipboard.styles.ts`, `Clipboard.types.ts`, `Clipboard.spec.ts`, `index.ts`
- **Props Utama**: `text`, `label` (`Salin`), `copiedLabel` (`Tersalin!`), `icon`, `copiedIcon`, `isIconOnly`, `variant` (`terminal`, `ghost`, `outline`, `primary`, `secondary`, `contrast`), `size`, `depth` (-3 s/d 3), `rounded`, `duration`, `disabled`, `copied`, `onClick`, `onCopy`, `onError`, `className`.

### 8. CodePreview (`src/components/molecules/SourceCode/CodePreview/`)
Komponen blok penampil kode sumber terformat dengan penyorotan sintaks (*syntax highlighting*) real-time bergaya resmi **VS Code Dark+**, opsi penomoran baris (*line numbers*), scroll horizontal, dan integrasi Sistem Kedalaman visual (**Depth System skala -3 s/d 3**). Ditempatkan di dalam `SourceCode` sebagai unit modular dan dapat digunakan secara mandiri di seluruh aplikasi.
- **File**: `CodePreview.tsx`, `components/CodePreviewLine.tsx`, `useCodePreview.ts`, `CodePreview.utils.tsx`, `CodePreview.styles.ts`, `CodePreview.types.ts`, `CodePreview.spec.ts`, `index.ts`
- **Props Utama**: `code`, `language` (`'jsx'`), `showLineNumbers`, `maxHeight`, `depth` (-3 s/d 3), `variant` (`'terminal'`, `'inset'`, `'flat'`, `'raised'`), `header`, `className`.

### 9. ShowcasePreview (`src/components/molecules/ShowcasePreview/`)
Komponen wadah kanvas interaktif (*sandbox preview canvas*) berbasis Atomic Design untuk menguji komponen UI secara langsung pada halaman showcase. Memiliki garis pembatas putus-putus, latar belakang dekoratif (dots, radial, grid), indikator klik dan stempel waktu, pil status props aktif, serta integrasi Depth System (-3 s/d 3).
- **File**: `ShowcasePreview.tsx`, `components/ShowcasePreviewBackground.tsx`, `components/ShowcasePreviewBadges.tsx`, `components/ShowcasePreviewInfo.tsx`, `ShowcasePreview.styles.ts`, `ShowcasePreview.types.ts`, `ShowcasePreview.spec.ts`, `index.ts`
- **Props Utama**: `children`, `clickCount`, `lastClickedAt`, `badges`, `badgesNode`, `borderStyle`, `rounded`, `background`, `minHeight`, `fullWidth`, `depth`, `className`, `contentClassName`.




