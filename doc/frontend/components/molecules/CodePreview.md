# 📜 Molekul: CodePreview

Komponen blok penampil kode sumber terformat dengan penyorotan sintaks (*syntax highlighting*) real-time bergaya **VS Code Dark+**, opsi penomoran baris (*line numbers*), scroll horizontal, dan integrasi Depth System (-3 s/d 3). Dapat digunakan mandiri atau di dalam `SourceCode`.

---

## 📍 Lokasi Berkas & Arsitektur
- **Komponen Utama**: [`frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.types.ts)
- **Sub-komponen Line**: [`frontend/src/components/molecules/SourceCode/CodePreview/components/CodePreviewLine.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/components/CodePreviewLine.tsx)
- **Hook Pemrosesan Baris**: [`frontend/src/components/molecules/SourceCode/CodePreview/useCodePreview.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/useCodePreview.ts)
- **Styling Clsx**: [`frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.styles.ts)
- **Utilitas Highlighter**: [`frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.utils.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.utils.tsx)
- **Unit Test**: [`frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/CodePreview.spec.ts)
- **Index Export**: [`frontend/src/components/molecules/SourceCode/CodePreview/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/SourceCode/CodePreview/index.ts)

---

## ⚙️ Props & Interface

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `code` | `string` | *(Wajib)* | Teks kode yang akan dirender |
| `language` | `string` | `'jsx'` | Bahasa target penyorotan tokenik |
| `showLineNumbers` | `boolean` | `false` | Menampilkan nomor baris di sisi kiri |
| `maxHeight` | `string` | - | Batas tinggi maksimum kontainer kode |
| `depth` | `CodePreviewDepth` (-3 s/d 3) | `0` | Kedalaman visual elevasi |
| `variant` | `'terminal' \| 'inset' \| 'flat' \| 'raised'` | `'terminal'` | Gaya visual kontainer |
| `header` | `ReactNode` | - | Header kustom opsional di atas blok |

---

## 💡 Contoh Penggunaan

```tsx
import { CodePreview } from '@/components/molecules';

<CodePreview
  code={`const greeting = "Halo GamePedia!";\nconsole.log(greeting);`}
  language="typescript"
  showLineNumbers
  variant="inset"
  depth={-1}
/>
```
