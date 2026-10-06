# 🎚️ Atom: Switch

Komponen sakelar biner (*toggle switch*) interaktif dengan alur cekung Depth System (-1 s/d -3), varian warna semantik, sub-komponen modular (`SwitchTrack`, `SwitchLabel`), serta integrasi ikon pada knop/thumb.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Switch/Switch.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Switch/Switch.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Switch/Switch.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Switch/Switch.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Switch/Switch.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Switch/Switch.styles.ts)
- **Sub-komponen Jalur**: [`frontend/src/components/atoms/Switch/components/SwitchTrack.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Switch/components/SwitchTrack.tsx)
- **Sub-komponen Label**: [`frontend/src/components/atoms/Switch/components/SwitchLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Switch/components/SwitchLabel.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Switch/Switch.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Switch/Switch.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Switch/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Switch/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `checked` | `boolean` | - | Status aktif sakelar (*controlled*) |
| `defaultChecked` | `boolean` | `false` | Status aktif awal (*uncontrolled*) |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback pemanggilan saat status sakelar berubah |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran fisik sakelar |
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Varian warna track saat aktif |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `-1` | Kedalaman visual (bawaan berupa cekungan inset) |
| `label` | `ReactNode` | - | Teks label utama |
| `description` | `ReactNode` | - | Teks keterangan bantuan di bawah label |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Posisi teks label relatif terhadap sakelar |
| `thumbCheckedIcon` | `ReactNode` | - | Ikon yang muncul di dalam knop saat status ON |
| `thumbUncheckedIcon`| `ReactNode` | - | Ikon yang muncul di dalam knop saat status OFF |
| `disabled` | `boolean` | `false` | Menonaktifkan interaksi pengguna |

---

## 💡 Contoh Penggunaan

```tsx
import { Switch } from '@/components/atoms';

// 1. Sakelar Pengaturan Sederhana
<Switch
  label="Aktifkan Notifikasi"
  description="Dapatkan kabar update seputar game favorit Anda"
  defaultChecked
  variant="primary"
/>

// 2. Sakelar Dark Mode dengan Ikon Thumb
<Switch
  checked={isDark}
  onCheckedChange={setIsDark}
  thumbCheckedIcon="lucide:moon"
  thumbUncheckedIcon="lucide:sun"
  variant="secondary"
/>
```
