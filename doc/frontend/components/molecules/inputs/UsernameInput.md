# 👤 Molekul Input: UsernameInput

Komponen masukan nama pengguna (*username*) dengan prefiks simbol `@` otomatis, pembersihan spasi/karakter terlarang, validasi format, dan integrasi Depth System (-3 s/d 3).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/UsernameInput/UsernameInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/UsernameInput/UsernameInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/UsernameInput/UsernameInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/UsernameInput/UsernameInput.types.ts)
- **Unit Test**: [`frontend/src/components/molecules/Input/UsernameInput/UsernameInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/UsernameInput/UsernameInput.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/UsernameInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/UsernameInput/index.ts)

---

## ⚙️ Fitur Utama
- Menampilkan prefix tetap `@` di awal kolom input.
- Otomatis membatasi karakter alfanumerik, garis bawah (`_`), dan titik (`.`).
- Tersedia tombol silang pembersih teks instan (`clearable`).

---

## 💡 Contoh Penggunaan

```tsx
import { UsernameInput } from '@/components/molecules';

<UsernameInput
  label="Username GamePedia"
  placeholder="gamer_pro"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  helperText="Hanya huruf, angka, dan garis bawah"
/>
```
