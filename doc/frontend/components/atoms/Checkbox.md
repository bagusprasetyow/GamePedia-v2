# ☑️ Atom: Checkbox

Komponen kotak centang interaktif dengan indikator centang/indeterminate via sub-atom `CheckboxIndicator`, varian visual (`check` & `solid`), varian warna semantik, teks label/deskripsi terenkapsulasi (`CheckboxLabel`), serta dukungan Depth System (-3 s/d 3).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Checkbox/Checkbox.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Checkbox/Checkbox.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Checkbox/Checkbox.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Checkbox/Checkbox.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Checkbox/Checkbox.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Checkbox/Checkbox.styles.ts)
- **Sub-komponen Indikator**: [`frontend/src/components/atoms/Checkbox/components/CheckboxIndicator.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Checkbox/components/CheckboxIndicator.tsx)
- **Sub-komponen Label**: [`frontend/src/components/atoms/Checkbox/components/CheckboxLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Checkbox/components/CheckboxLabel.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Checkbox/Checkbox.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Checkbox/Checkbox.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Checkbox/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Checkbox/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | - | Nilai status centang (*controlled*) |
| `defaultChecked` | `boolean` | `false` | Nilai status centang awal (*uncontrolled*) |
| `indeterminate` | `boolean` | `false` | Menampilkan tanda minus horizontal (status parsial) |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback pemanggilan saat status berganti |
| `label` | `ReactNode` | - | Teks label utama |
| `description` | `ReactNode` | - | Teks penjelas di bawah label |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Posisi label relatif terhadap kotak centang |
| `variant` | `'check' \| 'solid'` | `'solid'` | Gaya visual indikator centang |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Varian warna semantik |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `0` | Kedalaman visual elevasi kotak centang |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran kotak centang dan font label |
| `disabled` | `boolean` | `false` | Menonaktifkan interaksi klik |

---

## 💡 Contoh Penggunaan

```tsx
import { Checkbox } from '@/components/atoms';

// 1. Checkbox Persetujuan Syarat & Ketentuan
<Checkbox
  label="Saya menyetujui Ketentuan Layanan"
  description="Data akun Anda akan diproses sesuai Kebijakan Privasi"
  color="primary"
  required
/>

// 2. Checkbox Indeterminate (Parsial Pilihan)
<Checkbox
  label="Pilih Semua Kategori"
  indeterminate={isSomeSelected}
  checked={isAllSelected}
  onCheckedChange={handleToggleAll}
/>
```
