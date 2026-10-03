# 🎨 Pusat Dokumentasi Frontend GamePedia v2

Selamat datang di pusat dokumentasi modul **Frontend GamePedia v2**! Modul ini dibangun menggunakan **React 19**, **Vite 8**, dan **Tailwind CSS v4** dengan pendekatan metodologi **Atomic Design**.

---

## 🗂️ Navigasi Sub-Dokumentasi Frontend

Silakan klik tautan di bawah ini untuk mempelajari komponen, styling, atau hooks secara lebih terperinci:

| Dokumen | Deskripsi |
| :--- | :--- |
| 🧩 [**Katalog Komponen UI (COMPONENTS.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/COMPONENTS.md) | Dokumentasi lengkap komponen **Atoms** & **Molecules** berbasis Atomic Design, props, tipe data, serta contoh penggunaan. |
| 🎨 [**Panduan Styling & Depth System (STYLING.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/STYLING.md) | Penjelasan skema warna OKLCH, Tailwind CSS v4 `@theme`, Depth System (-3 s/d 3), utility `cn()`, dan konvensi penamaan class. |
| 🪝 [**Custom Hooks & Utilities (HOOKS_AND_STORE.md)**](file:///d:/Projects/project%20GP-v2/GamePedia-v2/doc/frontend/HOOKS_AND_STORE.md) | Panduan custom hooks React (`useTheme`, `usePhoneInput`), manajemen tema global, dan pengolahan data SSE real-time. |

---

## 📂 Struktur Folder `frontend/src/`

```
frontend/src/
├── assets/                  # Media Assets (images, SVG)
├── components/              # Komponen UI (Atomic Design)
│   ├── atoms/               # Komponen Atomik dasar (Text, Icon, Button, Switch, Input, Textarea, Checkbox, Radio, Tooltip, Dot)
│   └── molecules/           # Komponen Molekul gabungan (CheckboxGroup, RadioGroup, ThemeToggle, Inputs, Dropdown, SourceCode, Clipboard, ShowcasePreview)
├── hooks/                   # Custom React Hooks (useTheme, usePhoneInput, useDropdown, useTooltip, useCodeInput, useClipboard, useSourceCode, useCodePreview)
├── lib/                     # Library utilities (cn - clsx & tailwind-merge)
├── utils/                   # Helper utilities
├── App.tsx                  # Root Entry Component
├── index.css                # Style Utama (OKLCH palette & Tailwind v4 @theme)
└── main.tsx                 # Entry Point React
```

---

## ⚡ Perintah Utama Frontend

```bash
# Menjalankan Vite Development Server
npm run dev --prefix frontend

# Type-check & Production Build
npm run build --prefix frontend

# Jalankan ESLint Linter
npm run lint --prefix frontend

# Jalankan Unit Testing Otomatis (Vitest)
npm run test --prefix frontend
```
