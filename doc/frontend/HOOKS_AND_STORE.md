# 🪝 Custom Hooks & State Management Frontend

Dokumen ini memuat detail implementasi custom React hooks, manajemen tema global, dan integrasi streaming data di Frontend GamePedia v2.

---

## 🌓 1. Manajemen Tema Global (`useTheme`)

File: `src/hooks/useTheme.ts`

Manajemen tema reaktif yang efisien menggunakan API bawaan React 19 `useSyncExternalStore`. Hook ini mendukung sinkronisasi state antar komponen tanpa re-render yang tidak perlu, persistensi di `localStorage`, serta deteksi preferensi tema sistem operasi (`prefers-color-scheme`).

### Fungsi Global (Dapat Dipanggil di Luar React):
- `toggleGlobalTheme()`: Melakukan toggle tema secara langsung antara `'light'` dan `'dark'`.
- `setGlobalTheme(theme: 'light' | 'dark' | 'system')`: Menyetel mode tema secara eksplisit.
- `getGlobalTheme()`: Mengambil preferensi tema yang tersimpan.
- `getResolvedTheme()`: Mengembalikan nilai aktif aktual (`'light'` atau `'dark'`).

### Penggunaan React Hook:

```tsx
import { useTheme } from '@/hooks/useTheme';

function Header() {
  const { isDark, theme, resolvedTheme, toggleTheme, setTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Mode saat ini: {resolvedTheme} ({isDark ? 'Gelap' : 'Terang'})
    </button>
  );
}
```

---

## 📞 2. Hook Masukan Telepon (`usePhoneInput`)

File: `src/components/molecules/Input/PhoneInput/usePhoneInput.ts`

Hook khusus pengelola logika masukan nomor telepon internasional. Terintegrasi dengan utility `phoneUtils.ts` untuk memparsing kode negara, melakukan format digit otomatis sesuai standar internasional, dan memvalidasi nomor telepon.

```tsx
import { usePhoneInput } from '@/components/molecules/Input/PhoneInput/usePhoneInput';

const { selectedCountry, formattedValue, handleCountryChange, handleNumberChange } = usePhoneInput({
  defaultValue: '+628123456789',
  onChange: (fullNumber) => console.log(fullNumber),
});
```

---

## 🔽 3. Hook Dropdown (`useDropdown` & `useDropdownKeyboard`)

File: `src/components/molecules/Dropdown/useDropdown.ts` & `src/components/molecules/Dropdown/useDropdownKeyboard.ts`

Hook modular pengelola interaksi komponen `Dropdown`:
- **`useDropdown`**: Mengelola state dropdown terbuka/tertutup, seleksi nilai (single / multi-select), pemfilteran kata kunci pencarian (ComboBox) menggunakan utility `filterOptions`, tombol bersihkan (`clearable`), serta pendeteksi klik luar (_click outside_).
- **`useDropdownKeyboard`**: Mengelola navigasi keyboard WAI-ARIA lengkap (`ArrowDown`, `ArrowUp`, `Enter`, `Space`, `Escape`, `Home`, `End`), penanda fokus aktif item, dan auto-scroll viewport ke item yang aktif disorot.

```tsx
import { useDropdown } from '@/components/molecules/Dropdown/useDropdown';
import { useDropdownKeyboard } from '@/components/molecules/Dropdown/useDropdownKeyboard';

const { isOpen, setIsOpen, selectedValues, handleSelect, searchQuery, setSearchQuery } = useDropdown({
  variant: 'single',
  options,
  value,
  onChange,
});
```

---

## 💬 4. Hook Tooltip (`useTooltip`)

File: `src/components/atoms/Tooltip/useTooltip.ts`

Hook internal pengatur siklus kemunculan gelembung `Tooltip`. Mengelola kontrol pemicu `hover`, `click`, `focus`, dan `manual`, jeda waktu kemunculan (`delay`), durasi penutupan otomatis, serta registrasi event listener pada target pemicu.

```tsx
import { useTooltip } from '@/components/atoms/Tooltip/useTooltip';

const { isOpen, triggerProps, bubbleProps } = useTooltip({
  trigger: 'hover',
  delay: 150,
  defaultOpen: false,
});
```

---

## 🔢 5. Hook Masukan Kode (`useCodeInput`)

File: `src/components/molecules/Input/CodeInput/useCodeInput.ts`

Hook pengatur interaksi form masukan kode multi-digit (PIN / OTP). Mengatur perpindahan fokus kursor antar slot digit, penekanan tombol Backspace mundur, tombol panah kiri/kanan, serta pembagian digit otomatis saat pengguna melakukan paste kode dari clipboard.

```tsx
import { useCodeInput } from '@/components/molecules/Input/CodeInput/useCodeInput';

const { values, activeIndex, handleInputChange, handleKeyDown, handlePaste } = useCodeInput({
  length: 6,
  onComplete: (code) => console.log('Kode Lengkap:', code),
});
```

---

## 📋 6. Hook Penyalinan Clipboard (`useClipboard`)

File: `src/components/molecules/Clipboard/useClipboard.ts`

Hook modular pengatur interaksi salin teks ke clipboard sistem menggunakan API browser `navigator.clipboard`.

- **Fitur Utama**:
  - Penanganan status `isCopied` reaktif dengan durasi reset otomatis (default 2000ms).
  - Pembersihan timer (`clearTimeout`) otomatis pada saat unmount komponen untuk mencegah kebocoran memori.
  - Fallback aman dan penanganan callback `onCopy` serta `onError`.
  - Dukungan mode terkontrol (*controlled*) via prop `copied` maupun mandiri (*uncontrolled*).

```tsx
import { useClipboard } from '@/components/molecules/Clipboard/useClipboard';

const { isCopied, copy } = useClipboard({
  duration: 2000,
  onCopy: () => console.log('Teks berhasil disalin'),
});
```

---

## 💻 7. Hook Penampil Kode Sumber (`useSourceCode`)

File: `src/components/molecules/SourceCode/useSourceCode.ts`

Hook pengatur interaksi komponen `SourceCode`:
- **Fitur Utama**:
  - Pengelolaan active tab pada multi-tab code snippet.
  - Penentuan kode sumber aktif berdasarkan tab terpilih atau prop `code` / `jsxCode`.
  - Integrasi aksi tombol salin dengan feedback teks dinamis ("Salin" -> "Tersalin!").
  - Sinkronisasi event `onTabChange`.

```tsx
import { useSourceCode } from '@/components/molecules/SourceCode/useSourceCode';

const { activeTab, activeCode, isCopied, handleTabSelect, handleCopy } = useSourceCode({
  tabs: [{ id: 'tsx', label: 'App.tsx', code: '...', language: 'jsx' }],
});
```

---

## 🔍 8. Hook Pratinjau Kode (`useCodePreview`)

File: `src/components/molecules/SourceCode/CodePreview/useCodePreview.ts`

Hook komputasi token sintaksis dan pemformatan baris kode untuk komponen `CodePreview`:
- **Fitur Utama**:
  - Pemecahan string kode menjadi baris-baris terstruktur (`lines`).
  - Kalkulasi lebar kolom penomoran baris (*line numbers gutter padding*).
  - Optimasi render dengan token memoization untuk penyorotan sintaksis (*syntax highlighting*) bergaya VS Code Dark+.

```tsx
import { useCodePreview } from '@/components/molecules/SourceCode/CodePreview/useCodePreview';

const { lines, gutterWidth } = useCodePreview({
  code: 'const greeting = "Hello World";',
  showLineNumbers: true,
});
```

---

## ⏱️ 9. Custom Hooks Debounce (`useDebounce` & `useDebouncedCallback`)

File: [`src/hooks/debounce/useDebounce.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/debounce/useDebounce.ts) & [`src/hooks/debounce/useDebouncedCallback.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/debounce/useDebouncedCallback.ts)

Kumpulan custom hook untuk menunda eksekusi nilai atau fungsi sampai jeda waktu tertentu berlalu:
- **`useDebounce<T>(value: T, delay: number = 300, options?: DebounceOptions)`**: Mengembalikan nilai tertunda (*debounced value*) yang hanya diperbarui setelah pengguna berhenti mengubah nilai input selama `delay` milidetik.
- **`useDebouncedCallback<T>(callback: T, delay: number = 300, options?: DebounceOptions)`**: Menghasilkan fungsi callback dengan penundaan eksekusi, dilengkapi metode `.cancel()`, `.flush()`, dan `.pending()`.

```tsx
import { useDebounce, useDebouncedCallback } from '@/hooks/debounce';

// 1. Debounce Value (misal untuk input pencarian atau query filter)
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

// 2. Debounced Callback (misal untuk pemanggilan API atau resize event)
const handleApiSearch = useDebouncedCallback((query: string) => {
  fetchData(query);
}, 400);
```

---

## 💾 10. Custom Hook Cache In-Memory (`useCache`)

File: [`src/hooks/cache/useCache.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/cache/useCache.ts)

Hook pengelolaan cache state in-memory berbasis LRU/TTL:
- **Fitur Utama**:
  - Pengambilan data instan dari cache lokal sebelum melakukan fetch jaringan.
  - Dukungan TTL (*Time To Live*) dan penggusuran otomatis saat kapasitas maksimum tercapai (*LRU Eviction*).
  - Metode bawaan: `get(key)`, `set(key, value, ttl?)`, `has(key)`, `remove(key)`, `clear()`, dan `size`.

```tsx
import { useCache } from '@/hooks/cache';

const { get, set, has, remove, clear, size } = useCache<UserData>({
  maxSize: 100,
  defaultTtl: 5 * 60 * 1000, // 5 menit
});

if (!has('user-123')) {
  set('user-123', fetchedUser);
}
```

---

## 🖼️ 11. Hook Pengunggah Gambar (`useImageUpload`)

File: [`src/components/molecules/ImageUpload/useImageUpload.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/ImageUpload/useImageUpload.ts)

Hook modular pengelola alur pengunggahan, pemrosesan, dan pratinjau gambar:
- **Fitur Utama**:
  - Penanganan status drag-and-drop (`isDragging`) dengan feedback visual taktil.
  - Validasi tipe MIME dan batasan ukuran berkas (`maxSizeMB`) dengan callback error komprehensif.
  - Pratinjau gambar instan (*instant preview*) dengan pembersihan memori otomatis (`URL.revokeObjectURL`) untuk mencegah memory leak.
  - Integrasi kompresi otomatis (`compress`) dan konversi format gambar (`convertTo`, misal WebP) sebelum trigger `onChange`.
  - Penanganan mode terkontrol (*controlled*) via prop `value` maupun mode mandiri (*uncontrolled*).

```tsx
import { useImageUpload } from '@/components/molecules/ImageUpload/useImageUpload';

const {
  previewUrl,
  selectedFile,
  isDragging,
  isProcessing,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
  handleRemove,
} = useImageUpload({
  compress: { quality: 0.8, maxWidth: 1920 },
  convertTo: 'webp',
  onChange: (file, url) => console.log('File terpilih:', file, url),
});
```

### Hook Drag-and-Drop Area Gambar (`useImageDragDrop`)

File: [`src/hooks/image/useImageDragDrop.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/hooks/image/useImageDragDrop.ts)

Hook modular untuk mengelola state visual dan event handling interaksi drag-and-drop (`isDragging`, `handleDragEnter`, `handleDragOver`, `handleDragLeave`, `handleDrop`) pada dropzone area berkas gambar:

```tsx
import { useImageDragDrop } from '@/hooks/image';

const { isDragging, handleDragEnter, handleDragOver, handleDragLeave, handleDrop } = useImageDragDrop(
  disabled,
  (file) => console.log('File di-drop:', file)
);
```

---

## 🎬 12. Hook Pemutar Video (`useVideoPlayer`, `useVideoClickHandler`, `useContextMenu`, `useTextInfo`)

### A. Hook Utama Pemutar Video (`useVideoPlayer`)
File: [`src/components/molecules/VideoPlayer/useVideoPlayer.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoPlayer.ts)

State machine komprehensif pengendali media HTML5 Video:
- **Fitur Utama**:
  - Kontrol pemutaran: `togglePlay()`, `skip(seconds)`, `seek(seconds, autoPlay?, silentTextInfo?)`, `setVolumeLevel(vol)`, `toggleMute()`.
  - Navigasi seek cerdas dengan notifikasi TextInfo otomatis (`silentTextInfo` untuk mematikan HUD saat seek programatik/Home/End).
  - Fullscreen & Picture-in-Picture: `toggleFullscreen()`, `togglePiP()`.
  - Pengulangan (*Looping*): `toggleLoop()`.
  - Subtitle & Kualitas: `setSubtitle(id)`, `toggleSubtitle()`, `setQuality(id)`.
  - Popover Pengaturan: `toggleSettings(tab)`, `closeSettings()`.
  - Auto-hide bilah kendali cerdas saat kursor diam (*idle timeout*) dan tetap terbuka jika menu pengaturan aktif.
  - Penanganan pintasan keyboard lengkap (`Space`, `K`, `F`, `Enter`, `M`, `L`, `C`, `P`, `I`, `S`, `ArrowLeft/Right`, `ArrowUp/Down`, `0-9`, `Home/End`, `<>`).

```tsx
import { useVideoPlayer } from '@/components/molecules/VideoPlayer/useVideoPlayer';

const {
  videoRef,
  containerRef,
  isPlaying,
  currentTime,
  duration,
  bufferedPercent,
  volume,
  isMuted,
  playbackRate,
  togglePlay,
  toggleFullscreen,
} = useVideoPlayer({ autoPlay: false, defaultVolume: 0.8 });
```

### B. Hook Gestur Klik Anti-Stutter (`useVideoClickHandler`)
File: [`src/components/molecules/VideoPlayer/useVideoClickHandler.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useVideoClickHandler.ts)

Membedakan interaksi klik tunggal (toggle play) dan klik ganda (toggle fullscreen) menggunakan timer debounce 250ms untuk mencegah efek play-pause berkedip saat pengguna melakukan double-click.

### C. Hook Menu Konteks Kustom (`useContextMenu`)
File: [`src/components/molecules/VideoPlayer/useContextMenu.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useContextMenu.ts)

Mengelola posisi koordinat tetikus (`x, y`), penyesuaian batas kontainer (*boundary checking*), serta penutupan otomatis saat klik luar atau tombol `Escape` ditekan.

### D. Hook Umpan Balik HUD (`useTextInfo`)
File: [`src/components/molecules/VideoPlayer/useTextInfo.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/components/molecules/VideoPlayer/useTextInfo.ts)

Menampilkan overlay status teks taktil di pojok kiri atas (misal volume %, lompat durasi %, pengulangan aktif/nonaktif, kecepatan putar) dengan durasi tayang teratur.

---

## 🛠️ 13. Utilitas Frontend (`src/utils/`)

### A. Utilitas Debounce (`debounce`)
File: [`src/utils/debounce/debounce.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/utils/debounce/debounce.ts)
Fungsi murni TypeScript untuk mendebounce panggilan fungsi apa pun dengan konfigurasi `leading`, `trailing`, `maxWait`, serta pembersihan memory leak timer.

### B. Utilitas Memory Cache (`MemoryCache`)
File: [`src/utils/cache/MemoryCache.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/utils/cache/MemoryCache.ts)
Kelas struktur data cache in-memory berbasis Map dengan algoritma LRU (*Least Recently Used*) dan penghapusan otomatis entri kedaluwarsa berbasis TTL (*Time To Live*).

### C. Utilitas Manipulasi & Pengunggahan Gambar (`@/utils/image`)
File: [`src/utils/image/`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/utils/image/)
- **`imageCompressor.ts`**: Kompresi gambar sisi klien berbasis HTML5 Canvas dengan opsi penyesuaian resolusi (`maxWidth`, `maxHeight`), rasio kualitas, dan kompresi adaptif hingga mencapai target ukuran spesifik (`maxSizeKB`).
- **`imageConverter.ts`**: Konversi format berkas gambar secara instan ke WebP, JPEG, PNG, atau AVIF dengan penanganan background transparan / fallback warna.
- **`imageUploader.ts`**: Utilitas pengunggahan berkas gambar ke backend API (`/storage/upload`) via `FormData` dengan pelacakan progres unggah reaktif (`onProgress`).
- **`image.helpers.ts`**: Validasi MIME type, kalkulasi ukuran file (KB/MB), pembuatan blob URL, dan ekstraksi dimensi natural gambar.

---

## 📡 14. Konsumsi Real-Time SSE (Server-Sent Events)

File: `src/App.tsx`

Frontend mengonsumsi data real-time streaming waktu dan live data dari backend NestJS (`@Sse('time')`) menggunakan API web standar `EventSource`.

- **Fitur Utama**:
  - Penanganan koneksi otomatis (`onopen`, `onmessage`, `onerror`).
  - Parsing otomatis data JSON dinamis (`live-data.json`).
  - Indikator status koneksi SSE reaktif (Live / Reconnecting).

---

## 🧪 15. Pengujian Unit Frontend (Vitest)

Frontend GamePedia v2 dilengkapi dengan **Vitest** untuk pengujian unit otomatis pada seluruh komponen atomik, sub-komponen, molekul, utilitas, kalkulasi logika, dan aksesibilitas:

```bash
# Menjalankan seluruh pengujian unit frontend
npm run test --prefix frontend
```

### Hasil Verifikasi Test Suite Aktif (39 File, 510 Tests Passed):
1. `Badge.spec.ts` (10 tests): Pengujian sub-komponen `BadgeIcon` dan `BadgeLabel`, 4 appearance visual (`filled`, `ghost`, `outline`, `tint`), varian semantik token OKLCH, radius rounded, dan Depth System (-3 s/d 3).
2. `Button.spec.ts` (19 tests): Pengujian varian warna semantik, ukuran, depth -3 s/d 3, status loading (`ButtonLoading`), dan sub-atom ikon (`ButtonIcon`).
3. `Checkbox.spec.ts` (9 tests): Pengujian sub-komponen `CheckboxIndicator` dan `CheckboxLabel`, status indeterminate, varian visual (`check`/`solid`), dan interaksi checked.
4. `Chip.spec.ts` (9 tests): Pengujian sub-komponen `ChipIcon`, `ChipLabel`, dan `ChipRemove`, status terpilih/toggle (`selected`), tombol hapus interaktif dengan efek merah, dan Depth System (-3 s/d 3).
5. `ClearButton.spec.ts` (9 tests): Pengujian tombol pembersih interaktif dengan varian visual (`default`, `subtle`, `ghost`, `danger`), transisi hover merah, kompatibilitas ARIA, dan Depth System (-3 s/d 3).
6. `Dot.spec.ts` (11 tests): Pengujian sub-atom `DotCircle`, ukuran 2xs s/d xl, animasi denyut (ping halo ripple & pulse), efek ambient neon glow, cincin pembatas kontras (`bordered`), teks label status, dan placement anchor overlay.
7. `Icon.spec.ts` (4 tests): Pengujian render ikon Iconify, varian warna semantik token tema, animasi spin & pulse, dan ukuran preset.
8. `Image.spec.ts` (19 tests): Pengujian primitif gambar, ambient blur glow, fallback graceful, shimmer skeleton loader, dan Depth System (-3 s/d 3).
9. `Input.spec.ts` (8 tests): Pengujian sub-komponen `InputLabel`, `InputHelperText`, dan `InputClearButton`, status validasi (error, success, warning), ikon start/end, dan Depth System.
10. `ProgressBar.spec.tsx` (35 tests): Pengujian mode determinate/indeterminate, kalkulasi persentase clamped, format kustom label, sub-komponen `ProgressBarTrack`, `ProgressBarFill`, `ProgressBarLabel`, varian semantik OKLCH, dan Depth System (-3 s/d 3).
11. `Radio.spec.ts` (8 tests): Pengujian sub-atom `RadioIndicator` dan `RadioLabel`, status checked/disabled, ukuran, dan Depth System.
12. `SegmentedControl.spec.tsx` (35 tests): Pengujian roving tabindex WAI-ARIA, seleksi item, keyboard navigation (panah kiri/kanan/home/end), rendering ikon, status disabled, varian semantik, dan Depth System.
13. `Slider.spec.tsx` (56 tests): Pengujian drag thumb, klik track, langkah lompat (*step*), keyboard navigation (panah/PageUp/PageDown/Home/End), sub-komponen `SliderTrack`, `SliderRange`, `SliderThumb`, `SliderMarks`, `SliderLabel`, `SliderHelperText`, serta Depth System.
14. `Spinner.spec.ts` (14 tests): Pengujian indikator loading SVG circular ring, Iconify fallback, Depth System, ketebalan & opasitas ring, sub-atom `SpinnerRing` dan `SpinnerLabel`.
15. `Switch.spec.ts` (8 tests): Pengujian sub-komponen `SwitchTrack` dan `SwitchLabel`, alur kedalaman cekung (-1 s/d -3), varian warna semantik, dan ikon knop thumb.
16. `Text.spec.ts` (9 tests): Pengujian tag HTML polimorfik (`as`), varian semantik token OKLCH, skala tipografi, perataan teks, clamp, dan truncate.
17. `Textarea.spec.ts` (9 tests): Pengujian sub-komponen `TextareaLabel` dan `TextareaFooter`, penghitung karakter (`showCharacterCount`), resize kontrol, dan auto-resize.
18. `Tooltip.spec.ts` (10 tests): Pengujian sub-komponen `TooltipBubble`, 12 penempatan arah (`placement`), Depth System visual (-3 s/d 3), delay timer, dan status trigger pemicu.
19. `Clipboard.spec.ts` (8 tests): Pengujian sub-komponen `ClipboardIcon` dan `ClipboardLabel`, feedback visual taktil saat teks disalin, durasi reset, timer cleanup, dan varian depth.
20. `ShowcasePreview.spec.ts` (17 tests): Pengujian sub-komponen `ShowcasePreviewBackground`, `ShowcasePreviewBadges`, `ShowcasePreviewInfo`, border styles, backgrounds, dan Depth System.
21. `SourceCode.spec.ts` (15 tests): Pengujian sub-komponen `SourceCodeHeader` dan `SourceCodeBody`, multi-tab switching, token highlighter sintaksis, copy-to-clipboard, dan styling terminal window.
22. `CodePreview.spec.ts` (11 tests): Pengujian sub-komponen `CodePreviewLine`, token parser sintaks VS Code Dark+, penomoran baris (*line numbers*), dan kedalaman visual.
23. `ImageUpload.spec.ts` (32 tests): Pengujian komponen `ImageUpload`, sub-komponen `ImageUploadDropzone`, `ImageUploadPreview`, `ImageUploadProgress`, `ImageUploadInfo`, `ImageUploadActions`, validasi format dan ukuran, integrasi kompresi & konversi otomatis, serta Depth System (-3 s/d 3).
24. `useImageDragDrop.spec.tsx` (7 tests): Pengujian hook drag-and-drop file gambar, state enter/over/leave/drop, dan pencegahan event default.
25. `VideoPlayer.spec.ts` (12 tests): Pengujian ekspor modul VideoPlayer, integrasi sub-komponen internal, barrel export molecules, dan rendering dasar.
26. `useVideoPlayer.spec.tsx` (4 tests): Pengujian hook utama `useVideoPlayer`, ekspor barrel internal, pemisahan lifecycle HLS / native, dan cleanup unmount.
27. `VideoPlayer.utils.spec.ts` (30 tests): Pengujian utilitas format waktu (`formatTime`), persentase progress, kalkulasi scrubbing, parsing subtitle, dan helper fungsi pemutar.
28. `useVideoClickHandler.spec.ts` (3 tests): Pengujian pemisahan klik tunggal (toggle play) dan klik ganda (toggle fullscreen) dengan timer debounce pembatalan.
29. `useContextMenu.spec.ts` (3 tests): Pengujian posisi koordinat context menu, pembatasan boundary layar, penutupan klik luar dan escape.
30. `useTextInfo.spec.ts` (4 tests): Pengujian penayangan HUD overlay notifikasi, timer auto-clear, dan payload teks.
31. `dropdown.utils.spec.ts` (5 tests): Pengujian pemfilteran opsi ComboBox (prefix vs substring), normalisasi nilai terpilih (single vs multi), dan batas tag maksimal.
32. `phoneUtils.spec.ts` (11 tests): Pengujian validasi format nomor telepon internasional, pemetaan bendera negara, dan ekstraksi digit.
33. `SearchInput.utils.spec.ts` (4 tests): Pengujian utilitas pemfilteran kata kunci pencarian reaktif dan debouncing.
34. `passwordStrength.spec.ts` (5 tests): Pengujian algoritma skor kekuatan kata sandi (panjang, huruf kapital, angka, dan karakter khusus).
35. `useDebounce.spec.tsx` (7 tests): Pengujian hook `useDebounce` dan `useDebouncedCallback`, delay timer, pemanggilan leading/trailing, flush, dan cancel.
36. `useCache.spec.tsx` (8 tests): Pengujian hook `useCache` integrasi, persistensi sesi komponen, mutasi cache get/set/clear, dan event listener reaktif.
37. `debounce.spec.ts` (9 tests): Pengujian fungsi debounce murni, pembatalan eksekusi, opsi maxWait, dan pencegahan memory leak.
38. `MemoryCache.spec.ts` (10 tests): Pengujian algoritma penggusuran LRU (*Least Recently Used*), kedaluwarsa TTL, kapasitas cache, dan metode sanitasi data.
39. `image.spec.ts` (23 tests): Pengujian utilitas kompresi lossy (`compressImage`), konversi format WebP/JPEG/PNG (`convertImage`), penyesuaian dimensi gambar (`resizeImage`), validasi MIME, dan ekstraksi metadata gambar.
