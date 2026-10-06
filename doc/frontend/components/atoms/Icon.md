# 🎨 Atom: Icon

Komponen ikon universal GamePedia v2 berbasis `@iconify/react` dengan enkapsulasi varian warna semantik, ukuran preset standar, animasi rotasi/denyut, dan unit test Vitest terintegrasi.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Icon/Icon.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Icon/Icon.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Icon/Icon.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Icon/Icon.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Icon/Icon.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Icon/Icon.styles.ts)
- **Unit Test**: [`frontend/src/components/atoms/Icon/Icon.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Icon/Icon.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Icon/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Icon/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `icon` | `string` | *(Wajib)* | Identifier ikon Iconify (misal: `'lucide:check'`, `'mdi:heart'`) |
| `size` | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl' \| number \| string` | `'md'` | Ukuran preset atau dimensi eksplisit (px/rem) |
| `variant` | `'current' \| 'muted' \| 'subtle' \| 'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'contrast' \| 'white'` | `'current'` | Varian warna semantik tema |
| `spin` | `boolean` | `false` | Memberikan animasi perputaran kontinu (loading state) |
| `pulse` | `boolean` | `false` | Memberikan animasi denyut halus |
| `className` | `string` | `''` | Class kustom tambahan untuk styling khusus |

---

## 💡 Contoh Penggunaan

```tsx
import { Icon } from '@/components/atoms';

// 1. Ikon Standar dengan Pewarnaan Semantik
<Icon icon="lucide:check" variant="success" size="lg" />

// 2. Ikon Spinner Loading
<Icon icon="lucide:loader-2" variant="primary" size="md" spin />

// 3. Ikon Mewarisi Warna Teks Induk (Current)
<button className="text-destructive flex items-center gap-2">
  <Icon icon="lucide:trash-2" size="sm" />
  Hapus Item
</button>
```
