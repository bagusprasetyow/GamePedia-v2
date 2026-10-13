import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatTime,
  clampValue,
  calculateProgress,
  calculateBufferedPercent,
  parseVttTimeToSeconds,
  parseVttCues,
  findScrubbingCue,
  getStoredVolume,
  setStoredVolume,
  VIDEO_VOLUME_STORAGE_KEY,
} from './VideoPlayer.utils';

describe('VideoPlayer.utils', () => {
  describe('formatTime', () => {
    it('harus memformat 0 detik menjadi "00:00"', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('harus memformat detik di bawah 1 menit dengan padding nol', () => {
      expect(formatTime(5)).toBe('00:05');
      expect(formatTime(59)).toBe('00:59');
    });

    it('harus memformat menit dan detik ("MM:SS")', () => {
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(599)).toBe('09:59');
      expect(formatTime(3599)).toBe('59:59');
    });

    it('harus memformat jam jika durasi mencapai atau melebihi 3600 detik ("HH:MM:SS")', () => {
      expect(formatTime(3600)).toBe('01:00:00');
      expect(formatTime(3665)).toBe('01:01:05');
      expect(formatTime(7325)).toBe('02:02:05');
    });

    it('harus mengembalikan "00:00" jika input NaN, Infinity, atau negatif', () => {
      expect(formatTime(NaN)).toBe('00:00');
      expect(formatTime(-10)).toBe('00:00');
      expect(formatTime(Infinity)).toBe('00:00');
    });
  });

  describe('clampValue', () => {
    it('harus mempertahankan nilai jika berada dalam batas min dan max', () => {
      expect(clampValue(5, 0, 10)).toBe(5);
      expect(clampValue(0.5, 0, 1)).toBe(0.5);
    });

    it('harus membatasi ke min jika nilai lebih kecil dari batas bawah', () => {
      expect(clampValue(-5, 0, 10)).toBe(0);
      expect(clampValue(-1, 0, 1)).toBe(0);
    });

    it('harus membatasi ke max jika nilai lebih besar dari batas atas', () => {
      expect(clampValue(15, 0, 10)).toBe(10);
      expect(clampValue(2, 0, 1)).toBe(1);
    });

    it('harus mengembalikan min jika input bernilai NaN', () => {
      expect(clampValue(NaN, 0, 100)).toBe(0);
    });
  });

  describe('calculateProgress', () => {
    it('harus mengembalikan 0 jika durasi bernilai 0 atau negatif', () => {
      expect(calculateProgress(10, 0)).toBe(0);
      expect(calculateProgress(10, -5)).toBe(0);
    });

    it('harus mengembalikan 0 jika currentTime bernilai 0 atau negatif', () => {
      expect(calculateProgress(0, 100)).toBe(0);
      expect(calculateProgress(-10, 100)).toBe(0);
    });

    it('harus menghitung persentase secara proporsional', () => {
      expect(calculateProgress(50, 100)).toBe(50);
      expect(calculateProgress(25, 100)).toBe(25);
      expect(calculateProgress(30, 60)).toBe(50);
    });

    it('harus membatasi persentase maksimum di 100%', () => {
      expect(calculateProgress(150, 100)).toBe(100);
    });
  });

  describe('calculateBufferedPercent', () => {
    it('harus mengembalikan 0 jika buffered null atau kosong', () => {
      expect(calculateBufferedPercent(null, 10, 100)).toBe(0);
    });

    it('harus mengembalikan 0 jika durasi bernilai 0 atau negatif', () => {
      const mockRanges = {
        length: 1,
        start: () => 0,
        end: () => 50,
      } as unknown as TimeRanges;
      expect(calculateBufferedPercent(mockRanges, 10, 0)).toBe(0);
      expect(calculateBufferedPercent(mockRanges, 10, -100)).toBe(0);
    });

    it('harus mengembalikan persentase buffer jika currentTime berada dalam range', () => {
      const mockRanges = {
        length: 1,
        start: () => 0,
        end: () => 60,
      } as unknown as TimeRanges;
      expect(calculateBufferedPercent(mockRanges, 20, 100)).toBe(60);
    });
  });

  describe('parseVttTimeToSeconds', () => {
    it('harus mengonversi format HH:MM:SS.mmm ke detik', () => {
      expect(parseVttTimeToSeconds('00:00:05.500')).toBe(5.5);
      expect(parseVttTimeToSeconds('01:02:03.000')).toBe(3723);
    });

    it('harus mengonversi format MM:SS.mmm ke detik', () => {
      expect(parseVttTimeToSeconds('02:30.000')).toBe(150);
      expect(parseVttTimeToSeconds('00:45.250')).toBe(45.25);
    });

    it('harus mengembalikan 0 untuk input kosong', () => {
      expect(parseVttTimeToSeconds('')).toBe(0);
    });
  });

  describe('parseVttCues', () => {
    it('harus mem-parse berkas WebVTT sprite sheet dengan koordinat #xywh', () => {
      const vttSample = `WEBVTT

00:00:00.000 --> 00:00:01.000
/thumbs/sprite_1.jpg#xywh=0,0,320,180

00:00:01.000 --> 00:00:02.000
/thumbs/sprite_1.jpg#xywh=320,0,320,180`;

      const cues = parseVttCues(vttSample);
      expect(cues).toHaveLength(2);
      expect(cues[0]).toEqual({
        start: 0,
        end: 1,
        imageUrl: '/thumbs/sprite_1.jpg',
        x: 0,
        y: 0,
        w: 320,
        h: 180,
      });
      expect(cues[1]).toEqual({
        start: 1,
        end: 2,
        imageUrl: '/thumbs/sprite_1.jpg',
        x: 320,
        y: 0,
        w: 320,
        h: 180,
      });
    });

    it('harus meresolusi baseUrl jika url gambar relatif', () => {
      const vttSample = `WEBVTT

00:00:00.000 --> 00:00:01.000
sprite_001.jpg#xywh=0,0,320,180`;

      const cues = parseVttCues(vttSample, '/videos/Genshin/scrubbing/thumbs.vtt');
      expect(cues).toHaveLength(1);
      expect(cues[0].imageUrl).toBe('/videos/Genshin/scrubbing/sprite_001.jpg');
    });

    it('harus mengembalikan array kosong untuk input kosong', () => {
      expect(parseVttCues('')).toEqual([]);
    });
  });

  describe('findScrubbingCue', () => {
    const mockCues = [
      { start: 0, end: 5, imageUrl: 'thumb.jpg', x: 0, y: 0, w: 320, h: 180 },
      { start: 5, end: 10, imageUrl: 'thumb.jpg', x: 320, y: 0, w: 320, h: 180 },
    ];

    it('harus menemukan cue yang tepat sesuai waktu target', () => {
      const cue = findScrubbingCue(mockCues, 2.5);
      expect(cue).toBe(mockCues[0]);

      const cue2 = findScrubbingCue(mockCues, 7.8);
      expect(cue2).toBe(mockCues[1]);
    });

    it('harus mengembalikan cue pertama jika targetTime sebelum start pertama', () => {
      expect(findScrubbingCue(mockCues, -5)).toBe(mockCues[0]);
    });

    it('harus mengembalikan cue terakhir jika targetTime melebihi durasi', () => {
      expect(findScrubbingCue(mockCues, 99)).toBe(mockCues[1]);
    });

    it('harus mengembalikan null jika daftar cues kosong', () => {
      expect(findScrubbingCue([], 5)).toBeNull();
    });
  });

  describe('Storage Volume Persistence', () => {
    let mockStorage: Record<string, string> = {};

    beforeEach(() => {
      mockStorage = {};
      const storageMock = {
        getItem: (key: string) => mockStorage[key] ?? null,
        setItem: (key: string, val: string) => {
          mockStorage[key] = val;
        },
        removeItem: (key: string) => {
          delete mockStorage[key];
        },
        clear: () => {
          mockStorage = {};
        },
      };

      vi.stubGlobal('window', {
        localStorage: storageMock,
      });
      vi.stubGlobal('localStorage', storageMock);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('harus mengembalikan fallback jika window bernilai undefined (SSR / non-browser)', () => {
      vi.unstubAllGlobals();
      expect(getStoredVolume(0.5)).toBe(0.5);
    });

    it('harus mengembalikan fallback (1) jika belum ada nilai yang disimpan di LocalStorage', () => {
      expect(getStoredVolume()).toBe(1);
      expect(getStoredVolume(0.75)).toBe(0.75);
    });

    it('harus menyimpan dan membaca volume yang disimpan di LocalStorage', () => {
      setStoredVolume(0.42);
      expect(mockStorage[VIDEO_VOLUME_STORAGE_KEY]).toBe('0.42');
      expect(getStoredVolume()).toBe(0.42);
    });

    it('harus membatasi volume ke rentang [0, 1] saat disimpan dan dibaca', () => {
      setStoredVolume(1.5);
      expect(getStoredVolume()).toBe(1);

      setStoredVolume(-0.5);
      expect(getStoredVolume()).toBe(0);

      mockStorage[VIDEO_VOLUME_STORAGE_KEY] = 'invalid_number';
      expect(getStoredVolume(0.8)).toBe(0.8);
    });
  });
});
