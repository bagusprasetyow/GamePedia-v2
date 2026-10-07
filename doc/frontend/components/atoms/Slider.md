# 🎚️ Atom: Slider

Komponen penggeser nilai tunggal (*single-value slider*) interaktif dan terstandarisasi untuk GamePedia-v2 Design System. Mendukung Depth System (-3 s/d 3) dengan alur cekung, orientasi horizontal maupun vertikal, arah normal/reverse, controlled & uncontrolled mode, touch/mouse pointer events, navigasi keyboard lengkap, titik penanda (*marks*), gelembung tooltip, form integration dengan hidden input, dan aksesibilitas ARIA komprehensif.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Slider/Slider.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/Slider.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Slider/Slider.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/Slider.types.ts)
- **Styling Clsx & Maps**: [`frontend/src/components/atoms/Slider/Slider.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/Slider.styles.ts)
- **Fungsi Utilitas & Matematika**: [`frontend/src/components/atoms/Slider/Slider.utils.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/Slider.utils.ts)
- **Sub-komponen Jalur (Track)**: [`frontend/src/components/atoms/Slider/components/SliderTrack.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/components/SliderTrack.tsx)
- **Sub-komponen Rentang (Range)**: [`frontend/src/components/atoms/Slider/components/SliderRange.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/components/SliderRange.tsx)
- **Sub-komponen Knop (Thumb)**: [`frontend/src/components/atoms/Slider/components/SliderThumb.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/components/SliderThumb.tsx) (terintegrasi dengan [`TooltipBubble`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Tooltip/components/TooltipBubble.tsx))
- **Sub-komponen Penanda (Marks)**: [`frontend/src/components/atoms/Slider/components/SliderMarks.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/components/SliderMarks.tsx)
- **Sub-komponen Label**: [`frontend/src/components/atoms/Slider/components/SliderLabel.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/components/SliderLabel.tsx)
- **Sub-komponen Helper Text**: [`frontend/src/components/atoms/Slider/components/SliderHelperText.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/components/SliderHelperText.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Slider/Slider.spec.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/Slider.spec.tsx)
- **Index Export**: [`frontend/src/components/atoms/Slider/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Slider/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `min` | `number` | `0` | Batas nilai minimum |
| `max` | `number` | `100` | Batas nilai maksimum |
| `step` | `number` | `1` | Besaran kenaikan/penurunan nilai kelipatan |
| `value` | `number` | - | Nilai slider saat ini (*controlled mode*) |
| `defaultValue` | `number` | `min` | Nilai awal slider (*uncontrolled mode*) |
| `onChange` | `(value: number) => void` | - | Callback pemanggilan saat nilai berubah (geser/klik/keyboard) |
| `onChangeEnd` | `(value: number) => void` | - | Callback pemanggilan saat interaksi selesai (*pointerup*) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientasi tata letak slider |
| `direction` | `'normal' \| 'reverse'` | `'normal'` | Arah pertambahan nilai (normal: kiri->kanan/bawah->atas) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Skala ukuran trek, thumb, dan tipografi |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Varian tema warna semantik GamePedia |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `-1` | Kedalaman visual trek (alur cekung -1 s/d -3) |
| `label` | `ReactNode` | - | Teks label di atas slider |
| `description` | `ReactNode` | - | Teks keterangan bantuan di bawah slider |
| `error` | `ReactNode` | - | Pesan galat validasi (*invalid state*) |
| `success` | `boolean` | `false` | Status validasi sukses (border & ring hijau) |
| `errorPosition` | `'absolute' \| 'relative'` | `'absolute'` | Posisi penempatan pesan error / keterangan |
| `required` | `boolean` | `false` | Menampilkan indikator tanda bintang wajib (*) pada label |
| `disabled` | `boolean` | `false` | Menonaktifkan seluruh interaksi slider |
| `fullWidth` | `boolean` | `true` | Membentang selebar kontainer (100% width) |
| `width` | `'auto' \| 'full' \| string` | - | Lebar kustom spesifik (misal `'300px'`) |
| `showValue` | `boolean` | `false` | Menampilkan teks nilai secara visual |
| `valuePosition`| `'top' \| 'bottom' \| 'tooltip'` | `'tooltip'` | Posisi letak teks nilai |
| `formatValue` | `(value: number) => ReactNode` | - | Pemformat tampilan angka nilai (contoh: persentase/mata uang) |
| `tooltip` | `boolean` | `false` | Menampilkan floating tooltip saat hover, fokus, atau dragging |
| `getAriaValueText` | `(value: number) => string` | - | Pembuat teks deskripsi nilai untuk pembaca layar (`aria-valuetext`) |
| `marks` | `SliderMark[]` | - | Daftar titik penanda (*ticks*) pada trek |
| `marksClickable` | `boolean` | `true` | Mengizinkan klik pada penanda untuk melompatkan nilai |
| `trackClickable` | `boolean` | `true` | Mengizinkan klik pada trek untuk memindahkan knop |
| `thumbIcon` | `ReactNode` | - | Ikon di dalam knop penggeser |
| `wrapperClassName` | `string` | `''` | ClassName tambahan khusus pembungkus terluar |
| `className` | `string` | `''` | ClassName tambahan untuk elemen trek slider |

---

## ⌨️ Kontrol Keyboard & Aksesibilitas (A11y)

| Tombol | Fungsi Normal | Fungsi Reverse |
| :--- | :--- | :--- |
| `ArrowRight` / `ArrowUp` | Menambah nilai sebesar `+step` | Mengurangi nilai sebesar `-step` |
| `ArrowLeft` / `ArrowDown`| Mengurangi nilai sebesar `-step` | Menambah nilai sebesar `+step` |
| `Home` | Melompat ke batas `min` | Melompat ke batas `max` |
| `End` | Melompat ke batas `max` | Melompat ke batas `min` |
| `PageUp` | Menambah nilai dengan kelipatan halaman | Mengurangi nilai dengan kelipatan halaman |
| `PageDown` | Mengurangi nilai dengan kelipatan halaman | Menambah nilai dengan kelipatan halaman |

### Standar ARIA
- Knop memiliki `role="slider"`, `tabIndex={0}` (atau `-1` jika disabled).
- Dilengkapi atribut `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, dan `aria-orientation`.
- Label terhubung melalui `aria-labelledby` dan keterangan/error terhubung melalui `aria-describedby`.
- Menyertakan elemen native `<input type="range" className="sr-only" />` yang sinkron untuk kebutuhan form submission.

---

## 💡 Contoh Penggunaan

```tsx
import { useState } from 'react';
import { Slider } from '@/components/atoms';

// 1. Slider Dasar Uncontrolled
<Slider
  label="Tingkat Volume Audio"
  defaultValue={70}
  showValue
  valuePosition="top"
  formatValue={(val) => `${val}%`}
/>

// 2. Slider Controlled dengan Tooltip & Penanda (Marks)
export const AudioSettings = () => {
  const [volume, setVolume] = useState(50);

  return (
    <Slider
      value={volume}
      onChange={setVolume}
      label="Master Volume"
      tooltip
      color="accent"
      marks={[
        { value: 0, label: 'Mute' },
        { value: 50, label: '50%' },
        { value: 100, label: 'Max' },
      ]}
    />
  );
};

// 3. Slider Vertikal
<Slider
  orientation="vertical"
  min={0}
  max={100}
  defaultValue={80}
  color="primary"
  tooltip
/>
```
