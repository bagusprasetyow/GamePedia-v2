# 📝 Molekul Input: TextareaInput

Komponen bidang masukan teks multi-baris tingkat molekul yang mengintegrasikan atom `Textarea` dan `Text`, dilengkapi label, teks bantuan (*helper text*), teks galat (*error text*), counter karakter, dan auto-resize otomatis.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/TextareaInput/TextareaInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/TextareaInput/TextareaInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/TextareaInput/TextareaInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/TextareaInput/TextareaInput.types.ts)
- **Unit Test**: [`frontend/src/components/molecules/Input/TextareaInput/TextareaInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/TextareaInput/TextareaInput.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/TextareaInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/TextareaInput/index.ts)

---

## ⚙️ Fitur Utama
- Mendukung fitur `autoResize` tinggi kontainer mengikuti jumlah teks.
- Mendukung batas panjang teks (`maxLength`) dan indikator hitung karakter terpakai.
- Membawa integrasi state formulir `errorText` dan `helperText`.

---

## 💡 Contoh Penggunaan

```tsx
import { TextareaInput } from '@/components/molecules';

<TextareaInput
  label="Catatan Pembaruan Patch"
  placeholder="Jelaskan perubahan mekanik game di versi ini..."
  rows={5}
  autoResize
  showCharacterCount
  maxLength={1000}
  helperText="Maksimal 1000 karakter"
/>
```
