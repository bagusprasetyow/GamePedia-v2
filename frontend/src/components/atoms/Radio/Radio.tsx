import { useState, useId } from 'react';
import type { FC, ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import type { RadioProps } from './Radio.types';
import { RadioIndicator } from './components/RadioIndicator';
import { RadioLabel } from './components/RadioLabel';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di Radio.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Radio Component - Atomic UI Element
 *
 * Komponen tombol radio bulat interaktif dengan 2 varian visual ('solid' ring+dot & 'check' centang),
 * Depth System (-3 s/d 3), palet tema GamePedia, dan aksesibilitas form standar.
 *
 * @param {boolean} [props.checked] - Status checked untuk mode controlled
 * @param {boolean} [props.defaultChecked=false] - Status default checked untuk mode uncontrolled
 * @param {(checked: boolean) => void} [props.onCheckedChange] - Callback saat status terpilih berubah
 * @param {string | number | readonly string[]} [props.value] - Nilai value dari input radio
 * @param {RadioSize} [props.size='md'] - Skala ukuran radio ('sm', 'md', 'lg')
 * @param {RadioColor} [props.color='primary'] - Warna semantik tema saat terpilih
 * @param {RadioVariant} [props.variant='solid'] - Varian visual indikator ('solid' atau 'check')
 * @param {RadioDepth} [props.depth=-1] - Kedalaman taktil visual (-3 s/d 3), default -1 (cekung/sunken)
 * @param {ReactNode} [props.label] - Teks label pendamping
 * @param {ReactNode} [props.description] - Teks deskripsi keterangan tambahan
 * @param {'left' | 'right'} [props.labelPosition='right'] - Posisi peletakan label terhadap lingkaran
 * @param {boolean} [props.disabled=false] - Menonaktifkan interaksi radio button
 * @param {string} [props.className] - Class kustom tambahan untuk wadah pembungkus
 *
 * @returns {ReactElement} Elemen radio button interaktif
 */
export const Radio: FC<RadioProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  value,
  size = 'md',
  color = 'primary',
  variant = 'solid',
  depth = -1,
  label,
  description,
  labelPosition = 'right',
  disabled = false,
  className = '',
  id,
  name,
  onChange,
  onKeyDown,
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
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

  const handleCircleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!isChecked) {
        if (!isControlled) {
          setInternalChecked(true);
        }
        onCheckedChange?.(true);
      }
    }
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLInputElement>);
  };

  // Enkapsulasi ClassName Kontainer Utama
  const containerClasses = cn(
    // layout
    'group inline-flex items-center gap-3 select-none',
    // position & direction
    labelPosition === 'left' && 'flex-row-reverse justify-end',
    // interaction & cursor
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
      {/* Hidden real input radio untuk aksesibilitas & form submission */}
      <input
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        aria-checked={isChecked}
        {...restProps}
      />

      {/* Visual Radio Circle Indicator */}
      <RadioIndicator
        size={size}
        color={color}
        variant={variant}
        depth={depth}
        isChecked={isChecked}
        disabled={disabled}
        onKeyDown={handleCircleKeyDown}
      />

      {/* Label & Description Text */}
      <RadioLabel
        label={label}
        description={description}
      />
    </label>
  );
};

export default Radio;
