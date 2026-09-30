# 🎨 Panduan Styling & Depth System Frontend

Aplikasi Frontend GamePedia v2 menerapkan sistem desain modern berbasis **Tailwind CSS v4**, ruang warna **OKLCH**, serta **Sistem Kedalaman Taktil (Depth System -3 s/d 3)**.

---

## 🌈 Skema Warna OKLCH (`src/index.css`)

Semua token warna didefinisikan menggunakan variabel OKLCH di dalam arahan `@theme` pada file `src/index.css`:

- **Primary Colors** (`--color-primary-*`): Warna aksen utama aplikasi (Violet / Deep Purple OKLCH).
- **Secondary Colors** (`--color-secondary-*`): Warna aksen sekunder (Emerald / Neon Mint OKLCH).
- **Neutral Colors** (`--color-neutral-*`): Skala warna abu-abu netral untuk latar belakang, kontainer, border, dan teks.
- **Semantic Colors**:
  - `success`: Hijau OKLCH untuk indikator sukses/berhasil.
  - `warning`: Amber/Kuning OKLCH untuk peringatan/warning.
  - `error`: Merah OKLCH untuk status error/gagal.
  - `info`: Biru OKLCH untuk informasi/petunjuk.

---

## 🎚️ Sistem Kedalaman UI (Depth System -3 s/d 3)

Depth System memberikan dimensi taktil visual yang realistis (Cekung, Rata, Timbul) pada elemen UI seperti tombol, kartu, input, switch, dan modal:

| Level Kedalaman | Deskripsi Visual | Efek Shadow Tailwind | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **-3** | Ultra Sunken (Sangat Cekung) | `shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)]` | Form slot mendalam, code block recessed |
| **-2** | Deep Sunken (Cekung Sedang) | `shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)]` | Inset text area, field input tertekan |
| **-1** | Sunken (Cekung Inset) | `shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]` | Switch track, input box, active state |
| **0** | Flat (Rata) | `shadow-none` | Tombol ghost, teks datar, pembatas |
| **1** | Raised (Timbul Ringan) | `shadow-sm` / `shadow-md` | Tombol utama, kartu default, badge |
| **2** | Elevated (Timbul Sedang) | `shadow-lg` | Dropdown menu, popover, hover state card |
| **3** | Floating (Timbul Tinggi) | `shadow-xl` / `shadow-2xl` | Modal dialog, toast floating indicator |

---

## 🛠️ Utility Styling & Composition (`cn()`)

Penggabungan class Tailwind dilakukan menggunakan fungsi pembantu `cn()` di `src/lib/utils.ts` yang menggabungkan `clsx` dan `tailwind-merge`:

```tsx
import { cn } from '@/lib/utils';

// Contoh enkapsulasi class dalam komponen:
const containerClasses = cn(
  'flex items-center justify-between gap-4 p-4 rounded-xl',
  'bg-neutral-900 border border-neutral-800',
  'transition-all duration-200 hover:border-primary-500/50',
  customClassName
);
```

### Aturan Komposisi Class (Tailwind Class Organization Standard):
1. **Grouping Per Kategori**: Susun class secara rapi sesuai urutan (Layout -> Spacing -> Typography -> Colors/Background -> Border -> Effects -> Transitions).
2. **Enkapsulasi Class Internal**: Semua komponen custom WAJIB menyembunyikan wall-of-text className di variabel internal komponen.
