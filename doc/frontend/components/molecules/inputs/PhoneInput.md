# 📱 Molekul Input: PhoneInput

Komponen masukan nomor telepon internasional interaktif lengkap dengan pemilih kode negara (dropdown bendera & kode panggil), pemformatan otomatis nomor lokal (*auto-masking*), sanitasi digit angka, dan hook khusus `usePhoneInput`.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/PhoneInput/PhoneInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PhoneInput/PhoneInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/PhoneInput/PhoneInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PhoneInput/PhoneInput.types.ts)
- **Hook Logika Masukan**: [`frontend/src/components/molecules/Input/PhoneInput/usePhoneInput.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PhoneInput/usePhoneInput.ts)
- **Utilitas Format Telepon**: [`frontend/src/components/molecules/Input/PhoneInput/phoneUtils.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PhoneInput/phoneUtils.ts) & [`.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PhoneInput/phoneUtils.spec.ts)
- **Unit Test Komponen**: [`frontend/src/components/molecules/Input/PhoneInput/PhoneInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PhoneInput/PhoneInput.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/PhoneInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PhoneInput/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `defaultCountry` | `string` | `'ID'` | Kode negara ISO 3166-1 alpha-2 default (+62) |
| `allowedCountries`| `string[]` | - | Daftar kode negara yang diizinkan untuk dipilih |
| `onPhoneChange` | `(fullNumber: string, countryCode: string) => void` | - | Callback pemanggilan saat nomor telepon berubah |
| `depth` | `InputDepth` (-3 s/d 3) | `-1` | Kedalaman elevasi visual |

---

## 💡 Contoh Penggunaan

```tsx
import { PhoneInput } from '@/components/molecules';

<PhoneInput
  label="Nomor WhatsApp"
  defaultCountry="ID"
  onPhoneChange={(fullNumber) => console.log('Nomor lengkap:', fullNumber)}
  helperText="Digunakan untuk verifikasi akun 2FA"
/>
```
