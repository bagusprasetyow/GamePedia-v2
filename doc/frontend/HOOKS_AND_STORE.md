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

## 🛠️ 11. Utilitas Frontend (`src/utils/`)

### A. Utilitas Debounce (`debounce`)
File: [`src/utils/debounce/debounce.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/utils/debounce/debounce.ts)
Fungsi murni TypeScript untuk mendebounce panggilan fungsi apa pun dengan konfigurasi `leading`, `trailing`, `maxWait`, serta pembersihan memory leak timer.

### B. Utilitas Memory Cache (`MemoryCache`)
File: [`src/utils/cache/MemoryCache.ts`](file:///d:/Projects/project%20GP-v2/GamePedia-v2/frontend/src/utils/cache/MemoryCache.ts)
Kelas struktur data cache in-memory berbasis Map dengan algoritma LRU (*Least Recently Used*) dan penghapusan otomatis entri kedaluwarsa berbasis TTL (*Time To Live*).

---

## 📡 12. Konsumsi Real-Time SSE (Server-Sent Events)

File: `src/App.tsx`

Frontend mengonsumsi data real-time streaming waktu dan live data dari backend NestJS (`@Sse('time')`) menggunakan API web standar `EventSource`.

- **Fitur Utama**:
  - Penanganan koneksi otomatis (`onopen`, `onmessage`, `onerror`).
  - Parsing otomatis data JSON dinamis (`live-data.json`).
  - Indikator status koneksi SSE reaktif (Live / Reconnecting).

---

## 🧪 13. Pengujian Unit Frontend (Vitest)

Frontend GamePedia v2 dilengkapi dengan **Vitest** untuk pengujian unit otomatis pada seluruh komponen atomik, sub-komponen, molekul, utilitas, kalkulasi logika, dan aksesibilitas:

```bash
# Menjalankan seluruh pengujian unit frontend
npm run test --prefix frontend
```

### Hasil Verifikasi Test Suite Aktif (28 File, 357 Tests Passed):
1. `Badge.spec.ts` (10 tests): Pengujian sub-komponen `BadgeIcon` dan `BadgeLabel`, 4 appearance visual (`filled`, `ghost`, `outline`, `tint`), varian semantik token OKLCH, radius rounded, dan Depth System (-3 s/d 3).
2. `Button.spec.ts` (19 tests): Pengujian varian warna semantik, ukuran, depth -3 s/d 3, status loading (`ButtonLoading`), dan sub-atom ikon (`ButtonIcon`).
3. `Checkbox.spec.ts` (9 tests): Pengujian sub-komponen `CheckboxIndicator` dan `CheckboxLabel`, status indeterminate, varian visual (`check`/`solid`), dan interaksi checked.
4. `Chip.spec.ts` (9 tests): Pengujian sub-komponen `ChipIcon`, `ChipLabel`, dan `ChipRemove`, status terpilih/toggle (`selected`), tombol hapus interaktif dengan efek merah, dan Depth System (-3 s/d 3).
5. `ClearButton.spec.ts` (9 tests): Pengujian tombol pembersih interaktif dengan varian visual (`default`, `subtle`, `ghost`, `danger`), transisi hover merah, kompatibilitas ARIA, dan Depth System (-3 s/d 3).
6. `Dot.spec.ts` (11 tests): Pengujian sub-atom `DotCircle`, ukuran 2xs s/d xl, animasi denyut (ping halo ripple & pulse), efek ambient neon glow, cincin pembatas kontras (`bordered`), teks label status, dan placement anchor overlay.
7. `Icon.spec.ts` (4 tests): Pengujian render ikon Iconify, varian warna semantik token tema, animasi spin & pulse, dan ukuran preset.
8. `Input.spec.ts` (8 tests): Pengujian sub-komponen `InputLabel`, `InputHelperText`, dan `InputClearButton`, status validasi (error, success, warning), ikon start/end, dan Depth System.
9. `ProgressBar.spec.tsx` (35 tests): Pengujian mode determinate/indeterminate, kalkulasi persentase clamped, format kustom label, sub-komponen `ProgressBarTrack`, `ProgressBarFill`, `ProgressBarLabel`, varian semantik OKLCH, dan Depth System (-3 s/d 3).
10. `Radio.spec.ts` (8 tests): Pengujian sub-atom `RadioIndicator` dan `RadioLabel`, status checked/disabled, ukuran, dan Depth System.
11. `SegmentedControl.spec.tsx` (35 tests): Pengujian roving tabindex WAI-ARIA, seleksi item, keyboard navigation (panah kiri/kanan/home/end), rendering ikon, status disabled, varian semantik, dan Depth System.
12. `Slider.spec.tsx` (54 tests): Pengujian drag thumb, klik track, langkah lompat (*step*), keyboard navigation (panah/PageUp/PageDown/Home/End), sub-komponen `SliderTrack`, `SliderRange`, `SliderThumb`, `SliderMarks`, `SliderLabel`, `SliderHelperText`, serta Depth System.
13. `Switch.spec.ts` (8 tests): Pengujian sub-komponen `SwitchTrack` dan `SwitchLabel`, alur kedalaman cekung (-1 s/d -3), varian warna semantik, dan ikon knop thumb.
14. `Text.spec.ts` (9 tests): Pengujian tag HTML polimorfik (`as`), varian semantik token OKLCH, skala tipografi, perataan teks, clamp, dan truncate.
15. `Textarea.spec.ts` (9 tests): Pengujian sub-komponen `TextareaLabel` dan `TextareaFooter`, penghitung karakter (`showCharacterCount`), resize kontrol, dan auto-resize.
16. `Tooltip.spec.ts` (10 tests): Pengujian sub-komponen `TooltipBubble`, 12 penempatan arah (`placement`), Depth System visual (-3 s/d 3), delay timer, dan status trigger pemicu.
17. `Clipboard.spec.ts` (8 tests): Pengujian sub-komponen `ClipboardIcon` dan `ClipboardLabel`, feedback visual taktil saat teks disalin, durasi reset, timer cleanup, dan varian depth.
18. `ShowcasePreview.spec.ts` (17 tests): Pengujian sub-komponen `ShowcasePreviewBackground`, `ShowcasePreviewBadges`, `ShowcasePreviewInfo`, border styles, backgrounds, dan Depth System.
19. `SourceCode.spec.ts` (15 tests): Pengujian sub-komponen `SourceCodeHeader` dan `SourceCodeBody`, multi-tab switching, token highlighter sintaksis, copy-to-clipboard, dan styling terminal window.
20. `CodePreview.spec.ts` (11 tests): Pengujian sub-komponen `CodePreviewLine`, token parser sintaks VS Code Dark+, penomoran baris (*line numbers*), dan kedalaman visual.
21. `dropdown.utils.spec.ts` (5 tests): Pengujian pemfilteran opsi ComboBox (prefix vs substring), normalisasi nilai terpilih (single vs multi), dan batas tag maksimal.
22. `phoneUtils.spec.ts` (11 tests): Pengujian validasi format nomor telepon internasional, pemetaan bendera negara, dan ekstraksi digit.
23. `SearchInput.utils.spec.ts` (4 tests): Pengujian utilitas pemfilteran kata kunci pencarian reaktif dan debouncing.
24. `passwordStrength.spec.ts` (5 tests): Pengujian algoritma skor kekuatan kata sandi (panjang, huruf kapital, angka, dan karakter khusus).
25. `useDebounce.spec.tsx` (7 tests): Pengujian hook `useDebounce` dan `useDebouncedCallback`, delay timer, pemanggilan leading/trailing, flush, dan cancel.
26. `useCache.spec.tsx` (8 tests): Pengujian hook `useCache` integrasi, persistensi sesi komponen, mutasi cache get/set/clear, dan event listener reaktif.
27. `debounce.spec.ts` (9 tests): Pengujian fungsi debounce murni, pembatalan eksekusi, opsi maxWait, dan pencegahan memory leak.
28. `MemoryCache.spec.ts` (10 tests): Pengujian algoritma penggusuran LRU (*Least Recently Used*), kedaluwarsa TTL, kapasitas cache, dan metode sanitasi data.
