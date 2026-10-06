# ⌨️ Molekul Input: TextInput

Komponen bidang masukan teks serbaguna tingkat molekul yang mengintegrasikan atom `Input`, `Text`, label, teks bantuan (*helper text*), teks galat (*error text*), dan Depth System (-3 s/d 3).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/TextInput/TextInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/TextInput/TextInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/TextInput/TextInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/TextInput/TextInput.types.ts)
- **Unit Test**: [`frontend/src/components/molecules/Input/TextInput/TextInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/TextInput/TextInput.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/TextInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/TextInput/index.ts)

---

## ⚙️ Props & Interface

Mewarisi seluruh properti dari `InputProps` atom dengan penyederhanaan state formulir:

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `label` | `ReactNode` | - | Label judul masukan teks |
| `helperText` | `ReactNode` | - | Pesan petunjuk di bawah input |
| `errorText` | `ReactNode` | - | Pesan kesalahan (otomatis mengubah status jadi error) |
| `clearable` | `boolean` | `false` | Menampilkan tombol silang pembersih teks |
| `startIcon` | `ReactNode` | - | Ikon di awal kolom input |
| `endIcon` | `ReactNode` | - | Ikon di akhir kolom input |
| `depth` | `InputDepth` (-3 s/d 3) | `-1` | Kedalaman visual cekungan inset |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran masukan |

---

## 💡 Contoh Penggunaan

```tsx
import { TextInput } from '@/components/molecules';

<TextInput
  label="Nama Profil"
  placeholder="Masukkan nama profil Anda"
  helperText="Gunakan nama yang mudah dikenali kawan bermain"
  startIcon="lucide:user"
  clearable
/>
```
