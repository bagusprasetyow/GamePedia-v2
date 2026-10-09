import type { HTMLAttributes, ReactNode } from 'react';
import type {
  DepthNumeric,
  DepthString,
  DepthNamed,
} from '@/components/atoms/Button/Button.types';
import type {
  CompressImageOptions,
  ConvertImageOptions,
  TargetImageFormat,
  ImageUploadServerResponse,
  ImageUploadServerData,
} from '@/utils/image';

export {
  SUPPORTED_IMAGE_MIME_TYPES,
  DEFAULT_ACCEPTED_IMAGE_TYPES,
} from '@/utils/image';

export type { DepthNamed };
export type {
  CompressImageOptions,
  ConvertImageOptions,
  TargetImageFormat,
  ImageUploadServerResponse,
  ImageUploadServerData,
};

export type ImageUploadSize = 'sm' | 'md' | 'lg' | 'xl';

export type ImageUploadVariant = 'dashed' | 'solid' | 'ghost';

export type ImageUploadRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type ImageUploadAspectRatio = 'square' | 'video' | 'portrait' | 'wide' | 'auto';

export type ImageUploadDepth = DepthNumeric | DepthString | DepthNamed;

export interface ImageUploadFileDetails {
  /**
   * Nama file gambar.
   */
  name: string;
  /**
   * Ukuran file gambar dalam byte.
   */
  size: number;
  /**
   * Ukuran file yang sudah diformat ramah pengguna (contoh: "1.4 MB").
   */
  formattedSize: string;
  /**
   * Tipe MIME file (contoh: "image/png").
   */
  type: string;
  /**
   * Ukuran asli sebelum kompresi dalam byte (jika gambar dikompresi).
   */
  originalSize?: number;
  /**
   * Ukuran asli sebelum kompresi yang sudah diformat (contoh: "2.4 MB").
   */
  originalFormattedSize?: string;
}

export interface ImageUploadCustomProps {
  /**
   * Nilai gambar terpilih saat ini (URL gambar atau objek File).
   */
  value?: string | File | null;

  /**
   * Nilai default awal gambar (uncontrolled).
   */
  defaultValue?: string | File | null;

  /**
   * Callback ketika berkas gambar berubah atau dihapus.
   */
  onChange?: (file: File | null, previewUrl: string | null) => void;

  /**
   * Callback saat terjadi kesalahan validasi ukuran, tipe berkas, atau pemrosesan gambar.
   */
  onError?: (errorMessage: string) => void;

  /**
   * Tipe file gambar yang diizinkan untuk diunggah (Single Source of Truth: DEFAULT_ACCEPTED_IMAGE_TYPES).
   * @default 'image/jpeg, image/png, image/webp, image/avif'
   */
  accept?: string;

  /**
   * Batas ukuran maksimum berkas gambar dalam Megabyte (MB).
   * @default 5
   */
  maxSizeMB?: number;

  /**
   * Konfigurasi kompresi otomatis untuk gambar yang diunggah.
   * Jika bernilai `true`, gambar akan dikompresi menggunakan kualitas default (0.8).
   * @default false
   */
  compress?: boolean | CompressImageOptions;

  /**
   * Format target atau konfigurasi konversi otomatis saat berkas dipilih/di-drop.
   * Contoh: 'webp', 'image/webp', atau { format: 'webp', quality: 0.9 }.
   */
  convertTo?: TargetImageFormat | ConvertImageOptions;

  /**
   * Callback saat status proses kompresi atau konversi gambar berubah.
   */
  onProcessingChange?: (isProcessing: boolean) => void;

  /**
   * Sub-path folder penyimpanan di backend relatif terhadap `data/storage/image`.
   * Contoh: '/game', 'game', 'users/avatar'.
   * Jika diatur, backend akan menyimpan gambar di data/storage/image/<uploadPath>.
   */
  uploadPath?: string;

  /**
   * URL endpoint upload backend.
   * @default 'http://localhost:4003/storage/upload'
   */
  uploadUrl?: string;

  /**
   * Menentukan apakah berkas otomatis diunggah ke backend setelah gambar dipilih/diproses.
   * @default true jika uploadPath atau uploadUrl disediakan, false jika tidak ada
   */
  autoUpload?: boolean;

  /**
   * Callback saat berkas gambar berhasil diunggah ke server penyimpanan backend.
   */
  onUploadSuccess?: (response: ImageUploadServerResponse) => void;

  /**
   * Callback saat pengunggahan gambar ke server penyimpanan gagal.
   */
  onUploadError?: (error: Error | string) => void;

  /**
   * Skala ukuran komponen dropzone image upload.
   * @default 'md'
   */
  size?: ImageUploadSize;

  /**
   * Varian visual border dan latar belakang dropzone.
   * - 'dashed': Border garis putus-putus standar drop area
   * - 'solid': Border solid tegas dengan background card
   * - 'ghost': Transparan tanpa border tegas hingga di-hover
   * @default 'dashed'
   */
  variant?: ImageUploadVariant;

  /**
   * Radius sudut lengkungan (border-radius).
   * @default 'lg'
   */
  rounded?: ImageUploadRounded;

  /**
   * Rasio aspek tampilan kotak gambar.
   * - 'square': 1:1
   * - 'video': 16:9
   * - 'portrait': 3:4
   * - 'wide': 21:9
   * - 'auto': Tinggi menyesuaikan konten
   * @default 'video'
   */
  aspectRatio?: ImageUploadAspectRatio;

  /**
   * Tingkat kedalaman visual taktil (Depth System: -3 s/d 3).
   * @default 0
   */
  depth?: ImageUploadDepth;

  /**
   * Label teks di atas bidang upload.
   */
  label?: ReactNode;

  /**
   * Deskripsi atau teks petunjuk di bawah label.
   */
  description?: ReactNode;

  /**
   * Pesan kesalahan validasi eksternal atau form-level.
   */
  error?: ReactNode;

  /**
   * Status validasi sukses.
   * @default false
   */
  success?: boolean;

  /**
   * Status apakah proses interaksi dan upload dinonaktifkan.
   * @default false
   */
  disabled?: boolean;

  /**
   * Menandakan proses pengunggahan gambar sedang berlangsung.
   * @default false
   */
  isUploading?: boolean;

  /**
   * Persentase progres upload gambar (0 - 100).
   * @default 0
   */
  progress?: number;

  /**
   * Mengizinkan gambar dihapus/dibersihkan kembali ke state kosong.
   * @default true
   */
  clearable?: boolean;

  /**
   * Menampilkan informasi nama dan ukuran file di bawah pratinjau.
   * @default true
   */
  showFileInfo?: boolean;

  /**
   * Teks utama di area placeholder dropzone.
   * @default 'Pilih atau seret gambar ke sini'
   */
  placeholderTitle?: ReactNode;

  /**
   * Teks instruksi format di bawah judul placeholder.
   */
  placeholderSubtitle?: ReactNode;

  /**
   * Ikon Iconify yang ditampilkan di tengah area dropzone.
   * @default 'lucide:upload-cloud'
   */
  icon?: string;

  /**
   * Teks atribut alt untuk elemen gambar pratinjau.
   * @default 'Pratinjau gambar terunggah'
   */
  alt?: string;

  /**
   * ClassName tambahan untuk kontainer pembungkus terluar.
   */
  wrapperClassName?: string;
}

export type ImageUploadProps = ImageUploadCustomProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof ImageUploadCustomProps | 'defaultValue' | 'onChange' | 'onError'>;

// Props Sub-Komponen Internal
export interface ImageUploadDropzoneProps {
  icon: string;
  title: ReactNode;
  subtitle: ReactNode;
  size: ImageUploadSize;
  disabled: boolean;
  isDragging: boolean;
  onBrowse: () => void;
}

export interface ImageUploadPreviewProps {
  previewUrl: string;
  alt: string;
  aspectRatio: ImageUploadAspectRatio;
  disabled: boolean;
  isUploading: boolean;
  onBrowse: () => void;
  onClear: () => void;
  clearable: boolean;
}

export interface ImageUploadProgressProps {
  progress?: number;
  label?: ReactNode;
  indeterminate?: boolean;
}

export interface ImageUploadInfoProps {
  fileDetails: ImageUploadFileDetails | null;
  onClear?: () => void;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ImageUploadActionsProps {
  onBrowse: () => void;
  onClear: () => void;
  clearable: boolean;
  disabled: boolean;
  className?: string;
}

