# 🎨 Dokumentasi Frontend GamePedia v2

Dokumen ini berisi informasi terperinci mengenai aplikasi Frontend GamePedia v2 yang dibangun menggunakan **React 19**, **Vite 8**, dan **Tailwind CSS v4**.

---

## 🛠️ Stack & Perkakas Frontend

- **React 19**: Penggunaan API UI React 19 terbaru.
- **Vite 8**: Build tool super cepat untuk pengembangan dan kompilasi modul bundle dengan dukungan Path Alias (`@/*`).
- **Tailwind CSS v4**: Generasi terbaru Tailwind CSS yang menggunakan `@import "tailwindcss";` dan `@theme` custom token warna OKLCH di `src/index.css` dengan plugin Vite `@tailwindcss/vite`.
- **Utility Styling (`clsx` + `tailwind-merge`)**: Helper `cn()` di `src/lib/utils.ts` & `src/utils/` untuk komposisi class Tailwind yang bersih dan terstruktur (Tailwind Class Organization Standard).
- **Iconify (`@iconify/react`)**: Komponen ikon universal untuk antarmuka pengguna yang kaya dan konsisten.
- **Server-Sent Events (SSE)**: Konsumsi stream real-time waktu server & live JSON data menggunakan API standar `EventSource`.
- **ESLint v10 & TypeScript ESLint**: Menjamin standar kualitas kode TypeScript/JSX.

---

## 📂 Struktur Folder Frontend

```
frontend/
├── public/               # Static Assets (favicon, icons)
├── src/
│   ├── assets/          # Media Assets (images, logo, react.svg)
│   ├── lib/             # Utility Libraries & Class Merger (cn)
│   ├── utils/           # Helper Utilities
│   ├── App.tsx          # Main Component (Class Organization Standard)
│   ├── index.css        # CSS Utama (Tailwind CSS v4 @theme imports & OKLCH palette)
│   ├── main.tsx         # Entry Point Aplikasi React
│   └── vite-env.d.ts    # Types Declaration untuk Vite
├── eslint.config.js      # Konfigurasi Flat ESLint
├── index.html            # HTML Template Utama
├── package.json          # Dependencies & Scripts Frontend
├── tsconfig.app.json     # TypeScript Config Aplikasi
├── tsconfig.node.json    # TypeScript Config Vite/Node
└── vite.config.ts        # Konfigurasi Build Vite & Plugin Tailwind
```

---

## ⚡ Perintah Penting (Commands)

Semua perintah di bawah ini dapat dijalankan dari folder root atau langsung di direktori `frontend/`:

```bash
# Menjalankan Development Server Frontend (Vite)
npm run dev --prefix frontend

# Memeriksa Type Safety & Melakukan Production Build
npm run build --prefix frontend

# Jalankan Linting Kode Frontend
npm run lint --prefix frontend

# Preview Hasil Build Production
npm run preview --prefix frontend
```
