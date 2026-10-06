# ✉️ Molekul Input: EmailInput

Komponen masukan email khusus dengan ikon amplop otomatis, validasi format regex email bawaan, pesan galat reaktif, dan integrasi Depth System (-3 s/d 3).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/EmailInput/EmailInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/EmailInput/EmailInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/EmailInput/EmailInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/EmailInput/EmailInput.types.ts)
- **Unit Test**: [`frontend/src/components/molecules/Input/EmailInput/EmailInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/EmailInput/EmailInput.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/EmailInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/EmailInput/index.ts)

---

## ⚙️ Props & Fitur Spesifik

- Otomatis menetapkan tipe HTML `type="email"`.
- Ikon bawaan `lucide:mail` di sisi kiri.
- Mendukung pembersihan teks instan (`clearable`).
- Menyediakan validasi format alamat email otomatis.

---

## 💡 Contoh Penggunaan

```tsx
import { EmailInput } from '@/components/molecules';

<EmailInput
  label="Alamat Email"
  placeholder="nama@domain.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  clearable
  required
/>
```
