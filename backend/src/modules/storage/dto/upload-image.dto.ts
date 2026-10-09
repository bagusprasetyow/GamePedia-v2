/**
 * Data Transfer Object untuk permintaan pengunggahan gambar
 */
export class UploadImageDto {
  /**
   * Sub-direktori penyimpanan gambar relatif terhadap root penyimpanan (data/storage/image).
   * Contoh: 'game', '/game', 'users/avatar'
   * @default '' (root direktori penyimpanan gambar)
   */
  path?: string;
}
