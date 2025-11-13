import React from "react";
import clsx from "clsx";

interface ButtonCommonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?:
    | "default"
    | "continue"
    | "agree"
    | "delete"
    | "cancel"
    | "next"
    | "back"
    | "submit"
    | "warning"
    | "info";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4 py-2.5 text-lg",
};

const variantClasses = {
  default: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  continue: "bg-green-500 hover:bg-green-600 text-white",
  agree: "bg-green-500 hover:bg-green-600 text-white",
  delete: "bg-red-300 hover:bg-red-400 text-white",
  cancel: "bg-gray-300 hover:bg-gray-400 text-gray-900",
  next: "bg-sky-400 hover:bg-sky-500 text-white",
  back: "bg-gray-300 hover:bg-gray-400 text-gray-900",
  submit: "bg-blue-500 hover:bg-blue-600 text-white",
  warning: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
  info: "bg-blue-400 hover:bg-blue-500 text-white",
};

export default function ButtonCommon({
  children,
  onClick,
  variant = "default",
  size = "sm",
  disabled = false,
  fullWidth = false,
  className,
  type = "button",
}: ButtonCommonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "rounded-sm font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full",
        // Focus ring colors based on variant
        variant === "continue" || variant === "agree"
          ? "focus:ring-green-500"
          : variant === "delete"
          ? "focus:ring-red-400"
          : variant === "next" || variant === "info"
          ? "focus:ring-sky-400"
          : variant === "submit"
          ? "focus:ring-blue-500"
          : variant === "warning"
          ? "focus:ring-yellow-400"
          : "focus:ring-gray-400",
        className
      )}
    >
      {children}
    </button>
  );
}
