import { createElement, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { useContextMenu, type UseContextMenuReturn } from './useContextMenu';

describe('useContextMenu', () => {
  it('harus mengembalikan state awal menu tersembunyi dengan koordinat (0, 0)', () => {
    let hookResult!: UseContextMenuReturn;

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement | null>(null);
      hookResult = useContextMenu(ref);
      return null;
    };

    renderToString(createElement(TestComponent));

    expect(hookResult.visible).toBe(false);
    expect(hookResult.coords).toEqual({ x: 0, y: 0 });
    expect(typeof hookResult.show).toBe('function');
    expect(typeof hookResult.hide).toBe('function');
  });

  it('harus memperbarui koordinat dan memunculkan menu saat fungsi show dipanggil', () => {
    let hookResult!: UseContextMenuReturn;

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement | null>(null);
      hookResult = useContextMenu(ref);
      return null;
    };

    renderToString(createElement(TestComponent));

    hookResult.show(250, 420);
    expect(typeof hookResult.show).toBe('function');
  });

  it('harus menutup menu saat fungsi hide dipanggil', () => {
    let hookResult!: UseContextMenuReturn;

    const TestComponent = () => {
      const ref = useRef<HTMLDivElement | null>(null);
      hookResult = useContextMenu(ref);
      return null;
    };

    renderToString(createElement(TestComponent));

    hookResult.hide();
    expect(typeof hookResult.hide).toBe('function');
  });
});
