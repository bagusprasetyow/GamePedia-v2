import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';
import type { CodeInputType } from './CodeInput.types';

export interface UseCodeInputOptions {
  length?: number;
  value?: string;
  defaultValue?: string;
  type?: CodeInputType;
  uppercase?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

/**
 * Hook kustom untuk mengelola seluruh state multi-digit, sinkronisasi PIN,
 * navigasi keyboard, dan penanganan clipboard paste pada CodeInput.
 */
export function useCodeInput({
  length = 6,
  value: controlledValue,
  defaultValue = '',
  type = 'numeric',
  uppercase = false,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  onChange,
  onComplete,
}: UseCodeInputOptions) {
  const isControlled = controlledValue !== undefined;
  const [internalPin, setInternalPin] = useState<string>(
    String(controlledValue ?? defaultValue ?? '').slice(0, length)
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const currentPin = isControlled
    ? String(controlledValue ?? '').slice(0, length)
    : internalPin;

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const validateChar = (char: string): boolean => {
    if (!char) return false;
    if (type === 'numeric') {
      return /^\d$/.test(char);
    }
    return /^[a-zA-Z0-9]$/.test(char);
  };

  const updatePinValue = (nextPin: string) => {
    if (!isControlled) {
      setInternalPin(nextPin);
    }
    onChange?.(nextPin);

    if (nextPin.length === length) {
      onComplete?.(nextPin);
    }
  };

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    const rawInput = event.target.value;
    const pinChars = Array(length).fill('');
    for (let i = 0; i < length; i++) {
      if (currentPin[i]) pinChars[i] = currentPin[i];
    }

    if (!rawInput) {
      pinChars[index] = '';
      const nextPin = pinChars.join('').trimEnd();
      updatePinValue(nextPin);
      return;
    }

    const validChars = rawInput
      .split('')
      .filter(validateChar)
      .map((c) => (uppercase ? c.toUpperCase() : c));

    if (validChars.length === 0) return;

    let nextFocusIndex = index;
    for (let i = 0; i < validChars.length && index + i < length; i++) {
      pinChars[index + i] = validChars[i];
      nextFocusIndex = index + i + 1;
    }

    const nextPin = pinChars.join('').trimEnd();
    updatePinValue(nextPin);

    const targetIndex = Math.min(nextFocusIndex, length - 1);
    if (inputRefs.current[targetIndex]) {
      inputRefs.current[targetIndex]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    if (event.key === 'Backspace') {
      const currentChar = currentPin[index];
      if (!currentChar && index > 0) {
        event.preventDefault();
        const pinChars = Array(length).fill('');
        for (let i = 0; i < length; i++) {
          if (currentPin[i]) pinChars[i] = currentPin[i];
        }
        pinChars[index - 1] = '';
        const nextPin = pinChars.join('').trimEnd();
        updatePinValue(nextPin);

        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').trim();
    if (!pastedData) return;

    const validChars = pastedData
      .split('')
      .filter(validateChar)
      .map((char) => (uppercase ? char.toUpperCase() : char))
      .slice(0, length);

    if (validChars.length > 0) {
      const newPin = validChars.join('');
      updatePinValue(newPin);

      const targetIndex = Math.min(validChars.length, length - 1);
      if (inputRefs.current[targetIndex]) {
        inputRefs.current[targetIndex]?.focus();
      }
    }
  };

  return {
    currentPin,
    inputRefs,
    handleInputChange,
    handleKeyDown,
    handlePaste,
  };
}
