# 🎨 Dokumentasi Frontend GamePedia v2

Dokumen ini berisi informasi terperinci mengenai aplikasi Frontend GamePedia v2 yang dibangun menggunakan **React 19**, **Vite 8**, dan **Tailwind CSS v4**.

---

## 🗂️ Navigasi Sub-Dokumentasi Frontend Terpecah

Untuk informasi yang lebih terstruktur dan modular, silakan merujuk ke sub-dokumentasi di [`doc/frontend/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/README.md):

- 🏠 [**Pusat Dokumentasi Frontend (doc/frontend/README.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/README.md)
- 🧩 [**Katalog Komponen UI (doc/frontend/COMPONENTS.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md)
- 🎨 [**Panduan Styling & Depth System (doc/frontend/STYLING.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/STYLING.md)
- 🪝 [**Custom Hooks & Utilities (doc/frontend/HOOKS_AND_STORE.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md)

---

## 🛠️ Stack & Perkakas Frontend

- **React 19**: Penggunaan API UI React 19 terbaru.
- **Vite 8**: Build tool super cepat untuk pengembangan dan kompilasi modul bundle dengan dukungan Path Alias (`@/*`).
- **Tailwind CSS v4**: Generasi terbaru Tailwind CSS yang menggunakan `@import "tailwindcss";` dan `@theme` custom token warna OKLCH di `src/index.css` dengan plugin Vite `@tailwindcss/vite`.
- **Utility Styling (`clsx` + `tailwind-merge`)**: Helper `cn()` di `src/lib/utils.ts` & `src/utils/` untuk komposisi class Tailwind yang bersih dan terstruktur (Tailwind Class Organization Standard).
- **Iconify (`@iconify/react`)**: Komponen ikon universal untuk antarmuka pengguna yang kaya dan konsisten.
- **Server-Sent Events (SSE)**: Konsumsi stream real-time waktu server & live JSON data menggunakan API standar `EventSource`.
- **ESLint v10 & TypeScript ESLint**: Menjamin standar kualitas kode TypeScript/JSX.

---

## 📂 Struktur Folder Frontend

```
frontend/
├── public/               # Static Assets (favicon, icons)
├── src/
│   ├── assets/          # Media Assets (images, logo, react.svg)
│   ├── lib/             # Utility Libraries & Class Merger (cn)
│   ├── utils/           # Helper Utilities
│   ├── App.tsx          # Main Component (Class Organization Standard)
│   ├── index.css        # CSS Utama (Tailwind CSS v4 @theme imports & OKLCH palette)
│   ├── main.tsx         # Entry Point Aplikasi React
│   └── vite-env.d.ts    # Types Declaration untuk Vite
├── eslint.config.js      # Konfigurasi Flat ESLint
├── index.html            # HTML Template Utama
├── package.json          # Dependencies & Scripts Frontend
├── tsconfig.app.json     # TypeScript Config Aplikasi
├── tsconfig.node.json    # TypeScript Config Vite/Node
└── vite.config.ts        # Konfigurasi Build Vite & Plugin Tailwind
```

---

## ⚡ Perintah Penting (Commands)

Semua perintah di bawah ini dapat dijalankan dari folder root atau langsung di direktori `frontend/`:

```bash
# Menjalankan Development Server Frontend (Vite)
npm run dev --prefix frontend

# Memeriksa Type Safety & Melakukan Production Build
npm run build --prefix frontend

# Jalankan Linting Kode Frontend
npm run lint --prefix frontend

# Preview Hasil Build Production
npm run preview --prefix frontend
```

---

## 🧩 Katalog Komponen UI (Atomic Design)

Frontend GamePedia v2 menerapkan prinsip metodologi **Atomic Design** dengan enkapsulasi class name ketat dan arsitektur hybrid (tampilan vs logika terstruktur).

### ⚛️ Atoms (`src/components/atoms/`)

#### 1. Text (`src/components/atoms/Text/`)

Komponen tipografi polimorfik dasar dengan enkapsulasi styling Tailwind CSS v4 penuh dan varian warna semantik token tema GamePedia.

- **Lokasi File**:
  - Implementasi: `src/components/atoms/Text/Text.tsx`
  - Tipe Data: `src/components/atoms/Text/Text.types.ts`
  - Barrel Export: `src/components/atoms/Text/index.ts` & `src/components/atoms/index.ts`
- **Fitur & Props**:
  - `as`: Tag HTML polimorfik (`'p' | 'span' | 'h1' - 'h6' | 'label' | 'div' | 'small' | 'strong' | 'em' | 'caption'`) (default: `'p'`)
  - `size`: Skala tipografi (`'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'`) (default: `'base'`)
  - `variant`: Varian tema semantik (`'default' | 'muted' | 'subtle' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'contrast' | 'white'`) (default: `'default'`)
  - `weight`: Ketebalan teks (`'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'`) (default: `'normal'`)
  - `align`: Perataan teks (`'left' | 'center' | 'right' | 'justify'`) (default: `'left'`)
  - `transform`: Format casing (`'none' | 'capitalize' | 'uppercase' | 'lowercase'`) (default: `'none'`)
  - `leading`: Line height (`'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'`)
  - `tracking`: Letter spacing (`'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'`)
  - `italic`, `underline`, `strikethrough`: Boolean styling teks
  - `truncate`: Truncate single-line dengan elipsis (`...`)
  - `clamp`: Multi-line clamp (`1 | 2 | 3 | 4 | 5 | 6`)
- **Contoh Pemakaian**:

  ```tsx
  import { Text } from '@/components/atoms';

  // Heading polimorfik
  <Text as="h1" size="3xl" weight="bold" variant="primary">
    GamePedia Database
  </Text>

  // Paragraf muted dengan line-clamp
  <Text as="p" size="sm" variant="muted" clamp={2}>
    Deskripsi game yang panjang akan terpotong rapi dengan 2 baris...
  </Text>
  ```

#### 2. Icon (`src/components/atoms/Icon/`)

Komponen ikon universal berbasis `@iconify/react` dengan enkapsulasi varian warna semantik token tema GamePedia, ukuran preset, dan animasi.

- **Lokasi File**:
  - Implementasi: `src/components/atoms/Icon/Icon.tsx`
  - Tipe Data: `src/components/atoms/Icon/Icon.types.ts`
  - Barrel Export: `src/components/atoms/Icon/index.ts` & `src/components/atoms/index.ts`
- **Fitur & Props**:
  - `icon`: Identifier string icon Iconify (contoh: `'mdi:controller'`, `'lucide:sparkles'`, `'ri:fire-fill'`)
  - `size`: Skala ukuran preset (`'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'`) atau nilai kustom pixel/rem (`number | string`) (default: `'md'`)
  - `variant`: Varian tema semantik (`'default' | 'muted' | 'subtle' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'contrast' | 'white' | 'inherit'`) (default: `'inherit'`)
  - `spin`: Animasi memutar kontinu untuk loading/refresh indicator (`boolean`)
  - `pulse`: Animasi berdenyut (`boolean`)
- **Contoh Pemakaian**:

  ```tsx
  import { Icon } from '@/components/atoms';

  // Ikon primary controller game
  <Icon icon="mdi:controller" size="xl" variant="primary" />

  // Loading spinner
  <Icon icon="mdi:loading" size="md" variant="secondary" spin />
  ```

#### 3. Button (`src/components/atoms/Button/`)

Komponen tombol interaktif terenkapsulasi penuh dengan dukungan varian semantik tema GamePedia, **sistem kedalaman taktil (Cekung, Rata, Timbul)**, integrasi ikon otomatis (startIcon, endIcon, icon-only), status loading, dan dimensi fleksibel.

- **Lokasi File**:
  - Implementasi: `src/components/atoms/Button/Button.tsx`
  - Tipe Data: `src/components/atoms/Button/Button.types.ts`
  - Barrel Export: `src/components/atoms/Button/index.ts` & `src/components/atoms/index.ts`
- **Fitur & Props**:
  - `size`: Skala ukuran preset (`'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`) (default: `'md'`)
  - `variant`: Varian tema semantik (`'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'contrast' | 'success' | 'warning' | 'error' | 'info' | 'close'`) (default: `'primary'`)
  - `depth`: Tingkat kedalaman taktil visual skala -3 s/d 3 (`-3 | -2 | -1 | 0 | 1 | 2 | 3`) atau aliasnya (default: `1` dengan transisi cekung saat ditekan `active:shadow-n1`)
  - `width`: Lebar tombol (`'auto' | 'full' | string`) (default: `'auto'`)
  - `rounded`: Kelengkungan sudut (`'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full'`) (default: `'default'`)
  - `weight`: Ketebalan font (`'normal' | 'medium' | 'semibold' | 'bold'`) (default: `'medium'`)
  - `justify`: Perataan konten (`'start' | 'center' | 'end' | 'between'`) (default: `'center'`)
  - `gap`: Celah antara ikon dan teks (`'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`)
  - `startIcon` / `endIcon`: Ikon di awal atau akhir tombol (menerima nama iconify string atau ReactNode)
  - `icon`: Ikon untuk tombol icon-only tanpa teks (menerima nama iconify string atau ReactNode)
  - `iconSize`: Ukuran ikon kustom jika berbeda dari ukuran tombol
  - `isLoading`: Status loading dengan spinner berputar otomatis dan click blocker (`boolean`)
  - `loadingText`: Teks pengganti saat loading aktif
  - `cursor`: Kursor mouse kustom (`'auto' | 'default' | 'pointer' | 'wait' | 'text' | 'move' | 'help' | 'not-allowed' | 'none' | 'progress' | 'grab' | 'grabbing' | 'crosshair' | 'copy'`)
- **Contoh Pemakaian**:

  ```tsx
  import { Button } from '@/components/atoms';

  // Tombol aksi utama timbul level 1 (default) dengan efek tactile cekung saat ditekan
  <Button variant="primary" size="md" startIcon="mdi:play">
    Mainkan Sekarang
  </Button>

  // Tombol timbul level 2 (medium shadow)
  <Button variant="secondary" size="lg" depth={2}>
    Jelajahi Game
  </Button>

  // Tombol cekung level -2 (sunken/inset)
  <Button variant="outline" size="sm" depth={-2}>
    Mode Cekung
  </Button>

  // Tombol rata level 0 (flat tanpa shadow)
  <Button variant="ghost" size="sm" depth={0}>
    Batal
  </Button>
  ```

#### 4. Switch / Toggle (`src/components/atoms/Switch/`)

Komponen sakelar biner (toggle switch) interaktif dengan **Depth System taktil (alur cekung -1 s/d -3)**, varian semantik tema GamePedia, dukungan ikon terintegrasi di knop/thumb, dan aksesibilitas formulir standar.

- **Lokasi File**:
  - Implementasi: `src/components/atoms/Switch/Switch.tsx`
  - Tipe Data: `src/components/atoms/Switch/Switch.types.ts`
  - Barrel Export: `src/components/atoms/Switch/index.ts` & `src/components/atoms/index.ts`
- **Fitur & Props**:
  - `checked` & `defaultChecked`: Kontrol status aktif (controlled & uncontrolled)
  - `onCheckedChange`: Handler `(checked: boolean) => void`
  - `size`: Skala ukuran preset (`'sm' | 'md' | 'lg' | 'xl'`) (default: `'md'`)
  - `variant`: Varian warna saat aktif (`'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info'`) (default: `'primary'`)
  - `depth`: Tingkat kedalaman trek switch skala -3 s/d 3 (`-3 | -2 | -1 | 0 | 1 | 2 | 3`) (default: `-1` alur cekung natural)
  - `label`: Teks label pendamping switch
  - `description`: Deskripsi tambahan di bawah label
  - `labelPosition`: `'left' | 'right'` (default: `'right'`)
  - `thumbCheckedIcon` / `thumbUncheckedIcon`: Ikon di dalam knop/thumb saat aktif/nonaktif
  - `disabled`: Status nonaktif (`boolean`)
- **Contoh Pemakaian**:

  ```tsx
  import { Switch } from '@/components/atoms';

  // Switch standar dengan label
  <Switch label="Notifikasi Game Baru" defaultChecked />

  // Switch varian sukses dengan deskripsi dan icon di thumb
  <Switch
    variant="success"
    size="lg"
    label="Auto-Save Cloud"
    description="Sinkronkan progres permainan secara otomatis"
    thumbCheckedIcon="mdi:check"
    thumbUncheckedIcon="mdi:close"
    defaultChecked
  />
  ```

#### 4. Checkbox (`src/components/atoms/Checkbox/`)

Komponen kotak centang interaktif dengan dukungan 2 varian indikator (`check` & `solid`), status indeterminate, depth system visual skala -3 s/d 3, dan label/deskripsi.

- **Lokasi File**:
  - Implementasi: `src/components/atoms/Checkbox/Checkbox.tsx`
  - Tipe Data: `src/components/atoms/Checkbox/Checkbox.types.ts`
  - Barrel Export: `src/components/atoms/Checkbox/index.ts` & `src/components/atoms/index.ts`
- **Fitur & Props**:
  - `variant`: Varian ikon indikator saat terpilih (`'check'` untuk tanda checklist, `'solid'` untuk kotak padat/persegi) (default: `'check'`)
  - `size`: Skala ukuran preset (`'sm' | 'md' | 'lg'`) (default: `'md'`)
  - `depth`: Tingkat kedalaman visual (`'sunken' | 'flat' | 'raised-sm' | 'raised-md' | 'raised-lg'` atau skala `-3` s/d `3`) (default: `-1` / cekung)
  - `color`: Warna semantik tema (`'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info'`)
  - `indeterminate`: Status tengah-tengah (sebagian terpilih) (`boolean`)
  - `label`: Label teks di samping checkbox (`ReactNode`)
  - `description`: Teks keterangan tambahan di bawah label (`ReactNode`)
  - `disabled`: Status nonaktif (`boolean`)
- **Contoh Pemakaian**:

  ```tsx
  import { Checkbox } from '@/components/atoms';

  // Checkbox varian 'check' (checklist icon)
  <Checkbox variant="check" label="Ingat preferensi saya" defaultChecked />

  // Checkbox varian 'solid' (kotak padat)
  <Checkbox variant="solid" label="Setujui syarat & ketentuan" />
  ```

#### 5. Radio (`src/components/atoms/Radio/`)

Komponen radio button interaktif dengan bentuk lingkaran, mendukung 2 varian indikator (`solid` & `check`), depth system visual skala -3 s/d 3, dan label/deskripsi.

- **Lokasi File**:
  - Implementasi: `src/components/atoms/Radio/Radio.tsx`
  - Tipe Data: `src/components/atoms/Radio/Radio.types.ts`
  - Barrel Export: `src/components/atoms/Radio/index.ts` & `src/components/atoms/index.ts`
- **Fitur & Props**:
  - `variant`: Varian indikator saat aktif (`'solid'` untuk outer ring berwarna + celah background + solid dot padat di tengah, `'check'` untuk ikon centang kecil) (default: `'solid'`)
  - `size`: Skala ukuran preset (`'sm' | 'md' | 'lg'`) (default: `'md'`)
  - `color`: Warna semantik tema (`'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info'`)
  - `depth`: Tingkat kedalaman visual skala `-3` s/d `3` (default: `-1` / cekung)
  - `label`: Label teks di samping radio (`ReactNode`)
  - `description`: Teks keterangan tambahan (`ReactNode`)
  - `disabled`: Status nonaktif (`boolean`)
- **Contoh Pemakaian**:

  ```tsx
  import { Radio } from '@/components/atoms';

  // Radio varian 'solid' (outer ring + celah + dot tengah)
  <Radio name="platform" value="pc" variant="solid" label="PC / Steam" defaultChecked />

  // Radio varian 'check' (ikon checklist di dalam lingkaran)
  <Radio name="platform" value="console" variant="check" label="PlayStation 5" />
  ```

#### 6. Input (`src/components/atoms/Input/`)

Komponen bidang masukan (_input field_) universal sebagai pondasi formulir UI GamePedia. Komponen ini dirancang fleksibel untuk nantinya dipecah atau diturunkan menjadi berbagai input khusus seperti `EmailInput`, `PasswordInput`, `SearchInput`, `PinInput`, dll.

- **Lokasi File**:
  - Implementasi: `src/components/atoms/Input/Input.tsx`
  - Tipe Data: `src/components/atoms/Input/Input.types.ts`
  - Barrel Export: `src/components/atoms/Input/index.ts` & `src/components/atoms/index.ts`
- **Fitur & Props**:
  - `size`: Skala ukuran preset (`'sm' | 'md' | 'lg'`) (default: `'md'`)
  - `variant`: Varian visual bidang input (`'outline' | 'filled' | 'ghost'`) (default: `'outline'`)
  - `depth`: Tingkat kedalaman visual taktil skala `-3` s/d `3` (default: `-1` / cekung/sunken khas bidang formulir)
  - `label`: Label teks di atas input (`ReactNode`)
  - `description`: Teks keterangan atau petunjuk di bawah input (`ReactNode`)
  - `error`: Pesan kesalahan validasi (`ReactNode`); memicu border merah dan ikon peringatan otomatis
  - `startIcon` / `endIcon`: Nama ikon Iconify (misal `'mdi:magnify'`, `'mdi:email'`, dll.)
  - `startAdornment` / `endAdornment`: Elemen React kustom (prefix URL "https://", badge bendera, tombol aksi, dll.)
  - `clearable`: Tombol silang cepat (_clear button_) untuk mengosongkan teks seketika (`boolean`)
  - `onClear`: Callback saat tombol pembersih ditekan
  - `fullWidth`: Mengisi 100% lebar kontainer (`boolean`, default: `true`)
  - Mendukung seluruh atribut standar HTML `<input>` (`placeholder`, `disabled`, `readOnly`, `required`, dll.) serta `forwardRef`
- **Contoh Pemakaian**:

  ```tsx
  import { Input } from '@/components/atoms';

  // Input standar dengan label dan placeholder
  <Input label="Nama Lengkap" placeholder="Masukkan nama Anda..." required />

  // Input dengan startIcon dan tombol clearable
  <Input
    label="Pencarian Game"
    startIcon="mdi:magnify"
    placeholder="Cari judul game atau genre..."
    clearable
  />

  // Input dengan status error
  <Input
    label="Username"
    startIcon="mdi:account"
    defaultValue="invalid user"
    error="Username tidak boleh mengandung spasi"
  />

  // Input dengan Adornment kustom (prefix)
  <Input
    label="Domain Web"
    startAdornment={<span className="text-xs font-semibold text-muted-foreground pr-1">https://</span>}
    placeholder="gamepedia.id"
  />
  ```

### 🧬 Molecules (`src/components/molecules/`)

#### 1. ThemeToggle (`src/components/molecules/ThemeToggle/`)

Komponen tombol sakelar tema interaktif (Light / Dark) yang terhubung langsung dengan sistem tema global dan penyimpanan lokal serta mendukung sistem kedalaman.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/ThemeToggle/ThemeToggle.tsx`
  - Tipe Data: `src/components/molecules/ThemeToggle/ThemeToggle.types.ts`
  - Barrel Export: `src/components/molecules/ThemeToggle/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `display`: Mode tampilan (`'icon'` untuk tombol kompak, `'button'` untuk tombol dengan label teks, `'switch'` untuk sakelar toggle biner dengan ikon matahari/bulan terintegrasi) (default: `'icon'`)
  - `size`: Skala ukuran preset (`'sm' | 'md' | 'lg'`) (default: `'md'`)
  - `variant`: Varian visual tombol / switch (default: `'primary'`)
  - `depth`: Tingkat kedalaman visual (`'sunken' | 'flat' | 'raised-sm' | 'raised-md' | 'raised-lg'` atau skala `-3` s/d `3`)
  - `rounded`: Kelengkungan sudut tombol (default: `'full'`)
- **Contoh Pemakaian**:

  ```tsx
  import { ThemeToggle } from '@/components/molecules';

  // Mode icon kompak (lingkaran) dengan depth timbul level 1
  <ThemeToggle display="icon" size="md" />

  // Mode button lengkap dengan teks dan depth timbul level 2
  <ThemeToggle display="button" size="md" depth="raised-md" />

  // Mode switch sakelar toggle biner dengan ikon cuaca di knop
  <ThemeToggle display="switch" size="lg" />
  ```

#### 2. CheckboxGroup (`src/components/molecules/CheckboxGroup/`)

Komponen molekul untuk mengelola pilihan ganda (multi-select) menggunakan sekumpulan atom `Checkbox`.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/CheckboxGroup/CheckboxGroup.tsx`
  - Tipe Data: `src/components/molecules/CheckboxGroup/CheckboxGroup.types.ts`
  - Barrel Export: `src/components/molecules/CheckboxGroup/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `options`: Daftar opsi checkbox (`CheckboxGroupOption[]`)
  - `value`: Array nilai yang aktif terpilih (controlled)
  - `defaultValue`: Array nilai aktif awal (uncontrolled)
  - `onChange`: Callback saat pilihan berganti `(values: string[]) => void`
  - `variant`: Varian atom Checkbox (`'check' | 'solid'`)
  - `orientation`: Arah susunan tata letak (`'vertical' | 'horizontal'`) (default: `'vertical'`)
  - `label`: Label grup (`ReactNode`)
  - `description`: Deskripsi grup (`ReactNode`)
  - `error`: Pesan kesalahan grup (`string`)
- **Contoh Pemakaian**:

  ```tsx
  import { CheckboxGroup } from "@/components/molecules";

  <CheckboxGroup
    label="Genre Favorit"
    description="Pilih satu atau lebih genre yang kamu sukai"
    variant="check"
    options={[
      { value: "rpg", label: "Role-Playing Game (RPG)" },
      { value: "action", label: "Action & Adventure" },
      { value: "strategy", label: "Strategy" },
    ]}
    defaultValue={["rpg"]}
    onChange={(selected) => console.log("Selected genres:", selected)}
  />;
  ```

#### 3. RadioGroup (`src/components/molecules/RadioGroup/`)

Komponen molekul untuk mengelola pemilihan tunggal (single-select) menggunakan sekumpulan atom `Radio` yang terikat pada satu grup `name`.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/RadioGroup/RadioGroup.tsx`
  - Tipe Data: `src/components/molecules/RadioGroup/RadioGroup.types.ts`
  - Barrel Export: `src/components/molecules/RadioGroup/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `name`: Nama unik HTML input radio (dibuat otomatis jika tidak dispesifikasikan)
  - `options`: Daftar opsi radio (`RadioGroupOption[]`)
  - `value`: Nilai yang sedang aktif (controlled)
  - `defaultValue`: Nilai aktif awal (uncontrolled)
  - `onChange`: Callback saat pilihan berganti `(value: string) => void`
  - `variant`: Varian atom Radio (`'solid' | 'check'`)
  - `orientation`: Arah susunan tata letak (`'vertical' | 'horizontal'`) (default: `'vertical'`)
  - `label`: Label grup (`ReactNode`)
  - `description`: Deskripsi grup (`ReactNode`)
  - `error`: Pesan kesalahan grup (`string`)
- **Contoh Pemakaian**:

  ```tsx
  import { RadioGroup } from "@/components/molecules";

  <RadioGroup
    label="Pilih Mode Permainan"
    variant="solid"
    options={[
      {
        value: "single",
        label: "Single Player",
        description: "Bermain sendiri dengan alur cerita",
      },
      {
        value: "multi",
        label: "Multiplayer Online",
        description: "Bermain bersama pemain lain di server",
      },
    ]}
    defaultValue="single"
    onChange={(val) => console.log("Mode selected:", val)}
  />;
  ```

#### 4. TextInput (`src/components/molecules/TextInput/`)

Komponen bidang masukan teks (_single-line text field_) spesifik yang meng-wrap atom `Input` universal dengan tambahan fitur manipulasi teks tingkat lanjut.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/TextInput/TextInput.tsx`
  - Tipe Data: `src/components/molecules/TextInput/TextInput.types.ts`
  - Barrel Export: `src/components/molecules/TextInput/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `transformCase`: Transformasi huruf otomatis saat diketik (`'none' | 'lowercase' | 'uppercase' | 'capitalize' | 'titlecase'`) (default: `'none'`)
  - `showCount`: Menampilkan penghitung karakter reaktif di pojok kanan bawah (misal `"12/30"`) (`boolean`)
  - `allowSpaces`: Mengizinkan atau melarang karakter spasi diketik (`boolean`, default: `true`)
  - `trimOnBlur`: Memotong spasi di awal dan akhir teks otomatis saat kehilangan fokus (`boolean`, default: `false`)
  - `footerRight`: Elemen React kustom di sebelah kanan footer
  - Warisan seluruh fitur atom `Input`: `size`, `variant`, `depth`, `label`, `description`, `error`, `clearable`, `startIcon`, `endIcon`, `startAdornment`, `endAdornment`, `disabled`, `readOnly`, `required`, dll.
- **Contoh Pemakaian**:

  ```tsx
  import { TextInput } from '@/components/molecules';

  // Input teks dengan penghitung karakter dan batas 30 huruf
  <TextInput
    label="Nama Panggilan / Nickname"
    placeholder="Masukkan nickname..."
    showCount
    maxLength={30}
    clearable
  />

  // Input teks khusus KAPITAL tanpa spasi
  <TextInput
    label="Kode Promo / Kupon"
    transformCase="uppercase"
    allowSpaces={false}
    placeholder="GAMEPEDIA2026"
  />
  ```

#### 5. FullNameInput (`src/components/molecules/FullNameInput/`)

Komponen bidang masukan nama lengkap pengguna yang meng-wrap `TextInput`. Dilengkapi pemformatan _Title Case_ otomatis, sanitasi filter angka & simbol khusus, serta validasi jumlah kata (Nama Depan + Nama Belakang).

- **Lokasi File**:
  - Implementasi: `src/components/molecules/FullNameInput/FullNameInput.tsx`
  - Tipe Data: `src/components/molecules/FullNameInput/FullNameInput.types.ts`
  - Barrel Export: `src/components/molecules/FullNameInput/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `autoTitleCase`: Otomatis memformat awal kata menjadi KAPITAL (misal `"budi santoso"` -> `"Budi Santoso"`) (`boolean`, default: `true`)
  - `allowNumbers`: Mengizinkan atau memfilter angka 0-9 (`boolean`, default: `false`)
  - `allowSpecialChars`: Mengizinkan atau memfilter karakter simbol khusus (`boolean`, default: `false`)
  - `minWords`: Jumlah kata minimal yang wajib diisi (misal `2` untuk Nama Depan + Belakang)
  - `minWordsErrorMessage`: Pesan kesalahan kustom bila jumlah kata kurang dari `minWords`
  - Inherit default: `label = "Nama Lengkap"`, `placeholder = "Masukkan nama lengkap Anda..."`, `startIcon = "mdi:account"`, `trimOnBlur = true`
- **Contoh Pemakaian**:

  ```tsx
  import { FullNameInput } from "@/components/molecules";

  // Input nama lengkap standar (auto Title Case + filter angka)
  <FullNameInput
    label="Nama Lengkap"
    placeholder="Contoh: Budi Santoso"
    minWords={2}
    clearable
  />;
  ```

#### 6. UsernameInput (`src/components/molecules/UsernameInput/`)

Komponen bidang masukan nama pengguna (_username_) yang meng-wrap `TextInput`. Dilengkapi konversi huruf kecil otomatis (_auto-lowercase_), pemfilteran spasi & karakter ilegal (hanya huruf, angka, `_`, `.`, dan `-`), ornamen prefix `@`, serta indikator visual status ketersediaan (_idle_, _checking_, _available_, _taken_).

- **Lokasi File**:
  - Implementasi: `src/components/molecules/UsernameInput/UsernameInput.tsx`
  - Tipe Data: `src/components/molecules/UsernameInput/UsernameInput.types.ts`
  - Barrel Export: `src/components/molecules/UsernameInput/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `showPrefix`: Menampilkan ornamen prefix di awal input (`boolean`, default: `true`)
  - `prefixSymbol`: Simbol prefix kustom (`string`, default: `'@'`)
  - `allowNumbers`: Mengizinkan angka `0-9` (`boolean`, default: `true`)
  - `allowUnderscore`: Mengizinkan karakter garis bawah `_` (`boolean`, default: `true`)
  - `allowPeriod`: Mengizinkan karakter titik `.` (`boolean`, default: `true`)
  - `allowHyphen`: Mengizinkan karakter tanda hubung `-` (`boolean`, default: `false`)
  - `availability`: Status ketersediaan username (`'idle' | 'checking' | 'available' | 'taken'`) (default: `'idle'`)
  - `takenErrorMessage`: Pesan kesalahan kustom saat `availability = 'taken'` (`string`, default: `"Username ini sudah digunakan"`)
  - Inherit default: `label = "Username"`, `placeholder = "username_kamu"`, `startIcon = "mdi:at"`, `forceLowercase = true`, `allowSpaces = false`, `trimOnBlur = true`
- **Contoh Pemakaian**:

  ```tsx
  import { UsernameInput } from '@/components/molecules';

  // Username Input standar dengan indikator checking / available / taken
  <UsernameInput
    label="Username Akun"
    availability="available"
    clearable
  />

  // Username Input dengan ketersediaan 'taken'
  <UsernameInput
    label="Username Akun"
    defaultValue="admin"
    availability="taken"
  />
  ```

#### 7. EmailInput (`src/components/molecules/EmailInput/`)

Komponen bidang masukan alamat email (_email field_) yang meng-wrap `TextInput`. Dilengkapi validasi format email otomatis, konversi _auto-lowercase_, pemfilteran spasi, ikon email terintegrasi, serta penanganan indikator visual error dan success.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/EmailInput/EmailInput.tsx`
  - Tipe Data: `src/components/molecules/EmailInput/EmailInput.types.ts`
  - Barrel Export: `src/components/molecules/EmailInput/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `forceLowercase`: Paksa alamat email menggunakan huruf kecil (`boolean`, default: `true`)
  - `validateOnBlur`: Jalankan validasi format email secara otomatis saat blur/kehilangan fokus (`boolean`, default: `true`)
  - `validateOnChange`: Jalankan validasi format email secara reaktif saat mengetik (`boolean`, default: `false`)
  - `invalidErrorMessage`: Pesan kesalahan kustom jika format email tidak valid (`string`, default: `"Format alamat email tidak valid"`)
  - Inherit default: `label = "Email"`, `placeholder = "nama@email.com"`, `startIcon = "mdi:email-outline"`, `allowSpaces = false`
- **Contoh Pemakaian**:

  ```tsx
  import { EmailInput } from "@/components/molecules";

  // EmailInput standar dengan validasi format otomatis saat blur
  <EmailInput label="Alamat Email" placeholder="nama@email.com" clearable />;
  ```

#### 8. PhoneInput (`src/components/molecules/PhoneInput/`)

Komponen bidang masukan nomor telepon (_phone field_) yang meng-wrap `TextInput`. Dilengkapi ornamen prefix kode negara (default `+62`), sanitasi angka & tanda hubung, validasi rentang jumlah digit (default 9-14 digit), serta indikator visual error & success.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/PhoneInput/PhoneInput.tsx`
  - Tipe Data: `src/components/molecules/PhoneInput/PhoneInput.types.ts`
  - Barrel Export: `src/components/molecules/PhoneInput/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `countryCode`: Kode negara yang ditampilkan di prefix input (`ReactNode`, default: `"+62"`)
  - `allowPlusPrefix`: Mengizinkan tanda `+` di awal nomor (`boolean`, default: `true`)
  - `allowHyphens`: Mengizinkan karakter tanda hubung `-` (`boolean`, default: `true`)
  - `minDigits` & `maxDigits`: Batas minimal dan maksimal digit angka yang valid (`number`, default: `9` & `14`)
  - `validateOnBlur`: Memvalidasi jumlah digit saat blur (`boolean`, default: `true`)
  - `invalidErrorMessage`: Pesan kesalahan kustom saat jumlah digit tidak sesuai (`string`)
  - Inherit default: `label = "Nomor Telepon"`, `placeholder = "812-3456-7890"`, `startIcon = "mdi:phone-outline"`
- **Contoh Pemakaian**:

  ```tsx
  import { PhoneInput } from "@/components/molecules";

  // PhoneInput standar dengan kode negara +62
  <PhoneInput
    label="Nomor WhatsApp / HP"
    placeholder="812-3456-7890"
    clearable
  />;
  ```

#### 9. PasswordInput (`src/components/molecules/PasswordInput/`)

Komponen bidang masukan kata sandi (_password field_) yang meng-wrap `TextInput`. Dilengkapi sakelar visibilitas kata sandi (mata terbuka/tertutup), meteran kekuatan kata sandi (_password strength meter_), serta indikator centang kriteria validasi.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/PasswordInput/PasswordInput.tsx`
  - Tipe Data: `src/components/molecules/PasswordInput/PasswordInput.types.ts`
  - Barrel Export: `src/components/molecules/PasswordInput/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `showTogglePassword`: Menampilkan tombol toggle lihat/sembunyikan kata sandi (`boolean`, default: `true`)
  - `showStrengthMeter`: Menampilkan meteran visual tingkat kekuatan kata sandi (`boolean`, default: `false`)
  - `showRequirements`: Menampilkan checklist 4 kriteria keamanan kata sandi (`boolean`, default: `false`)
  - `minLength`: Batas minimal karakter kata sandi (`number`, default: `8`)
  - Inherit default: `label = "Kata Sandi"`, `placeholder = "Masukkan kata sandi..."`, `startIcon = "mdi:lock-outline"`
- **Contoh Pemakaian**:

  ```tsx
  import { PasswordInput } from "@/components/molecules";

  // PasswordInput lengkap dengan meteran kekuatan & checklist persyaratan
  <PasswordInput
    label="Kata Sandi Baru"
    showStrengthMeter
    showRequirements
    clearable
  />;
  ```

#### 10. PasswordStrengthMeter (`src/components/molecules/PasswordStrengthMeter/`)

Komponen terpisah (_standalone molecule_) yang menggabungkan meteran visual kekuatan kata sandi (`PasswordStrengthBar`) dan checklist 4 kriteria keamanan (`PasswordRequirements`).

- **Lokasi File**:
  - Implementasi: `src/components/molecules/PasswordStrengthMeter/PasswordStrengthMeter.tsx`
  - Tipe Data: `src/components/molecules/PasswordStrengthMeter/PasswordStrengthMeter.types.ts`
  - Barrel Export: `src/components/molecules/PasswordStrengthMeter/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `value`: String kata sandi yang dievaluasi (`string`, default: `""`)
  - `showMeter`: Menampilkan progress bar tingkat kekuatan (`boolean`, default: `true`)
  - `showRequirements`: Menampilkan checklist 4 kriteria keamanan (`boolean`, default: `true`)
  - `minLength`: Batas minimal karakter kata sandi (`number`, default: `8`)
- **Contoh Pemakaian**:

  ```tsx
  import { PasswordInput, PasswordStrengthMeter } from "@/components/molecules";

  // Komponen PasswordInput disandingkan dengan PasswordStrengthMeter terpisah
  <div>
    <PasswordInput
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <PasswordStrengthMeter value={password} />
  </div>;
  ```

#### 11. PasswordStrengthBar (`src/components/molecules/PasswordStrengthBar/`)

Komponen terpisah (_standalone molecule_) khusus untuk menampilkan batang indikator progress bar kekuatan kata sandi beserta label statusnya (Lemah, Sedang, Kuat, Sangat Kuat).

- **Lokasi File**:
  - Implementasi: `src/components/molecules/PasswordStrengthBar/PasswordStrengthBar.tsx`
  - Tipe Data: `src/components/molecules/PasswordStrengthBar/PasswordStrengthBar.types.ts`
  - Barrel Export: `src/components/molecules/PasswordStrengthBar/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `value`: String kata sandi yang dievaluasi (`string`, default: `""`)
  - `showLabel`: Menampilkan label teks 'Kekuatan Kata Sandi: ...' (`boolean`, default: `true`)
  - `minLength`: Batas minimal karakter kata sandi (`number`, default: `8`)

#### 12. PasswordRequirements (`src/components/molecules/PasswordRequirements/`)

Komponen terpisah (_standalone molecule_) khusus untuk menampilkan 4 kriteria keamanan kata sandi dalam 2 kolom grid yang sejajar menggunakan `CheckboxGroup`.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/PasswordRequirements/PasswordRequirements.tsx`
  - Tipe Data: `src/components/molecules/PasswordRequirements/PasswordRequirements.types.ts`
  - Barrel Export: `src/components/molecules/PasswordRequirements/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `value`: String kata sandi yang dievaluasi (`string`, default: `""`)
  - `minLength`: Batas minimal karakter kata sandi (`number`, default: `8`)
  - `size`: Ukuran indikator checkbox (`'sm' | 'md' | 'lg'`, default: `'sm'`)
  - `variant`: Varian indikator checkbox (`'check' | 'solid'`, default: `'check'`)

#### 13. CodeInput (`src/components/molecules/Input/CodeInput/`)

Komponen molekul dasar multi-digit code input berbasis atom `Input`, `Text`, dan `Icon`. Menjadi fondasi utama untuk `PinInput` dan `OtpInput`. Mendukung navigasi keyboard otomatis (auto-advance/backspace), penggantian digit presisi tanpa blok seleksi biru, tempel multi-digit (paste), masking bulatan kata sandi, rasio proporsional 3:4, perataan terpusat (`mx-auto`), serta Depth System (-3 s/d 3).

- **Lokasi File**:
  - Implementasi: `src/components/molecules/Input/CodeInput/CodeInput.tsx`
  - Tipe Data: `src/components/molecules/Input/CodeInput/CodeInput.types.ts`
  - Barrel Export: `src/components/molecules/Input/CodeInput/index.ts` & `src/components/molecules/index.ts`

#### 14. PinInput (`src/components/molecules/Input/PinInput/`)

Komponen bidang masukan kode PIN transaksi berbasis `CodeInput`. Karakter secara default ter-masking (`mask=true`) untuk keamanan data sensitif.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/Input/PinInput/PinInput.tsx`
  - Tipe Data: `src/components/molecules/Input/PinInput/PinInput.types.ts`
  - Barrel Export: `src/components/molecules/Input/PinInput/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `length`: Jumlah digit/kotak PIN (`number`, default: `6`)
  - `value`: Nilai PIN terformat (`string`, controlled)
  - `mask`: Menyembunyikan karakter PIN dalam mode password (`boolean`, default: `true`)
  - `maxWidth`: Lebar maksimum wadah baris PIN (`xs`, `sm`, `md`, `lg`, `full`, `none`, atau custom pixel misal `'240px'`)
  - `onComplete`: Callback otomatis saat seluruh digit terisi penuh (`(value: string) => void`)

#### 15. OtpInput (`src/components/molecules/Input/OtpInput/`)

Komponen masukan kode verifikasi OTP (One-Time Password) berbasis `CodeInput`. Karakter secara default tidak ter-masking (`mask=false`). Mendukung fitur kirim ulang kode OTP (resend timer & callback) dengan komponen atomic `<Button>` dan `<Text>`.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/Input/OtpInput/OtpInput.tsx`
  - Tipe Data: `src/components/molecules/Input/OtpInput/OtpInput.types.ts`
  - Barrel Export: `src/components/molecules/Input/OtpInput/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `showResend`: Menampilkan tombol kirim ulang OTP (`boolean`, default: `false`)
  - `resendTimer`: Waktu hitung mundur kirim ulang dalam detik (`number`, default: `0`)
  - `onResend`: Callback saat tombol kirim ulang diklik (`() => void`)
  - `resendLabel`: Teks label tombol kirim ulang (`ReactNode`, default: `'Kirim Ulang'`)

#### 16. SearchInput (`src/components/molecules/Input/SearchInput/`)

Komponen molekul pencarian reaktif berbasis atom `Input`, `Button`, dan `Icon`. Mendukung jeda pencarian reaktif (debounce), indikator loading spinner, tombol pembersih cepat (clear button), dan Depth System (-3 s/d 3).

- **Lokasi File**:
  - Implementasi: `src/components/molecules/Input/SearchInput/SearchInput.tsx`
  - Tipe Data: `src/components/molecules/Input/SearchInput/SearchInput.types.ts`
  - Barrel Export: `src/components/molecules/Input/SearchInput/index.ts` & `src/components/molecules/index.ts`
- **Fitur & Props**:
  - `onSearch`: Callback pencarian reaktif (`(query: string) => void`)
  - `debounceTime`: Jeda debounce sebelum `onSearch` dipanggil dalam milidetik (`number`, default: `300`)
  - `isLoading`: Menampilkan animasi spinner saat mencari (`boolean`, default: `false`)
  - `clearable`: Menampilkan tombol pembersih `X` saat berisi kata kunci (`boolean`, default: `true`)

- **Contoh Pemakaian**:

  ```tsx
  import { SearchInput } from "@/components/molecules";

  // SearchInput reaktif dengan debounce
  <SearchInput
    placeholder="Cari game..."
    onSearch={(query) => console.log("Query:", query)}
  />;
#### 17. TextareaInput (`src/components/molecules/Input/TextareaInput/`)
Komponen molekul masukan teks area / multi-baris berbasis atom `Textarea` dan `Text`.

- **Lokasi File**:
  - Implementasi: `src/components/molecules/Input/TextareaInput/TextareaInput.tsx`
  - Tipe Data: `src/components/molecules/Input/TextareaInput/TextareaInput.types.ts`
  - Barrel Export: `src/components/molecules/Input/TextareaInput/index.ts` & `src/components/molecules/index.ts`

- **Contoh Pemakaian**:

  ```tsx
  import { PinInput, OtpInput } from '@/components/molecules';

  // PIN Input 6 digit (Masked)
  <PinInput
    label="Kode PIN Keamanan"
    length={6}
    mask
    onComplete={(pin) => console.log('PIN Selesai:', pin)}
  />

  // OTP Input 6 digit (Unmasked + Resend Button)
  <OtpInput
    label="Kode Verifikasi OTP"
    length={6}
    showResend
    resendTimer={30}
    onResend={() => console.log('Resend OTP')}
  />
  ```

#### 7. Textarea (`src/components/atoms/Textarea/`)

Komponen bidang masukan teks multi-baris reaktif sebagai atom UI dasar formulir GamePedia. Mendukung penyesuaian tinggi otomatis (`autoResize`), batas & penghitung karakter (`showCharacterCount`), kontrol pengubahan ukuran (`resize`), dan Depth System (-3 s/d 3).

- **Lokasi File**:
  - Implementasi: `src/components/atoms/Textarea/Textarea.tsx`
  - Tipe Data: `src/components/atoms/Textarea/Textarea.types.ts`
  - Barrel Export: `src/components/atoms/Textarea/index.ts` & `src/components/atoms/index.ts`
- **Fitur & Props**:
  - `autoResize`: Menyesuaikan tinggi otomatis berdasarkan konten teks (`boolean`, default: `false`)
  - `showCharacterCount`: Menampilkan jumlah karakter & batas `maxLength` di kanan bawah (`boolean`, default: `false`)
  - `rows`: Jumlah baris default (`number`, default: `3`)
  - `resize`: Mode perentangan CSS (`'none' | 'vertical' | 'horizontal' | 'both'`, default: `'none'`)
  - `resizable`: Mengaktifkan penyeretan/pengubahan ukuran manual oleh pengguna (`boolean`, default: `false`)
  - `size`, `variant`, `depth`: Ukuran (`'sm' | 'md' | 'lg'`), varian border, dan kedalaman taktil visual (-3 s/d 3)

- **Contoh Pemakaian**:

  ```tsx
  import { Textarea } from "@/components/atoms";

  <Textarea
    label="Catatan Tambahan"
    placeholder="Tulis pesan Anda..."
    rows={4}
    maxLength={300}
    showCharacterCount
  />;
  ```

---

## 🪝 Custom Hooks & Global Utilities (`src/hooks/`)

### 1. `useTheme` & Global Theme Utilities (`src/hooks/useTheme.ts`)

Manajemen tema reaktif berbasis `useSyncExternalStore` dengan dukungan persistensi `localStorage`, deteksi preferensi sistem operasi, dan fungsi pemanggil global:

- **Fungsi Global (Dapat dipanggil di dalam atau di luar React)**:
  - `toggleGlobalTheme()`: Melakukan toggle tema secara langsung antara `'light'` dan `'dark'`.
  - `setGlobalTheme(theme: 'light' | 'dark' | 'system')`: Menyetel tema secara eksplisit.
  - `getGlobalTheme()`: Mengambil tema yang tersimpan di localStorage.
  - `getResolvedTheme()`: Mengembalikan tema aktif aktual (`'light'` atau `'dark'`).
- **React Hook (`useTheme`)**:

  ```tsx
  import { useTheme } from "@/hooks/useTheme";

  const { isDark, theme, resolvedTheme, toggleTheme, setTheme } = useTheme();
  ```

---

## 📜 Aturan & Konvensi Komponen Frontend

1. **Mandat Komponen Custom Atomic Design**:
   - DILARANG menggunakan elemen DOM murni bawaan React/HTML (`<button>`, `<input>`, `<p>`, `<span>`, `<h1>`-`<h6>`, `<label>`, `<textarea>`, `<select>`, dll.) secara langsung di komponen molecules, organisms, templates, maupun pages.
   - WAJIB menggunakan komponen custom Atomic Design (`<Text>`, `<Button>`, `<Input>`, `<Checkbox>`, `<Radio>`, `<Switch>`, `<Icon>`, dll.).
   - Jika atom custom belum ada, wajib buat terlebih dahulu di `src/components/atoms/`.
2. **Sistem Kedalaman UI (Depth Scale -3 s/d 3)**:
   - Menggunakan token elevasi simetris: Level Negatif (`-3`, `-2`, `-1` — Cekung/Sunken), Level 0 (Rata/Flat), Level Positif (`1`, `2`, `3` — Timbul/Raised).
3. **View vs Logic Hybrid Architecture**:
   - Atoms & Molecules: 1 file terstruktur 3 blok (`// 1. TAMPILAN`, `// 2. LOGIKA`, `// 3. RENDER UI`).
   - Organisms, Templates, & Pages: Dipisah file View (`<Component>.tsx`) dan Custom Hook Logic (`use<Component>.ts`).
4. **Warna OKLCH & Enkapsulasi Class**:
   - Semua warna berbasis OKLCH di `index.css` `@theme`.
   - Styling disimpan di variabel internal (`const cardClasses = cn(...)`). Dilarang mengoper inline `className` panjang saat mengimpor komponen.
