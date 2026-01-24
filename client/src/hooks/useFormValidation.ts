// Form validation hook - Enhanced form validation with real-time feedback
// Provides comprehensive validation state management and error handling

'use client';

import { useCallback, useState } from 'react';
import type { ZodSchema, ZodError } from 'zod';

import { getValidationErrors } from '@/lib/validations';

export interface ValidationState {
  isValid: boolean;
  isValidating: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isDirty: boolean;
}

export interface UseFormValidationOptions<T> {
  schema: ZodSchema<T>;
  initialValues: T;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export interface UseFormValidationReturn<T> {
  values: T;
  validation: ValidationState;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearFieldError: (field: keyof T) => void;
  validateField: (field: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  resetForm: () => void;
  resetValidation: () => void;
  getFieldProps: (field: keyof T) => {
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    error?: string;
    touched: boolean;
  };
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  initialValues,
  validateOnChange = true,
  validateOnBlur = true,
  debounceMs = 300,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [validation, setValidation] = useState<ValidationState>({
    isValid: false,
    isValidating: false,
    errors: {},
    touched: {},
    isDirty: false,
  });

  // Debounce timer ref
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    setValidation(prev => ({ ...prev, isDirty: true }));

    if (validateOnChange) {
      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        validateField(field);
      }, debounceMs);

      setDebounceTimer(timer);
    }
  }, [validateOnChange, debounceMs, debounceTimer]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
    setValidation(prev => ({ ...prev, isDirty: true }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, touched = true) => {
    setValidation(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }));

    if (touched && validateOnBlur) {
      validateField(field);
    }
  }, [validateOnBlur]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setValidation(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
      isValid: false,
    }));
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setValidation(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[field as string];
      
      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    });
  }, []);

  const validateField = useCallback(async (field: keyof T): Promise<boolean> => {
    setValidation(prev => ({ ...prev, isValidating: true }));

    try {
      // Validate the entire object and check for field-specific errors
      const result = schema.safeParse(values);
      if (!result.success) {
        const fieldError = result.error.errors.find(err => 
          err.path.length > 0 && err.path[0] === field
        );
        if (fieldError) {
          setFieldError(field, fieldError.message);
          return false;
        }
      }
      
      // Field is valid, clear any existing error
      clearFieldError(field);
      
      setValidation(prev => ({ ...prev, isValidating: false }));
      return true;
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as ZodError;
        const fieldErrors = getValidationErrors(zodError);
        const fieldError = fieldErrors[field as string];
        
        if (fieldError) {
          setFieldError(field, fieldError);
        }
      }
      
      setValidation(prev => ({ ...prev, isValidating: false }));
      return false;
    }
  }, [values, schema, clearFieldError, setFieldError]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    setValidation(prev => ({ ...prev, isValidating: true }));

    try {
      await schema.parseAsync(values);
      
      setValidation(prev => ({
        ...prev,
        isValid: true,
        isValidating: false,
        errors: {},
      }));
      
      return true;
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as ZodError;
        const errors = getValidationErrors(zodError);
        
        setValidation(prev => ({
          ...prev,
          isValid: false,
          isValidating: false,
          errors,
        }));
      }
      
      return false;
    }
  }, [values, schema]);

  const resetForm = useCallback(() => {
    setValuesState(initialValues);
    setValidation({
      isValid: false,
      isValidating: false,
      errors: {},
      touched: {},
      isDirty: false,
    });
  }, [initialValues]);

  const resetValidation = useCallback(() => {
    setValidation(prev => ({
      ...prev,
      isValid: false,
      isValidating: false,
      errors: {},
      touched: {},
    }));
  }, []);

  const getFieldProps = useCallback((field: keyof T) => {
    return {
      value: values[field] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setValue(field, e.target.value);
      },
      onBlur: () => {
        setFieldTouched(field, true);
      },
      error: validation.errors[field as string],
      touched: validation.touched[field as string] || false,
    };
  }, [values, validation.errors, validation.touched, setValue, setFieldTouched]);

  return {
    values,
    validation,
    setValue,
    setValues,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    validateField,
    validateForm,
    resetForm,
    resetValidation,
    getFieldProps,
  };
}