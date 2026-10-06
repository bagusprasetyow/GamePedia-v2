# 🔤 Atom: Text

Komponen tipografi polimorfik dasar GamePedia v2 dengan enkapsulasi penuh class Tailwind CSS v4, varian warna token semantik, pemotongan teks (*clamp/truncate*), serta unit test Vitest terintegrasi.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Text/Text.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Text/Text.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Text/Text.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Text/Text.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Text/Text.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Text/Text.styles.ts)
- **Unit Test**: [`frontend/src/components/atoms/Text/Text.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Text/Text.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Text/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Text/index.ts)

---

## ⚙️ Props & Interface

Komponen bersifat polimorfik menggunakan prop `as` (`<T extends ElementType = 'p'>`).

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `as` | `ElementType` | `'p'` | Elemen HTML target (`p`, `span`, `h1`-`h6`, `label`, `div`, dll.) |
| `size` | `'2xs' \| 'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl' \| '5xl' \| '6xl'` | `'base'` | Ukuran skala font tokenik |
| `variant` | `'default' \| 'muted' \| 'subtle' \| 'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'contrast' \| 'white'` | `'default'` | Warna semantik berbasis token tema GamePedia |
| `weight` | `'thin' \| 'extralight' \| 'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold' \| 'black'` | `'normal'` | Ketebalan font teks |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | `'left'` | Perataan teks |
| `transform` | `'uppercase' \| 'lowercase' \| 'capitalize' \| 'normal-case'` | `'normal-case'` | Transformasi kapitalisasi teks |
| `leading` | `'none' \| 'tight' \| 'snug' \| 'normal' \| 'relaxed' \| 'loose'` | - | Jarak antar-baris teks (*line-height*) |
| `tracking` | `'tighter' \| 'tight' \| 'normal' \| 'wide' \| 'wider' \| 'widest'` | - | Jarak antar-karakter (*letter-spacing*) |
| `truncate` | `boolean` | `false` | Memotong teks satu baris dengan elipsis (`...`) |
| `clamp` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | - | Memotong teks multi-baris (*line clamp*) |
| `className` | `string` | `''` | Class kustom tambahan (hanya untuk penataan layout) |
| `children` | `ReactNode` | - | Konten teks |

---

## 💡 Contoh Penggunaan

```tsx
import { Text } from '@/components/atoms';

// 1. Heading H1 Kontras
<Text as="h1" size="3xl" weight="bold" variant="contrast">
  Katalog Game Populer
</Text>

// 2. Paragraf Deskripsi dengan Muted Color & Clamp 2 Baris
<Text as="p" size="sm" variant="muted" clamp={2}>
  Game aksi petualangan terbaru dengan kualitas grafis fotorealistis dan cerita mendalam...
</Text>

// 3. Label Formulir
<Text as="label" size="xs" weight="semibold" transform="uppercase" tracking="wider">
  Nama Pengguna
</Text>
```
