import { useState, useRef, useEffect, useId } from 'react';
import type { FC, ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import type { CheckboxProps } from './Checkbox.types';
import { sizeConfigMap } from './Checkbox.styles';
import { CheckboxIndicator } from './components/CheckboxIndicator';
import { CheckboxLabel } from './components/CheckboxLabel';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di Checkbox.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Checkbox Component - Atomic UI Element
 *
 * Komponen kotak centang interaktif dengan dukungan 2 varian visual ('check' & 'solid'),
 * status indeterminate (garis minus), Depth System (-3 s/d 3), palet tema GamePedia,
 * dan teks label/deskripsi terenkapsulasi penuh via sub-atom CheckboxLabel.
 *
 * @param {boolean} [props.checked] - Status checked (controlled)
 * @param {boolean} [props.defaultChecked=false] - Status default checked (uncontrolled)
 * @param {boolean} [props.indeterminate=false] - Status indeterminate (garis minus)
 * @param {(checked: boolean) => void} [props.onCheckedChange] - Callback saat status berubah
 * @param {CheckboxSize} [props.size='md'] - Skala ukuran ('sm', 'md', 'lg')
 * @param {CheckboxColor} [props.color='primary'] - Warna saat dicentang
 * @param {CheckboxVariant} [props.variant='check'] - Varian indikator ('check' atau 'solid')
 * @param {CheckboxDepth} [props.depth=-1] - Kedalaman visual kotak (-3 s/d 3)
 * @param {ReactNode} [props.label] - Teks label
 * @param {ReactNode} [props.description] - Deskripsi tambahan
 * @param {'left' | 'right'} [props.labelPosition='right'] - Posisi peletakan label
 * @param {boolean} [props.disabled=false] - Status disabled
 *
 * @returns {ReactElement} Elemen checkbox interaktif
 */
export const Checkbox: FC<CheckboxProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  size = 'md',
  color = 'primary',
  variant = 'check',
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
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const sizeConfig = sizeConfigMap[size] || sizeConfigMap.md;

  // Sinkronisasi status indeterminate native HTML
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newChecked = event.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
    onChange?.(event);
  };

  const handleBoxKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const nextChecked = !isChecked;
      if (!isControlled) {
        setInternalChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
    }
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLInputElement>);
  };

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const containerClasses = cn(
    // layout
    'group inline-flex items-center gap-3',
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
        ref={inputRef}
        type="checkbox"
        id={inputId}
        name={name}
        checked={isChecked}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        aria-checked={indeterminate ? 'mixed' : isChecked}
        {...restProps}
      />

      {/* Visual Checkbox Box Sub-Atom */}
      <CheckboxIndicator
        isChecked={isChecked}
        indeterminate={indeterminate}
        size={size}
        color={color}
        variant={variant}
        depth={depth}
        disabled={disabled}
        onKeyDown={handleBoxKeyDown}
      />

      {/* Label & Description Sub-Atom */}
      <CheckboxLabel
        label={label}
        description={description}
        labelSize={sizeConfig.labelSize}
        descSize={sizeConfig.descSize}
      />
    </label>
  );
};

export default Checkbox;
