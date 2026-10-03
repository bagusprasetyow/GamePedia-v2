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

## 📡 6. Konsumsi Real-Time SSE (Server-Sent Events)

File: `src/App.tsx`

Frontend mengonsumsi data real-time streaming waktu dan live data dari backend NestJS (`@Sse('time')`) menggunakan API web standar `EventSource`.

- **Fitur Utama**:
  - Penanganan koneksi otomatis (`onopen`, `onmessage`, `onerror`).
  - Parsing otomatis data JSON dinamis (`live-data.json`).
  - Indikator status koneksi SSE reaktif (Live / Reconnecting).

---

## 🧪 7. Pengujian Unit Frontend (Vitest)

Frontend GamePedia v2 dilengkapi dengan **Vitest** untuk pengujian unit otomatis pada fungsi utilitas, kalkulasi logika, dekomposisi komponen, dan aksesibilitas:

```bash
# Menjalankan seluruh pengujian unit frontend
npm run test --prefix frontend
```

### Daftar Test Suite Aktif:
- `phoneUtils.spec.ts`: Validasi format nomor telepon internasional, pemetaan bendera negara, dan ekstraksi digit.
- `dropdown.utils.spec.ts`: Pemfilteran opsi ComboBox (prefix vs substring), normalisasi nilai terpilih (single vs multi), dan penanganan batas tag.
- `SearchInput.utils.spec.ts`: Utilitas filter pencarian dan debouncing.
- `passwordStrength.spec.ts`: Perhitungan skor kekuatan sandi (Panjang, Huruf Besar, Angka, Karakter Khusus).
- `Tooltip.spec.ts`: Pengujian logika penempatan placement, visual depth, dan status trigger.
- `Dot.spec.ts`: Pengujian varian warna semantik, ukuran 2xs s/d xl, animasi denyut (ping/pulse), efek glow, dan bordered overlay.
