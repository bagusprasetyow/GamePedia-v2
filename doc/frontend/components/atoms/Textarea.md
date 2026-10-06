# 📝 Atom: Textarea

Komponen bidang masukan teks multi-baris reaktif dengan penyesuaian tinggi otomatis (`autoResize`), batas & penghitung karakter via sub-komponen `TextareaFooter`, label terenkapsulasi `TextareaLabel`, serta Depth System (-3 s/d 3).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Textarea/Textarea.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Textarea/Textarea.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Textarea/Textarea.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Textarea/Textarea.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Textarea/Textarea.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Textarea/Textarea.styles.ts)
- **Sub-komponen Label**: [`frontend/src/components/atoms/Textarea/components/TextareaLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Textarea/components/TextareaLabel.tsx)
- **Sub-komponen Footer**: [`frontend/src/components/atoms/Textarea/components/TextareaFooter.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Textarea/components/TextareaFooter.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Textarea/Textarea.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Textarea/Textarea.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Textarea/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Textarea/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran padding dan font |
| `variant` | `'default' \| 'filled' \| 'flushed'` | `'default'` | Gaya visual border textarea |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `-1` | Kedalaman visual cekungan inset |
| `rows` | `number` | `3` | Jumlah baris teks default |
| `autoResize` | `boolean` | `false` | Menyesuaikan tinggi textarea otomatis sesuai panjang teks |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Izin penyesuaian ukuran manual oleh pengguna |
| `showCharacterCount`| `boolean` | `false` | Menampilkan meteran jumlah karakter terpakai |
| `maxLength` | `number` | - | Batas maksimum karakter yang diizinkan |
| `label` | `ReactNode` | - | Label bidang textarea |
| `helperText` | `ReactNode` | - | Keterangan petunjuk |
| `errorText` | `ReactNode` | - | Pesan validasi galat |

---

## 💡 Contoh Penggunaan

```tsx
import { Textarea } from '@/components/atoms';

// 1. Textarea Ulasan dengan Auto-Resize & Penghitung Karakter
<Textarea
  label="Tulis Ulasan Game"
  placeholder="Bagikan pengalaman bermain Anda..."
  rows={4}
  autoResize
  showCharacterCount
  maxLength={500}
  helperText="Maksimal 500 karakter"
/>
```
