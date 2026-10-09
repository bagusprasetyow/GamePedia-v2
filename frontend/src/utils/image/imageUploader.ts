import type {
  UploadImageToServerOptions,
  ImageUploadServerResponse,
} from './image.types';

const API_BASE_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4003'
).replace(/\/+$/, '');

/**
 * URL default endpoint upload storage backend
 */
export const DEFAULT_STORAGE_UPLOAD_URL = `${API_BASE_URL}/storage/upload`;

/**
 * Mengunggah berkas gambar ke backend storage API dengan dukungan sub-path dinamis dan pelacakan progres.
 *
 * @param {UploadImageToServerOptions} options Konfigurasi pengunggahan
 * @returns {Promise<ImageUploadServerResponse>} Respons data penyimpanan dari server
 */
export function uploadImageToServer(
  options: UploadImageToServerOptions
): Promise<ImageUploadServerResponse> {
  const {
    file,
    path = '',
    uploadUrl = DEFAULT_STORAGE_UPLOAD_URL,
    headers = {},
    onProgress,
    signal,
    timeout = 60_000,
  } = options;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Pengunggahan gambar dibatalkan', 'AbortError'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    if (path) {
      formData.append('path', path);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);
    xhr.timeout = timeout;

    // Pasang custom headers jika ada
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    // Pantau progres pengunggahan
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    const cleanupSignalListener = () => {
      if (signal) {
        signal.removeEventListener('abort', onAbortSignal);
      }
    };

    const onAbortSignal = () => {
      xhr.abort();
    };

    if (signal) {
      signal.addEventListener('abort', onAbortSignal, { once: true });
    }

    xhr.onload = () => {
      cleanupSignalListener();
      try {
        const responseText = xhr.responseText;
        const jsonResponse = JSON.parse(responseText || '{}');

        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100);
          resolve(jsonResponse as ImageUploadServerResponse);
        } else {
          const errorMessage =
            jsonResponse?.message ||
            `Gagal mengunggah berkas ke server (HTTP ${xhr.status})`;
          reject(new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage));
        }
      } catch (err) {
        reject(
          new Error(
            `Respon server tidak valid saat upload (HTTP ${xhr.status}): ${
              err instanceof Error ? err.message : String(err)
            }`
          )
        );
      }
    };

    xhr.onerror = () => {
      cleanupSignalListener();
      reject(new Error('Koneksi ke server penyimpanan gambar gagal'));
    };

    xhr.ontimeout = () => {
      cleanupSignalListener();
      reject(new Error(`Waktu permintaan pengunggahan gambar habis (timeout ${timeout}ms)`));
    };

    xhr.onabort = () => {
      cleanupSignalListener();
      reject(new DOMException('Pengunggahan gambar dibatalkan', 'AbortError'));
    };

    xhr.send(formData);
  });
}

/**
 * Menghapus berkas gambar dari backend storage API
 *
 * @param {string} filePath Path atau URL berkas gambar di server penyimpanan
 * @param {string} [baseUrl] URL basis backend API
 * @returns {Promise<{ success: boolean; message: string }>} Hasil penghapusan berkas
 */
export async function deleteImageFromServer(
  filePath: string,
  baseUrl: string = API_BASE_URL
): Promise<{ success: boolean; message: string }> {
  const url = `${baseUrl}/storage/file?path=${encodeURIComponent(filePath)}`;
  const response = await fetch(url, { method: 'DELETE' });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || `Gagal menghapus gambar (HTTP ${response.status})`);
  }
  return data;
}
