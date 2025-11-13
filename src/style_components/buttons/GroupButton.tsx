import React, { useState, useCallback } from "react";
import clsx from "clsx";

interface GroupButtonOption {
  key: string;
  label: React.ReactNode;
  value?: any;
}

interface GroupButtonProps {
  options: GroupButtonOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (key: string, option: GroupButtonOption) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-2.5 py-1.5 text-base",
  lg: "px-3 py-2 text-lg",
};

export default function GroupButton({
  options,
  defaultValue,
  value: controlledValue,
  onChange,
  className,
  size = "sm",
}: GroupButtonProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || options[0]?.key || "");
  const isControlled = controlledValue !== undefined;
  const activeKey = isControlled ? controlledValue : internalValue;

  const handleClick = useCallback(
    (option: GroupButtonOption) => {
      if (!isControlled) {
        setInternalValue(option.key);
      }
      onChange?.(option.key, option);
    },
    [isControlled, onChange]
  );

  return (
    <div
      className={clsx(
        "flex gap-0 items-center bg-gray-200 rounded-sm w-fit max-w-full overflow-hidden",
        className
      )}
    >
      {options.map((option, index) => {
        const isActive = activeKey === option.key;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <button
            key={option.key}
            onClick={() => handleClick(option)}
            className={clsx(
              sizeClasses[size],
              "transition-all duration-200 font-medium",
              "border-0 outline-none focus:outline-none",
              // Active state - white background
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "bg-transparent text-gray-700 hover:bg-gray-100",
              // Border radius for first and last items
              isFirst && "rounded-l-sm",
              isLast && "rounded-r-sm",
              // Spacing between buttons
              !isLast && "border-r border-gray-300"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
