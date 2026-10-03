import { describe, it, expect } from 'vitest';
import {
  depthClasses,
  namedDepthMap,
  resolveDepthKey,
  resolveDepthClass,
  getContainerClasses,
  getTabButtonClasses,
  headerClasses,
  copyButtonClasses,
  codeContainerClasses,
} from './SourceCode.styles';

describe('SourceCode Molecule - Styles & Depth System', () => {
  describe('Depth System Skala -3 s/d 3 & Named Aliases', () => {
    it('harus memetakan level cekung (-3, -2, -1) ke shadow negatif yang benar', () => {
      expect(resolveDepthKey(-3)).toBe('-3');
      expect(resolveDepthKey(-2)).toBe('-2');
      expect(resolveDepthKey(-1)).toBe('-1');
      expect(resolveDepthClass(-3)).toBe('shadow-n3');
      expect(resolveDepthClass(-2)).toBe('shadow-n2');
      expect(resolveDepthClass(-1)).toBe('shadow-n1');
      expect(resolveDepthClass('-3')).toBe('shadow-n3');
    });

    it('harus memetakan level 0 ke shadow rata (flat)', () => {
      expect(resolveDepthKey(0)).toBe('0');
      expect(resolveDepthClass(0)).toBe('shadow-0');
      expect(resolveDepthClass('0')).toBe('shadow-0');
    });

    it('harus memetakan level timbul (1, 2, 3) ke shadow positif yang benar', () => {
      expect(resolveDepthKey(1)).toBe('1');
      expect(resolveDepthKey(2)).toBe('2');
      expect(resolveDepthKey(3)).toBe('3');
      expect(resolveDepthClass(1)).toBe('shadow-1');
      expect(resolveDepthClass(2)).toBe('shadow-2');
      expect(resolveDepthClass(3)).toBe('shadow-3');
    });

    it('harus memetakan alias nama depth ke level yang sesuai', () => {
      expect(resolveDepthKey('sunken')).toBe('-2');
      expect(resolveDepthKey('flat')).toBe('0');
      expect(resolveDepthKey('raised-sm')).toBe('1');
      expect(resolveDepthKey('raised-md')).toBe('2');
      expect(resolveDepthKey('raised-lg')).toBe('3');
      expect(resolveDepthClass('sunken')).toBe('shadow-n2');
      expect(resolveDepthClass('raised-md')).toBe('shadow-2');
    });

    it('harus menggunakan default level 2 saat depth undefined, null, atau tidak dikenal', () => {
      expect(resolveDepthKey(undefined)).toBe('2');
      expect(resolveDepthKey(null as unknown as undefined)).toBe('2');
      expect(resolveDepthClass(undefined)).toBe('shadow-2');
      expect(resolveDepthClass('unknown-depth')).toBe('shadow-2');
    });

    it('harus mengekspor depthClasses dan namedDepthMap lengkap', () => {
      expect(depthClasses['-3']).toBe('shadow-n3');
      expect(depthClasses['0']).toBe('shadow-0');
      expect(depthClasses['3']).toBe('shadow-3');
      expect(namedDepthMap.sunken).toBe('-2');
    });
  });

  describe('Container & Element Classes (OKLCH Theme Tokens)', () => {
    it('harus menyertakan border, background neutral-950, dan shadow depth pada container', () => {
      const containerClass = getContainerClasses(2);
      expect(containerClass).toContain('overflow-hidden');
      expect(containerClass).toContain('rounded-2xl');
      expect(containerClass).toContain('border-neutral-800');
      expect(containerClass).toContain('bg-neutral-950');
      expect(containerClass).toContain('shadow-2');
    });

    it('harus menggabungkan className kustom jika diberikan', () => {
      const custom = getContainerClasses(1, 'my-custom-terminal');
      expect(custom).toContain('my-custom-terminal');
      expect(custom).toContain('shadow-1');
    });

    it('harus membedakan styling tombol tab aktif dan tidak aktif dengan token OKLCH', () => {
      const activeTabClass = getTabButtonClasses(true);
      const inactiveTabClass = getTabButtonClasses(false);

      expect(activeTabClass).toContain('text-primary-300');
      expect(activeTabClass).toContain('bg-primary-950/60');
      expect(activeTabClass).toContain('border-primary-500/40');

      expect(inactiveTabClass).toContain('text-neutral-400');
      expect(inactiveTabClass).toContain('bg-transparent');
    });

    it('harus memiliki konstanta class header, copy button, dan code container berbasis token OKLCH', () => {
      expect(headerClasses).toContain('border-neutral-800');
      expect(copyButtonClasses).toContain('cursor-pointer');
      expect(copyButtonClasses).toContain('bg-neutral-850');
      expect(codeContainerClasses).toContain('font-mono');
      expect(codeContainerClasses).toContain('bg-neutral-950');
    });

    it('harus mendefinisikan kelas warna khusus untuk syntax highlighting Modern IDE', async () => {
      const { syntaxTokenClasses } = await import('./SourceCode.styles');
      expect(syntaxTokenClasses.comment).toContain('text-[#6A9955]');
      expect(syntaxTokenClasses.tag).toContain('text-[#569CD6]');
      expect(syntaxTokenClasses.attribute).toContain('text-[#9CDCFE]');
      expect(syntaxTokenClasses.string).toContain('text-[#CE9178]');
      expect(syntaxTokenClasses.number).toContain('text-[#B5CEA8]');
      expect(syntaxTokenClasses.punctuation).toContain('text-[#808080]');
      expect(syntaxTokenClasses.boolean).toContain('text-[#569CD6]');
      expect(syntaxTokenClasses.plainText).toContain('text-[#D4D4D4]');
    });
  });

  describe('Tokenizer & Syntax Highlighting (renderHighlightedLine)', () => {
    it('harus merender baris komentar HTML dengan kelas italic dan text-[#6A9955]', async () => {
      const { renderHighlightedLine } = await import('./SourceCode.utils');
      const commentNode = renderHighlightedLine('<!-- ini komentar -->', 0);
      expect(commentNode).toBeDefined();
      const props = commentNode.props as { className?: string };
      expect(props.className).toContain('text-[#6A9955]');
      expect(props.className).toContain('italic');
    });

    it('harus merender baris kode JSX dengan token terpisah', async () => {
      const { renderHighlightedLine } = await import('./SourceCode.utils');
      const jsxNode = renderHighlightedLine('<Button variant="primary" />', 1);
      expect(jsxNode).toBeDefined();
      const props = jsxNode.props as { children?: unknown };
      expect(props.children).toBeDefined();
    });

    it('harus merender baris kosong tanpa error', async () => {
      const { renderHighlightedLine } = await import('./SourceCode.utils');
      const emptyNode = renderHighlightedLine('', 2);
      expect(emptyNode).toBeDefined();
    });
  });

  describe('SourceCode Exports', () => {
    it('harus mengekspor komponen SourceCode, sub-komponen Header & Body, hook, tokenizer, dan CodePreview', async () => {
      const module = await import('./index');
      expect(module.SourceCode).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.SourceCodeHeader).toBeDefined();
      expect(module.SourceCodeBody).toBeDefined();
      expect(module.useSourceCode).toBeDefined();
      expect(module.renderHighlightedLine).toBeDefined();
      expect(module.resolveDepthKey).toBeDefined();
      expect(module.resolveDepthClass).toBeDefined();
      expect(module.depthClasses).toBeDefined();
      expect(module.CodePreview).toBeDefined();
      expect(module.useCodePreview).toBeDefined();
    });
  });
});
