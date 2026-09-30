import { useState } from 'react';
import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox, Text } from '@/components/atoms';
import type { CheckboxGroupProps } from './CheckboxGroup.types';

/**
 * CheckboxGroup Component - Molecule UI
 * 
 * Komponen grup kumpulan kotak centang (multi-select) dengan integrasi atom Checkbox,
 * pengaturan orientasi, Depth System, dan validasi form standar.
 * 
 * @param {CheckboxGroupOption[]} props.options - Daftar opsi checkbox
 * @param {string[]} [props.value] - Opsi terpilih (controlled)
 * @param {string[]} [props.defaultValue=[]] - Opsi default (uncontrolled)
 * @param {(values: string[]) => void} [props.onChange] - Callback saat pilihan berubah
 * @param {ReactNode} [props.label] - Judul label grup
 * @param {ReactNode} [props.description] - Deskripsi grup
 * @param {'vertical' | 'horizontal'} [props.orientation='vertical'] - Orientasi layout
 * @param {CheckboxSize} [props.size='md'] - Ukuran checkbox
 * @param {CheckboxColor} [props.color='primary'] - Warna checkbox
 * @param {CheckboxVariant} [props.variant='check'] - Varian indikator ('check' atau 'solid')
 * @param {CheckboxDepth} [props.depth=-1] - Kedalaman visual box (-3 s/d 3)
 * @param {boolean} [props.disabled=false] - Menonaktifkan seluruh grup
 * 
 * @returns {ReactElement} Elemen grup checkbox
 */
const gridColumnsMap: Record<number, string> = {
  1: 'grid grid-cols-1 gap-y-2.5 gap-x-4 w-full',
  2: 'grid grid-cols-2 gap-y-2.5 gap-x-4 w-full',
  3: 'grid grid-cols-3 gap-y-2.5 gap-x-4 w-full',
  4: 'grid grid-cols-4 gap-y-2.5 gap-x-4 w-full',
};

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  label,
  description,
  orientation = 'vertical',
  columns,
  size = 'md',
  color = 'primary',
  variant = 'check',
  depth = -1,
  disabled = false,
  className = '',
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const selectedValues = isControlled ? controlledValue : internalValue;

  const handleOptionChange = (optionVal: string, isChecked: boolean) => {
    let nextValues: string[];
    if (isChecked) {
      nextValues = [...selectedValues, optionVal];
    } else {
      nextValues = selectedValues.filter((v) => v !== optionVal);
    }

    if (!isControlled) {
      setInternalValue(nextValues);
    }
    onChange?.(nextValues);
  };

  // Enkapsulasi ClassName Internal
  const containerClasses = cn(
    // layout
    'flex flex-col gap-2.5',
    // size
    'w-full',
    className
  );

  const legendClasses = cn(
    // layout & spacing
    'flex flex-col gap-0.5 pb-1'
  );

  const listClasses = cn(
    // layout & grid/flex
    columns
      ? gridColumnsMap[columns] || gridColumnsMap[2]
      : orientation === 'vertical'
        ? 'flex flex-col gap-3'
        : 'flex flex-row flex-wrap gap-5'
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <fieldset role="group" className={containerClasses}>
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
          const isOptionChecked = selectedValues.includes(option.value);
          const isOptionDisabled = disabled || option.disabled;

          return (
            <Checkbox
              key={option.value}
              value={option.value}
              checked={isOptionChecked}
              onCheckedChange={(checked) => handleOptionChange(option.value, checked)}
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

export default CheckboxGroup;
