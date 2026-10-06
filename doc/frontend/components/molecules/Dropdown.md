# 📑 Molekul: Dropdown

Komponen dropdown interaktif serbaguna yang mendukung 2 varian seleksi (**`single`** & **`multi`**), mode pencarian/filter reaktif (**ComboBox**), Depth System visual (-3 s/d 3), aksesibilitas keyboard WAI-ARIA, integrasi `ClearButton`, serta dekomposisi sub-komponen modular.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Dropdown/Dropdown.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/Dropdown.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Dropdown/Dropdown.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/Dropdown.types.ts)
- **Sub-komponen Trigger**: [`frontend/src/components/molecules/Dropdown/components/DropdownTrigger.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/components/DropdownTrigger.tsx)
- **Sub-komponen Popover**: [`frontend/src/components/molecules/Dropdown/components/DropdownPopover.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/components/DropdownPopover.tsx)
- **Sub-komponen Item**: [`frontend/src/components/molecules/Dropdown/components/DropdownItem.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/components/DropdownItem.tsx)
- **Sub-komponen Empty State**: [`frontend/src/components/molecules/Dropdown/components/DropdownEmptyState.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/components/DropdownEmptyState.tsx)
- **Hook Status Popover**: [`frontend/src/components/molecules/Dropdown/useDropdown.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/useDropdown.ts)
- **Hook Navigasi Keyboard**: [`frontend/src/components/molecules/Dropdown/useDropdownKeyboard.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/useDropdownKeyboard.ts)
- **Utilitas Filter & Test**: [`frontend/src/components/molecules/Dropdown/dropdown.utils.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/dropdown.utils.ts) & [`.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/dropdown.utils.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Dropdown/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Dropdown/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `options` | `DropdownOption[]` | *(Wajib)* | Daftar pilihan (`{ value, label, icon?, description?, disabled? }`) |
| `variant` | `'single' \| 'multi'` | `'single'` | Mode pemilihan tunggal atau jamak (multi-tag) |
| `isComboBox` | `boolean` | `false` | Menampilkan kotak pencarian filter di dalam popover |
| `value` | `string \| string[]` | - | Nilai yang sedang aktif terpilih (*controlled mode*) |
| `defaultValue` | `string \| string[]` | - | Nilai default terpilih (*uncontrolled mode*) |
| `onChange` | `(value: any) => void` | - | Handler pemanggilan saat nilai pilihan berubah |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran kotak pemicu dan opsi dropdown |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `-1` | Kedalaman elevasi taktil kotak pemicu |
| `label` | `ReactNode` | - | Teks label masukan form |
| `description` | `ReactNode` | - | Keterangan bantuan di bawah input |
| `error` | `ReactNode` | - | Pesan galat validasi |
| `placeholder` | `string` | `'Pilih opsi...'`| Teks placeholder saat belum ada pilihan |
| `clearable` | `boolean` | `true` | Menampilkan tombol pembersih untuk mereset pilihan |
| `startIcon` | `ReactNode` | - | Ikon di sebelah kiri pemicu dropdown |
| `maxTagCount` | `number` | `3` | Batas maksimum tag yang ditampilkan pada mode multi |
| `disabled` | `boolean` | `false` | Menonaktifkan interaksi dropdown |

---

## 💡 Contoh Penggunaan

```tsx
import { Dropdown } from '@/components/molecules';

// 1. Single Select Dropdown dengan Pencarian (ComboBox)
<Dropdown
  label="Pilih Wilayah Server"
  options={[
    { value: 'sea', label: 'Asia Tenggara (Singapura)' },
    { value: 'na', label: 'Amerika Utara' },
    { value: 'eu', label: 'Eropa Barat' },
  ]}
  isComboBox
  searchPlaceholder="Cari server..."
  value={server}
  onChange={setServer}
/>

// 2. Multi-Select Dropdown dengan Tag
<Dropdown
  variant="multi"
  label="Filter Genre Game"
  options={[
    { value: 'action', label: 'Action' },
    { value: 'rpg', label: 'RPG' },
    { value: 'strategy', label: 'Strategy' },
    { value: 'simulation', label: 'Simulation' },
  ]}
  value={selectedGenres}
  onChange={setSelectedGenres}
/>
```
