# 📊 Atom: ProgressBar

Komponen bilah indikator kemajuan (*progress bar*) yang terstandarisasi untuk GamePedia-v2 Design System. Mendukung Depth System (-3 s/d 3) dengan alur cekung (*sunken track*), varian warna semantik, skala ukuran responsif, mode terukur (*determinate*) dan tak terukur (*indeterminate*), penyesuaian label & tampilan persentase, custom value formatter, serta aksesibilitas ARIA komprehensif.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/ProgressBar/ProgressBar.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/ProgressBar.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/ProgressBar/ProgressBar.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/ProgressBar.types.ts)
- **Styling Clsx & Maps**: [`frontend/src/components/atoms/ProgressBar/ProgressBar.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/ProgressBar.styles.ts)
- **Fungsi Utilitas & Normalisasi**: [`frontend/src/components/atoms/ProgressBar/ProgressBar.utils.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/ProgressBar.utils.ts)
- **Sub-komponen Jalur (Track)**: [`frontend/src/components/atoms/ProgressBar/components/ProgressBarTrack.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/components/ProgressBarTrack.tsx)
- **Sub-komponen Isian (Fill)**: [`frontend/src/components/atoms/ProgressBar/components/ProgressBarFill.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/components/ProgressBarFill.tsx)
- **Sub-komponen Label**: [`frontend/src/components/atoms/ProgressBar/components/ProgressBarLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/components/ProgressBarLabel.tsx)
- **Unit Test**: [`frontend/src/components/atoms/ProgressBar/ProgressBar.spec.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/ProgressBar.spec.tsx)
- **Index Export**: [`frontend/src/components/atoms/ProgressBar/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/ProgressBar/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `value` | `number` | `0` | Nilai progres saat ini (dibatasi otomatis antara 0 dan `max`) |
| `max` | `number` | `100` | Batas nilai maksimum kapasitas (> 0) |
| `indeterminate` | `boolean` | `false` | Mode alur tak tentu untuk operasi berdurasi tidak diketahui |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Skala ukuran tinggi track dan tipografi pendukung |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Varian tema warna semantik GamePedia |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `-1` | Kedalaman visual trek (alur cekung -1 s/d -3) |
| `label` | `ReactNode` | - | Teks label judul di atas bilah progres |
| `showValue` | `boolean` | `false` | Menampilkan teks nilai persentase secara visual |
| `formatValue` | `(value: number, max: number) => ReactNode` | - | Pemformat kustom tampilan teks nilai (misal: "750 MB / 1 GB") |
| `description` | `ReactNode` | - | Teks keterangan atau bantuan di bawah bilah progres |
| `disabled` | `boolean` | `false` | Status redup visual (`opacity-60`) |
| `fullWidth` | `boolean` | `true` | Membentang selebar 100% kontainer induk |
| `width` | `'auto' \| 'full' \| string` | - | Lebar spesifik kustom (contoh: `'320px'` atau `'50%'`) |
| `wrapperClassName` | `string` | `''` | ClassName tambahan khusus pembungkus terluar |
| `className` | `string` | `''` | ClassName tambahan khusus untuk trek bilah progres |

---

## ♿ Aksesibilitas (A11y)
1. **Semantics Role**: Menggunakan `role="progressbar"` murni (bukan `role="slider"` dan bukan tombol).
2. **Determinate State**:
   - `aria-valuemin="0"`
   - `aria-valuemax={max}`
   - `aria-valuenow={value}`
3. **Indeterminate State**:
   - `aria-busy="true"`
   - `aria-valuenow` secara sengaja **ditiadakan** agar pembaca layar tidak mengumumkan nilai persentase palsu.
4. **Label Relations**:
   - Menghubungkan label ke trek bilah secara otomatis via `aria-labelledby`.
   - Menghubungkan description bantuan via `aria-describedby`.
   - Mendukung `aria-label` langsung untuk kasus bilah tanpa label visual.
5. **Reduced Motion**:
   - Mendukung preferensi sistem `@media (prefers-reduced-motion: reduce)` dengan utility `motion-reduce:transition-none` dan `motion-reduce:animate-none`.

---

## 💡 Contoh Penggunaan

### 1. Dasar (Default Determinate)
```tsx
import { ProgressBar } from '@/components/atoms';

<ProgressBar value={40} />
```

### 2. Dengan Label dan Teks Persentase
```tsx
<ProgressBar
  label="Mengunduh Patch Game"
  value={65}
  showValue
/>
```

### 3. Batas Maksimum Kustom dan Pemformat Nilai
```tsx
<ProgressBar
  label="Instalasi Asset"
  value={750}
  max={1000}
  showValue
  formatValue={(val, max) => `${val} MB / ${max} MB`}
/>
```

### 4. Varian Warna Semantik & Ukuran
```tsx
<ProgressBar value={100} color="success" size="lg" label="Pemasangan Selesai" showValue />
<ProgressBar value={25} color="warning" size="sm" label="Memori Rendah" showValue />
<ProgressBar value={15} color="error" label="Gagal Mengunduh" showValue />
```

### 5. Mode Tak Tentu (Indeterminate / Loading)
```tsx
<ProgressBar
  indeterminate
  color="primary"
  label="Menghubungkan ke Server Game..."
  description="Mohon tunggu sejenak sementara kami memverifikasi autentikasi Anda."
/>
```
