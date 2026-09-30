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

## 📡 3. Konsumsi Real-Time SSE (Server-Sent Events)

File: `src/App.tsx`

Frontend mengonsumsi data real-time streaming waktu dan live data dari backend NestJS (`@Sse('time')`) menggunakan API web standar `EventSource`.

- **Fitur Utama**:
  - Penanganan koneksi otomatis (`onopen`, `onmessage`, `onerror`).
  - Parsing otomatis data JSON dinamis (`live-data.json`).
  - Indikator status koneksi SSE reaktif (Live / Reconnecting).
