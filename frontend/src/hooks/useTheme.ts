import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'gamepedia_theme_preference';

/**
 * Mendapatkan preferensi tema sistem operasi (OS).
 */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Mendapatkan tema saat ini dari localStorage.
 */
export function getGlobalTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      return saved;
    }
  } catch {
    // Fallback aman jika localStorage tidak dapat diakses (e.g. mode incognito ketat)
  }
  return 'system';
}

/**
 * Menentukan tema aktif akhir ('light' atau 'dark').
 */
export function getResolvedTheme(theme: Theme = getGlobalTheme()): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

/**
 * Menerapkan tema aktif ke documentElement (<html class="dark"> dan data-theme).
 */
export function applyThemeToDOM(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (resolved === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
}

// ─────────────────────────────────────────────────────────────
// Event Listener & Reactive Store untuk Global State
// ─────────────────────────────────────────────────────────────
type ThemeListener = () => void;
const listeners = new Set<ThemeListener>();

function notifyThemeChange(): void {
  listeners.forEach((listener) => listener());
}

/**
 * Mengubah tema secara global dari mana saja (dalam atau luar React).
 */
export function setGlobalTheme(newTheme: Theme): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  } catch {
    // Abaikan jika penulisan ke localStorage gagal (e.g. storage quota exceeded)
  }
  const resolved = getResolvedTheme(newTheme);
  applyThemeToDOM(resolved);
  notifyThemeChange();
}

/**
 * Melakukan toggle tema global secara cepat antara 'light' dan 'dark'.
 */
export function toggleGlobalTheme(): ResolvedTheme {
  const current = getGlobalTheme();
  const currentResolved = getResolvedTheme(current);
  const nextResolved: ResolvedTheme = currentResolved === 'dark' ? 'light' : 'dark';

  setGlobalTheme(nextResolved);
  return nextResolved;
}

// Inisialisasi DOM saat script pertama kali dimuat di browser
if (typeof window !== 'undefined') {
  const initialTheme = getGlobalTheme();
  applyThemeToDOM(getResolvedTheme(initialTheme));

  // Pantau perubahan mode tema sistem operasi
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getGlobalTheme() === 'system') {
      applyThemeToDOM(getSystemTheme());
      notifyThemeChange();
    }
  });

  // Pantau perubahan tema dari tab/window lain
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_STORAGE_KEY) {
      applyThemeToDOM(getResolvedTheme(getGlobalTheme()));
      notifyThemeChange();
    }
  });
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Theme {
  return getGlobalTheme();
}

function getServerSnapshot(): Theme {
  return 'dark';
}

/**
 * Hook React untuk membaca dan mengontrol status tema secara reaktif di seluruh komponen.
 * 
 * @returns {Object} { theme, resolvedTheme, isDark, setTheme, toggleTheme }
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const resolvedTheme = getResolvedTheme(theme);
  const isDark = resolvedTheme === 'dark';

  return {
    theme,
    resolvedTheme,
    isDark,
    setTheme: setGlobalTheme,
    toggleTheme: toggleGlobalTheme,
  };
}

export default useTheme;
