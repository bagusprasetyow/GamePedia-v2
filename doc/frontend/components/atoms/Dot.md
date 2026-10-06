# 🟢 Atom: Dot

Komponen titik status visual terenkapsulasi penuh dengan Depth System (skala -3 s/d 3), sub-atom `DotCircle`, animasi denyut (ping halo ripple & pulse), ambient neon glow, cincin pembatas kontras (`bordered`), serta penempatan overlay badge pada elemen anak (avatar/icon).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Dot/Dot.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Dot/Dot.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Dot/Dot.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Dot/Dot.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Dot/Dot.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Dot/Dot.styles.ts)
- **Sub-komponen Lingkaran**: [`frontend/src/components/atoms/Dot/components/DotCircle.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Dot/components/DotCircle.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Dot/Dot.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Dot/Dot.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Dot/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Dot/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `size` | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Dimensi diameter titik status |
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'contrast' \| 'white'` | `'primary'` | Varian warna semantik status |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `0` | Kedalaman elevasi titik |
| `ping` | `boolean` | `false` | Memberikan animasi halo ripple bergelombang |
| `pulse` | `boolean` | `false` | Memberikan animasi denyut memudar/membesar |
| `glow` | `boolean` | `false` | Memberikan pendaran neon ambient di sekeliling titik |
| `bordered` | `boolean` | `false` | Menambahkan cincin border kontras pemisah dengan latar |
| `label` | `ReactNode` | - | Label teks status pendamping di samping titik |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Posisi penempatan label teks |
| `placement` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Posisi overlay saat membungkus elemen anak (`children`) |
| `invisible` | `boolean` | `false` | Menyembunyikan titik status secara kondisional |
| `children` | `ReactNode` | - | Elemen target yang ditandai statusnya (Avatar/Button) |

---

## 💡 Contoh Penggunaan

```tsx
import { Dot } from '@/components/atoms';

// 1. Indikator Status Server Online dengan Animasi Ping
<Dot variant="success" ping label="Server Online" />

// 2. Indikator Siaran Langsung dengan Efek Neon Glow
<Dot variant="error" glow pulse label="LIVE NOW" />

// 3. Status Badge di Pojok Kanan Atas Avatar
<Dot variant="success" bordered placement="top-right">
  <img src="/avatar.png" alt="User Avatar" className="w-10 h-10 rounded-full" />
</Dot>
```
