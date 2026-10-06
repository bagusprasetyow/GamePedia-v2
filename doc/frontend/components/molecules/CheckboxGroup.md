# 🗂️ Molekul: CheckboxGroup

Komponen grup pilihan kotak centang (*multi-select*) terenkapsulasi penuh dengan opsi orientasi (vertikal / horizontal / grid multi-kolom), dukungan mode terkontrol (*controlled*) & mandiri (*uncontrolled*), pewarisan ukuran semantik, dan Depth System.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/CheckboxGroup/CheckboxGroup.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/CheckboxGroup/CheckboxGroup.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/CheckboxGroup/CheckboxGroup.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/CheckboxGroup/CheckboxGroup.types.ts)
- **Unit Test**: [`frontend/src/components/molecules/CheckboxGroup/CheckboxGroup.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/CheckboxGroup/CheckboxGroup.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/CheckboxGroup/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/CheckboxGroup/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `options` | `CheckboxGroupOption[]` | *(Wajib)* | Daftar opsi pilihan (`{ value, label, description?, disabled? }`) |
| `value` | `string[]` | - | Nilai array yang terpilih (*controlled mode*) |
| `defaultValue` | `string[]` | `[]` | Nilai array terpilih awal (*uncontrolled mode*) |
| `onChange` | `(values: string[]) => void` | - | Callback pemanggilan saat pilihan berganti |
| `label` | `ReactNode` | - | Label judul grup |
| `description` | `ReactNode` | - | Keterangan deskripsi grup |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Tata letak penataan opsi |
| `columns` | `1 \| 2 \| 3 \| 4` | - | Jumlah kolom bila menggunakan layout grid |
| `size` | `CheckboxSize` | `'md'` | Ukuran kotak centang seluruh opsi |
| `color` | `CheckboxColor` | `'primary'` | Varian warna semantik seluruh opsi |
| `variant` | `'check' \| 'solid'` | `'check'` | Varian visual ikon centang |
| `depth` | `CheckboxDepth` (-3 s/d 3) | `-1` | Kedalaman elevasi taktil |
| `disabled` | `boolean` | `false` | Menonaktifkan seluruh opsi di dalam grup |

---

## 💡 Contoh Penggunaan

```tsx
import { CheckboxGroup } from '@/components/molecules';

<CheckboxGroup
  label="Platform Gaming"
  description="Pilih platform yang Anda gunakan untuk bermain"
  options={[
    { value: 'pc', label: 'PC Windows / Steam' },
    { value: 'playstation', label: 'PlayStation 5' },
    { value: 'xbox', label: 'Xbox Series X/S' },
    { value: 'switch', label: 'Nintendo Switch' },
  ]}
  value={selectedPlatforms}
  onChange={setSelectedPlatforms}
  columns={2}
  color="primary"
/>
```
