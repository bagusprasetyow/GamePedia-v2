import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { SourceCodeProps, SourceCodeTab } from './SourceCode.types';

/**
 * Custom Hook: useSourceCode
 *
 * Mengelola normalisasi tab (multi-tab, shortcut tsxCode/jsxCode/htmlCode, atau single code),
 * state tab aktif (controlled / uncontrolled), pencegahan kebocoran memori (timer cleanup),
 * serta aksi penyalinan teks clipboard yang aman secara asinkron dengan penanganan error.
 */
export const useSourceCode = ({
  tabs,
  code,
  language = 'tsx',
  tsxCode,
  jsxCode,
  activeTabId: controlledActiveTabId,
  defaultTabId,
  onTabChange,
  copiedDuration = 2000,
}: SourceCodeProps) => {
  // ── 1. Normalisasi Tab ──
  const normalizedTabs = useMemo<SourceCodeTab[]>(() => {
    if (tabs && tabs.length > 0) {
      return tabs;
    }

    const generatedTabs: SourceCodeTab[] = [];
    const reactSnippet = tsxCode !== undefined ? tsxCode : jsxCode;

    if (reactSnippet !== undefined) {
      generatedTabs.push({
        id: 'tsx',
        label: 'React TSX',
        code: reactSnippet,
        language: 'tsx',
      });
    }

    if (generatedTabs.length > 0) {
      return generatedTabs;
    }

    if (code !== undefined) {
      return [
        {
          id: 'code',
          label: language.toUpperCase(),
          code,
          language,
        },
      ];
    }

    return [];
  }, [tabs, code, language, tsxCode, jsxCode]);

  // ── 2. Active Tab State ──
  const initialTabId = defaultTabId || normalizedTabs[0]?.id || 'tsx';
  const [internalActiveTabId, setInternalActiveTabId] = useState<string>(initialTabId);

  const activeTabId =
    controlledActiveTabId !== undefined ? controlledActiveTabId : internalActiveTabId;

  const currentTab = useMemo(() => {
    return normalizedTabs.find((t) => t.id === activeTabId) || normalizedTabs[0] || null;
  }, [normalizedTabs, activeTabId]);

  const activeCode = currentTab ? currentTab.code : code || '';
  const activeLanguage = currentTab ? currentTab.language || 'tsx' : language;

  const handleTabChange = useCallback(
    (tabId: string) => {
      setInternalActiveTabId(tabId);
      onTabChange?.(tabId);
    },
    [onTabChange]
  );

  // ── 3. Copy Clipboard Logic dengan Async Safety & Memory Cleanup ──
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bersihkan timer aktif saat komponen unmount untuk mencegah kebocoran memori
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (!activeCode) return;

    // Bersihkan timer sebelumnya jika tombol ditekan berulang secara cepat
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = null;
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeCode);
        setCopied(true);
      } else if (typeof document !== 'undefined') {
        // Fallback untuk lingkungan tanpa Clipboard API (non-HTTPS / iframe tertentu)
        const textArea = document.createElement('textarea');
        textArea.value = activeCode;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
      }
    } catch (err) {
      console.warn('[SourceCode] Gagal menyalin kode ke clipboard:', err);
    }

    copyTimerRef.current = setTimeout(() => {
      setCopied(false);
      copyTimerRef.current = null;
    }, copiedDuration);
  }, [activeCode, copiedDuration]);

  return {
    tabs: normalizedTabs,
    activeTabId,
    currentTab,
    activeCode,
    activeLanguage,
    copied,
    handleTabChange,
    handleCopy,
  };
};

export default useSourceCode;
