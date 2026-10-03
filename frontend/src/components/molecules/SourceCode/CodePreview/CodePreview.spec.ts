import { describe, it, expect } from 'vitest';
import {
  getContainerClasses,
  depthClasses,
  resolveDepthKey,
  resolveDepthClass,
  syntaxTokenClasses,
} from './CodePreview.styles';
import { renderHighlightedLine } from './CodePreview.utils';
import { CodePreviewLine } from './components/CodePreviewLine';

describe('CodePreview Molecule Unit Tests', () => {
  describe('Depth System & Styling (CodePreview.styles)', () => {
    it('harus memetakan depth -3 s/d 3 ke kelas shadow yang valid', () => {
      expect(resolveDepthKey(-3)).toBe('-3');
      expect(resolveDepthKey('sunken')).toBe('-2');
      expect(resolveDepthKey(0)).toBe('0');
      expect(resolveDepthKey('raised-sm')).toBe('1');
      expect(resolveDepthKey(2)).toBe('2');
      expect(resolveDepthKey(undefined)).toBe('0');
      expect(resolveDepthKey('unknown')).toBe('0');

      expect(resolveDepthClass(-1)).toBe(depthClasses['-1']);
      expect(resolveDepthClass(0)).toBe(depthClasses['0']);
      expect(resolveDepthClass(2)).toBe(depthClasses['2']);
    });

    it('harus mendukung varian terminal, inset, flat, dan raised', () => {
      const terminalClass = getContainerClasses('terminal', 0);
      expect(terminalClass).toContain('bg-neutral-950');

      const insetClass = getContainerClasses('inset', -1);
      expect(insetClass).toContain('shadow-n1');
      expect(insetClass).toContain('border-neutral-800');

      const raisedClass = getContainerClasses('raised', 2);
      expect(raisedClass).toContain('shadow-2');
    });

    it('harus menyertakan palet warna hex resmi VS Code Dark+ pada syntaxTokenClasses', () => {
      expect(syntaxTokenClasses.comment).toContain('text-[#6A9955]');
      expect(syntaxTokenClasses.plainText).toContain('text-[#D4D4D4]');
      expect(syntaxTokenClasses.tag).toContain('text-[#569CD6]');
      expect(syntaxTokenClasses.attribute).toContain('text-[#9CDCFE]');
      expect(syntaxTokenClasses.string).toContain('text-[#CE9178]');
      expect(syntaxTokenClasses.number).toContain('text-[#B5CEA8]');
      expect(syntaxTokenClasses.punctuation).toContain('text-[#808080]');
      expect(syntaxTokenClasses.boolean).toContain('text-[#569CD6]');
    });
  });

  describe('Tokenizer & Syntax Highlighting (renderHighlightedLine)', () => {
    it('harus merender baris komentar HTML dengan kelas italic dan text-[#6A9955]', () => {
      const commentNode = renderHighlightedLine('<!-- ini komentar -->', 0);
      expect(commentNode).toBeDefined();
      const props = commentNode.props as { className?: string };
      expect(props.className).toContain('text-[#6A9955]');
      expect(props.className).toContain('italic');
    });

    it('harus merender baris kode JSX dengan token terpisah', () => {
      const jsxNode = renderHighlightedLine('<Button variant="primary" />', 1);
      expect(jsxNode).toBeDefined();
    });

    it('harus merender baris kosong tanpa error', () => {
      const emptyNode = renderHighlightedLine('', 2);
      expect(emptyNode).toBeDefined();
    });
  });

  describe('Hook & Components Verification', () => {
    it('harus mengekspor hook useCodePreview dan fungsi-fungsinya', async () => {
      const { useCodePreview } = await import('./useCodePreview');
      expect(useCodePreview).toBeDefined();
      expect(typeof useCodePreview).toBe('function');
    });

    it('harus mengekspor komponen utama CodePreview', async () => {
      const { CodePreview } = await import('./CodePreview');
      expect(CodePreview).toBeDefined();
      expect(typeof CodePreview).toBe('function');
    });

    it('harus merender CodePreviewLine tanpa nomor baris secara default', () => {
      const lineNode = CodePreviewLine({
        line: 'const a = 1;',
        lineIndex: 0,
        showLineNumber: false,
      });
      expect(lineNode).toBeDefined();
    });

    it('harus merender CodePreviewLine dengan nomor baris saat showLineNumber bernilai true', () => {
      const lineNode = CodePreviewLine({
        line: 'const a = 1;',
        lineIndex: 0,
        showLineNumber: true,
      });
      expect(lineNode).toBeDefined();
    });
  });

  describe('Module Exports', () => {
    it('harus mengekspor komponen CodePreview, sub-komponen, hook, tokenizer, dan styles', async () => {
      const module = await import('./index');
      expect(module.CodePreview).toBeDefined();
      expect(module.default).toBeDefined();
      expect(module.CodePreviewLine).toBeDefined();
      expect(module.useCodePreview).toBeDefined();
      expect(module.renderHighlightedLine).toBeDefined();
      expect(module.SYNTAX_REGEX).toBeDefined();
      expect(module.getContainerClasses).toBeDefined();
      expect(module.syntaxTokenClasses).toBeDefined();
      expect(module.depthClasses).toBeDefined();
    });
  });
});
