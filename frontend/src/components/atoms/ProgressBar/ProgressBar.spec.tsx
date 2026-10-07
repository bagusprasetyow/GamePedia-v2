import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ProgressBar } from './ProgressBar';
import {
  sizeStyles,
  colorStyles,
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
} from './ProgressBar.styles';
import {
  clampProgressValue,
  getProgressPercentage,
  normalizeProgressValue,
  formatProgressValue,
} from './ProgressBar.utils';
import type { ProgressBarSize, ProgressBarColor } from './ProgressBar.types';

describe('ProgressBar Atom - Unit Tests', () => {
  // ─────────────────────────────────────────────────────────────
  // 1. PROGRESSBAR UTILITIES
  // ─────────────────────────────────────────────────────────────
  describe('ProgressBar.utils', () => {
    describe('clampProgressValue', () => {
      it('harus membatasi nilai dalam rentang min dan max', () => {
        expect(clampProgressValue(50, 0, 100)).toBe(50);
        expect(clampProgressValue(-10, 0, 100)).toBe(0);
        expect(clampProgressValue(150, 0, 100)).toBe(100);
      });

      it('harus menukar batas jika min > max', () => {
        expect(clampProgressValue(50, 100, 0)).toBe(50);
        expect(clampProgressValue(-10, 100, 0)).toBe(0);
        expect(clampProgressValue(120, 100, 0)).toBe(100);
      });

      it('harus menangani nilai non-finite (NaN, Infinity) secara aman', () => {
        expect(clampProgressValue(NaN, 0, 100)).toBe(0);
        expect(clampProgressValue(Infinity, 0, 100)).toBe(100);
        expect(clampProgressValue(-Infinity, 0, 100)).toBe(0);
      });
    });

    describe('getProgressPercentage', () => {
      it('harus menghitung persentase dasar dengan benar', () => {
        expect(getProgressPercentage(50, 100)).toBe(50);
        expect(getProgressPercentage(25, 50)).toBe(50);
        expect(getProgressPercentage(75, 100)).toBe(75);
      });

      it('harus membatasi persentase ke batas 0% s/d 100%', () => {
        expect(getProgressPercentage(-20, 100)).toBe(0);
        expect(getProgressPercentage(150, 100)).toBe(100);
      });

      it('harus mengembalikan 0 jika max <= 0 atau non-finite', () => {
        expect(getProgressPercentage(50, 0)).toBe(0);
        expect(getProgressPercentage(50, -10)).toBe(0);
        expect(getProgressPercentage(50, NaN)).toBe(0);
        expect(getProgressPercentage(50, Infinity)).toBe(0);
      });

      it('harus membulatkan persentase desimal tanpa precision floating noise', () => {
        const pct = getProgressPercentage(1, 3);
        expect(pct).toBe(33.3333);
      });
    });

    describe('normalizeProgressValue', () => {
      it('harus menormalkan nilai bawaan jika undefined', () => {
        const norm = normalizeProgressValue();
        expect(norm).toEqual({ value: 0, max: 100, percentage: 0 });
      });

      it('harus mengembalikan nilai yang valid untuk input custom', () => {
        const norm = normalizeProgressValue(30, 60);
        expect(norm).toEqual({ value: 30, max: 60, percentage: 50 });
      });

      it('harus melakukan fallback max ke 100 jika max <= 0', () => {
        const norm = normalizeProgressValue(25, 0);
        expect(norm.max).toBe(100);
        expect(norm.value).toBe(25);
        expect(norm.percentage).toBe(25);
      });
    });

    describe('formatProgressValue', () => {
      it('harus memformat nilai persentase bulat secara bawaan', () => {
        expect(formatProgressValue(50, 100, 50)).toBe('50%');
        expect(formatProgressValue(75, 100, 75)).toBe('75%');
        expect(formatProgressValue(1, 3, 33.3333)).toBe('33%');
      });

      it('harus menggunakan formatFn kustom jika disediakan', () => {
        const formatted = formatProgressValue(750, 1000, 75, (val, max) => `${val}/${max} MB`);
        expect(formatted).toBe('750/1000 MB');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. STYLES, DEPTH SYSTEM & COLOR TOKENS
  // ─────────────────────────────────────────────────────────────
  describe('ProgressBar.styles', () => {
    describe('resolveDepthKey', () => {
      it('harus memetakan skala numerik valid (-3 s/d 3) ke string key', () => {
        expect(resolveDepthKey(-3)).toBe('-3');
        expect(resolveDepthKey(-2)).toBe('-2');
        expect(resolveDepthKey(-1)).toBe('-1');
        expect(resolveDepthKey(0)).toBe('0');
        expect(resolveDepthKey(1)).toBe('1');
        expect(resolveDepthKey(2)).toBe('2');
        expect(resolveDepthKey(3)).toBe('3');
      });

      it('harus memetakan alias nama depth ke level yang sesuai', () => {
        expect(resolveDepthKey('sunken')).toBe('-2');
        expect(resolveDepthKey('flat')).toBe('0');
        expect(resolveDepthKey('raised-sm')).toBe('1');
        expect(resolveDepthKey('raised-md')).toBe('2');
        expect(resolveDepthKey('raised-lg')).toBe('3');
      });

      it('harus fallback ke "-1" untuk undefined atau nilai tidak dikenal', () => {
        expect(resolveDepthKey(undefined)).toBe('-1');
        // @ts-expect-error - testing invalid runtime input
        expect(resolveDepthKey('invalid-depth')).toBe('-1');
      });
    });

    describe('depthClasses & namedDepthMap', () => {
      it('harus memiliki mapping shadow untuk Depth System skala -3 s/d 3', () => {
        expect(depthClasses['-3']).toBe('shadow-n3');
        expect(depthClasses['-2']).toBe('shadow-n2');
        expect(depthClasses['-1']).toBe('shadow-n1');
        expect(depthClasses['0']).toBe('shadow-0');
        expect(depthClasses['1']).toBe('shadow-1');
        expect(depthClasses['2']).toBe('shadow-2');
        expect(depthClasses['3']).toBe('shadow-3');
      });

      it('harus memiliki namedDepthMap terdefinisi lengkap', () => {
        expect(namedDepthMap).toEqual({
          sunken: '-2',
          flat: '0',
          'raised-sm': '1',
          'raised-md': '2',
          'raised-lg': '3',
        });
      });
    });

    describe('sizeStyles', () => {
      const allSizes: ProgressBarSize[] = ['sm', 'md', 'lg'];

      it('harus mendefinisikan tinggi trek dan ukuran tipografi untuk setiap ukuran', () => {
        allSizes.forEach((size) => {
          expect(sizeStyles[size]).toBeDefined();
          expect(sizeStyles[size].trackHeight).toContain('h-');
          expect(sizeStyles[size].labelText).toContain('text-');
          expect(sizeStyles[size].valueText).toContain('text-');
        });
        expect(sizeStyles.sm.trackHeight).toBe('h-1.5');
        expect(sizeStyles.md.trackHeight).toBe('h-2.5');
        expect(sizeStyles.lg.trackHeight).toBe('h-3.5');
      });
    });

    describe('colorStyles', () => {
      const allColors: ProgressBarColor[] = [
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
      ];

      it('harus mendefinisikan kelas warna semantik yang valid untuk semua tema', () => {
        allColors.forEach((color) => {
          expect(colorStyles[color]).toBeDefined();
          expect(colorStyles[color]).toContain('bg-');
        });
        expect(colorStyles.primary).toBe('bg-primary');
        expect(colorStyles.secondary).toBe('bg-secondary');
        expect(colorStyles.accent).toBe('bg-accent-600');
        expect(colorStyles.success).toBe('bg-success');
        expect(colorStyles.warning).toBe('bg-warning');
        expect(colorStyles.error).toBe('bg-destructive');
        expect(colorStyles.info).toBe('bg-info-600');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. COMPONENT RENDERING & A11Y BEHAVIOR
  // ─────────────────────────────────────────────────────────────
  describe('ProgressBar Component Rendering & A11y', () => {
    it('harus merender default ProgressBar dengan benar (value=0, max=100, role="progressbar")', () => {
      const html = renderToString(<ProgressBar />);
      expect(html).toContain('role="progressbar"');
      expect(html).toContain('aria-valuemin="0"');
      expect(html).toContain('aria-valuemax="100"');
      expect(html).toContain('aria-valuenow="0"');
      expect(html).toContain('shadow-n1'); // depth bawaan alur cekung
      expect(html).toContain('width:0%');
    });

    it('harus merender nilai kustom dan batas maksimum yang sesuai', () => {
      const html = renderToString(<ProgressBar value={45} max={200} />);
      expect(html).toContain('aria-valuenow="45"');
      expect(html).toContain('aria-valuemax="200"');
      expect(html).toContain('width:22.5%');
    });

    it('harus membatasi nilai yang melebihi batas (clamping)', () => {
      const htmlOver = renderToString(<ProgressBar value={150} max={100} />);
      expect(htmlOver).toContain('aria-valuenow="100"');
      expect(htmlOver).toContain('width:100%');

      const htmlUnder = renderToString(<ProgressBar value={-20} max={100} />);
      expect(htmlUnder).toContain('aria-valuenow="0"');
      expect(htmlUnder).toContain('width:0%');
    });

    it('harus mendukung mode indeterminate tanpa aria-valuenow dan menyembunyikan angka palsu', () => {
      const html = renderToString(<ProgressBar indeterminate value={50} showValue />);
      expect(html).toContain('role="progressbar"');
      expect(html).toContain('aria-busy="true"');
      expect(html).not.toContain('aria-valuenow');
      expect(html).not.toContain('50%'); // Tidak merender nilai palsu
      expect(html).toContain('data-testid="progressbar-fill-indeterminate"');
      expect(html).toContain('animate-[progress-indeterminate_1.8s_cubic-bezier(0.4,0,0.2,1)_infinite]');
      expect(html).toContain('motion-reduce:animate-none');
    });

    it('harus merender label teks dan menghubungkannya dengan aria-labelledby', () => {
      const html = renderToString(<ProgressBar label="Mengunduh Patch Game" id="patch-prog" />);
      expect(html).toContain('Mengunduh Patch Game');
      expect(html).toContain('id="patch-prog-label"');
      expect(html).toContain('aria-labelledby="patch-prog-label"');
    });

    it('harus mendukung aria-label langsung jika tidak ada visible label', () => {
      const html = renderToString(<ProgressBar aria-label="Loading progress" />);
      expect(html).toContain('aria-label="Loading progress"');
    });

    it('harus merender description dan menghubungkannya dengan aria-describedby', () => {
      const html = renderToString(
        <ProgressBar
          id="install-prog"
          description="Memasang file aset 2.4 GB ke penyimpanan..."
        />
      );
      expect(html).toContain('Memasang file aset 2.4 GB ke penyimpanan...');
      expect(html).toContain('id="install-prog-desc"');
      expect(html).toContain('aria-describedby="install-prog-desc"');
    });

    it('harus menampilkan nilai teks ketika showValue=true', () => {
      const html = renderToString(<ProgressBar value={75} showValue />);
      expect(html).toContain('75%');
    });

    it('harus mendukung formatValue kustom', () => {
      const html = renderToString(
        <ProgressBar
          value={750}
          max={1000}
          showValue
          formatValue={(val, max) => `${val}/${max} MB`}
        />
      );
      expect(html).toContain('750/1000 MB');
    });

    it('harus menerapkan kelas warna semantik yang dipilih', () => {
      const htmlSuccess = renderToString(<ProgressBar color="success" />);
      expect(htmlSuccess).toContain('bg-success');

      const htmlError = renderToString(<ProgressBar color="error" />);
      expect(htmlError).toContain('bg-destructive');

      const htmlWarning = renderToString(<ProgressBar color="warning" />);
      expect(htmlWarning).toContain('bg-warning');

      const htmlInfo = renderToString(<ProgressBar color="info" />);
      expect(htmlInfo).toContain('bg-info-600');

      const htmlAccent = renderToString(<ProgressBar color="accent" />);
      expect(htmlAccent).toContain('bg-accent-600');
    });

    it('harus menerapkan kelas ukuran tinggi track yang dipilih', () => {
      const htmlSm = renderToString(<ProgressBar size="sm" />);
      expect(htmlSm).toContain('h-1.5');

      const htmlMd = renderToString(<ProgressBar size="md" />);
      expect(htmlMd).toContain('h-2.5');

      const htmlLg = renderToString(<ProgressBar size="lg" />);
      expect(htmlLg).toContain('h-3.5');
    });

    it('harus menerapkan kedalaman visual Depth System', () => {
      const htmlSunken = renderToString(<ProgressBar depth="sunken" />);
      expect(htmlSunken).toContain('shadow-n2');

      const htmlFlat = renderToString(<ProgressBar depth={0} />);
      expect(htmlFlat).toContain('shadow-0');

      const htmlRaised = renderToString(<ProgressBar depth={2} />);
      expect(htmlRaised).toContain('shadow-2');
    });

    it('harus merender status disabled visual', () => {
      const htmlDisabled = renderToString(<ProgressBar disabled />);
      expect(htmlDisabled).toContain('opacity-60');
      expect(htmlDisabled).toContain('cursor-not-allowed');
    });

    it('harus mendukung pengaturan lebar (width dan fullWidth) secara efisien', () => {
      const htmlDefault = renderToString(<ProgressBar />);
      expect(htmlDefault).toContain('w-full');

      const htmlAuto = renderToString(<ProgressBar fullWidth={false} />);
      expect(htmlAuto).toContain('w-auto');

      const htmlCustom = renderToString(<ProgressBar width="320px" />);
      expect(htmlCustom).toContain('width:320px');
    });

    it('harus meneruskan className dan wrapperClassName kustom', () => {
      const html = renderToString(
        <ProgressBar
          wrapperClassName="custom-wrapper-class"
          className="custom-track-class"
        />
      );
      expect(html).toContain('custom-wrapper-class');
      expect(html).toContain('custom-track-class');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. BARREL EXPORT & INDEX INTEGRITY
  // ─────────────────────────────────────────────────────────────
  describe('Index Barrel Export', () => {
    it('harus mengekspor komponen utama, sub-komponen, utilitas, dan styles', async () => {
      const barrel = await import('./index');
      expect(barrel.ProgressBar).toBeDefined();
      expect(barrel.default).toBeDefined();
      expect(barrel.ProgressBarTrack).toBeDefined();
      expect(barrel.ProgressBarFill).toBeDefined();
      expect(barrel.ProgressBarLabel).toBeDefined();
      expect(barrel.clampProgressValue).toBeDefined();
      expect(barrel.getProgressPercentage).toBeDefined();
      expect(barrel.normalizeProgressValue).toBeDefined();
      expect(barrel.formatProgressValue).toBeDefined();
      expect(barrel.sizeStyles).toBeDefined();
      expect(barrel.colorStyles).toBeDefined();
      expect(barrel.depthClasses).toBeDefined();
      expect(barrel.resolveDepthKey).toBeDefined();
    });
  });
});
