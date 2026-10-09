import { describe, expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { useImageDragDrop } from './useImageDragDrop';
import type { DragEvent } from 'react';

describe('useImageDragDrop hook', () => {
  it('harus diekspor dengan benar melalui barrel hooks/image/index.ts dan hooks/index.ts', async () => {
    const barrel = await import('./index');
    expect(barrel.useImageDragDrop).toBeDefined();
    expect(typeof barrel.useImageDragDrop).toBe('function');

    const globalHooks = await import('../index');
    expect(globalHooks.useImageDragDrop).toBeDefined();
    expect(typeof globalHooks.useImageDragDrop).toBe('function');
  });

  it('harus mengembalikan state awal isDragging false beserta fungsi handlers', () => {
    let result: ReturnType<typeof useImageDragDrop> | null = null;
    const onDropFile = vi.fn();

    const TestComponent = () => {
      result = useImageDragDrop(false, onDropFile);
      return null;
    };

    renderToString(<TestComponent />);

    expect(result).not.toBeNull();
    expect(result!.isDragging).toBe(false);
    expect(typeof result!.handleDragEnter).toBe('function');
    expect(typeof result!.handleDragOver).toBe('function');
    expect(typeof result!.handleDragLeave).toBe('function');
    expect(typeof result!.handleDrop).toBe('function');
  });

  it('harus mengubah isDragging menjadi true saat dragEnter dan dragOver jika tidak disabled', () => {
    let result: ReturnType<typeof useImageDragDrop> | null = null;
    const onDropFile = vi.fn();

    const TestComponent = () => {
      result = useImageDragDrop(false, onDropFile);
      return null;
    };

    renderToString(<TestComponent />);

    const fakeEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent<HTMLDivElement>;

    result!.handleDragEnter(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();

    result!.handleDragOver(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(2);
  });

  it('tidak boleh mengubah isDragging jika dalam kondisi disabled', () => {
    let result: ReturnType<typeof useImageDragDrop> | null = null;
    const onDropFile = vi.fn();

    const TestComponent = () => {
      result = useImageDragDrop(true, onDropFile);
      return null;
    };

    renderToString(<TestComponent />);

    const fakeEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent<HTMLDivElement>;

    result!.handleDragEnter(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(result!.isDragging).toBe(false);

    result!.handleDragOver(fakeEvent);
    expect(result!.isDragging).toBe(false);
  });

  it('harus memanggil preventDefault dan reset isDragging saat dragLeave', () => {
    let result: ReturnType<typeof useImageDragDrop> | null = null;
    const onDropFile = vi.fn();

    const TestComponent = () => {
      result = useImageDragDrop(false, onDropFile);
      return null;
    };

    renderToString(<TestComponent />);

    const fakeEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent<HTMLDivElement>;

    result!.handleDragLeave(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
  });

  it('harus mengekstrak file yang di-drop dan memanggil callback onDropFile', () => {
    let result: ReturnType<typeof useImageDragDrop> | null = null;
    const onDropFile = vi.fn();

    const TestComponent = () => {
      result = useImageDragDrop(false, onDropFile);
      return null;
    };

    renderToString(<TestComponent />);

    const mockFile = new File(['dummy'], 'cover.png', { type: 'image/png' });
    const fakeDropEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        files: [mockFile],
      },
    } as unknown as DragEvent<HTMLDivElement>;

    result!.handleDrop(fakeDropEvent);

    expect(fakeDropEvent.preventDefault).toHaveBeenCalled();
    expect(fakeDropEvent.stopPropagation).toHaveBeenCalled();
    expect(onDropFile).toHaveBeenCalledWith(mockFile);
  });

  it('tidak boleh memanggil callback onDropFile saat disabled saat drop', () => {
    let result: ReturnType<typeof useImageDragDrop> | null = null;
    const onDropFile = vi.fn();

    const TestComponent = () => {
      result = useImageDragDrop(true, onDropFile);
      return null;
    };

    renderToString(<TestComponent />);

    const mockFile = new File(['dummy'], 'cover.png', { type: 'image/png' });
    const fakeDropEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        files: [mockFile],
      },
    } as unknown as DragEvent<HTMLDivElement>;

    result!.handleDrop(fakeDropEvent);

    expect(fakeDropEvent.preventDefault).toHaveBeenCalled();
    expect(fakeDropEvent.stopPropagation).toHaveBeenCalled();
    expect(onDropFile).not.toHaveBeenCalled();
  });
});
