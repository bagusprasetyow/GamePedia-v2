# 🔢 Molekul Input: CodeInput

Komponen dasar masukan multi-digit terfragmentasi (kotak per digit) dengan auto-focus maju-mundur, penanganan clipboard paste instan, navigasi panah keyboard, dan hook khusus `useCodeInput`.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/CodeInput/CodeInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/CodeInput/CodeInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/CodeInput/CodeInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/CodeInput/CodeInput.types.ts)
- **Sub-komponen Kolom**: [`frontend/src/components/molecules/Input/CodeInput/components/CodeInputField.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/CodeInput/components/CodeInputField.tsx)
- **Sub-komponen Timer**: [`frontend/src/components/molecules/Input/CodeInput/components/CodeInputResendTimer.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/CodeInput/components/CodeInputResendTimer.tsx)
- **Hook Pengelola**: [`frontend/src/components/molecules/Input/CodeInput/useCodeInput.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/CodeInput/useCodeInput.ts)
- **Unit Test**: [`frontend/src/components/molecules/Input/CodeInput/CodeInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/CodeInput/CodeInput.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/CodeInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/CodeInput/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `length` | `number` | `6` | Jumlah kotak digit yang dirender |
| `value` | `string` | - | Nilai gabungan kode string |
| `onChange` | `(value: string) => void` | - | Callback pemanggilan saat digit berubah |
| `onComplete` | `(value: string) => void` | - | Callback otomatis saat semua digit telah terisi lengkap |
| `mask` | `boolean` | `false` | Menyamarkan digit menjadi bulatan titik sandi (*bullet*) |
| `type` | `'number' \| 'text' \| 'alphanumeric'`| `'number'` | Jenis karakter yang diizinkan |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dimensi kotak per digit |
| `depth` | `InputDepth` (-3 s/d 3) | `-1` | Kedalaman elevasi tiap kotak |

---

## 💡 Contoh Penggunaan

```tsx
import { CodeInput } from '@/components/molecules';

<CodeInput
  length={6}
  onComplete={(code) => submitVerificationCode(code)}
  autoFocus
/>
```
