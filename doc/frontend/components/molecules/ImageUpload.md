# 🖼️ Molekul: ImageUpload

Komponen pengunggah berkas gambar interaktif berbasis **Atomic Design** GamePedia v2. Dilengkapi area drag-and-drop dengan tactile dropzone feedback, validasi tipe MIME dan ukuran maksimum file, pratinjau gambar instan (*instant image preview*), kontrol aksi ganti dan hapus berkas, indikator progres unggah terintegrasi (*progress bar overlay*), integrasi **Depth System (-3 s/d 3)**, serta pembersihan memori otomatis (`URL.revokeObjectURL`) untuk mencegah memory leak.

---

## 📍 Lokasi Berkas & Arsitektur

- **Komponen Utama**: [`frontend/src/components/molecules/ImageUpload/ImageUpload.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/ImageUpload.tsx)
- **Tipe Data**: [`frontend/src/components/molecules/ImageUpload/ImageUpload.types.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/ImageUpload.types.ts)
- **Hook Logika**: [`frontend/src/components/molecules/ImageUpload/useImageUpload.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/useImageUpload.ts) & [`useImageDragDrop.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/image/useImageDragDrop.ts)
- **Styling Clsx & Helpers**: [`frontend/src/components/molecules/ImageUpload/ImageUpload.styles.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/ImageUpload.styles.ts)
- **Utilitas Helper**: [`frontend/src/components/molecules/ImageUpload/ImageUpload.utils.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/ImageUpload.utils.ts)
- **Sub-komponen Internal**:
  - Header: [`frontend/src/components/molecules/ImageUpload/components/ImageUploadHeader.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/components/ImageUploadHeader.tsx)
  - Dropzone Area: [`frontend/src/components/molecules/ImageUpload/components/ImageUploadDropzone.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/components/ImageUploadDropzone.tsx)
  - Pratinjau Gambar: [`frontend/src/components/molecules/ImageUpload/components/ImageUploadPreview.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/components/ImageUploadPreview.tsx)
  - Indikator Progres: [`frontend/src/components/molecules/ImageUpload/components/ImageUploadProgress.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/components/ImageUploadProgress.tsx)
  - Rincian Metadata: [`frontend/src/components/molecules/ImageUpload/components/ImageUploadInfo.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/components/ImageUploadInfo.tsx)
  - Kontrol Aksi: [`frontend/src/components/molecules/ImageUpload/components/ImageUploadActions.tsx`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/components/ImageUploadActions.tsx)
- **Unit Test (Vitest)**: [`frontend/src/components/molecules/ImageUpload/ImageUpload.spec.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/ImageUpload.spec.ts) (32 tests)
- **Barrel Export**: [`frontend/src/components/molecules/ImageUpload/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/index.ts) & [`frontend/src/components/molecules/index.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/index.ts)

---

## ⚙️ Props & Interface (`ImageUploadProps`)

| Prop | Tipe Data | Nilai Bawaan | Deskripsi |
| :--- | :--- | :--- | :--- |
| `value` | `string \| File \| null` | `undefined` | Nilai gambar terpilih (mode terkontrol). URL string atau objek `File` |
| `defaultValue` | `string \| File \| null` | `undefined` | Nilai awal gambar (mode mandiri/uncontrolled) |
| `onChange` | `(file: File \| null, url: string \| null) => void` | `undefined` | Callback saat gambar dipilih, diganti, atau dihapus |
| `onError` | `(errorMessage: string) => void` | `undefined` | Callback saat validasi ukuran atau tipe MIME gagal |
| `compress` | `boolean \| CompressImageOptions` | `false` | Kompresi otomatis gambar sebelum callback `onChange` (kualitas default 0.8, pembatasan maxWidth/maxHeight) |
| `convertTo` | `TargetImageFormat \| ConvertImageOptions` | `undefined` | Konversi otomatis format gambar ke target (misal `'webp'`, `'image/webp'`, atau opsi konfigurasi) |
| `onProcessingChange` | `(isProcessing: boolean) => void` | `undefined` | Callback saat status proses kompresi atau konversi gambar aktif/selesai |
| `accept` | `string` | `'image/png, image/jpeg, image/webp, image/gif'` | Format gambar yang diperbolehkan |
| `maxSizeMB` | `number` | `5` | Batas maksimum ukuran berkas dalam Megabyte |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Skala dimensi kotak pengunggahan |
| `variant` | `'dashed' \| 'solid' \| 'ghost'` | `'dashed'` | Gaya visual border dan background dropzone |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'lg'` | Radius kelengkungan sudut bingkai |
| `aspectRatio` | `'square' \| 'video' \| 'portrait' \| 'wide' \| 'auto'` | `'video'` | Rasio aspek kotak pratinjau gambar |
| `depth` | `ImageUploadDepth` (-3 s/d 3) | `0` | Elevasi visual taktil (Depth System) |
| `label` | `ReactNode` | `undefined` | Label teks di atas bidang unggah |
| `description` | `ReactNode` | `undefined` | Keterangan/petunjuk di bawah label |
| `error` | `ReactNode` | `undefined` | Pesan kesalahan form eksternal |
| `success` | `boolean` | `false` | Indikasi visual validasi berhasil (border hijau) |
| `disabled` | `boolean` | `false` | Menonaktifkan interaksi dan dialog berkas |
| `isUploading` | `boolean` | `false` | Mengaktifkan overlay loading & progress bar |
| `progress` | `number` | `0` | Nilai progres upload (0 s/d 100) |
| `clearable` | `boolean` | `true` | Menampilkan tombol hapus gambar |
| `showFileInfo` | `boolean` | `true` | Menampilkan nama dan ukuran file di bawah pratinjau |
| `placeholderTitle` | `ReactNode` | `'Pilih atau seret gambar ke sini'` | Judul instruksi dropzone |
| `placeholderSubtitle` | `ReactNode` | `'Mendukung PNG, JPG, WEBP hingga 5MB'` | Teks format instruksi dropzone |
| `icon` | `string` | `'lucide:upload-cloud'` | Ikon dropzone |
| `alt` | `string` | `'Pratinjau gambar terunggah'` | Atribut alt gambar pratinjau |

---

## 💡 Contoh Penggunaan

```tsx
import { useState } from 'react';
import { ImageUpload } from '@/components/molecules';

export const GameCoverForm = () => {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  return (
    <ImageUpload
      label="Cover Game"
      description="Unggah cover utama (otomatis dikompresi & dikonversi ke WebP)"
      accept="image/png, image/jpeg, image/webp"
      maxSizeMB={5}
      aspectRatio="video"
      variant="dashed"
      depth={0}
      compress={{ quality: 0.8, maxWidth: 1920, maxHeight: 1080 }}
      convertTo="webp"
      value={coverUrl}
      onChange={(file, url) => {
        setCoverFile(file);
        setCoverUrl(url);
      }}
    />
  );
};
```

---

## 🛠️ Utilitas Kompresi & Konversi Gambar Mandiri (`@/utils/image`)

Fungsi kompresi dan konversi dapat digunakan secara mandiri di luar komponen:

```tsx
import { compressImage, convertImage } from '@/utils/image';

// 1. Kompresi gambar dengan kualitas lossy, batas resolusi, atau target ukuran spesifik (< 100 KB)
const compressedFile = await compressImage(originalFile, {
  maxSizeKB: 100, // Menghasilkan file di bawah 100 KB secara otomatis
  maxWidth: 1280,
  maxHeight: 720,
});

// 2. Konversi format gambar (misal PNG -> WebP) dengan target ukuran (< 200 KB)
const webpFile = await convertImage(originalFile, {
  format: 'webp',
  quality: 0.85,
  maxSizeKB: 200,
});
```

