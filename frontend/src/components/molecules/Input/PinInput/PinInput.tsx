import { forwardRef } from 'react';
import { CodeInput } from '../CodeInput';
import type { PinInputProps } from './PinInput.types';

/**
 * PinInput Component - Molecule UI Element
 * 
 * Komponen bidang masukan kode PIN transaksi / PIN keamanan berbasis `CodeInput`.
 * Karakter secara default ter-masking (bullet dots / password mode) untuk keamanan data sensitif.
 * 
 * @param {number} [props.length=6] - Jumlah digit PIN (default 6)
 * @param {boolean} [props.mask=true] - Menyembunyikan karakter PIN dalam mode password (default true)
 */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(({
  mask = true,
  length = 6,
  ...restProps
}, ref) => {
  return (
    <CodeInput
      ref={ref}
      mask={mask}
      length={length}
      {...restProps}
    />
  );
});

PinInput.displayName = 'PinInput';

export default PinInput;
