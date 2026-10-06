# 🔒 Molekul Input: PasswordInput

Komponen masukan kata sandi teruji dengan tombol sakelar intip (*toggle show/hide password*), meteran kekuatan sandi (*strength meter & bar*), daftar prasyarat keamanan terurai (*PasswordRequirements*), serta Depth System (-3 s/d 3).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/PasswordInput/PasswordInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PasswordInput/PasswordInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/PasswordInput/PasswordInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PasswordInput/PasswordInput.types.ts)
- **Sub-Molekul Meter**: [`frontend/src/components/molecules/Input/PasswordInput/PasswordStrengthMeter/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PasswordInput/PasswordStrengthMeter/)
- **Sub-Molekul Requirements**: [`frontend/src/components/molecules/Input/PasswordInput/PasswordRequirements/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PasswordInput/PasswordRequirements/)
- **Sub-Molekul Strength Bar**: [`frontend/src/components/molecules/Input/PasswordInput/PasswordStrengthBar/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PasswordInput/PasswordStrengthBar/)
- **Utilitas & Algoritma Kekuatan**: [`passwordStrength.utils.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PasswordInput/PasswordStrengthBar/passwordStrength.utils.ts) & [`.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PasswordInput/PasswordStrengthBar/passwordStrength.spec.ts)
- **Unit Test Utama**: [`frontend/src/components/molecules/Input/PasswordInput/PasswordInput.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/PasswordInput/PasswordInput.spec.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `showToggle` | `boolean` | `true` | Menampilkan tombol ikon mata intip/sembunyikan sandi |
| `showStrengthMeter`| `boolean` | `false` | Menampilkan bar visual indikator kekuatan sandi |
| `showRequirements` | `boolean` | `false` | Menampilkan checklist syarat kata sandi yang terpenuhi |
| `label` | `ReactNode` | `'Kata Sandi'` | Label teks bidang sandi |
| `depth` | `InputDepth` (-3 s/d 3) | `-1` | Kedalaman visual elevasi |

---

## 💡 Contoh Penggunaan

```tsx
import { PasswordInput } from '@/components/molecules';

<PasswordInput
  label="Buat Kata Sandi Baru"
  showStrengthMeter
  showRequirements
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
```
