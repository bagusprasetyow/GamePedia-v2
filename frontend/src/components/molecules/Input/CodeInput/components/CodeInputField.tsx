import { type FC, type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/atoms';
import type { InputSize, InputVariant, InputDepth } from '@/components/atoms/Input/Input.types';

export interface CodeInputFieldProps {
  idx: number;
  inputRef: (el: HTMLInputElement | null) => void;
  mask?: boolean;
  type?: 'numeric' | 'alphanumeric';
  value: string;
  onChange: (idx: number, e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (idx: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  size?: InputSize;
  variant?: InputVariant;
  depth?: InputDepth;
  error?: boolean;
  success?: boolean;
  pinBoxClasses: string;
  sizeConfigContainer: string;
}

export const CodeInputField: FC<CodeInputFieldProps> = ({
  idx,
  inputRef,
  mask,
  type,
  value,
  onChange,
  onKeyDown,
  onPaste,
  disabled,
  readOnly,
  size,
  variant,
  depth,
  error,
  success,
  pinBoxClasses,
  sizeConfigContainer,
}) => {
  return (
    <Input
      ref={inputRef}
      type={mask ? 'password' : 'text'}
      inputMode={type === 'numeric' ? 'numeric' : 'text'}
      value={value}
      onChange={(e) => onChange(idx, e)}
      onKeyDown={(e) => onKeyDown(idx, e)}
      onPaste={onPaste}
      disabled={disabled}
      readOnly={readOnly}
      size={size}
      variant={variant}
      depth={depth}
      error={error}
      success={success}
      className={pinBoxClasses}
      wrapperClassName={cn('w-auto shrink-0', sizeConfigContainer)}
      aria-label={`Digit kode ke-${idx + 1}`}
    />
  );
};

export default CodeInputField;
