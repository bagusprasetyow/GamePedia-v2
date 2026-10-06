# 📋 Molekul: Clipboard

Komponen tombol aksi penyalinan teks ke clipboard interaktif dengan feedback taktil dinamis (transisi warna hijau sukses dan teks "Tersalin!" saat ditekan), integrasi Depth System (-3 s/d 3), timer cleanup otomatis, dan dukungan mode terkontrol maupun mandiri.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Clipboard/Clipboard.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/Clipboard.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Clipboard/Clipboard.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/Clipboard.types.ts)
- **Sub-komponen Icon**: [`frontend/src/components/molecules/Clipboard/components/ClipboardIcon.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/components/ClipboardIcon.tsx)
- **Sub-komponen Label**: [`frontend/src/components/molecules/Clipboard/components/ClipboardLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/components/ClipboardLabel.tsx)
- **Hook Pengelola**: [`frontend/src/components/molecules/Clipboard/useClipboard.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/useClipboard.ts)
- **Styling Clsx**: [`frontend/src/components/molecules/Clipboard/Clipboard.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/Clipboard.styles.ts)
- **Unit Test**: [`frontend/src/components/molecules/Clipboard/Clipboard.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/Clipboard.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Clipboard/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Clipboard/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `text` | `string` | *(Wajib)* | Teks yang akan disalin ke clipboard |
| `label` | `ReactNode` | `'Salin'` | Label tombol saat kondisi idle |
| `copiedLabel` | `ReactNode` | `'Tersalin!'` | Label tombol setelah penyalinan berhasil |
| `icon` | `ReactNode` | `'mdi:content-copy'` | Ikon tombol saat idle |
| `copiedIcon` | `ReactNode` | `'mdi:check'` | Ikon tombol saat status tersalin |
| `isIconOnly` | `boolean` | `false` | Hanya menampilkan ikon tanpa label teks |
| `variant` | `'terminal' \| 'ghost' \| 'outline' \| 'primary' \| 'secondary' \| 'contrast'` | `'terminal'` | Gaya visual tombol |
| `size` | `ButtonSize` | `'sm'` | Ukuran tombol |
| `depth` | `ButtonDepth` (-3 s/d 3) | `1` | Kedalaman elevasi taktil |
| `duration` | `number` | `2000` | Durasi tampil feedback tersalin (ms) |
| `disabled` | `boolean` | `false` | Menonaktifkan tombol |

---

## 💡 Contoh Penggunaan

```tsx
import { Clipboard } from '@/components/molecules';

// 1. Tombol Salin API Key
<Clipboard text="gp_live_8923fdskjsd832" label="Salin Kunci API" variant="outline" />

// 2. Tombol Ikon Saja di Samping Tautan
<Clipboard text="https://gamepedia.id/share/123" isIconOnly variant="ghost" />
```
