# 📲 Molekul Input: OtpInput

Komponen masukan kode OTP (*One-Time Password*) berbasis `CodeInput` tanpa sensor karakter (*unmasked*) yang dilengkapi dengan integrasi tombol dan timer hitung mundur kirim ulang (*Resend Timer*).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/OtpInput/OtpInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/OtpInput/OtpInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/OtpInput/OtpInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/OtpInput/OtpInput.types.ts)
- **Sub-komponen Timer**: Menggunakan [`CodeInputResendTimer`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/CodeInput/components/CodeInputResendTimer.tsx)
- **Unit Test**: [`frontend/src/components/molecules/Input/OtpInput/OtpInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/OtpInput/OtpInput.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/OtpInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/OtpInput/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `length` | `number` | `6` | Jumlah digit kode OTP |
| `onComplete` | `(otp: string) => void` | - | Callback pemanggilan saat OTP lengkap |
| `resendCountdown`| `number` | `60` | Durasi waktu hitung mundur kirim ulang (detik) |
| `onResend` | `() => void` | - | Handler saat tombol "Kirim Ulang Kode" ditekan |

---

## 💡 Contoh Penggunaan

```tsx
import { OtpInput } from '@/components/molecules';

<OtpInput
  length={6}
  resendCountdown={60}
  onResend={handleResendSMS}
  onComplete={handleVerifyOtp}
/>
```
