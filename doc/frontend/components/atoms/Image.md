# 🖼️ Atom Komponen: Image (`Image.tsx`)

Komponen primitif gambar tingkat lanjut berbasis Atomic Design dengan dukungan **Depth System (-3 s/d 3)**, efek **ambient blur glow**, animasi **shimmer skeleton loader**, mekanisme **graceful fallback** (error resilience), dan optimasi peramban (lazy loading & aspect ratio preservation).

---

## 📍 Lokasi Berkas & Arsitektur

- **Komponen Utama**: [`frontend/src/components/atoms/Image/Image.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Image/Image.tsx)
- **Tipe & Interface**: [`frontend/src/components/atoms/Image/Image.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Image/Image.types.ts)
- **Modular Styles**: [`frontend/src/components/atoms/Image/Image.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Image/Image.styles.ts)
- **Sub-Komponen Terdekomposisi**:
  - [`ImageSkeleton.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Image/components/ImageSkeleton.tsx) — Shimmer loading placeholder
  - [`ImageFallback.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Image/components/ImageFallback.tsx) — Placeholder visual jika gambar gagal dimuat
  - [`ImageAmbientBlur.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Image/components/ImageAmbientBlur.tsx) — Lapisan glow blur di belakang wadah gambar
- **Unit Tests (Vitest)**: [`frontend/src/components/atoms/Image/Image.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Image/Image.spec.ts) (19 tests)
- **Barrel Export**: [`frontend/src/components/atoms/Image/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Image/index.ts)

---

## ⚙️ Tabel API Props & Interface

Komponen mewarisi seluruh atribut bawaan tag HTML `<img>` (`ImgHTMLAttributes<HTMLImageElement>`) dengan prop kustom berikut:

| Prop | Tipe Data | Nilai Bawaan (*Default*) | Keterangan & Deskripsi Fungsi |
| :--- | :--- | :--- | :--- |
| `src` | `string` | `undefined` | URL sumber gambar utama yang akan ditampilkan. |
| `alt` | `string` | `''` | Teks deskripsi alternatif untuk a11y & screen reader. |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | Nilai properti CSS `object-fit`. |
| `rounded` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'none'` | Tingkat kelengkungan sudut bingkai gambar. |
| `aspectRatio` | `'square' \| 'video' \| 'portrait' \| 'wide' \| 'auto'` | `'auto'` | Rasio aspek bingkai (`1/1`, `16/9`, `3/4`, `21/9`, atau `auto`). |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` | `0` | Elevasi tactile Depth System (-3 s/d 3). |
| `ambientBlur` | `boolean` | `false` | Menampilkan efek pantulan cahaya blur di belakang gambar. |
| `showSkeleton`| `boolean` | `false` | Menampilkan placeholder shimmer saat gambar sedang diunduh. |
| `fallbackSrc` | `string` | `undefined` | URL cadangan jika gambar `src` gagal dimuat (404 / network fail). |
| `fallbackElement` | `ReactNode` | `undefined` | Elemen visual kustom pengganti jika gambar gagal dimuat. |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Strategi pemuatan gambar native peramban. |
| `wrapperClassName` | `string` | `undefined` | Kelas styling tambahan untuk kontainer pembungkus luar. |
| `onLoad` | `(event) => void` | `undefined` | Callback saat gambar berhasil dimuat. |
| `onError` | `(event) => void` | `undefined` | Callback saat pemuatan gambar mengalami kegagalan. |

---

## 📐 Depth System (-3 s/d 3)

Komponen `Image` mendukung Depth System secara menyeluruh:
- **Depth Cembung (`1`, `2`, `3`)**: Memberikan elevasi bayangan mengambang di atas kanvas dengan saturasi bayangan natural berbasis OKLCH.
- **Depth Rata (`0`)**: Menempel sejajar kanvas tanpa bayangan.
- **Depth Cekung (`-1`, `-2`, `-3`)**: Memberikan inset shadow taktil seolah gambar berada di dalam cekungan bingkai bingkai (*sunken frame*).

---

## 💻 Contoh Penggunaan

```tsx
import { Image } from '@/components/atoms/Image';

// Gambar game cover dengan rasio video, rounded-lg, ambient blur, dan depth 2
export function GameCoverCard() {
  return (
    <Image
      src="/storage/image/game/cyberpunk.webp"
      alt="Cyberpunk 2077 Cover"
      aspectRatio="video"
      fit="cover"
      rounded="lg"
      depth={2}
      ambientBlur={true}
      showSkeleton={true}
      fallbackSrc="/placeholder-game.png"
    />
  );
}
```

---

## ♿ Aksesibilitas (A11y)

- Mendukung atribut `alt` wajib untuk screen readers.
- Elemen skeleton dan ambient blur secara otomatis ditandai `aria-hidden="true"` untuk mencegah gangguan screen reader.
- Sub-komponen fallback menyertakan representasi visual ikonik dan teks pendukung agar pengguna mengetahui kegagalan muat gambar secara jelas.
