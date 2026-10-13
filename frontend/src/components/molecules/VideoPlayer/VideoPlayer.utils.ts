/**
 * Utilitas murni untuk VideoPlayer.
 */

/**
 * Format detik ke format waktu string ramah pengguna ("MM:SS" atau "HH:MM:SS").
 *
 * @param {number} seconds - Jumlah detik
 * @returns {string} String waktu terformat
 *
 * @example
 * formatTime(65) // "01:05"
 * formatTime(3665) // "01:01:05"
 * formatTime(NaN) // "00:00"
 */
export const formatTime = (seconds: number): string => {
  if (typeof seconds !== 'number' || isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return '00:00';
  }

  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const paddedMins = String(mins).padStart(2, '0');
  const paddedSecs = String(secs).padStart(2, '0');

  if (hrs > 0) {
    const paddedHrs = String(hrs).padStart(2, '0');
    return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
  }

  return `${paddedMins}:${paddedSecs}`;
};

/**
 * Batasi nilai numerik dalam rentang minimum dan maksimum.
 *
 * @param {number} value - Nilai input
 * @param {number} min - Batas bawah
 * @param {number} max - Batas atas
 * @returns {number} Nilai yang telah dibatasi
 */
export const clampValue = (value: number, min: number, max: number): number => {
  if (isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

/**
 * Kunci LocalStorage untuk persistensi level volume suara VideoPlayer.
 */
export const VIDEO_VOLUME_STORAGE_KEY = 'gp_video_volume';

/**
 * Membaca volume video tersimpan dari LocalStorage.
 *
 * @param {number} [fallback=1] - Volume default jika belum tersimpan atau tidak valid (0.0 s/d 1.0)
 * @returns {number} Volume tersimpan (0.0 s/d 1.0)
 */
export const getStoredVolume = (fallback: number = 1): number => {
  if (typeof window === 'undefined') {
    return clampValue(fallback, 0, 1);
  }
  try {
    const saved = localStorage.getItem(VIDEO_VOLUME_STORAGE_KEY);
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!Number.isNaN(parsed)) {
        return clampValue(parsed, 0, 1);
      }
    }
  } catch {
    // Abaikan jika LocalStorage diblokir oleh browser / environment non-browser
  }
  return clampValue(fallback, 0, 1);
};

/**
 * Menyimpan volume video ke LocalStorage.
 *
 * @param {number} volume - Volume yang akan disimpan (0.0 s/d 1.0)
 */
export const setStoredVolume = (volume: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const clamped = clampValue(volume, 0, 1);
    localStorage.setItem(VIDEO_VOLUME_STORAGE_KEY, String(clamped));
  } catch {
    // Abaikan jika LocalStorage diblokir oleh browser
  }
};


/**
 * Hitung persentase durasi pemutaran (0 - 100%).
 *
 * @param {number} currentTime - Waktu saat ini (detik)
 * @param {number} duration - Total durasi video (detik)
 * @returns {number} Persentase pemutaran antara 0 hingga 100
 */
export const calculateProgress = (currentTime: number, duration: number): number => {
  if (!duration || duration <= 0 || isNaN(currentTime) || currentTime <= 0) {
    return 0;
  }
  const percent = (currentTime / duration) * 100;
  return clampValue(percent, 0, 100);
};

/**
 * Hitung persentase buffer video yang sudah terunduh di sekitar waktu pemutaran.
 *
 * @param {TimeRanges | null} buffered - Objek TimeRanges dari elemen video
 * @param {number} currentTime - Waktu putar saat ini
 * @param {number} duration - Total durasi video
 * @returns {number} Persentase buffer antara 0 hingga 100
 */
export const calculateBufferedPercent = (
  buffered: TimeRanges | null,
  currentTime: number,
  duration: number
): number => {
  if (!buffered || buffered.length === 0 || !duration || duration <= 0) {
    return 0;
  }

  for (let i = 0; i < buffered.length; i++) {
    const start = buffered.start(i);
    const end = buffered.end(i);
    if (currentTime >= start && currentTime <= end) {
      return clampValue((end / duration) * 100, 0, 100);
    }
  }

  // Jika currentTime belum berada di dalam range (misal di awal), ambil end dari range pertama
  if (buffered.length > 0) {
    return clampValue((buffered.end(buffered.length - 1) / duration) * 100, 0, 100);
  }

  return 0;
};

export interface ScrubbingCue {
  start: number;
  end: number;
  imageUrl: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Konversi timestamp string format WebVTT ("00:01:23.450" atau "01:23.450") ke satuan detik float.
 */
export const parseVttTimeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length === 3) {
    const hrs = parseFloat(parts[0]) || 0;
    const mins = parseFloat(parts[1]) || 0;
    const secs = parseFloat(parts[2]) || 0;
    return hrs * 3600 + mins * 60 + secs;
  }
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins * 60 + secs;
  }
  return parseFloat(timeStr) || 0;
};

/**
 * Urai isi berkas teks WebVTT sprite sheet menjadi array cue koordinat pratinjau.
 *
 * @param {string} vttText Konten string berkas WebVTT
 * @returns {ScrubbingCue[]} Daftar cue pratinjau
 */
export const parseVttCues = (vttText: string, baseUrl?: string): ScrubbingCue[] => {
  if (!vttText || typeof vttText !== 'string') return [];

  const cues: ScrubbingCue[] = [];
  const lines = vttText.split(/\r?\n/);

  let currentStart = 0;
  let currentEnd = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes('-->')) {
      const [startStr, endStr] = line.split('-->');
      currentStart = parseVttTimeToSeconds(startStr);
      // Hapus opsi tambahan di akhir timestamp jika ada
      const cleanEndStr = (endStr || '').trim().split(' ')[0];
      currentEnd = parseVttTimeToSeconds(cleanEndStr);
    } else if (line.includes('#xywh=')) {
      const [imgUrl, hash] = line.split('#xywh=');
      if (imgUrl && hash) {
        const [x, y, w, h] = hash.split(',').map((val) => parseInt(val, 10));
        if (!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h)) {
          let finalImgUrl = imgUrl;
          if (baseUrl && !imgUrl.startsWith('http') && !imgUrl.startsWith('/')) {
            const lastSlash = baseUrl.lastIndexOf('/');
            const basePath = lastSlash !== -1 ? baseUrl.substring(0, lastSlash + 1) : '';
            finalImgUrl = basePath + imgUrl;
          }

          cues.push({
            start: currentStart,
            end: currentEnd,
            imageUrl: finalImgUrl,
            x,
            y,
            w,
            h,
          });
        }
      }
    }
  }

  return cues;
};

/**
 * Temukan cue pratinjau thumbnail scrubbing yang aktif pada waktu tertentu
 * dengan algoritma Binary Search O(log N) untuk kinerja scrubbing instan 60fps.
 *
 * @param {ScrubbingCue[]} cues - Daftar cue terurut berdasarkan waktu awal
 * @param {number} targetTime - Waktu target (detik)
 * @returns {ScrubbingCue | null} Cue pratinjau yang cocok atau fallback terdekat
 */
export const findScrubbingCue = (
  cues: ScrubbingCue[],
  targetTime: number
): ScrubbingCue | null => {
  if (!cues || cues.length === 0 || isNaN(targetTime)) return null;

  const lastIdx = cues.length - 1;

  // Batas bawah dan atas instan
  if (targetTime < cues[0].start) return cues[0];
  if (targetTime >= cues[lastIdx].end) return cues[lastIdx];

  let low = 0;
  let high = lastIdx;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const cue = cues[mid];

    if (targetTime >= cue.start && targetTime < cue.end) {
      return cue;
    }

    if (targetTime < cue.start) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  // Fallback ke cue terdekat jika waktu jatuh di antara celah/gap
  const clampedIdx = clampValue(low, 0, lastIdx);
  return cues[clampedIdx] || null;
};
