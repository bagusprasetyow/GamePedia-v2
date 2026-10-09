/**
 * Entitas representasi berkas gambar yang berhasil disimpan di storage
 */
export interface StorageFileEntity {
  /**
   * Nama berkas unik yang tersimpan di sistem berkas
   * Contoh: '1712345678-a1b2c3d4.webp'
   */
  filename: string;

  /**
   * Nama asli berkas yang diunggah oleh pengguna
   * Contoh: 'cover.png'
   */
  originalName: string;

  /**
   * Sub-direktori penyimpanan yang telah disanitasi
   * Contoh: 'game'
   */
  subPath: string;

  /**
   * Path relatif dari berkas terhadap root direktori monorepo data/storage/image
   * Contoh: 'data/storage/image/game/1712345678-a1b2c3d4.webp'
   */
  relativeFilePath: string;

  /**
   * URL publik untuk mengakses berkas gambar secara statis
   * Contoh: '/storage/image/game/1712345678-a1b2c3d4.webp'
   */
  url: string;

  /**
   * Ukuran berkas dalam bytes
   */
  size: number;

  /**
   * MIME Type gambar (misal: 'image/webp')
   */
  mimeType: string;
}
