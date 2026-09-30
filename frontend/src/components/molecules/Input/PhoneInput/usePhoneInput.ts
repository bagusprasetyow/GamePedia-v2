import { useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import type { PhoneInputProps } from './PhoneInput.types';
import {
  sanitizePhone,
  validatePhoneFormat,
  getDynamicErrorMessage,
} from './phoneUtils';

export interface UsePhoneInputParams extends PhoneInputProps {
  isControlled: boolean;
}

export const usePhoneInput = (params: UsePhoneInputParams) => {
  const {
    value,
    defaultValue,
    autoFormatHyphen = true,
    hyphenSymbol = '-',
    allowPlusPrefix = true,
    allowHyphens = true,
    minDigits = 5,
    maxDigits = 14,
    validateOnBlur = true,
    validateOnChange = false,
    invalidErrorMessage,
    onChange,
    onBlur,
    error,
    isControlled,
  } = params;

  const formatOptions = {
    autoFormatHyphen,
    hyphenSymbol,
    allowPlusPrefix,
    allowHyphens,
    maxDigits,
  };

  const validateOptions = {
    minDigits,
    maxDigits,
    invalidErrorMessage,
  };

  const [internalValue, setInternalValue] = useState<string>(
    String(value ?? defaultValue ?? '')
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = sanitizePhone(rawValue, formatOptions);

    if (!isControlled) {
      setInternalValue(sanitized);
    }

    if (sanitized !== rawValue) {
      e.target.value = sanitized;
    }

    if (validateOnChange) {
      if (sanitized && !validatePhoneFormat(sanitized, validateOptions)) {
        setValidationError(getDynamicErrorMessage(sanitized, validateOptions));
      } else {
        setValidationError(null);
      }
    } else if (validationError) {
      if (!sanitized || validatePhoneFormat(sanitized, validateOptions)) {
        setValidationError(null);
      } else {
        setValidationError(getDynamicErrorMessage(sanitized, validateOptions));
      }
    }

    onChange?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const textToValidate = e.target.value;

    if (validateOnBlur && textToValidate) {
      if (!validatePhoneFormat(textToValidate, validateOptions)) {
        setValidationError(getDynamicErrorMessage(textToValidate, validateOptions));
      } else {
        setValidationError(null);
      }
    }

    onBlur?.(e);
  };

  const computedError = error || validationError;
  const currentValueStr = String(isControlled ? (value ?? '') : internalValue);
  const isSuccess = params.success ?? (
    Boolean(currentValueStr) &&
    !computedError &&
    validatePhoneFormat(currentValueStr, validateOptions)
  );

  return {
    internalValue,
    computedError,
    isSuccess,
    handleChange,
    handleBlur,
  };
};
