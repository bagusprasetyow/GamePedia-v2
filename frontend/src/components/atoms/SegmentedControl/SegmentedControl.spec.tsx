import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { SegmentedControl } from './SegmentedControl';
import {
  sizeStyles,
  activeColorStyles,
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
} from './SegmentedControl.styles';
import {
  isOptionDisabled,
  findFirstEnabledIndex,
  findLastEnabledIndex,
  findNextEnabledIndex,
  findPreviousEnabledIndex,
  getInitialSegmentValue,
} from './SegmentedControl.utils';
import type {
  SegmentedControlOption,
  SegmentedControlSize,
  SegmentedControlColor,
} from './SegmentedControl.types';

describe('SegmentedControl Atom - Unit Tests', () => {
  const sampleOptions: SegmentedControlOption<string>[] = [
    { value: 'all', label: 'Semua' },
    { value: 'games', label: 'Game' },
    { value: 'users', label: 'Pengguna' },
  ];

  // ─────────────────────────────────────────────────────────────
  // 1. SEGMENTED CONTROL UTILITIES
  // ─────────────────────────────────────────────────────────────
  describe('SegmentedControl.utils', () => {
    describe('isOptionDisabled', () => {
      it('harus mendeteksi status disabled opsi dan komponen', () => {
        expect(isOptionDisabled({ value: '1', label: '1' }, false)).toBe(false);
        expect(isOptionDisabled({ value: '1', label: '1', disabled: true }, false)).toBe(true);
        expect(isOptionDisabled({ value: '1', label: '1' }, true)).toBe(true);
      });
    });

    describe('findFirstEnabledIndex & findLastEnabledIndex', () => {
      it('harus menemukan indeks opsi enabled pertama dan terakhir', () => {
        const opts: SegmentedControlOption[] = [
          { value: '1', label: '1', disabled: true },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4', disabled: true },
        ];
        expect(findFirstEnabledIndex(opts, false)).toBe(1);
        expect(findLastEnabledIndex(opts, false)).toBe(2);
      });

      it('harus mengembalikan -1 jika semua opsi disabled atau komponen disabled', () => {
        const allDisabled: SegmentedControlOption[] = [
          { value: '1', label: '1', disabled: true },
        ];
        expect(findFirstEnabledIndex(allDisabled, false)).toBe(-1);
        expect(findLastEnabledIndex(allDisabled, false)).toBe(-1);
        expect(findFirstEnabledIndex(sampleOptions, true)).toBe(-1);
        expect(findLastEnabledIndex(sampleOptions, true)).toBe(-1);
      });
    });

    describe('findNextEnabledIndex & findPreviousEnabledIndex (Wrapping & Skipping)', () => {
      const opts: SegmentedControlOption[] = [
        { value: '0', label: '0' },
        { value: '1', label: '1', disabled: true },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
      ];

      it('harus melompati opsi disabled saat navigasi maju (next)', () => {
        // Dari indeks 0 -> harus skip 1 -> menuju ke 2
        expect(findNextEnabledIndex(opts, 0, false)).toBe(2);
        // Dari indeks 2 -> menuju ke 3
        expect(findNextEnabledIndex(opts, 2, false)).toBe(3);
        // Dari indeks 3 -> wrap ke 0
        expect(findNextEnabledIndex(opts, 3, false)).toBe(0);
      });

      it('harus melompati opsi disabled saat navigasi mundur (previous)', () => {
        // Dari indeks 2 -> harus skip 1 -> menuju ke 0
        expect(findPreviousEnabledIndex(opts, 2, false)).toBe(0);
        // Dari indeks 0 -> wrap ke 3
        expect(findPreviousEnabledIndex(opts, 0, false)).toBe(3);
      });

      it('harus menangani array kosong dan komponen disabled secara aman', () => {
        expect(findNextEnabledIndex([], 0, false)).toBe(0);
        expect(findPreviousEnabledIndex([], 0, false)).toBe(0);
        expect(findNextEnabledIndex(opts, 0, true)).toBe(0);
      });
    });

    describe('getInitialSegmentValue', () => {
      it('harus memilih defaultValue yang enabled jika tersedia', () => {
        const val = getInitialSegmentValue(sampleOptions, 'games', false);
        expect(val).toBe('games');
      });

      it('harus fallback ke opsi enabled pertama jika defaultValue tidak diberikan', () => {
        const val = getInitialSegmentValue(sampleOptions, undefined, false);
        expect(val).toBe('all');
      });

      it('harus fallback ke opsi enabled pertama jika defaultValue berstatus disabled', () => {
        const opts: SegmentedControlOption[] = [
          { value: 'a', label: 'A', disabled: true },
          { value: 'b', label: 'B' },
        ];
        const val = getInitialSegmentValue(opts, 'a', false);
        expect(val).toBe('b');
      });

      it('harus menangani array kosong tanpa error', () => {
        expect(getInitialSegmentValue([], undefined, false)).toBeUndefined();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. STYLES, DEPTH SYSTEM & COLOR TOKENS
  // ─────────────────────────────────────────────────────────────
  describe('SegmentedControl.styles', () => {
    describe('resolveDepthKey', () => {
      it('harus memetakan skala numerik (-3 s/d 3) ke string key', () => {
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
      const allSizes: SegmentedControlSize[] = ['sm', 'md', 'lg'];

      it('harus mendefinisikan tinggi item dan ukuran tipografi untuk setiap ukuran', () => {
        allSizes.forEach((size) => {
          expect(sizeStyles[size]).toBeDefined();
          expect(sizeStyles[size].item).toContain('h-');
          expect(sizeStyles[size].text).toContain('text-');
          expect(sizeStyles[size].iconSize).toBeDefined();
        });
        expect(sizeStyles.sm.item).toContain('h-7');
        expect(sizeStyles.md.item).toContain('h-8.5');
        expect(sizeStyles.lg.item).toContain('h-10');
      });
    });

    describe('activeColorStyles', () => {
      const allColors: SegmentedControlColor[] = [
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
      ];

      it('harus mendefinisikan kelas warna semantik yang valid untuk setiap varian', () => {
        allColors.forEach((color) => {
          expect(activeColorStyles[color]).toBeDefined();
          expect(activeColorStyles[color]).toContain('bg-');
          expect(activeColorStyles[color]).toContain('shadow-1');
        });
        expect(activeColorStyles.primary).toContain('bg-primary');
        expect(activeColorStyles.secondary).toContain('bg-secondary');
        expect(activeColorStyles.accent).toContain('bg-accent-600');
        expect(activeColorStyles.success).toContain('bg-success');
        expect(activeColorStyles.warning).toContain('bg-warning');
        expect(activeColorStyles.error).toContain('bg-destructive');
        expect(activeColorStyles.info).toContain('bg-info-600');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. COMPONENT RENDERING & A11Y BEHAVIOR
  // ─────────────────────────────────────────────────────────────
  describe('SegmentedControl Component Rendering & A11y', () => {
    it('harus merender container dengan role="radiogroup" dan opsi dengan role="radio"', () => {
      const html = renderToString(<SegmentedControl options={sampleOptions} />);
      expect(html).toContain('role="radiogroup"');
      expect(html).toContain('role="radio"');
      expect(html).toContain('aria-label="Pilihan segmen kontrol"');
      expect(html).toContain('Semua');
      expect(html).toContain('Game');
      expect(html).toContain('Pengguna');
    });

    it('harus memilih opsi pertama secara default jika value tidak ditentukan (uncontrolled)', () => {
      const html = renderToString(<SegmentedControl options={sampleOptions} />);
      // Opsi pertama 'all' harus aktif
      expect(html).toContain('data-value="all" data-state="active"');
      expect(html).toContain('tabindex="0" data-value="all"');
      // Opsi lainnya inactive
      expect(html).toContain('data-value="games" data-state="inactive"');
      expect(html).toContain('tabindex="-1" data-value="games"');
    });

    it('harus menghormati defaultValue pada mode uncontrolled', () => {
      const html = renderToString(
        <SegmentedControl options={sampleOptions} defaultValue="users" />
      );
      expect(html).toContain('data-value="users" data-state="active"');
      expect(html).toContain('tabindex="0" data-value="users"');
      expect(html).toContain('data-value="all" data-state="inactive"');
    });

    it('harus menghormati value pada mode controlled', () => {
      const html = renderToString(
        <SegmentedControl options={sampleOptions} value="games" />
      );
      expect(html).toContain('data-value="games" data-state="active"');
      expect(html).toContain('tabindex="0" data-value="games"');
      expect(html).toContain('data-value="all" data-state="inactive"');
      expect(html).toContain('data-value="users" data-state="inactive"');
    });

    it('harus merender status disabled pada tingkat komponen', () => {
      const html = renderToString(
        <SegmentedControl options={sampleOptions} disabled />
      );
      expect(html).toContain('aria-disabled="true"');
      expect(html).toContain('opacity-60 cursor-not-allowed');
      // Semua tombol harus disabled
      expect(html).toContain('disabled=""');
    });

    it('harus merender status disabled pada opsi individual', () => {
      const opts: SegmentedControlOption[] = [
        { value: 'all', label: 'Semua' },
        { value: 'games', label: 'Game', disabled: true },
      ];
      const html = renderToString(<SegmentedControl options={opts} />);
      expect(html).toContain('data-value="games"');
      expect(html).toContain('disabled=""');
      expect(html).toContain('aria-disabled="true"');
    });

    it('harus mendukung varian warna semantik aktif', () => {
      const htmlSuccess = renderToString(
        <SegmentedControl options={sampleOptions} value="all" color="success" />
      );
      expect(htmlSuccess).toContain('bg-success');

      const htmlAccent = renderToString(
        <SegmentedControl options={sampleOptions} value="all" color="accent" />
      );
      expect(htmlAccent).toContain('bg-accent-600');
    });

    it('harus menerapkan kelas ukuran yang dipilih', () => {
      const htmlSm = renderToString(
        <SegmentedControl options={sampleOptions} size="sm" />
      );
      expect(htmlSm).toContain('h-7');

      const htmlLg = renderToString(
        <SegmentedControl options={sampleOptions} size="lg" />
      );
      expect(htmlLg).toContain('h-10');
    });

    it('harus menerapkan Depth System yang ditentukan', () => {
      const htmlSunken = renderToString(
        <SegmentedControl options={sampleOptions} depth="sunken" />
      );
      expect(htmlSunken).toContain('shadow-n2');

      const htmlFlat = renderToString(
        <SegmentedControl options={sampleOptions} depth={0} />
      );
      expect(htmlFlat).toContain('shadow-0');
    });

    it('harus mendukung fullWidth dengan membagi lebar secara merata (flex-1)', () => {
      const html = renderToString(
        <SegmentedControl options={sampleOptions} fullWidth />
      );
      expect(html).toContain('w-full flex');
      expect(html).toContain('flex-1');
    });

    it('harus merender ikon opsi jika disediakan', () => {
      const opts: SegmentedControlOption[] = [
        { value: 'grid', label: 'Grid', icon: <span data-testid="grid-icon">GridIcon</span> },
        { value: 'list', label: 'List', icon: <span data-testid="list-icon">ListIcon</span> },
      ];
      const html = renderToString(<SegmentedControl options={opts} />);
      expect(html).toContain('data-testid="grid-icon"');
      expect(html).toContain('data-testid="list-icon"');
    });


    it('harus menerapkan ariaLabel untuk opsi icon-only', () => {
      const opts: SegmentedControlOption[] = [
        { value: 'grid', label: '', icon: 'mdi:view-grid', ariaLabel: 'Tampilan Grid' },
      ];
      const html = renderToString(<SegmentedControl options={opts} />);
      expect(html).toContain('aria-label="Tampilan Grid"');
    });

    it('harus merender hidden input jika prop name disediakan untuk integrasi form', () => {
      const html = renderToString(
        <SegmentedControl options={sampleOptions} name="category" value="games" />
      );
      expect(html).toContain('type="hidden" name="category" value="games"');
    });

    it('harus merender pembungkus jika wrapperClassName disediakan', () => {
      const html = renderToString(
        <SegmentedControl
          options={sampleOptions}
          wrapperClassName="custom-wrapper-container"
        />
      );
      expect(html).toContain('custom-wrapper-container');
    });

    it('harus merender sliding pill indicator dengan atribut dan kelas transisi yang tepat', () => {
      const html = renderToString(
        <SegmentedControl options={sampleOptions} value="games" color="primary" size="md" />
      );
      expect(html).toContain('data-testid="segmented-control-indicator"');
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('transition-all');
      expect(html).toContain('duration-200');
      expect(html).toContain('motion-reduce:transition-none');
      expect(html).toContain('bg-primary');
      expect(html).toContain('rounded-lg');
    });

    it('harus menangani options kosong tanpa error', () => {
      const html = renderToString(<SegmentedControl options={[]} />);
      expect(html).toContain('role="radiogroup"');
    });

    it('harus menangani controlled value yang tidak ada dalam options tanpa crash', () => {
      const html = renderToString(
        <SegmentedControl options={sampleOptions} value="non-existent" />
      );
      expect(html).toContain('role="radiogroup"');
      // Tidak ada segmen yang aktif
      expect(html).not.toContain('data-state="active"');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. BARREL EXPORT & INDEX INTEGRITY
  // ─────────────────────────────────────────────────────────────
  describe('Index Barrel Export', () => {
    it('harus mengekspor komponen utama, sub-komponen, utilitas, dan styles', async () => {
      const barrel = await import('./index');
      expect(barrel.SegmentedControl).toBeDefined();
      expect(barrel.default).toBeDefined();
      expect(barrel.SegmentedControlItem).toBeDefined();
      expect(barrel.isOptionDisabled).toBeDefined();
      expect(barrel.findFirstEnabledIndex).toBeDefined();
      expect(barrel.findLastEnabledIndex).toBeDefined();
      expect(barrel.findNextEnabledIndex).toBeDefined();
      expect(barrel.findPreviousEnabledIndex).toBeDefined();
      expect(barrel.getInitialSegmentValue).toBeDefined();
      expect(barrel.sizeStyles).toBeDefined();
      expect(barrel.activeColorStyles).toBeDefined();
      expect(barrel.indicatorColorStyles).toBeDefined();
      expect(barrel.indicatorRadiusMap).toBeDefined();
      expect(barrel.indicatorBaseClasses).toBeDefined();
      expect(barrel.activeTextStyles).toBeDefined();
      expect(barrel.depthClasses).toBeDefined();
      expect(barrel.resolveDepthKey).toBeDefined();
    });
  });
});
