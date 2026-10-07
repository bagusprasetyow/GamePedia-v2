import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Slider } from './Slider';
import {
  sizeStyles,
  colorStyles,
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
} from './Slider.styles';
import {
  getPrecision,
  roundToPrecision,
  normalizeRange,
  clampSliderValue,
  snapSliderValue,
  valueToPercentage,
  percentageToValue,
  getNextValue,
  getPreviousValue,
  getPageUpValue,
  getPageDownValue,
  getPointerValue,
} from './Slider.utils';
import type { SliderSize, SliderColor } from './Slider.types';

describe('Slider Atom - Unit Tests', () => {
  // ─────────────────────────────────────────────────────────────
  // 1. SLIDER UTILITIES
  // ─────────────────────────────────────────────────────────────
  describe('Slider.utils', () => {
    describe('getPrecision', () => {
      it('harus menghitung jumlah digit desimal dengan akurat', () => {
        expect(getPrecision(1)).toBe(0);
        expect(getPrecision(100)).toBe(0);
        expect(getPrecision(0.1)).toBe(1);
        expect(getPrecision(0.25)).toBe(2);
        expect(getPrecision(0.005)).toBe(3);
        expect(getPrecision(1e-4)).toBe(4);
        expect(getPrecision(NaN)).toBe(0);
        expect(getPrecision(Infinity)).toBe(0);
      });
    });

    describe('roundToPrecision', () => {
      it('harus membulatkan angka ke presisi desimal tanpa floating point noise', () => {
        expect(roundToPrecision(0.1 + 0.2, 1)).toBe(0.3);
        expect(roundToPrecision(1.23456, 2)).toBe(1.23);
        expect(roundToPrecision(1.23556, 2)).toBe(1.24);
        expect(roundToPrecision(NaN, 2)).toBe(0);
      });
    });

    describe('normalizeRange', () => {
      it('harus menormalkan batas range standar', () => {
        const norm = normalizeRange(0, 100, 1);
        expect(norm).toEqual({ min: 0, max: 100, step: 1 });
      });

      it('harus menukar posisi jika min > max', () => {
        const norm = normalizeRange(100, 0, 5);
        expect(norm).toEqual({ min: 0, max: 100, step: 5 });
      });

      it('harus mengganti step <= 0 atau invalid dengan default yang aman', () => {
        expect(normalizeRange(0, 100, 0).step).toBe(1);
        expect(normalizeRange(0, 100, -5).step).toBe(1);
        expect(normalizeRange(0, 100, NaN).step).toBe(1);
      });

      it('harus membatasi step jika step lebih besar dari range', () => {
        const norm = normalizeRange(0, 10, 50);
        expect(norm.step).toBe(10);
      });
    });

    describe('clampSliderValue', () => {
      it('harus mempertahankan nilai dalam batas range', () => {
        expect(clampSliderValue(50, 0, 100)).toBe(50);
        expect(clampSliderValue(0, 0, 100)).toBe(0);
        expect(clampSliderValue(100, 0, 100)).toBe(100);
      });

      it('harus membatasi nilai di bawah batas min', () => {
        expect(clampSliderValue(-20, 0, 100)).toBe(0);
      });

      it('harus membatasi nilai di atas batas max', () => {
        expect(clampSliderValue(150, 0, 100)).toBe(100);
      });

      it('harus menangani nilai negatif dan batas terbalik', () => {
        expect(clampSliderValue(-30, -50, -10)).toBe(-30);
        expect(clampSliderValue(-70, -50, -10)).toBe(-50);
        expect(clampSliderValue(5, -50, -10)).toBe(-10);
        expect(clampSliderValue(NaN, 0, 100)).toBe(0);
      });
    });

    describe('snapSliderValue', () => {
      it('harus men-snap nilai ke kelipatan step integer terdekat', () => {
        expect(snapSliderValue(23, 0, 100, 10)).toBe(20);
        expect(snapSliderValue(27, 0, 100, 10)).toBe(30);
        expect(snapSliderValue(25, 0, 100, 10)).toBe(30);
      });

      it('harus men-snap nilai dengan step desimal secara aman tanpa floating artifact', () => {
        expect(snapSliderValue(0.23, 0, 1, 0.1)).toBe(0.2);
        expect(snapSliderValue(0.27, 0, 1, 0.1)).toBe(0.3);
        expect(snapSliderValue(0.055, 0, 1, 0.05)).toBe(0.05);
        expect(snapSliderValue(0.08, 0, 1, 0.05)).toBe(0.1);
      });

      it('harus tetap patuh pada clamping min dan max', () => {
        expect(snapSliderValue(-10, 0, 100, 5)).toBe(0);
        expect(snapSliderValue(115, 0, 100, 5)).toBe(100);
      });
    });

    describe('valueToPercentage', () => {
      it('harus mengonversi nilai menjadi persentase normal', () => {
        expect(valueToPercentage(0, 0, 100)).toBe(0);
        expect(valueToPercentage(50, 0, 100)).toBe(50);
        expect(valueToPercentage(100, 0, 100)).toBe(100);
        expect(valueToPercentage(25, 0, 50)).toBe(50);
      });

      it('harus mengonversi nilai dengan arah reverse', () => {
        expect(valueToPercentage(0, 0, 100, 'reverse')).toBe(100);
        expect(valueToPercentage(50, 0, 100, 'reverse')).toBe(50);
        expect(valueToPercentage(100, 0, 100, 'reverse')).toBe(0);
        expect(valueToPercentage(25, 0, 100, 'reverse')).toBe(75);
      });

      it('harus mengembalikan 0 jika min === max', () => {
        expect(valueToPercentage(50, 50, 50)).toBe(0);
      });
    });

    describe('percentageToValue', () => {
      it('harus mengonversi persentase menjadi nilai snap', () => {
        expect(percentageToValue(0, 0, 100, 1)).toBe(0);
        expect(percentageToValue(50, 0, 100, 1)).toBe(50);
        expect(percentageToValue(100, 0, 100, 1)).toBe(100);
      });

      it('harus mengonversi persentase dengan arah reverse', () => {
        expect(percentageToValue(0, 0, 100, 1, 'reverse')).toBe(100);
        expect(percentageToValue(100, 0, 100, 1, 'reverse')).toBe(0);
        expect(percentageToValue(25, 0, 100, 1, 'reverse')).toBe(75);
      });
    });

    describe('getNextValue & getPreviousValue', () => {
      it('harus menambah atau mengurangi tepat 1 step', () => {
        expect(getNextValue(10, 5, 0, 100)).toBe(15);
        expect(getPreviousValue(10, 5, 0, 100)).toBe(5);
      });

      it('harus tidak melompati batas min atau max', () => {
        expect(getNextValue(100, 5, 0, 100)).toBe(100);
        expect(getPreviousValue(0, 5, 0, 100)).toBe(0);
      });
    });

    describe('getPageUpValue & getPageDownValue', () => {
      it('harus melompat dengan page factor', () => {
        expect(getPageUpValue(20, 1, 0, 100, 10)).toBe(30);
        expect(getPageDownValue(50, 1, 0, 100, 10)).toBe(40);
      });

      it('harus tidak melebihi batas min atau max', () => {
        expect(getPageUpValue(95, 1, 0, 100, 10)).toBe(100);
        expect(getPageDownValue(5, 1, 0, 100, 10)).toBe(0);
      });
    });

    describe('getPointerValue', () => {
      const mockRect: DOMRect = {
        left: 100,
        right: 300,
        top: 200,
        bottom: 400,
        width: 200,
        height: 200,
        x: 100,
        y: 200,
        toJSON: () => ({}),
      };

      it('harus menghitung posisi pointer horizontal secara normal', () => {
        // Pointer tepat di tengah (clientX = 200 -> (200 - 100) / 200 = 50%)
        const val = getPointerValue({
          clientX: 200,
          clientY: 300,
          rect: mockRect,
          min: 0,
          max: 100,
          step: 1,
          orientation: 'horizontal',
          direction: 'normal',
        });
        expect(val).toBe(50);
      });

      it('harus menghitung posisi pointer horizontal reverse', () => {
        // clientX = 150 -> 25% dari kiri -> reverse jadi 75%
        const val = getPointerValue({
          clientX: 150,
          clientY: 300,
          rect: mockRect,
          min: 0,
          max: 100,
          step: 1,
          orientation: 'horizontal',
          direction: 'reverse',
        });
        expect(val).toBe(75);
      });

      it('harus menghitung posisi pointer vertikal normal (bawah = min, atas = max)', () => {
        // clientY = 400 (di dasar) -> 0%
        const valAtBottom = getPointerValue({
          clientX: 200,
          clientY: 400,
          rect: mockRect,
          min: 0,
          max: 100,
          step: 1,
          orientation: 'vertical',
          direction: 'normal',
        });
        expect(valAtBottom).toBe(0);

        // clientY = 200 (di puncak) -> 100%
        const valAtTop = getPointerValue({
          clientX: 200,
          clientY: 200,
          rect: mockRect,
          min: 0,
          max: 100,
          step: 1,
          orientation: 'vertical',
          direction: 'normal',
        });
        expect(valAtTop).toBe(100);
      });

      it('harus membatasi pointer di luar batas trek (clamping)', () => {
        const valFarLeft = getPointerValue({
          clientX: 50,
          clientY: 300,
          rect: mockRect,
          min: 0,
          max: 100,
          step: 1,
          orientation: 'horizontal',
          direction: 'normal',
        });
        expect(valFarLeft).toBe(0);

        const valFarRight = getPointerValue({
          clientX: 500,
          clientY: 300,
          rect: mockRect,
          min: 0,
          max: 100,
          step: 1,
          orientation: 'horizontal',
          direction: 'normal',
        });
        expect(valFarRight).toBe(100);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. SLIDER STYLES & DEPTH SYSTEM
  // ─────────────────────────────────────────────────────────────
  describe('Slider.styles & Depth System', () => {
    describe('resolveDepthKey', () => {
      it('harus memetakan skala numerik valid (-3 s/d 3) ke string key yang tepat', () => {
        expect(resolveDepthKey(-3)).toBe('-3');
        expect(resolveDepthKey(-2)).toBe('-2');
        expect(resolveDepthKey(-1)).toBe('-1');
        expect(resolveDepthKey(0)).toBe('0');
        expect(resolveDepthKey(1)).toBe('1');
        expect(resolveDepthKey(2)).toBe('2');
        expect(resolveDepthKey(3)).toBe('3');
      });

      it('harus memetakan alias nama depth ke level numerik string yang sesuai', () => {
        expect(resolveDepthKey('sunken')).toBe('-2');
        expect(resolveDepthKey('flat')).toBe('0');
        expect(resolveDepthKey('raised-sm')).toBe('1');
        expect(resolveDepthKey('raised-md')).toBe('2');
        expect(resolveDepthKey('raised-lg')).toBe('3');
      });

      it('harus mengembalikan default "-1" untuk nilai undefined, null, atau tidak dikenal', () => {
        expect(resolveDepthKey(undefined)).toBe('-1');
        expect(resolveDepthKey(null as unknown as undefined)).toBe('-1');
        // @ts-expect-error - testing invalid runtime input
        expect(resolveDepthKey('unknown-depth')).toBe('-1');
      });
    });

    describe('sizeStyles', () => {
      const allSizes: SliderSize[] = ['sm', 'md', 'lg'];

      it('harus mendefinisikan seluruh properti ukuran untuk setiap preset', () => {
        allSizes.forEach((sz) => {
          const cfg = sizeStyles[sz];
          expect(cfg).toBeDefined();
          expect(cfg.trackHorizontal).toContain('h-');
          expect(cfg.trackVertical).toContain('w-');
          expect(cfg.thumb).toContain('h-');
          expect(cfg.thumb).toContain('w-');
          expect(cfg.thumbIcon).toBeDefined();
          expect(cfg.label).toBeDefined();
          expect(cfg.markDot).toBeDefined();
          expect(cfg.markLabel).toBeDefined();
          expect(cfg.tooltip).toBeDefined();
        });
      });
    });

    describe('colorStyles', () => {
      const allColors: SliderColor[] = [
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
      ];

      it('harus memuat seluruh class styling varian semantik warna', () => {
        allColors.forEach((color) => {
          const cStyle = colorStyles[color];
          expect(cStyle).toBeDefined();
          expect(cStyle.range).toBeDefined();
          expect(cStyle.thumbBorder).toBeDefined();
          expect(cStyle.focusRing).toBeDefined();
        });

        expect(colorStyles.primary.range).toContain('bg-primary');
        expect(colorStyles.secondary.range).toContain('bg-secondary');
        expect(colorStyles.accent.range).toContain('bg-accent-600');
        expect(colorStyles.success.range).toContain('bg-success');
        expect(colorStyles.warning.range).toContain('bg-warning');
        expect(colorStyles.error.range).toContain('bg-destructive');
        expect(colorStyles.info.range).toContain('bg-info-600');
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
  });

  // ─────────────────────────────────────────────────────────────
  // 3. SLIDER COMPONENT RENDERING & A11Y BEHAVIOR
  // ─────────────────────────────────────────────────────────────
  describe('Slider Component Rendering & A11y', () => {
    it('harus merender Slider default tanpa error dengan atribut bawaan min=0, max=100, step=1', () => {
      const html = renderToString(<Slider />);
      expect(html).toContain('role="slider"');
      expect(html).toContain('aria-valuemin="0"');
      expect(html).toContain('aria-valuemax="100"');
      expect(html).toContain('aria-valuenow="0"');
      expect(html).toContain('aria-orientation="horizontal"');
      expect(html).toContain('type="range"');
      expect(html).toContain('shadow-n1'); // depth bawaan -1
    });

    it('harus merender nilai controlled secara tepat', () => {
      const html = renderToString(<Slider value={65} />);
      expect(html).toContain('aria-valuenow="65"');
      expect(html).toContain('value="65"');
    });

    it('harus merender nilai defaultValue pada mode uncontrolled', () => {
      const html = renderToString(<Slider defaultValue={42} />);
      expect(html).toContain('aria-valuenow="42"');
      expect(html).toContain('value="42"');
    });

    it('harus merender custom min, max, dan step', () => {
      const html = renderToString(<Slider min={10} max={50} step={5} value={25} />);
      expect(html).toContain('aria-valuemin="10"');
      expect(html).toContain('aria-valuemax="50"');
      expect(html).toContain('aria-valuenow="25"');
      expect(html).toContain('step="5"');
    });

    it('harus merender status disabled dengan benar', () => {
      const html = renderToString(<Slider disabled />);
      expect(html).toContain('aria-disabled="true"');
      expect(html).toContain('tabindex="-1"');
      expect(html).toContain('disabled=""');
      expect(html).toContain('cursor-not-allowed');
    });

    it('harus merender label teks dan tanda bintang jika required=true', () => {
      const html = renderToString(<Slider label="Volume Suara" required id="vol-slider" />);
      expect(html).toContain('Volume Suara');
      expect(html).toContain('*');
      expect(html).toContain('aria-labelledby="vol-slider-label"');
      expect(html).toContain('for="vol-slider"');
    });

    it('harus merender pesan deskripsi bantuan dan menghubungkannya dengan aria-describedby', () => {
      const html = renderToString(
        <Slider id="test-slider" description="Geser untuk mengatur tingkat terang" />
      );
      expect(html).toContain('Geser untuk mengatur tingkat terang');
      expect(html).toContain('aria-describedby="test-slider-desc"');
    });

    it('harus merender status visual error dan pesan error dengan role="alert"', () => {
      const html = renderToString(
        <Slider id="test-slider" error="Nilai tidak boleh kurang dari 10" />
      );
      expect(html).toContain('role="alert"');
      expect(html).toContain('Nilai tidak boleh kurang dari 10');
      expect(html).toContain('border-destructive');
      expect(html).toContain('aria-invalid="true"');
      expect(html).toContain('aria-describedby="test-slider-error"');
    });

    it('harus merender status visual success ketika success=true dan tidak ada error', () => {
      const html = renderToString(<Slider success />);
      expect(html).toContain('border-success');
    });

    it('harus merender tampilan nilai saat showValue=true pada posisi top dan bottom', () => {
      const htmlTop = renderToString(
        <Slider label="Volume" showValue valuePosition="top" value={70} />
      );
      expect(htmlTop).toContain('70');

      const htmlBottom = renderToString(
        <Slider showValue valuePosition="bottom" value={85} />
      );
      expect(htmlBottom).toContain('85');
    });

    it('harus memformat nilai menggunakan formatValue', () => {
      const html = renderToString(
        <Slider
          showValue
          valuePosition="top"
          value={50}
          formatValue={(val) => `${val}% Audio`}
        />
      );
      expect(html).toContain('50% Audio');
    });

    it('harus mendukung custom getAriaValueText untuk pembaca layar', () => {
      const html = renderToString(
        <Slider value={80} getAriaValueText={(val) => `${val} Desibel`} />
      );
      expect(html).toContain('aria-valuetext="80 Desibel"');
    });

    it('harus merender titik penanda (marks) dan labelnya', () => {
      const html = renderToString(
        <Slider
          min={0}
          max={100}
          marks={[
            { value: 0, label: 'Min' },
            { value: 50, label: 'Mid' },
            { value: 100, label: 'Max' },
          ]}
        />
      );
      expect(html).toContain('Min');
      expect(html).toContain('Mid');
      expect(html).toContain('Max');
    });

    it('harus merender orientasi vertikal dengan atribut aria-orientation="vertical"', () => {
      const html = renderToString(<Slider orientation="vertical" />);
      expect(html).toContain('aria-orientation="vertical"');
    });

    it('harus merender thumb icon jika diberikan', () => {
      const html = renderToString(
        <Slider thumbIcon={<span data-testid="custom-thumb-icon">🔊</span>} />
      );
      expect(html).toContain('data-testid="custom-thumb-icon"');
      expect(html).toContain('🔊');
    });

    it('harus menerapkan lebar kustom ketika width ditentukan', () => {
      const html = renderToString(<Slider width="350px" />);
      expect(html).toContain('width:350px');
    });

    it('harus merender Range Slider dengan 2 thumb dan rentang nilai yang sesuai', () => {
      const html = renderToString(
        <Slider range value={[25, 75]} showValue valuePosition="top" />
      );
      expect(html).toContain('25 - 75');
      expect(html).toContain('aria-valuenow="25"');
      expect(html).toContain('aria-valuenow="75"');
      expect(html).toContain('type="range"');
    });

    it('harus merender Range Slider uncontrolled dengan defaultValue tuple', () => {
      const html = renderToString(
        <Slider range defaultValue={[10, 90]} />
      );
      expect(html).toContain('aria-valuenow="10"');
      expect(html).toContain('aria-valuenow="90"');
    });

    it('harus mendukung konfigurasi width secara efisien tanpa style kosong', () => {
      const htmlDefault = renderToString(<Slider />);
      expect(htmlDefault).toContain('w-full');

      const htmlFull = renderToString(<Slider width="full" />);
      expect(htmlFull).toContain('width:100%');

      const htmlCustom = renderToString(<Slider width="350px" />);
      expect(htmlCustom).toContain('width:350px');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. BARREL EXPORT INTEGRATION
  // ─────────────────────────────────────────────────────────────
  describe('Barrel Exports', () => {
    it('harus mengekspor komponen utama, sub-komponen, gaya, dan utilitas dari index barrel', async () => {
      const module = await import('./index');
      expect(module.Slider).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.SliderTrack).toBeDefined();
      expect(module.SliderRange).toBeDefined();
      expect(module.SliderThumb).toBeDefined();
      expect(module.SliderMarks).toBeDefined();
      expect(module.SliderLabel).toBeDefined();
      expect(module.SliderHelperText).toBeDefined();
      expect(module.sizeStyles).toBeDefined();
      expect(module.colorStyles).toBeDefined();
      expect(module.depthClasses).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
      expect(module.clampSliderValue).toBeDefined();
      expect(module.snapSliderValue).toBeDefined();
      expect(module.valueToPercentage).toBeDefined();
      expect(module.percentageToValue).toBeDefined();
    });

    it('harus mengekspor Slider dari barrel level atoms', async () => {
      const atoms = await import('@/components/atoms');
      expect(atoms.Slider).toBeDefined();
      expect(atoms.SliderAtom).toBeDefined();
    });
  });
});
