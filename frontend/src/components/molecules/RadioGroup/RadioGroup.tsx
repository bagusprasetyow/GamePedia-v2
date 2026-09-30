import { useState, useId } from 'react';
import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Radio, Text } from '@/components/atoms';
import type { RadioGroupProps } from './RadioGroup.types';

/**
 * RadioGroup Component - Molecule UI
 * 
 * Komponen grup pilihan radio tunggal (single-select) dengan integrasi atom Radio,
 * orientasi horizontal/vertikal, Depth System, dan 2 varian indikator ('solid' & 'check').
 * 
 * @param {string} [props.name] - Nama grup radio
 * @param {RadioGroupOption[]} props.options - Daftar opsi radio
 * @param {string} [props.value] - Opsi terpilih (controlled)
 * @param {string} [props.defaultValue] - Opsi default awal (uncontrolled)
 * @param {(value: string) => void} [props.onChange] - Callback saat pilihan berubah
 * @param {ReactNode} [props.label] - Judul label grup
 * @param {ReactNode} [props.description] - Deskripsi grup
 * @param {'vertical' | 'horizontal'} [props.orientation='vertical'] - Orientasi layout
 * @param {RadioSize} [props.size='md'] - Ukuran radio
 * @param {RadioColor} [props.color='primary'] - Warna radio
 * @param {RadioVariant} [props.variant='solid'] - Varian indikator ('solid' atau 'check')
 * @param {RadioDepth} [props.depth=-1] - Kedalaman visual lingkaran (-3 s/d 3)
 * @param {boolean} [props.disabled=false] - Menonaktifkan seluruh grup
 * 
 * @returns {ReactElement} Elemen grup radio button
 */
export const RadioGroup: FC<RadioGroupProps> = ({
  name,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  description,
  orientation = 'vertical',
  size = 'md',
  color = 'primary',
  variant = 'solid',
  depth = -1,
  disabled = false,
  className = '',
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const generatedName = useId();
  const groupName = name || `radio-group-${generatedName}`;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const selectedValue = isControlled ? controlledValue : internalValue;

  const handleSelect = (optionVal: string) => {
    if (!isControlled) {
      setInternalValue(optionVal);
    }
    onChange?.(optionVal);
  };

  // Enkapsulasi ClassName Internal
  const containerClasses = cn(
    // layout
    'flex flex-col gap-2.5',
    className
  );

  const legendClasses = cn(
    // layout & spacing
    'flex flex-col gap-0.5 pb-1'
  );

  const listClasses = cn(
    // layout & flex
    orientation === 'vertical' ? 'flex flex-col gap-3' : 'flex flex-row flex-wrap gap-5'
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <fieldset role="radiogroup" className={containerClasses}>
      {(label || description) && (
        <legend className={legendClasses}>
          {label && (
            <Text as="span" size="sm" weight="semibold" className="text-foreground">
              {label}
            </Text>
          )}
          {description && (
            <Text as="span" size="xs" variant="muted">
              {description}
            </Text>
          )}
        </legend>
      )}

      <div className={listClasses}>
        {options.map((option) => {
          const isOptionChecked = selectedValue === option.value;
          const isOptionDisabled = disabled || option.disabled;

          return (
            <Radio
              key={option.value}
              name={groupName}
              value={option.value}
              checked={isOptionChecked}
              onCheckedChange={() => handleSelect(option.value)}
              disabled={isOptionDisabled}
              label={option.label}
              description={option.description}
              size={size}
              color={color}
              variant={variant}
              depth={depth}
            />
          );
        })}
      </div>
    </fieldset>
  );
};

export default RadioGroup;
