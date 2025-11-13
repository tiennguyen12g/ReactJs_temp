import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useDebounce } from "../../hooks/common_hooks/useDebounce";

interface SearchProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
  debounceMs?: number;
  showClearButton?: boolean;
  disabled?: boolean;
}

export default function Search({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = "Search...",
  className,
  fullWidth = false,
  debounceMs = 500,
  showClearButton = true,
  disabled = false,
}: SearchProps) {
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = controlledValue !== undefined;

  // Use controlled value if provided, otherwise use internal state
  const value = isControlled ? controlledValue : internalValue;

  // Debounce the value
  const debouncedValue = useDebounce(value, debounceMs);

  // Call onSearch when debounced value changes
  useEffect(() => {
    if (onSearch && debouncedValue !== undefined) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""} ${className || ""}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-2.5 py-1.5 rounded-sm
            bg-gray-50 border border-gray-300
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:border-gray-400
            ${showClearButton && value ? "pr-10" : ""}
          `}
        />

        {/* Clear Button */}
        {showClearButton && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                     text-gray-400 hover:text-gray-600 
                     transition-colors duration-150
                     focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 rounded"
            aria-label="Clear search"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
