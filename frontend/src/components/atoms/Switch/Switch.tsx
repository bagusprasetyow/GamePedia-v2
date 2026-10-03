import { useState, useId } from 'react';
import type { FC, ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import type { SwitchProps } from './Switch.types';
import { SwitchTrack } from './components/SwitchTrack';
import { SwitchLabel } from './components/SwitchLabel';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Tokens & Styling Setup
// ─────────────────────────────────────────────────────────────

/**
 * Switch (Toggle) Component - Atomic UI Element
 *
 * Komponen sakelar biner interaktif dengan dukungan Depth System taktil (alur cekung -1 s/d -3),
 * varian warna semantik tema GamePedia, ikon terintegrasi, dan aksesibilitas form standar.
 *
 * @param {SwitchProps} props - Properti sakelar toggle
 * @param {boolean} [props.checked] - Status checked dalam mode controlled component
 * @param {boolean} [props.defaultChecked=false] - Status checked awal dalam mode uncontrolled component
 * @param {(checked: boolean) => void} [props.onCheckedChange] - Callback saat status sakelar berubah
 * @param {SwitchSize} [props.size='md'] - Skala ukuran sakelar ('sm', 'md', 'lg', 'xl')
 * @param {SwitchVariant} [props.variant='primary'] - Varian warna tema saat sakelar aktif
 * @param {SwitchDepth} [props.depth=-1] - Kedalaman visual trek sakelar (-3 s/d 3)
 * @param {ReactNode} [props.label] - Label teks di samping sakelar
 * @param {ReactNode} [props.description] - Deskripsi tambahan di bawah label
 * @param {'left' | 'right'} [props.labelPosition='right'] - Posisi peletakan label terhadap sakelar
 * @param {ReactNode} [props.thumbCheckedIcon] - Ikon kustom pada thumb saat sakelar aktif (ON)
 * @param {ReactNode} [props.thumbUncheckedIcon] - Ikon kustom pada thumb saat sakelar tidak aktif (OFF)
 * @param {boolean} [props.disabled=false] - Menonaktifkan interaksi sakelar
 * @param {string} [props.className] - Class kustom tambahan untuk wadah terluar
 * @param {string} [props.id] - ID elemen input checkbox untuk relasi label
 * @param {string} [props.name] - Nama form input checkbox
 * @param {(event: ChangeEvent<HTMLInputElement>) => void} [props.onChange] - Handler onChange bawaan form
 * @param {(event: KeyboardEvent<HTMLInputElement>) => void} [props.onKeyDown] - Handler keyboard bawaan
 *
 * @returns {ReactElement} Elemen sakelar toggle interaktif
 */
export const Switch: FC<SwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  size = 'md',
  variant = 'primary',
  depth = -1,
  label,
  description,
  labelPosition = 'right',
  thumbCheckedIcon,
  thumbUncheckedIcon,
  disabled = false,
  className = '',
  id,
  name,
  onChange,
  onKeyDown,
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State, Handlers & Calculated Properties
  // ─────────────────────────────────────────────────────────────
  const generatedId = useId();
  const inputId = id || generatedId;

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newChecked = event.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
    onChange?.(event);
  };

  const handleTrackKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const newChecked = !isChecked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    }
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLInputElement>);
  };

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const containerClasses = cn(
    // layout
    'inline-flex items-center gap-3',
    // position & direction
    labelPosition === 'left' && 'flex-row-reverse justify-end',
    // interaction & cursor
    'select-none',
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    // state
    disabled && 'opacity-50',
    className
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <label htmlFor={inputId} className={containerClasses}>
      {/* Hidden real input checkbox untuk aksesibilitas & form submission */}
      <input
        type="checkbox"
        id={inputId}
        name={name}
        checked={isChecked}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        aria-checked={isChecked}
        {...restProps}
      />

      {/* Visual Switch Track & Thumb */}
      <SwitchTrack
        isChecked={isChecked}
        disabled={disabled}
        size={size}
        variant={variant}
        depth={depth}
        thumbCheckedIcon={thumbCheckedIcon}
        thumbUncheckedIcon={thumbUncheckedIcon}
        onKeyDown={handleTrackKeyDown}
      />

      {/* Visual Switch Label & Description */}
      <SwitchLabel
        label={label}
        description={description}
      />
    </label>
  );
};

export default Switch;
