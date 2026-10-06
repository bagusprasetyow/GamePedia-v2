# 🏷️ Atom: Chip

Komponen chip interaktif atau tag taktil serbaguna dengan dukungan Depth System (skala -3 s/d 3), status seleksi/toggle (`selected`), tombol hapus instan ("x") dengan hover interaktif merah ala `InputClearButton`, dan integrasi ikon opsional.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Chip/Chip.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/Chip.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Chip/Chip.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/Chip.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Chip/Chip.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/Chip.styles.ts)
- **Sub-komponen Icon**: [`frontend/src/components/atoms/Chip/components/ChipIcon.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/components/ChipIcon.tsx)
- **Sub-komponen Label**: [`frontend/src/components/atoms/Chip/components/ChipLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/components/ChipLabel.tsx)
- **Sub-komponen Remove**: [`frontend/src/components/atoms/Chip/components/ChipRemove.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/components/ChipRemove.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Chip/Chip.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/Chip.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Chip/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Chip/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dimensi ukuran chip |
| `variant` | `BadgeVariant` | `'primary'` | Varian warna semantik tema |
| `appearance` | `'filled' \| 'ghost' \| 'outline' \| 'tint'` | `'outline'` | Gaya visual tampilan dasar |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `0` | Kedalaman elevasi taktil |
| `rounded` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'full'` | Radius sudut chip |
| `weight` | `'normal' \| 'medium' \| 'semibold' \| 'bold'` | `'medium'` | Ketebalan font label |
| `selected` | `boolean` | `false` | Status aktif/terpilih (otomatis berubah gaya ke `filled`) |
| `onRemove` | `() => void` | - | Callback pemanggilan tombol silang penghapus ("x") |
| `removeLabel`| `string` | `'Hapus'` | Label aksesibilitas tombol hapus |
| `startIcon` | `ReactNode` | - | Ikon di sebelah kiri label |
| `disabled` | `boolean` | `false` | Menonaktifkan interaksi |
| `children` | `ReactNode` | - | Konten teks tag/chip |

---

## 💡 Contoh Penggunaan

```tsx
import { Chip } from '@/components/atoms';

// 1. Chip Filter Kategori Dapat Diklik (Toggle Selection)
<Chip
  selected={isSelected}
  onClick={() => setIsSelected(!isSelected)}
  startIcon="lucide:gamepad-2"
>
  Multiplayer
</Chip>

// 2. Chip Tag Hapus (Removable)
<Chip
  variant="secondary"
  appearance="tint"
  onRemove={() => handleRemoveTag('rpg')}
>
  RPG
</Chip>
```
