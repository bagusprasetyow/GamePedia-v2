import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getClipboardClasses,
  getIconClasses,
  depthClasses,
  resolveDepthKey,
  resolveDepthClass,
  copiedFeedbackClasses,
} from './Clipboard.styles';

describe('Clipboard Molecule Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Depth System & Styling (Clipboard.styles)', () => {
    it('harus memetakan depth -3 s/d 3 ke kelas shadow yang valid', () => {
      expect(resolveDepthKey(-3)).toBe('-3');
      expect(resolveDepthKey('sunken')).toBe('-2');
      expect(resolveDepthKey(0)).toBe('0');
      expect(resolveDepthKey('raised-sm')).toBe('1');
      expect(resolveDepthKey(2)).toBe('2');
      expect(resolveDepthKey(3)).toBe('3');

      expect(resolveDepthClass(-2)).toBe(depthClasses['-2']);
      expect(resolveDepthClass(1)).toBe(depthClasses['1']);
      expect(resolveDepthClass(0)).toBe(depthClasses['0']);
    });

    it('harus menghasilkan kelas styling varian terminal dengan efek active hijau dan teks putih', () => {
      const classes = getClipboardClasses('terminal', false, 0);

      expect(classes).toContain('bg-neutral-850');
      expect(classes).toContain('hover:bg-neutral-800');
      expect(classes).toContain('active:bg-success');
      expect(classes).toContain('active:text-white');
      expect(classes).toContain('active:border-success');
    });

    it('harus menyertakan kelas copiedFeedbackClasses saat copied bernilai true', () => {
      const classes = getClipboardClasses('terminal', true, 0);

      expect(classes).toContain(copiedFeedbackClasses);
      expect(classes).toContain('bg-success');
      expect(classes).toContain('text-white');
      expect(classes).toContain('border-success');
    });

    it('harus menghasilkan kelas ikon putih saat copied bernilai true', () => {
      expect(getIconClasses(true, 'terminal')).toBe('text-white');
      expect(getIconClasses(false, 'terminal')).toContain('group-active:text-white');
    });
  });

  describe('Sub-Components & Helpers', () => {
    it('harus mengekspor sub-komponen ClipboardIcon dan ClipboardLabel', async () => {
      const module = await import('./index');
      expect(module.ClipboardIcon).toBeDefined();
      expect(module.ClipboardLabel).toBeDefined();
    });

    it('harus merender ClipboardIcon dengan benar saat idle dan copied', async () => {
      const { ClipboardIcon } = await import('./components/ClipboardIcon');
      const idleIcon = ClipboardIcon({ copied: false, icon: 'mdi:content-copy' });
      expect(idleIcon).toBeDefined();

      const copiedIcon = ClipboardIcon({ copied: true, copiedIcon: 'mdi:check' });
      expect(copiedIcon).toBeDefined();
    });

    it('harus merender ClipboardLabel dengan benar saat idle dan copied', async () => {
      const { ClipboardLabel } = await import('./components/ClipboardLabel');
      const idleLabel = ClipboardLabel({ copied: false, label: 'Salin' });
      expect(idleLabel).toBeDefined();

      const copiedLabel = ClipboardLabel({ copied: true, copiedLabel: 'Tersalin!' });
      expect(copiedLabel).toBeDefined();
    });
  });

  describe('Module Exports', () => {
    it('harus mengekspor komponen Clipboard, sub-komponen, hook, dan styles', async () => {
      const module = await import('./index');
      expect(module.Clipboard).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.ClipboardIcon).toBeDefined();
      expect(module.ClipboardLabel).toBeDefined();
      expect(module.useClipboard).toBeDefined();
      expect(module.getClipboardClasses).toBeDefined();
      expect(module.getIconClasses).toBeDefined();
      expect(module.depthClasses).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
      expect(module.resolveDepthClass).toBeDefined();
    });
  });
});
