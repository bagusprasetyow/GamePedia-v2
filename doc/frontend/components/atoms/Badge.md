# 🏷️ Atom: Badge

Komponen lencana status non-interaktif terenkapsulasi penuh dengan Depth System (skala -3 s/d 3), 4 varian tampilan visual (`appearance`: `filled`, `ghost`, `outline`, `tint`), warna semantik tema GamePedia, serta integrasi ikon depan/belakang otomatis.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Badge/Badge.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Badge/Badge.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Badge/Badge.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Badge/Badge.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Badge/Badge.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Badge/Badge.styles.ts)
- **Sub-komponen Icon**: [`frontend/src/components/atoms/Badge/components/BadgeIcon.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Badge/components/BadgeIcon.tsx)
- **Sub-komponen Label**: [`frontend/src/components/atoms/Badge/components/BadgeLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Badge/components/BadgeLabel.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Badge/Badge.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Badge/Badge.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Badge/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Badge/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran fisik badge dan padding |
| `variant` | `'brand' \| 'danger' \| 'important' \| 'informative' \| 'severe' \| 'subtle' \| 'primary' \| 'secondary' \| 'accent' \| 'muted' \| 'outline' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Varian warna semantik |
| `appearance` | `'filled' \| 'ghost' \| 'outline' \| 'tint'` | `'filled'` | Gaya visual penyajian badge |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `0` | Kedalaman elevasi taktil |
| `rounded` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'full'` | Kelengkungan sudut badge |
| `weight` | `'normal' \| 'medium' \| 'semibold' \| 'bold'` | `'medium'` | Ketebalan font label |
| `startIcon` | `ReactNode` | - | Ikon di sebelah kiri label |
| `endIcon` | `ReactNode` | - | Ikon di sebelah kanan label |
| `children` | `ReactNode` | - | Konten teks lencana |

---

## 💡 Contoh Penggunaan

```tsx
import { Badge } from '@/components/atoms';

// 1. Badge Status Sukses Tampil Tint
<Badge variant="success" appearance="tint" startIcon="lucide:check-circle">
  Terverifikasi
</Badge>

// 2. Badge Kategori Game Tampil Outline
<Badge variant="accent" appearance="outline" rounded="md">
  Action RPG
</Badge>

// 3. Badge Diskon Mencolok Tampil Filled dengan Depth
<Badge variant="danger" appearance="filled" depth={2} weight="bold">
  -50% SALE
</Badge>
```
