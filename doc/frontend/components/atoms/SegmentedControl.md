# 🎛️ Atom: SegmentedControl

Komponen kumpulan pilihan segmen tunggal (*single-selection segmented control*) terstandarisasi untuk GamePedia-v2 Design System. Berfungsi untuk memilih satu opsi/mode dari sekumpulan opsi terkait secara efisien, type-safe, dan aksesibel.

Mendukung **Depth System (alur cekung -1 s/d -3)**, palet warna semantik GamePedia, navigasi keyboard roving tabindex standar WAI-ARIA Radio Group, integrasi ikon otomatis, opsi individual disabled, mode controlled/uncontrolled, integrasi form native, dan pembagian lebar dinamis (*fullWidth*).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/SegmentedControl/SegmentedControl.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/SegmentedControl/SegmentedControl.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/SegmentedControl/SegmentedControl.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/SegmentedControl/SegmentedControl.types.ts)
- **Styling Clsx & Maps**: [`frontend/src/components/atoms/SegmentedControl/SegmentedControl.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/SegmentedControl/SegmentedControl.styles.ts)
- **Fungsi Utilitas & Navigasi**: [`frontend/src/components/atoms/SegmentedControl/SegmentedControl.utils.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/SegmentedControl/SegmentedControl.utils.ts)
- **Sub-komponen Item**: [`frontend/src/components/atoms/SegmentedControl/components/SegmentedControlItem.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/SegmentedControl/components/SegmentedControlItem.tsx)
- **Unit Test**: [`frontend/src/components/atoms/SegmentedControl/SegmentedControl.spec.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/SegmentedControl/SegmentedControl.spec.tsx)
- **Index Export**: [`frontend/src/components/atoms/SegmentedControl/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/SegmentedControl/index.ts)

---

## ⚙️ Props & Interface

### `SegmentedControlProps<T extends string | number = string>`

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `options` | `SegmentedControlOption<T>[]` | `[]` | Daftar opsi pilihan segmen |
| `value` | `T` | - | Nilai opsi yang sedang aktif (*controlled mode*) |
| `defaultValue` | `T` | `first enabled` | Nilai opsi default awal saat inisialisasi (*uncontrolled mode*) |
| `onChange` | `(value: T) => void` | - | Callback yang dipanggil saat opsi pilihan berubah |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Skala dimensi tinggi dan tipografi segmen |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Varian tema warna semantik untuk item aktif |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `-1` | Kedalaman visual wadah alur (alur cekung -1 s/d -3) |
| `fullWidth` | `boolean` | `false` | Membentang selebar 100% kontainer induk dengan lebar segmen merata |
| `disabled` | `boolean` | `false` | Menonaktifkan interaksi pada seluruh segmen |
| `ariaLabel` | `string` | `'Pilihan segmen kontrol'` | Label aksesibilitas kontainer untuk pembaca layar (`aria-label`) |
| `name` | `string` | - | Nama input form untuk integrasi native form submission |
| `wrapperClassName` | `string` | `''` | ClassName tambahan khusus pembungkus terluar |
| `className` | `string` | `''` | ClassName tambahan khusus untuk kontainer segmen |

### `SegmentedControlOption<T extends string | number = string>`

| Properti | Tipe Data | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `value` | `T` | Ya | Nilai unik pengenal opsi segmen |
| `label` | `ReactNode` | Ya | Konten label tampilan |
| `icon` | `ReactNode \| string` | Tidak | Ikon pendamping (nama iconify string atau elemen ReactNode) |
| `disabled` | `boolean` | Tidak | Menonaktifkan opsi individual ini |
| `ariaLabel` | `string` | Opsional | Label aksesibilitas untuk screen reader (wajib jika icon-only) |

---

## ♿ Aksesibilitas (A11y) & Keyboard Navigation
1. **Semantics Role**: Kontainer memiliki `role="radiogroup"`, dan setiap tombol opsi memiliki `role="radio"` serta `aria-checked={isSelected}`.
2. **Roving Tabindex**: Hanya ada **satu** opsi yang memiliki `tabIndex=0` pada satu waktu (opsi aktif atau fokus saat ini), sedangkan opsi lainnya memiliki `tabIndex=-1`.
3. **Keyboard Navigation**:
   - `ArrowRight` / `ArrowDown`: Pindah ke opsi aktif berikutnya (dengan wrapping ke awal dan melewati opsi *disabled*).
   - `ArrowLeft` / `ArrowUp`: Pindah ke opsi aktif sebelumnya (dengan wrapping ke akhir dan melewati opsi *disabled*).
   - `Home`: Langsung memilih opsi aktif pertama yang tidak dinonaktifkan.
   - `End`: Langsung memilih opsi aktif terakhir yang tidak dinonaktifkan.
   - `Space` / `Enter`: Memilih opsi yang sedang difokuskan.
4. **Form Integration**: Jika prop `name` diberikan, komponen secara otomatis merender `<input type="hidden" name={name} value={String(activeValue)} />` untuk form handling native.

---

## 💡 Contoh Penggunaan

### 1. Dasar Uncontrolled
```tsx
import { SegmentedControl } from '@/components/atoms';

<SegmentedControl
  options={[
    { value: 'all', label: 'Semua' },
    { value: 'games', label: 'Katalog Game' },
    { value: 'users', label: 'Komunitas' },
  ]}
  defaultValue="games"
/>
```

### 2. Controlled dengan Generic Type
```tsx
type ViewMode = 'grid' | 'list' | 'compact';

const [view, setView] = useState<ViewMode>('grid');

<SegmentedControl<ViewMode>
  options={[
    { value: 'grid', label: 'Grid', icon: 'mdi:view-grid' },
    { value: 'list', label: 'List', icon: 'mdi:view-list' },
    { value: 'compact', label: 'Compact', icon: 'mdi:view-headline' },
  ]}
  value={view}
  onChange={setView}
  color="accent"
/>
```

### 3. Full Width & Varian Warna
```tsx
<SegmentedControl
  fullWidth
  color="success"
  size="lg"
  options={[
    { value: 'active', label: 'Aktif Dimainkan' },
    { value: 'completed', label: 'Tamat' },
    { value: 'wishlist', label: 'Wishlist', disabled: true },
  ]}
/>
```

---

## 🎬 Animasi Bergeser (*Sliding Pill Indicator*)
Komponen dilengkapi dengan elemen indikator bergerak (*sliding pill indicator*) `data-testid="segmented-control-indicator"`:
1. **Transisi Halus**: Menggunakan transisi CSS Tailwind `transition-all duration-200 ease-out` untuk menggeser pill seleksi secara mulus antar opsi tanpa lag JavaScript loop.
2. **Dynamic Resize Observer**: Secara otomatis mengukur dimensi tombol segmen aktif (`offsetLeft`, `offsetTop`, `offsetWidth`, `offsetHeight`) bahkan saat kontainer di-resize atau layout berubah.
3. **Reduced Motion**: Mendukung aturan aksesibilitas OS `prefers-reduced-motion` via `motion-reduce:transition-none` untuk pengguna yang sensitif terhadap pergerakan visual.
4. **SSR Safe**: Aman dieksekusi di lingkungan Node.js / SSR (`renderToString`) tanpa error DOM API.

