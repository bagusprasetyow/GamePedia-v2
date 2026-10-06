# 🖼️ Molekul: ShowcasePreview

Komponen kanvas wadah interaktif (*sandbox preview canvas*) berbasis Atomic Design untuk mendemonstrasikan komponen UI secara langsung pada halaman showcase/dokumentasi. Dilengkapi latar belakang dekoratif (dots, radial, grid), penghitung klik, stempel waktu interaksi, pil status props aktif, serta integrasi Depth System (-3 s/d 3).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/ShowcasePreview/ShowcasePreview.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/ShowcasePreview.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/ShowcasePreview/ShowcasePreview.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/ShowcasePreview.types.ts)
- **Styling Clsx**: [`frontend/src/components/molecules/ShowcasePreview/ShowcasePreview.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/ShowcasePreview.styles.ts)
- **Sub-komponen Background**: [`frontend/src/components/molecules/ShowcasePreview/components/ShowcasePreviewBackground.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/components/ShowcasePreviewBackground.tsx)
- **Sub-komponen Badges**: [`frontend/src/components/molecules/ShowcasePreview/components/ShowcasePreviewBadges.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/components/ShowcasePreviewBadges.tsx)
- **Sub-komponen Info**: [`frontend/src/components/molecules/ShowcasePreview/components/ShowcasePreviewInfo.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/components/ShowcasePreviewInfo.tsx)
- **Unit Test**: [`frontend/src/components/molecules/ShowcasePreview/ShowcasePreview.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/ShowcasePreview.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/ShowcasePreview/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ShowcasePreview/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | *(Wajib)* | Komponen target yang diuji coba di dalam kanvas |
| `badges` | `string[] \| Record<string, any>` | - | Tag status atau nilai konfigurasi aktif |
| `clickCount` | `number` | - | Jumlah interaksi klik yang terdeteksi |
| `lastClickedAt`| `string \| Date` | - | Stempel waktu interaksi terakhir |
| `background` | `'dots' \| 'grid' \| 'radial' \| 'none'` | `'dots'` | Pola latar visual kanvas |
| `borderStyle` | `'dashed' \| 'solid' \| 'none'` | `'dashed'` | Gaya garis tepi kanvas |
| `depth` | `ButtonDepth` (-3 s/d 3) | `-1` | Kedalaman visual cekungan kanvas preview |
| `minHeight` | `string` | `'240px'` | Tinggi minimum kanvas |

---

## 💡 Contoh Penggunaan

```tsx
import { ShowcasePreview } from '@/components/molecules';
import { Button } from '@/components/atoms';

<ShowcasePreview
  badges={['variant="primary"', 'depth=2', 'size="md"']}
  background="dots"
  depth={-1}
>
  <Button variant="primary" depth={2}>Klik Saya</Button>
</ShowcasePreview>
```
