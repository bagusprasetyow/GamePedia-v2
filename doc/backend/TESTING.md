# 🧪 Pengujian & Quality Control Backend

Dokumen ini memuat panduan pengujian perangkat lunak, unit testing, E2E testing, dan linter pada Backend GamePedia v2.

---

## ⚡ Vitest Test Runner (`vitest.config.ts` & `vitest.config.e2e.ts`)

Backend GamePedia v2 menggunakan **Vitest 4** sebagai test runner utama pengganti Jest karena kecepatan eksekusi dan integrasi native dengan TypeScript.

### 1. Unit Testing (`src/**/*.spec.ts`)
- **Konfigurasi**: `vitest.config.ts`
- **Tujuan**: Menguji isolasi logika pada controller dan service.
- **Perintah Exec**:
  ```bash
  npm run test --prefix backend
  ```

### 2. End-to-End (E2E) Testing (`test/**/*.e2e-spec.ts`)
- **Konfigurasi**: `vitest.config.e2e.ts`
- **Tujuan**: Menguji integrasi alur HTTP request, route, dan SSE streaming secara langsung pada instance aplikasi NestJS.
- **Perintah Exec**:
  ```bash
  npm run test:e2e --prefix backend
  ```

---

## 🚀 Oxlint Linter (`.oxlintrc.json`)

**Oxlint** digunakan sebagai linter backend berperforma tinggi berbasis Rust yang mampu mengeksekusi linting puluhan kali lebih cepat daripada ESLint standar.

- **Perintah Exec**:
  ```bash
  npm run lint --prefix backend
  ```
