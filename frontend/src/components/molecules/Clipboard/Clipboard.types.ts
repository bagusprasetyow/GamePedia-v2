import type { ReactNode } from 'react';
import type { ButtonSize, ButtonDepth, ButtonRounded } from '@/components/atoms/Button/Button.types';

export type ClipboardVariant = 'terminal' | 'ghost' | 'outline' | 'primary' | 'secondary' | 'contrast';

export interface ClipboardProps {
  /**
   * Teks yang akan disalin ke clipboard pengguna.
   * Dapat berupa string langsung atau fungsi resolver yang mengembalikan string / Promise<string>.
   */
  text?: string | (() => string | Promise<string>);

  /**
   * Status copied yang dikontrol dari luar (controlled mode).
   * Jika tidak disediakan, Clipboard akan mengelola statusnya sendiri secara mandiri (uncontrolled).
   */
  copied?: boolean;

  /**
   * Handler klik tambahan saat tombol ditekan.
   */
  onClick?: () => void;

  /**
   * Label teks tombol saat dalam status idle (belum disalin).
   * @default 'Salin'
   */
  label?: ReactNode;

  /**
   * Label teks tombol saat berhasil disalin.
   * @default 'Tersalin!'
   */
  copiedLabel?: ReactNode;

  /**
   * Nama iconify string atau elemen ikon kustom saat dalam status idle.
   * @default 'mdi:content-copy'
   */
  icon?: string | ReactNode;

  /**
   * Nama iconify string atau elemen ikon kustom saat berhasil disalin.
   * @default 'mdi:check'
   */
  copiedIcon?: string | ReactNode;

  /**
   * Jika true, hanya merender ikon tombol salin tanpa label teks.
   * @default false
   */
  isIconOnly?: boolean;

  /**
   * Varian visual tombol Clipboard.
   * - 'terminal': Bergaya terminal gelap konsisten dengan SourceCode window
   * - 'ghost': Latar transparan dengan tactile hover & active feedback
   * - 'outline': Berbingkai border netral dengan latar kartu
   * - 'primary': Menggunakan warna brand primary
   * - 'secondary': Menggunakan warna secondary
   * - 'contrast': Menggunakan kontras tinggi
   * @default 'terminal'
   */
  variant?: ClipboardVariant;

  /**
   * Ukuran tombol.
   * @default 'xs'
   */
  size?: ButtonSize;

  /**
   * Tingkat kedalaman visual shadow (Depth System skala -3 s/d 3).
   * @default 0
   */
  depth?: ButtonDepth;

  /**
   * Kelengkungan sudut border tombol.
   * @default 'lg'
   */
  rounded?: ButtonRounded;

  /**
   * Durasi tampilan status berhasil disalin dalam satuan milidetik sebelum kembali ke status idle.
   * @default 2000
   */
  duration?: number;

  /**
   * Menonaktifkan interaksi tombol.
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback yang dieksekusi saat teks berhasil disalin ke clipboard.
   */
  onCopy?: (copiedText: string) => void;

  /**
   * Callback penanganan kesalahan jika penyalinan ke clipboard gagal.
   */
  onError?: (error: unknown) => void;

  /**
   * ClassName kustom tambahan untuk wadah tombol.
   */
  className?: string;
}

/**
 * Props untuk sub-komponen ikon dinamis Clipboard.
 */
export interface ClipboardIconProps {
  /**
   * Status apakah teks sedang dalam kondisi berhasil disalin.
   */
  copied: boolean;

  /**
   * Varian tombol Clipboard untuk resolusi warna ikon.
   * @default 'terminal'
   */
  variant?: ClipboardVariant;

  /**
   * Ukuran atom Button/Icon.
   * @default 'xs'
   */
  size?: ButtonSize;

  /**
   * Ikon saat status idle.
   * @default 'mdi:content-copy'
   */
  icon?: string | ReactNode;

  /**
   * Ikon saat status copied.
   * @default 'mdi:check'
   */
  copiedIcon?: string | ReactNode;

  /**
   * ClassName kustom tambahan untuk elemen ikon.
   */
  className?: string;
}

/**
 * Props untuk sub-komponen teks label Clipboard.
 */
export interface ClipboardLabelProps {
  /**
   * Status apakah teks sedang dalam kondisi berhasil disalin.
   */
  copied: boolean;

  /**
   * Label saat status idle.
   * @default 'Salin'
   */
  label?: ReactNode;

  /**
   * Label saat status copied.
   * @default 'Tersalin!'
   */
  copiedLabel?: ReactNode;

  /**
   * ClassName kustom tambahan untuk teks label.
   */
  className?: string;
}

