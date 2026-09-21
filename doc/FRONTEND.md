# 🎨 Dokumentasi Frontend GamePedia v2

Dokumen ini berisi informasi terperinci mengenai aplikasi Frontend GamePedia v2 yang dibangun menggunakan **React 19**, **Vite 8**, dan **Tailwind CSS v4**.

---

## 🛠️ Stack & Perkakas Frontend

- **React 19**: Penggunaan API UI React 19 terbaru.
- **Vite 8**: Build tool super cepat untuk pengembangan dan kompilasi modul bundle.
- **Tailwind CSS v4**: Generasi terbaru Tailwind CSS yang menggunakan konfigurasi `@import "tailwindcss";` langsung di `src/index.css` dengan integrasi plugin Vite `@tailwindcss/vite`.
- **ESLint v10 & TypeScript ESLint**: Menjamin standar kualitas kode TypeScript/JSX.

---

## 📂 Struktur Folder Frontend

```
frontend/
├── public/               # Static Assets (favicon, icons)
├── src/
│   ├── assets/          # Media Assets (images, logo, react.svg)
│   ├── App.tsx          # Main Component
│   ├── index.css        # CSS Utama (Tailwind CSS v4 imports)
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
