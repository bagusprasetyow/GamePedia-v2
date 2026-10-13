import { describe, it, expect } from 'vitest';
import {
  sizeClasses,
  aspectRatioClasses,
  objectFitClasses,
  roundedClasses,
  variantClasses,
  depthClasses,
  defaultDepthByVariant,
  namedDepthMap,
  resolveDepthKey,
} from './VideoPlayer.styles';
import type {
  VideoPlayerSize,
  VideoPlayerAspectRatio,
  VideoPlayerObjectFit,
  VideoPlayerRounded,
  VideoPlayerVariant,
} from './VideoPlayer.types';

describe('VideoPlayer.styles', () => {
  it('harus memiliki pemetaan lengkap untuk semua sizeClasses', () => {
    const allSizes: VideoPlayerSize[] = ['sm', 'md', 'lg', 'xl', 'full'];
    allSizes.forEach((size) => {
      expect(sizeClasses[size]).toBeDefined();
      expect(typeof sizeClasses[size]).toBe('string');
    });
  });

  it('harus memiliki pemetaan lengkap untuk semua aspectRatioClasses', () => {
    const allAspects: VideoPlayerAspectRatio[] = ['16/9', '4/3', '1/1', '21/9', 'auto'];
    allAspects.forEach((aspect) => {
      expect(aspectRatioClasses[aspect]).toBeDefined();
      expect(typeof aspectRatioClasses[aspect]).toBe('string');
    });
  });

  it('harus memiliki pemetaan lengkap untuk semua objectFitClasses', () => {
    const allObjectFits: VideoPlayerObjectFit[] = ['contain', 'cover', 'fill', 'none', 'scale-down'];
    allObjectFits.forEach((fit) => {
      expect(objectFitClasses[fit]).toBeDefined();
      expect(typeof objectFitClasses[fit]).toBe('string');
    });
  });

  it('harus memiliki pemetaan lengkap untuk semua roundedClasses', () => {
    const allRounded: VideoPlayerRounded[] = [
      'none',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      'full',
    ];
    allRounded.forEach((rounded) => {
      expect(roundedClasses[rounded]).toBeDefined();
      expect(typeof roundedClasses[rounded]).toBe('string');
    });
  });

  it('harus memiliki pemetaan lengkap untuk semua variantClasses', () => {
    const allVariants: VideoPlayerVariant[] = ['default', 'card', 'elevated', 'ghost'];
    allVariants.forEach((variant) => {
      expect(variantClasses[variant]).toBeDefined();
      expect(typeof variantClasses[variant]).toBe('string');
    });
  });

  it('harus memiliki kelas Depth System -3 s/d 3 di depthClasses', () => {
    const expectedKeys = ['-3', '-2', '-1', '0', '1', '2', '3'];
    expectedKeys.forEach((key) => {
      expect(depthClasses[key]).toBeDefined();
      expect(typeof depthClasses[key]).toBe('string');
    });
  });

  describe('resolveDepthKey', () => {
    it('harus memetakan angka numeric -3..3 secara tepat', () => {
      expect(resolveDepthKey(-3)).toBe('-3');
      expect(resolveDepthKey(-2)).toBe('-2');
      expect(resolveDepthKey(-1)).toBe('-1');
      expect(resolveDepthKey(0)).toBe('0');
      expect(resolveDepthKey(1)).toBe('1');
      expect(resolveDepthKey(2)).toBe('2');
      expect(resolveDepthKey(3)).toBe('3');
    });

    it('harus memetakan alias named depth secara tepat', () => {
      expect(resolveDepthKey('sunken')).toBe(namedDepthMap['sunken']);
      expect(resolveDepthKey('flat')).toBe(namedDepthMap['flat']);
      expect(resolveDepthKey('raised-sm')).toBe(namedDepthMap['raised-sm']);
      expect(resolveDepthKey('raised-md')).toBe(namedDepthMap['raised-md']);
      expect(resolveDepthKey('raised-lg')).toBe(namedDepthMap['raised-lg']);
    });

    it('harus menggunakan default depth berdasarkan varian jika depth tidak diisi', () => {
      expect(resolveDepthKey(undefined, 'default')).toBe(String(defaultDepthByVariant.default));
      expect(resolveDepthKey(undefined, 'card')).toBe(String(defaultDepthByVariant.card));
      expect(resolveDepthKey(undefined, 'elevated')).toBe(String(defaultDepthByVariant.elevated));
      expect(resolveDepthKey(undefined, 'ghost')).toBe(String(defaultDepthByVariant.ghost));
    });

    it('harus mengembalikan fallback "1" jika nilai depth tidak dikenal', () => {
      // @ts-expect-error Pengujian nilai tak terduga
      expect(resolveDepthKey(99)).toBe('1');
      // @ts-expect-error Pengujian nilai tak terduga
      expect(resolveDepthKey('unknown-depth')).toBe('1');
    });
  });
});

describe('VideoPlayer Barrel Export', () => {
  it('harus mengekspor komponen utama dan sub-komponen dari folder internal', async () => {
    const barrel = await import('./index');
    expect(barrel.VideoPlayer).toBeDefined();
    expect(barrel.default).toBeDefined();
    expect(barrel.useVideoPlayer).toBeDefined();
    expect(barrel.VideoPlayerOverlay).toBeDefined();
    expect(barrel.VideoPlayerControls).toBeDefined();
    expect(barrel.VideoPlayerPlayButton).toBeDefined();
    expect(barrel.VideoPlayerSkipButton).toBeDefined();
    expect(barrel.VideoPlayerTimeline).toBeDefined();
    expect(barrel.VideoPlayerTimeDisplay).toBeDefined();
    expect(barrel.VideoPlayerVolume).toBeDefined();
    expect(barrel.VideoPlayerPlaybackRate).toBeDefined();
    expect(barrel.VideoPlayerSubtitleButton).toBeDefined();
    expect(barrel.VideoPlayerQualityButton).toBeDefined();
    expect(barrel.VideoPlayerSettingsMenu).toBeDefined();
    expect(barrel.VideoPlayerFullscreenButton).toBeDefined();
    expect(barrel.VideoPlayerSubtitles).toBeDefined();
    expect(barrel.VideoPlayerTextInfo).toBeDefined();
    expect(barrel.VideoPlayerContextMenu).toBeDefined();
    expect(barrel.useTextInfo).toBeDefined();
    expect(barrel.useVideoClickHandler).toBeDefined();
    expect(barrel.useContextMenu).toBeDefined();
    expect(barrel.formatTime).toBeDefined();
    expect(barrel.calculateProgress).toBeDefined();
    expect(barrel.parseVttTimeToSeconds).toBeDefined();
    expect(barrel.parseVttCues).toBeDefined();
    expect(barrel.findScrubbingCue).toBeDefined();
  });

  it('harus mengekspor VideoPlayer dari barrel level molecules', async () => {
    const moleculesBarrel = await import('../index');
    expect(moleculesBarrel.VideoPlayer).toBeDefined();
    expect(moleculesBarrel.VideoPlayerMolecule).toBeDefined();
  });
});
