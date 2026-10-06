# 🌓 Molekul: ThemeToggle

Komponen pengalih tema aplikasi (`light` / `dark` / `system`) interaktif yang terhubung langsung dengan hook global `useTheme`. Menyediakan 3 ragam bentuk presentasi visual: tombol ikon kompak (`icon`), tombol penuh dengan label (`button`), dan sakelar saklar biner (`switch`).

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/ThemeToggle/ThemeToggle.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ThemeToggle/ThemeToggle.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/ThemeToggle/ThemeToggle.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ThemeToggle/ThemeToggle.types.ts)
- **Hook Pengelola**: [`frontend/src/hooks/useTheme.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/useTheme.ts)
- **Unit Test**: [`frontend/src/components/molecules/ThemeToggle/ThemeToggle.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ThemeToggle/ThemeToggle.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/ThemeToggle/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ThemeToggle/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `display` | `'icon' \| 'button' \| 'switch'` | `'icon'` | Mode bentuk tampilan komponen |
| `size` | `ButtonSize` (`'xs'` s/d `'xl'`) | `'md'` | Ukuran fisik elemen tombol/sakelar |
| `variant` | `ButtonVariant` | `'outline'` | Varian visual tombol |
| `depth` | `ButtonDepth` (-3 s/d 3) | `'raised-sm'` | Kedalaman elevasi taktil |
| `rounded` | `ButtonRounded` | `'full'` | Kelengkungan sudut tombol |
| `showIcon` | `boolean` | `false` | Menampilkan ikon matahari/bulan pada knop saat mode `switch` |
| `className` | `string` | `''` | Class tambahan untuk penataan layout |

---

## 💡 Contoh Penggunaan

```tsx
import { ThemeToggle } from '@/components/molecules';

// 1. Tombol Ikon Bundar di Navbar
<ThemeToggle display="icon" rounded="full" variant="ghost" />

// 2. Tombol Penuh di Menu Pengaturan
<ThemeToggle display="button" variant="outline" depth={1} />

// 3. Mode Sakelar Switch di Modal Preferensi
<ThemeToggle display="switch" showIcon />
```
