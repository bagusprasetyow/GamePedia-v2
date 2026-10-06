# 🔘 Molekul: RadioGroup

Komponen grup tombol radio pilihan tunggal (*single-select*) terenkapsulasi dengan varian visual (`solid` / `check`), orientasi tata letak (vertikal / horizontal), dukungan mode terkontrol & mandiri, serta integrasi Depth System (-3 s/d 3).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/RadioGroup/RadioGroup.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/RadioGroup/RadioGroup.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/RadioGroup/RadioGroup.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/RadioGroup/RadioGroup.types.ts)
- **Unit Test**: [`frontend/src/components/molecules/RadioGroup/RadioGroup.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/RadioGroup/RadioGroup.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/RadioGroup/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/RadioGroup/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `options` | `RadioGroupOption[]` | *(Wajib)* | Daftar opsi pilihan (`{ value, label, description?, disabled? }`) |
| `name` | `string` | - | Atribut nama HTML form input radio |
| `value` | `string` | - | Nilai yang sedang terpilih (*controlled mode*) |
| `defaultValue` | `string` | - | Nilai awal yang terpilih (*uncontrolled mode*) |
| `onChange` | `(value: string) => void` | - | Callback pemanggilan saat opsi terpilih berubah |
| `label` | `ReactNode` | - | Judul label grup |
| `description` | `ReactNode` | - | Keterangan deskripsi grup |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Orientasi susunan opsi |
| `size` | `RadioSize` | `'md'` | Ukuran lingkaran radio |
| `color` | `RadioColor` | `'primary'` | Varian warna titik aktif |
| `variant` | `'solid' \| 'check'` | `'solid'` | Gaya visual indikator (titik solid atau centang) |
| `depth` | `RadioDepth` (-3 s/d 3) | `-1` | Kedalaman elevasi taktil |
| `disabled` | `boolean` | `false` | Menonaktifkan seluruh opsi di dalam grup |

---

## 💡 Contoh Penggunaan

```tsx
import { RadioGroup } from '@/components/molecules';

<RadioGroup
  label="Tingkat Kesulitan"
  options={[
    { value: 'easy', label: 'Mudah', description: 'Cocok untuk pemain santai' },
    { value: 'normal', label: 'Normal', description: 'Pengalaman standar yang seimbang' },
    { value: 'hard', label: 'Sulit', description: 'Tantangan intensif bagi pemain berpengalaman' },
  ]}
  value={difficulty}
  onChange={setDifficulty}
  color="secondary"
/>
```
