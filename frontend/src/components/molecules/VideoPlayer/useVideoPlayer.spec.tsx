import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { useVideoPlayer } from './useVideoPlayer';

describe('useVideoPlayer hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Teardown
  });

  it('harus diekspor dengan benar melalui barrel level internal', async () => {
    const barrel = await import('./index');
    expect(barrel.useVideoPlayer).toBeDefined();
    expect(typeof barrel.useVideoPlayer).toBe('function');
  });

  it('harus menginisialisasi state dengan nilai default yang tepat', () => {
    let hookResult: ReturnType<typeof useVideoPlayer> | null = null;

    const TestComponent = () => {
      hookResult = useVideoPlayer({
        src: 'https://example.com/test.mp4',
        defaultVolume: 0.8,
        muted: false,
      });
      return null;
    };

    renderToString(<TestComponent />);

    expect(hookResult).not.toBeNull();
    expect(hookResult!.isPlaying).toBe(false);
    expect(hookResult!.isBuffering).toBe(false);
    expect(hookResult!.isEnded).toBe(false);
    expect(hookResult!.currentTime).toBe(0);
    expect(hookResult!.duration).toBe(0);
    expect(hookResult!.volume).toBe(0.8);
    expect(hookResult!.isMuted).toBe(false);
    expect(hookResult!.currentSubtitle).toBe('off');
    expect(typeof hookResult!.play).toBe('function');
    expect(typeof hookResult!.pause).toBe('function');
    expect(typeof hookResult!.togglePlay).toBe('function');
    expect(typeof hookResult!.seek).toBe('function');
    expect(typeof hookResult!.skip).toBe('function');
    expect(typeof hookResult!.setSubtitle).toBe('function');
    expect(typeof hookResult!.setQuality).toBe('function');
    expect(typeof hookResult!.handleRetry).toBe('function');
  });

  it('harus memiliki fungsi setSubtitle yang mendukung normalisasi case-insensitive', () => {
    let hookResult: ReturnType<typeof useVideoPlayer> | null = null;

    const TestComponent = () => {
      hookResult = useVideoPlayer({
        src: 'https://example.com/test.mp4',
        tracks: [
          { label: 'Indonesian', srcLang: 'id', src: '/sub-id.vtt', default: true },
          { label: 'English', srcLang: 'en', src: '/sub-en.vtt' },
        ],
      });
      return null;
    };

    renderToString(<TestComponent />);

    expect(hookResult).not.toBeNull();

    // Mock video element dengan textTracks
    const mockTracks = [
      { label: 'Indonesian', language: 'id', mode: 'disabled' },
      { label: 'English', language: 'en', mode: 'disabled' },
    ];
    const mockVideo = {
      textTracks: mockTracks as unknown as TextTrackList,
    } as unknown as HTMLVideoElement;
    (hookResult!.videoRef as unknown as { current: HTMLVideoElement | null }).current = mockVideo;

    // Set subtitle 'ID'
    hookResult!.setSubtitle('ID');
    expect(mockTracks[0].mode).toBe('hidden');
    expect(mockTracks[1].mode).toBe('disabled');

    // Matikan subtitle
    hookResult!.setSubtitle('off');
    expect(hookResult!.currentSubtitle).toBe('off');
    expect(mockTracks[0].mode).toBe('disabled');
  });

  it('harus mereset error message dan memanggil reload pada video saat handleRetry dieksekusi', () => {
    let hookResult: ReturnType<typeof useVideoPlayer> | null = null;

    const TestComponent = () => {
      hookResult = useVideoPlayer({
        src: 'https://example.com/test.mp4',
      });
      return null;
    };

    renderToString(<TestComponent />);

    expect(hookResult).not.toBeNull();

    const mockVideo = {
      load: vi.fn(),
      play: vi.fn().mockResolvedValue(undefined),
    } as unknown as HTMLVideoElement;
    (hookResult!.videoRef as unknown as { current: HTMLVideoElement | null }).current = mockVideo;

    hookResult!.handleRetry();

    expect(hookResult!.errorMessage).toBeNull();
    expect(hookResult!.isEnded).toBe(false);
    expect(mockVideo.load).toHaveBeenCalled();
  });
});
