# 🔘 Atom: Button

Komponen tombol interaktif terenkapsulasi penuh dengan **Depth System taktil (-3 s/d 3)**, integrasi ikon fleksibel, status loading terdekomposisi (`ButtonLoading`), sub-atom ikon (`ButtonIcon`), dan kepatuhan penuh terhadap standar aksesibilitas WAI-ARIA.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/atoms/Button/Button.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Button/Button.tsx)
- **Tipe Data**: [`frontend/src/components/atoms/Button/Button.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Button/Button.types.ts)
- **Styling Clsx**: [`frontend/src/components/atoms/Button/Button.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Button/Button.styles.ts)
- **Sub-komponen Loading**: [`frontend/src/components/atoms/Button/components/ButtonLoading.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Button/components/ButtonLoading.tsx)
- **Sub-komponen Icon**: [`frontend/src/components/atoms/Button/components/ButtonIcon.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Button/components/ButtonIcon.tsx)
- **Unit Test**: [`frontend/src/components/atoms/Button/Button.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Button/Button.spec.ts)
- **Index Export**: [`frontend/src/components/atoms/Button/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/atoms/Button/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'outline' \| 'ghost' \| 'contrast' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'close'` | `'primary'` | Varian tema visual tombol |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Ukuran tombol (padding & teks) |
| `depth` | `DepthNumeric \| DepthString \| DepthNamed` (-3 s/d 3) | `1` | Skala kedalaman bayangan & elevasi taktil |
| `width` | `'auto' \| 'full' \| 'icon'` | `'auto'` | Dimensi lebar tombol (icon = aspect ratio 1:1) |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Radius kelengkungan sudut |
| `isLoading` | `boolean` | `false` | Status memuat; menonaktifkan klik dan menampilkan spinner |
| `loadingText` | `string` | - | Teks label pengganti selama status loading |
| `startIcon` | `ReactNode` | - | Ikon di sebelah kiri label teks |
| `endIcon` | `ReactNode` | - | Ikon di sebelah kanan label teks |
| `icon` | `ReactNode` | - | Ikon tunggal untuk mode tombol ikon (`width="icon"`) |
| `disabled` | `boolean` | `false` | Menonaktifkan interaksi tombol |
| `children` | `ReactNode` | - | Konten label tombol |

---

## 🎨 Depth System pada Button
Button mendukung skala kedalaman taktil penuh:
- **Depth 0**: Tombol rata (*flat border/no shadow*).
- **Depth 1 s/d 3**: Elevasi positif tombol timbul dengan bayangan realistis.
- **Depth -1 s/d -3**: Efek tombol tertekan ke dalam (*inset shadow / pressed state*).

---

## 💡 Contoh Penggunaan

```tsx
import { Button } from '@/components/atoms';

// 1. Tombol Utama dengan Depth Taktil
<Button variant="primary" depth={2} startIcon="lucide:play">
  Mainkan Sekarang
</Button>

// 2. Tombol Aksi Bahaya
<Button variant="error" depth={1} startIcon="lucide:trash-2">
  Hapus Akun
</Button>

// 3. Tombol Loading Reaktif
<Button variant="secondary" isLoading={isSubmitting} loadingText="Menyimpan...">
  Simpan Profil
</Button>

// 4. Tombol Ikon Bundar (Icon Only)
<Button variant="ghost" width="icon" rounded="full" icon="lucide:settings" aria-label="Pengaturan" />
```
