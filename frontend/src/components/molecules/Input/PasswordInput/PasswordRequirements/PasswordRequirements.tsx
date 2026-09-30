import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup';
import type { CheckboxGroupOption } from '@/components/molecules/CheckboxGroup/CheckboxGroup.types';
import type { PasswordRequirementsProps } from './PasswordRequirements.types';

/**
 * PasswordRequirements Component - Molecule UI
 * 
 * Komponen indikator status kriteria keamanan kata sandi 
 * menggunakan grup atom Checkbox (`CheckboxGroup`).
 * 
 * @param {string} [props.value=''] - Nilai kata sandi yang dicek
 * @param {number} [props.minLength=8] - Minimum karakter yang dibutuhkan
 * @param {CheckboxSize} [props.size='sm'] - Ukuran indikator checkbox
 * @param {CheckboxVariant} [props.variant='check'] - Varian indikator ('check' atau 'solid')
 */
export const PasswordRequirements = forwardRef<HTMLDivElement, PasswordRequirementsProps>(({
  value = '',
  minLength = 8,
  size = 'sm',
  variant = 'check',
  className = '',
  ...restProps
}, ref) => {
  const hasMinLength = value.length >= minLength;
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);

  const options: CheckboxGroupOption[] = [
    { value: 'minLength', label: `Min. ${minLength} Karakter` },
    { value: 'upper', label: 'Huruf Besar (A-Z)' },
    { value: 'number', label: 'Angka (0-9)' },
    { value: 'special', label: 'Simbol Khusus' },
  ];

  const selectedValues: string[] = [];
  if (hasMinLength) selectedValues.push('minLength');
  if (hasUpper) selectedValues.push('upper');
  if (hasNumber) selectedValues.push('number');
  if (hasSpecial) selectedValues.push('special');

  const containerClasses = cn(
    // interaction & layout
    'pointer-events-none select-none',
    // typography & size
    'text-xs w-full',
    className
  );

  return (
    <div ref={ref} className={containerClasses} {...restProps}>
      <CheckboxGroup
        options={options}
        value={selectedValues}
        columns={2}
        size={size}
        color="success"
        variant={variant}
      />
    </div>
  );
});

PasswordRequirements.displayName = 'PasswordRequirements';

export default PasswordRequirements;
