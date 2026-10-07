import type { InputHTMLAttributes, ReactNode } from 'react';
import type { DepthNumeric, DepthString, DepthNamed } from '@/components/atoms/Button/Button.types';

export type SliderSize = 'sm' | 'md' | 'lg';

export type SliderOrientation = 'horizontal' | 'vertical';

export type SliderDirection = 'normal' | 'reverse';

export type SliderColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type SliderDepth = DepthNumeric | DepthString | DepthNamed;

export type SliderValuePosition = 'top' | 'bottom' | 'tooltip';

export type SliderSingleValue = number;

export type SliderRangeValue = [number, number];

export type SliderValue = SliderSingleValue | SliderRangeValue;

export interface SliderMark {
  /**
   * Nilai numerik penanda pada track slider.
   */
  value: number;

  /**
   * Label teks atau elemen visual untuk penanda.
   */
  label?: ReactNode;

  /**
   * Menonaktifkan pemilihan penanda ini.
   * @default false
   */
  disabled?: boolean;
}

export interface SliderBaseProps {
  /**
   * Batas nilai minimum slider.
   * @default 0
   */
  min?: number;

  /**
   * Batas nilai maksimum slider.
   * @default 100
   */
  max?: number;

  /**
   * Besaran kelipatan pergeseran nilai slider.
   * @default 1
   */
  step?: number;

  /**
   * Orientasi tata letak slider ('horizontal' atau 'vertical').
   * @default 'horizontal'
   */
  orientation?: SliderOrientation;

  /**
   * Arah pertambahan nilai slider ('normal' atau 'reverse').
   * - normal: horizontal kiri->kanan, vertikal bawah->atas
   * - reverse: horizontal kanan->kiri, vertikal atas->bawah
   * @default 'normal'
   */
  direction?: SliderDirection;

  /**
   * Skala ukuran fisik slider.
   * @default 'md'
   */
  size?: SliderSize;

  /**
   * Varian warna semantik slider (menggunakan tema GamePedia Design System).
   * @default 'primary'
   */
  color?: SliderColor;

  /**
   * Tingkat kedalaman visual taktil (Depth System: -3 s/d 3).
   * Bawaan menggunakan alur cekung (-1) untuk trek.
   * @default -1
   */
  depth?: SliderDepth;

  /**
   * Label teks atau elemen React di atas slider.
   */
  label?: ReactNode;

  /**
   * Teks keterangan atau petunjuk di bawah slider.
   */
  description?: ReactNode;

  /**
   * Pesan kesalahan validasi jika kondisi invalid.
   */
  error?: ReactNode;

  /**
   * Menampilkan status visual berhasil/valid (hijau).
   * @default false
   */
  success?: boolean;

  /**
   * Posisi penempatan pesan error/helper text ('absolute' atau 'relative').
   * @default 'absolute'
   */
  errorPosition?: 'absolute' | 'relative';

  /**
   * Menandai field formulir sebagai wajib diisi (menampilkan tanda bintang visual).
   * @default false
   */
  required?: boolean;

  /**
   * Menonaktifkan seluruh interaksi slider.
   * @default false
   */
  disabled?: boolean;

  /**
   * Apakah slider membentang selebar 100% kontainer induk.
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Lebar kustom untuk slider ('auto', 'full', atau nilai CSS seperti '300px').
   */
  width?: 'auto' | 'full' | string;

  /**
   * Menampilkan indikator angka nilai slider secara visual.
   * @default false
   */
  showValue?: boolean;

  /**
   * Posisi letak nilai slider yang ditampilkan.
   * @default 'tooltip'
   */
  valuePosition?: SliderValuePosition;

  /**
   * Fungsi pemformat kustom untuk tampilan nilai slider.
   */
  formatValue?: (value: number) => ReactNode;

  /**
   * Menampilkan gelembung tooltip berisi nilai saat hover, fokus, atau dragging.
   * @default false
   */
  tooltip?: boolean;

  /**
   * Fungsi pembuat teks deskripsi nilai untuk a11y `aria-valuetext`.
   */
  getAriaValueText?: (value: number, index?: number) => string;

  /**
   * Daftar titik penanda (marks) di sepanjang trek slider.
   */
  marks?: SliderMark[];

  /**
   * Apakah titik penanda (marks) dapat diklik untuk melompatkan nilai.
   * @default true
   */
  marksClickable?: boolean;

  /**
   * Apakah trek slider dapat diklik untuk memindahkan thumb ke posisi klik.
   * @default true
   */
  trackClickable?: boolean;

  /**
   * Ikon kustom di dalam knop (thumb) slider.
   */
  thumbIcon?: ReactNode;

  /**
   * ClassName kustom tambahan khusus untuk pembungkus terluar (outer wrapper).
   */
  wrapperClassName?: string;

  /**
   * ClassName kustom tambahan untuk wadah interaktif trek slider.
   */
  className?: string;

  /**
   * Jarak minimum antar nilai pada mode rentang (Range Slider).
   * @default 0
   */
  minDistance?: number;

  /**
   * Jarak maksimum antar nilai pada mode rentang (Range Slider).
   */
  maxDistance?: number;

  /**
   * Apakah kedua knop penggeser diizinkan saling melewati (cross) satu sama lain.
   * @default false
   */
  allowCross?: boolean;
}

export interface SingleSliderProps extends SliderBaseProps {
  /**
   * Mode single-value slider.
   */
  range?: false;

  /**
   * Nilai slider saat ini (mode controlled).
   */
  value?: number;

  /**
   * Nilai awal slider saat pertama kali render (mode uncontrolled).
   * @default min
   */
  defaultValue?: number;

  /**
   * Callback pemanggilan saat nilai slider berubah selama interaksi.
   */
  onChange?: (value: number) => void;

  /**
   * Callback pemanggilan saat interaksi selesai.
   */
  onChangeEnd?: (value: number) => void;
}

export interface RangeSliderProps extends SliderBaseProps {
  /**
   * Mengaktifkan mode rentang dua nilai (Range Slider) dengan dual knop penggeser.
   */
  range: true;

  /**
   * Nilai rentang slider saat ini dalam bentuk tuple `[minVal, maxVal]` (mode controlled).
   */
  value?: [number, number];

  /**
   * Nilai awal rentang slider saat pertama kali render (mode uncontrolled).
   * @default [min, max]
   */
  defaultValue?: [number, number];

  /**
   * Callback pemanggilan saat rentang nilai slider berubah selama interaksi.
   */
  onChange?: (value: [number, number]) => void;

  /**
   * Callback pemanggilan saat interaksi rentang selesai.
   */
  onChangeEnd?: (value: [number, number]) => void;
}

export type SliderCustomProps = SingleSliderProps | RangeSliderProps;

export type SliderProps = SliderCustomProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | keyof SliderBaseProps
    | 'range'
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'min'
    | 'max'
    | 'step'
    | 'size'
    | 'onChange'
  >;

export interface SliderTrackProps {
  orientation: SliderOrientation;
  size: SliderSize;
  depth: SliderDepth;
  disabled: boolean;
  hasError: boolean;
  isSuccess: boolean;
  trackClickable: boolean;
  onTrackPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  className?: string;
  children?: ReactNode;
}

export interface SliderRangeProps {
  startPercentage?: number;
  endPercentage?: number;
  percentage?: number;
  orientation: SliderOrientation;
  direction: SliderDirection;
  color: SliderColor;
  disabled: boolean;
  hasError: boolean;
  isSuccess: boolean;
  className?: string;
}

export interface SliderThumbProps {
  thumbIndex?: number;
  percentage: number;
  value: number;
  min: number;
  max: number;
  step: number;
  orientation: SliderOrientation;
  direction: SliderDirection;
  size: SliderSize;
  color: SliderColor;
  disabled: boolean;
  hasError: boolean;
  isSuccess: boolean;
  thumbIcon?: ReactNode;
  tooltip?: boolean;
  showValueTooltip?: boolean;
  formatValue?: (value: number) => ReactNode;
  getAriaValueText?: (value: number, index?: number) => string;
  isDragging: boolean;
  isOtherDragging?: boolean;
  isHovered: boolean;
  isFocused: boolean;
  onThumbPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onThumbKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onThumbFocus: () => void;
  onThumbBlur: () => void;
  onThumbMouseEnter: () => void;
  onThumbMouseLeave: () => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
}

export interface SliderMarksProps {
  marks: SliderMark[];
  min: number;
  max: number;
  orientation: SliderOrientation;
  direction: SliderDirection;
  size: SliderSize;
  currentValue: number | [number, number];
  disabled: boolean;
  marksClickable: boolean;
  onMarkClick: (markValue: number) => void;
}

export interface SliderLabelProps {
  label: ReactNode;
  required?: boolean;
  htmlFor?: string;
  id?: string;
  showValue?: boolean;
  formattedValue?: ReactNode;
  className?: string;
}

export interface SliderHelperTextProps {
  error?: ReactNode;
  description?: ReactNode;
  errorId: string;
  descId: string;
  errorPosition?: 'absolute' | 'relative';
}
