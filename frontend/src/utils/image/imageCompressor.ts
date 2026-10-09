import type { CompressImageOptions } from './image.types';
import {
  calculateDimensions,
  loadImageElement,
  normalizeImageFormat,
} from './image.helpers';

/**
 * Helper internal untuk mengekspor Canvas ke objek Blob secara asynchronous.
 *
 * @param {HTMLCanvasElement} canvas - Elemen kanvas browser
 * @param {string} mimeType - Tipe MIME berkas gambar
 * @param {number} quality - Kualitas kompresi berkas (0.01 - 1.0)
 * @returns {Promise<Blob>} Objek Blob berkas gambar
 */
function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Gagal mengekspor hasil kompresi gambar ke ${mimeType}`));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

/**
 * Mengompresi berkas gambar menggunakan HTML5 Canvas API.
 * Mendukung pembatasan resolusi maksimum (maxWidth/maxHeight), penyesuaian kualitas lossy,
 * serta optimasi cerdas bertahap hingga mencapai target batas ukuran (contoh: di bawah 100 KB atau 200 KB).
 *
 * @param {File} file - Berkas File gambar sumber
 * @param {CompressImageOptions} [options] - Opsi konfigurasi kompresi gambar
 * @returns {Promise<File>} Berkas File gambar baru hasil kompresi
 *
 * @example
 * ```ts
 * // Kompresi dengan target ukuran spesifik di bawah 100 KB
 * const compressedFile = await compressImage(originalFile, {
 *   maxSizeKB: 100,
 * });
 * ```
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  const {
    quality = 0.8,
    maxWidth,
    maxHeight,
    mimeType,
    maxSizeKB,
    minQuality = 0.1,
    maxIterations = 10,
    backgroundColor = '#FFFFFF',
    strictMaxSize = false,
  } = options;

  let currentQuality = Math.min(1.0, Math.max(0.01, quality));
  const safeMinQuality = Math.min(currentQuality, Math.max(0.01, minQuality));

  const targetMime = mimeType
    ? normalizeImageFormat(mimeType)
    : (file.type ? normalizeImageFormat(file.type) : 'image/jpeg');

  const img = await loadImageElement(file);
  let { width: currentWidth, height: currentHeight } = calculateDimensions(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    maxWidth,
    maxHeight
  );

  const targetMaxBytes = maxSizeKB && maxSizeKB > 0 ? maxSizeKB * 1024 : undefined;

  // Jika terdapat target maxSizeKB yang ketat (misal <= 150 KB) dan resolusi awal sangat besar (seperti 4K):
  // Batasi dimensi awal maksimal ke ~2 Megapixels agar tidak membuang iterasi mengecilkan gambar raksasa
  if (targetMaxBytes && targetMaxBytes <= 150 * 1024) {
    const maxInitialPixels = 1920 * 1080;
    const initialPixels = currentWidth * currentHeight;
    if (initialPixels > maxInitialPixels) {
      const initialScale = Math.sqrt(maxInitialPixels / initialPixels);
      currentWidth = Math.round(currentWidth * initialScale);
      currentHeight = Math.round(currentHeight * initialScale);
    }
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Gagal menginisialisasi 2D Canvas context untuk kompresi');
  }

  const renderToCanvas = (w: number, h: number) => {
    canvas.width = w;
    canvas.height = h;
    if (targetMime === 'image/jpeg') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.clearRect?.(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
  };

  renderToCanvas(currentWidth, currentHeight);
  let currentBlob = await exportCanvasToBlob(canvas, targetMime, currentQuality);

  // Jika terdapat target ukuran (misal di bawah 100KB atau 200KB) dan ukuran saat ini masih melebihi:
  if (targetMaxBytes && currentBlob.size > targetMaxBytes) {
    let iteration = 0;
    let bestBlob = currentBlob;

    const isLossless = targetMime === 'image/png';

    while (iteration < maxIterations && currentBlob.size > targetMaxBytes) {
      iteration++;
      const sizeRatio = targetMaxBytes / currentBlob.size;

      // 1. Kurangi kualitas gambar jika format lossy, masih di atas kualitas minimum, dan selisih tidak terlalu ekstrem
      if (!isLossless && currentQuality > safeMinQuality + 0.05 && sizeRatio >= 0.5) {
        const newQuality = Math.max(
          safeMinQuality,
          Math.min(currentQuality - 0.05, currentQuality * Math.sqrt(sizeRatio) * 0.95)
        );
        currentQuality = Math.round(newQuality * 100) / 100;
      } else {
        // 2. Skalakan resolusi dimensi secara adaptif proporsional
        const scaleFactor = Math.max(0.35, Math.min(0.88, Math.sqrt(sizeRatio) * 0.94));
        currentWidth = Math.max(40, Math.round(currentWidth * scaleFactor));
        currentHeight = Math.max(40, Math.round(currentHeight * scaleFactor));
        renderToCanvas(currentWidth, currentHeight);

        if (!isLossless && currentQuality < 0.45) {
          // Naikkan sedikit kualitas jika resolusi sudah dipangkas agar tidak pecah/blur
          currentQuality = Math.min(0.6, currentQuality + 0.1);
        }
      }

      currentBlob = await exportCanvasToBlob(canvas, targetMime, currentQuality);
      if (currentBlob.size < bestBlob.size) {
        bestBlob = currentBlob;
      }
    }

    // 3. Garansi absolut: Jika setelah loop ukuran masih melebihi targetMaxBytes,
    // pangkas resolusi kanvas hingga ukuran biner PASTI berada di bawah batas targetMaxBytes
    while (currentBlob.size > targetMaxBytes && (currentWidth > 60 || currentHeight > 60)) {
      const sizeRatio = targetMaxBytes / currentBlob.size;
      const finalScale = Math.max(0.3, Math.min(0.85, Math.sqrt(sizeRatio) * 0.92));
      currentWidth = Math.max(40, Math.round(currentWidth * finalScale));
      currentHeight = Math.max(40, Math.round(currentHeight * finalScale));
      renderToCanvas(currentWidth, currentHeight);
      currentBlob = await exportCanvasToBlob(canvas, targetMime, safeMinQuality);
      if (currentBlob.size < bestBlob.size) {
        bestBlob = currentBlob;
      }
    }

    if (currentBlob.size <= targetMaxBytes) {
      bestBlob = currentBlob;
    } else if (strictMaxSize) {
      throw new Error(
        `Gagal mengompresi gambar di bawah target ${maxSizeKB} KB setelah ${iteration} iterasi`
      );
    }

    currentBlob = bestBlob;
  }

  return new File([currentBlob], file.name, {
    type: currentBlob.type || targetMime,
    lastModified: Date.now(),
  });
}
