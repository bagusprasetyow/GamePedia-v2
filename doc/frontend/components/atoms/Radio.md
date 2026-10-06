# 🔘 Atom: Radio

Komponen tombol radio pilihan tunggal dengan sub-atom `RadioIndicator` dan `RadioLabel`, styling terenkapsulasi Tailwind CSS v4, dukungan Depth System (-3 s/d 3), dan unit test Vitest terintegrasi.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Radio/Radio.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Radio/Radio.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Radio/Radio.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Radio/Radio.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Radio/Radio.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Radio/Radio.styles.ts)
- **Sub-komponen Indikator**: [`frontend/src/components/atoms/Radio/components/RadioIndicator.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Radio/components/RadioIndicator.tsx)
- **Sub-komponen Label**: [`frontend/src/components/atoms/Radio/components/RadioLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Radio/components/RadioLabel.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Radio/Radio.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Radio/Radio.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Radio/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Radio/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | - | Status terpilih (*controlled*) |
| `defaultChecked` | `boolean` | `false` | Status awal (*uncontrolled*) |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | - | Event handler saat opsi dipilih |
| `label` | `ReactNode` | - | Teks label opsi |
| `description` | `ReactNode` | - | Keterangan tambahan di bawah label |
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Varian warna titik aktif |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `0` | Kedalaman visual radio |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran lingkaran radio |
| `name` | `string` | - | Nama grup input form HTML |
| `value` | `string \| number` | - | Nilai dari radio button |
| `disabled` | `boolean` | `false` | Menonaktifkan radio |

---

## 💡 Contoh Penggunaan

```tsx
import { Radio } from '@/components/atoms';

// Penggunaan Radio Satuan
<Radio
  name="payment-method"
  value="credit-card"
  label="Kartu Kredit / Debit"
  description="Visa, Mastercard, JCB"
  checked={selectedMethod === 'credit-card'}
  onChange={(e) => setSelectedMethod(e.target.value)}
/>
```
