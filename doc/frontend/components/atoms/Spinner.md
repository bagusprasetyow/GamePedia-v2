# ⏳ Atom: Spinner

Komponen indikator status pemuatan (*loading spinner*) terenkapsulasi penuh dengan Depth System (skala -3 s/d 3), sub-atom `SpinnerRing` (animasi SVG circular ring & Iconify fallback), `SpinnerLabel` (berbasis atom `Text`), ragam ketebalan garis alur, variasi opasitas lintasan, kontrol kecepatan animasi, serta aksesibilitas layar (`role="status"`, `aria-live="polite"`).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Spinner/Spinner.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Spinner/Spinner.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Spinner/Spinner.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Spinner/Spinner.types.ts)
- **Styling & Class Maps**: [`frontend/src/components/atoms/Spinner/Spinner.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Spinner/Spinner.styles.ts)
- **Sub-komponen Ring Animasi**: [`frontend/src/components/atoms/Spinner/components/SpinnerRing.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Spinner/components/SpinnerRing.tsx)
- **Sub-komponen Label Teks**: [`frontend/src/components/atoms/Spinner/components/SpinnerLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Spinner/components/SpinnerLabel.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Spinner/Spinner.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Spinner/Spinner.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Spinner/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Spinner/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `size` | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| number \| string` | `'md'` | Skala dimensi fisik spinner (preset atau nilai pixel kustom) |
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'contrast' \| 'muted' \| 'white' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'inherit'` | `'primary'` | Varian warna semantik tema GamePedia (OKLCH) |
| `thickness` | `'thin' \| 'normal' \| 'thick'` | `'normal'` | Ketebalan garis stroke alur cincin |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `0` | Kedalaman elevasi taktil Depth System |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Kecepatan durasi rotasi animasi putaran |
| `trackOpacity` | `'faint' \| 'light' \| 'normal' \| 'transparent'` | `'light'` | Tingkat transparansi cincin alur latar belakang (track ring) |
| `icon` | `string` | - | Ikon kustom Iconify opsional jika tidak memakai circular ring bawaan |
| `label` | `ReactNode` | - | Teks/label deskripsi pemuatan (dirender dengan atom `Text`) |
| `labelPosition` | `'right' \| 'bottom' \| 'top' \| 'left'` | `'right'` | Posisi tata letak teks label terhadap ring spinner |
| `labelSize` | `TextSize` | *Otomatis* | Skala ukuran tipografi teks label |
| `labelClassName` | `string` | `''` | Class tambahan khusus untuk elemen teks label |
| `spinnerClassName` | `string` | `''` | Class tambahan khusus untuk elemen ring/SVG |
| `className` | `string` | `''` | Class tambahan untuk kontainer pembungkus utama |

---

## 💡 Contoh Penggunaan

```tsx
import { Spinner } from '@/components/atoms';

// 1. Spinner Dasar Inline
<Spinner />

// 2. Spinner dengan Label Pemuatan
<Spinner size="sm" variant="accent" label="Memuat konten..." />

// 3. Spinner Vertikal untuk Loading Card / Modal
<Spinner
  size="xl"
  variant="primary"
  thickness="thick"
  label="Mengunduh media GamePedia..."
  labelPosition="bottom"
/>

// 4. Spinner dengan Ikon Kustom Iconify
<Spinner icon="mdi:loading" size="lg" variant="success" speed="fast" />

// 5. Spinner Tipis dengan Track Transparan
<Spinner thickness="thin" trackOpacity="transparent" variant="white" />
```
