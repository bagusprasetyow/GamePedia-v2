# ✖️ Atom: ClearButton

Komponen tombol pembersih (*clear button*) interaktif mandiri terenkapsulasi penuh dengan ikon silang, hover interaktif (warna merah/destructive atau subtle), integrasi Depth System (-3 s/d 3), dan kompatibilitas WAI-ARIA bawaan. Digunakan oleh `Input`, `SearchInput`, `Dropdown`, `Chip`, dan form controls lainnya.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/ClearButton/ClearButton.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ClearButton/ClearButton.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/ClearButton/ClearButton.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ClearButton/ClearButton.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/ClearButton/ClearButton.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ClearButton/ClearButton.styles.ts)
- **Unit Test**: [`frontend/src/components/atoms/ClearButton/ClearButton.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ClearButton/ClearButton.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/ClearButton/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ClearButton/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `size` | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran fisik tombol |
| `variant` | `'default' \| 'subtle' \| 'ghost' \| 'danger'` | `'default'` | Varian tampilan (`default` berubah merah saat hover) |
| `depth` | `ClearButtonDepth` (-3 s/d 3) | `0` | Kedalaman elevasi taktil |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'full'` | Kelengkungan sudut tombol |
| `icon` | `ReactNode` | `'mdi:close'` | Ikon tombol pembersih |
| `iconSize` | `IconSize \| number \| string` | - | Ukuran eksplisit ikon |
| `label` | `string` | `'Bersihkan'` | Label aksesibilitas (`aria-label`) |
| `disabled` | `boolean` | `false` | Menonaktifkan interaksi |
| `className` | `string` | `''` | Class tambahan untuk penataan layout |

---

## 💡 Contoh Penggunaan

```tsx
import { ClearButton } from '@/components/atoms';

// 1. Tombol Pembersih Default
<ClearButton onClick={() => handleReset()} />

// 2. Tombol Pembersih Berukuran Kecil dengan Varian Subtle
<ClearButton size="xs" variant="subtle" onClick={handleClearFilter} />
```
