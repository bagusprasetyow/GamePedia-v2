# 🪪 Molekul Input: FullNameInput

Komponen masukan nama lengkap pengguna dengan validasi huruf alfabet & spasi, konversi Title Case otomatis opsional, dan integrasi ikon pengguna.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/FullNameInput/FullNameInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/FullNameInput/FullNameInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/FullNameInput/FullNameInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/FullNameInput/FullNameInput.types.ts)
- **Unit Test**: [`frontend/src/components/molecules/Input/FullNameInput/FullNameInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/FullNameInput/FullNameInput.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/FullNameInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/FullNameInput/index.ts)

---

## ⚙️ Fitur Utama
- Sanitasi input untuk mencegah angka dan simbol karakter aneh.
- Ikon bawaan `lucide:user` di sisi kiri.
- Dukungan tombol silang pembersih teks instan (`clearable`).

---

## 💡 Contoh Penggunaan

```tsx
import { FullNameInput } from '@/components/molecules';

<FullNameInput
  label="Nama Lengkap Sesuai KTP"
  placeholder="Contoh: Bagus Prasetyo"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  clearable
  required
/>
```
