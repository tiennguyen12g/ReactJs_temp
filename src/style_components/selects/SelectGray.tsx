import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";
import { FcFilledFilter } from "react-icons/fc";

interface Option {
  key: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  placeHolder?: string;
  isUsePlaceHolder?: boolean;
}

export default function SelectGray({ label, options, value, onChange, className, fullWidth, disabled, placeHolder = "Select an option" }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Find selected option label
  const selectedOption = options.find((opt) => opt.key === value);
  const displayLabel = selectedOption?.label ? selectedOption.label : placeHolder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("click", close);
    }
    return () => document.removeEventListener("click", close);
  }, [open]);

  // Calculate position (top or bottom) based on available space
  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !dropdownRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current.offsetHeight;
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // If not enough space below but enough above, show on top
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setPosition("top");
    } else {
      setPosition("bottom");
    }
  }, [open, options.length]);

  const handleSelect = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""} ${className || ""}`} ref={containerRef}>
      {label && <label className="block mb-1 text-sm font-medium text-gray-200">{label}</label>}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 px-2.5 py-1.5 rounded-sm 
          border border-gray-300 outline-none 
               focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500
           transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed 
          hover:border-gray-400
          flex items-center justify-between

        `}
      >
        <FcFilledFilter size={20} />
        <span className="truncate">{displayLabel}</span>
        <FaChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`
            absolute left-0 right-0 z-[200] mt-1 mb-1
            bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 
            rounded-lg shadow-xl overflow-hidden
            ${position === "top" ? "bottom-full mb-1 mt-0" : "top-full"}
          `}
        >
          <div className="max-h-60 overflow-auto">
            <div
              onClick={() => handleSelect("")}
              className={`
                    px-2.5 py-1.5 text-gray-900 cursor-pointer transition-colors duration-150
                    flex items-center
                    border-b-1 border-b-gray-300
                    hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200
                  `}
            >
              <FaCheck color="transparent" />
              <span className="flex justify-center items-center flex-1">{placeHolder}</span>
            </div>
            {options.map((option) => {
              const isSelected = option.key === value;
              return (
                <div
                  key={option.key}
                  onClick={() => handleSelect(option.key)}
                  className={`
                    px-2.5 py-1.5 text-gray-900 cursor-pointer transition-colors duration-150
                    flex items-center
                    ${isSelected ? "bg-gradient-to-r from-gray-100 to-gray-200 font-medium" : ""}
                    hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200
                  `}
                >
                  {isSelected ? <FaCheck size={22} className="h-4 w-4 text-[#00bb19] flex-shrink-0" /> : <FaCheck color="transparent" />}
                  <span className="flex justify-center items-center flex-1">{option.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ex:
//       <Select
//         label="Select Country"
//         value={country}
//         onChange={setCountry}
//         options={[
//           { key: "vn", label: "Vietnam" },
//           { key: "us", label: "USA" },
//           { key: "jp", label: "Japan" },
//         ]}
//       />
