import { forwardRef } from 'react';
import { Textarea } from '@/components/atoms';
import type { TextareaInputProps } from './TextareaInput.types';

/**
 * TextareaInput Component - Molecule UI Element
 * 
 * Komponen masukan teks area / multi-baris berbasis atom `Textarea` dan `Text`.
 * Mendukung penyesuaian tinggi otomatis (autoResize), batas & penghitung karakter (character count),
 * status validasi (error/success), dan Depth System (-3 s/d 3).
 * 
 * @param {InputSize} [props.size='md'] - Skala ukuran textarea ('sm', 'md', 'lg')
 * @param {InputVariant} [props.variant='outline'] - Varian visual ('outline', 'filled', 'ghost')
 * @param {InputDepth} [props.depth=-1] - Kedalaman visual taktil (Depth System: -3 s/d 3)
 */
export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>((props, ref) => {
  return <Textarea ref={ref} {...props} />;
});

TextareaInput.displayName = 'TextareaInput';

export default TextareaInput;
