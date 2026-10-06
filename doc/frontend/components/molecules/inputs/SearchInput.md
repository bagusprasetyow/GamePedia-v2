# 🔍 Molekul Input: SearchInput

Komponen bidang pencarian reaktif dengan fitur penundaan permintaan (*debounce*), indikator animasi loading spinner otomatis, tombol pembersih cepat (`ClearButton`), serta fungsi pencocokan data `matchesSearch` teruji Vitest.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/Input/SearchInput/SearchInput.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/SearchInput/SearchInput.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/Input/SearchInput/SearchInput.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/SearchInput/SearchInput.types.ts)
- **Utilitas Pencarian**: [`frontend/src/components/molecules/Input/SearchInput/SearchInput.utils.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/SearchInput/SearchInput.utils.ts) & [`.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/SearchInput/SearchInput.utils.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/Input/SearchInput/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/Input/SearchInput/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `onSearch` | `(query: string) => void` | - | Callback pemanggilan setelah query ter-debounce |
| `debounceMs` | `number` | `300` | Waktu jeda debounce dalam milidetik (ms) |
| `isLoading` | `boolean` | `false` | Menampilkan spinner loading menggantikan tombol clear |
| `clearable` | `boolean` | `true` | Menampilkan tombol silang untuk mereset kata kunci |
| `placeholder`| `string` | `'Cari...'` | Placeholder default input |

---

## 💡 Contoh Penggunaan

```tsx
import { SearchInput } from '@/components/molecules';

<SearchInput
  placeholder="Cari game berdasarkan judul, genre, atau publisher..."
  debounceMs={400}
  isLoading={isSearching}
  onSearch={(query) => fetchSearchResults(query)}
/>
```
