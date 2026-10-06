# 🔑 Molekul Input: PinInput

Komponen masukan nomor PIN rahasia (seperti PIN otentikasi transaksi) berbasis varian terspesialisasi dari `CodeInput` dengan fitur penyembunyian karakter (`mask=true`) secara otomatis.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/PinInput/PinInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PinInput/PinInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/PinInput/PinInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PinInput/PinInput.types.ts)
- **Unit Test**: [`frontend/src/components/molecules/Input/PinInput/PinInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PinInput/PinInput.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/PinInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PinInput/index.ts)

---

## ⚙️ Fitur Utama
- Panjang digit default: 6 digit PIN (dapat disesuaikan misal 4 digit).
- Karakter otomatis dimasking dengan titik bulat demi keamanan data pengguna.
- Callback `onComplete` otomatis dipicu ketika digit terakhir diisi.

---

## 💡 Contoh Penggunaan

```tsx
import { PinInput } from '@/components/molecules';

<PinInput
  length={6}
  onComplete={(pin) => handleConfirmPin(pin)}
  label="Masukkan 6 Digit PIN Dompet"
/>
```
