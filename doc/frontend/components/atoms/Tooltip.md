# 💬 Atom: Tooltip

Komponen gelembung petunjuk interaktif dengan Depth System (skala -3 s/d 3), varian warna semantik, 12 pilihan arah kemunculan (*placement*), panah penunjuk (*showArrow*), serta hook logika modular `useTooltip`.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Tooltip/Tooltip.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/Tooltip.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Tooltip/Tooltip.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/Tooltip.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Tooltip/Tooltip.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/Tooltip.styles.ts)
- **Sub-komponen Bubble**: [`frontend/src/components/atoms/Tooltip/components/TooltipBubble.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/components/TooltipBubble.tsx)
- **Hook Logika**: [`frontend/src/components/atoms/Tooltip/useTooltip.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/useTooltip.ts)
- **Unit Test**: [`frontend/src/components/atoms/Tooltip/Tooltip.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/Tooltip.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Tooltip/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `content` | `ReactNode` | *(Wajib)* | Konten teks atau elemen di dalam gelembung tooltip |
| `children` | `ReactElement` | *(Wajib)* | Elemen pemicu (*trigger element*) |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end' \| 'left-start' \| 'left-end' \| 'right-start' \| 'right-end'` | `'top'` | Posisi kemunculan gelembung tooltip |
| `variant` | `'dark' \| 'light' \| 'primary' \| 'secondary' \| 'accent' \| 'contrast' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'dark'` | Skema warna semantik latar belakang bubble |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Dimensi padding dan ukuran teks tooltip |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `2` | Kedalaman elevasi mengambang tooltip |
| `trigger` | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'hover'` | Mode interaksi yang memunculkan tooltip |
| `delay` | `number` | `200` | Jeda waktu kemunculan dalam milidetik (ms) |
| `showArrow` | `boolean` | `true` | Menampilkan panah segitiga penunjuk arah target |
| `icon` | `ReactNode` | - | Ikon opsional di dalam bubble |
| `maxWidth` | `number \| string` | `'240px'` | Batas lebar maksimum kontainer bubble |
| `disabled` | `boolean` | `false` | Menonaktifkan kemunculan tooltip |

---

## 💡 Contoh Penggunaan

```tsx
import { Tooltip, Button } from '@/components/atoms';

// 1. Tooltip Hover pada Tombol Aksi
<Tooltip content="Salin token ke papan klip" placement="top" depth={2}>
  <Button variant="ghost" width="icon" icon="lucide:copy" />
</Tooltip>

// 2. Tooltip Semantik Peringatan dengan Ikon
<Tooltip
  content="Tindakan ini tidak dapat dibatalkan!"
  variant="warning"
  icon="lucide:alert-triangle"
  placement="right"
>
  <span className="cursor-help text-warning underline">Perhatian</span>
</Tooltip>
```
