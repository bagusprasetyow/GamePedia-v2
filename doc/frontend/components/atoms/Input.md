# ⌨️ Atom: Input

Komponen bidang masukan teks dasar terenkapsulasi penuh dengan status varian validasi (`default`, `error`, `success`, `warning`), sub-komponen terdekomposisi (`InputLabel`, `InputHelperText`, `InputClearButton`), integrasi ikon depan/belakang, tombol hapus teks instan (`clearable`), dan Depth System.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Input/Input.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Input/Input.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Input/Input.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Input/Input.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Input/Input.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Input/Input.styles.ts)
- **Sub-komponen Label**: [`frontend/src/components/atoms/Input/components/InputLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Input/components/InputLabel.tsx)
- **Sub-komponen Helper Text**: [`frontend/src/components/atoms/Input/components/InputHelperText.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Input/components/InputHelperText.tsx)
- **Sub-komponen Clear Button**: [`frontend/src/components/atoms/Input/components/InputClearButton.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Input/components/InputClearButton.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Input/Input.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Input/Input.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Input/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Input/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran bidang masukan (tinggi dan padding teks) |
| `variant` | `'default' \| 'filled' \| 'flushed'` | `'default'` | Gaya batas visual input |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Status feedback validasi |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `-1` | Kedalaman visual (alur inset -1 s/d -3) |
| `label` | `ReactNode` | - | Teks label masukan |
| `helperText` | `ReactNode` | - | Pesan bantuan di bawah input |
| `errorText` | `ReactNode` | - | Pesan galat validasi yang memicu `state="error"` |
| `startIcon` | `ReactNode` | - | Ikon atau elemen di awal input |
| `endIcon` | `ReactNode` | - | Ikon atau elemen di akhir input |
| `clearable` | `boolean` | `false` | Menampilkan tombol silang penghapus teks saat ada input |
| `onClear` | `() => void` | - | Callback pemanggilan saat tombol silang ditekan |
| `disabled` | `boolean` | `false` | Menonaktifkan input |

---

## 💡 Contoh Penggunaan

```tsx
import { Input } from '@/components/atoms';

// 1. Input Teks dengan Ikon dan Tombol Clear
<Input
  label="Cari Game"
  placeholder="Ketik judul game..."
  startIcon="lucide:search"
  clearable
  depth={-1}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onClear={() => setSearchTerm('')}
/>

// 2. Input dengan Pesan Galat Validasi
<Input
  label="Email Akun"
  type="email"
  state="error"
  errorText="Format email tidak valid atau sudah terdaftar"
  startIcon="lucide:mail"
/>
```
