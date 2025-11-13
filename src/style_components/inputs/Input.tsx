import React, { useState, useRef, useEffect, forwardRef } from "react";
import { useDebounce } from "../../hooks/common_hooks/useDebounce";

interface InputProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onDebounceChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  debounceMs?: number;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showClearButton?: boolean;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      value: controlledValue,
      defaultValue,
      onChange,
      onDebounceChange,
      onBlur,
      onFocus,
      onKeyDown,
      placeholder,
      label,
      className,
      inputClassName,
      fullWidth = false,
      disabled = false,
      required = false,
      readOnly = false,
      autoFocus = false,
      debounceMs = 500,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showClearButton = false,
      maxLength,
      min,
      max,
      step,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const inputRef = useRef<HTMLInputElement>(null);
    const isControlled = controlledValue !== undefined;

    // Use controlled value if provided, otherwise use internal state
    const value = isControlled ? controlledValue : internalValue;

    // Debounce the value if onDebounceChange is provided
    const debouncedValue = useDebounce(value, debounceMs);

    // Call onDebounceChange when debounced value changes
    useEffect(() => {
      if (onDebounceChange && debouncedValue !== undefined) {
        onDebounceChange(debouncedValue);
      }
    }, [debouncedValue, onDebounceChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (isControlled) {
        onChange?.(newValue);
      } else {
        setInternalValue(newValue);
        onChange?.(newValue);
      }
    };

    const handleClear = () => {
      if (isControlled) {
        onChange?.("");
      } else {
        setInternalValue("");
        onChange?.("");
      }
      inputRef.current?.focus();
    };

    // Merge refs
    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(inputRef.current);
        } else {
          ref.current = inputRef.current;
        }
      }
    }, [ref]);

    const hasLeftIcon = leftIcon !== undefined;
    const hasRightIcon = rightIcon !== undefined || (showClearButton && value);

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${className || ""}`}>
        {label && (
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoFocus={autoFocus}
            placeholder={placeholder}
            maxLength={maxLength}
            min={min}
            max={max}
            step={step}
            className={`
              w-full py-1.5 rounded-sm
              bg-gray-50 border border-gray-300
              text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              read-only:bg-gray-100 read-only:cursor-default
              hover:border-gray-400
              ${hasLeftIcon ? "pl-10" : "pl-3"}
              ${hasRightIcon ? "pr-10" : "pr-3"}
              ${error ? "border-red-300 focus:border-red-500 focus:ring-red-400" : ""}
              ${inputClassName || ""}
            `}
          />

          {/* Right Icon or Clear Button */}
          {hasRightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              {showClearButton && value ? (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={disabled}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 rounded"
                  aria-label="Clear input"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
