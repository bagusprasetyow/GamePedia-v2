# 💻 Molekul: SourceCode

Komponen penampil kode sumber bergaya terminal window gelap dengan dukungan multi-tab kode, penyorotan sintaks tokenik real-time, tombol salin ke clipboard dengan feedback visual (`Tersalin!`), serta Depth System skala -3 s/d 3.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/SourceCode/SourceCode.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/SourceCode.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/SourceCode/SourceCode.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/SourceCode.types.ts)
- **Styling Clsx**: [`frontend/src/components/molecules/SourceCode/SourceCode.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/SourceCode.styles.ts)
- **Sub-komponen Header**: [`frontend/src/components/molecules/SourceCode/components/SourceCodeHeader.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/components/SourceCodeHeader.tsx)
- **Sub-komponen Body**: [`frontend/src/components/molecules/SourceCode/components/SourceCodeBody.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/components/SourceCodeBody.tsx)
- **Hook Status Tab & Salin**: [`frontend/src/components/molecules/SourceCode/useSourceCode.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/useSourceCode.ts)
- **Utilitas Highlighter**: [`frontend/src/components/molecules/SourceCode/SourceCode.utils.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/SourceCode.utils.tsx)
- **Unit Test**: [`frontend/src/components/molecules/SourceCode/SourceCode.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/SourceCode.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/SourceCode/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `tabs` | `SourceCodeTab[]` | - | Kumpulan tab kode sumber (`{ id, label, code, language? }`) |
| `code` | `string` | - | Kode sumber tunggal jika tanpa tab |
| `language` | `string` | `'tsx'` | Bahasa pemrograman untuk syntax highlighting |
| `tsxCode` | `string` | - | Shortcut untuk tab React TSX |
| `jsxCode` | `string` | - | Shortcut untuk tab React JSX |
| `activeTabId` | `string` | - | ID tab yang aktif (*controlled mode*) |
| `defaultTabId` | `string` | `'tsx'` | ID tab default awal (*uncontrolled mode*) |
| `showCopyButton` | `boolean` | `true` | Menampilkan tombol salin kode di kanan atas |
| `copyButtonText` | `string` | `'Salin Kode'` | Teks tombol salin saat idle |
| `copiedText` | `string` | `'Tersalin!'` | Teks feedback setelah disalin |
| `depth` | `ButtonDepth` (-3 s/d 3) | `2` | Kedalaman elevasi taktil bingkai terminal |
| `title` | `ReactNode` | - | Judul kustom di header |
| `maxHeight` | `string` | - | Batas tinggi maksimum kontainer kode (aktifkan scroll) |

---

## 💡 Contoh Penggunaan

```tsx
import { SourceCode } from '@/components/molecules';

// 1. Tampilan Kode Multi-Tab (TSX dan CSS)
<SourceCode
  tabs={[
    { id: 'tsx', label: 'App.tsx', code: `import { Button } from '@/components/atoms';\n\nexport default () => <Button>Click</Button>;`, language: 'tsx' },
    { id: 'css', label: 'theme.css', code: `@theme { --color-primary: #3b82f6; }`, language: 'css' },
  ]}
  depth={2}
  maxHeight="320px"
/>
```
