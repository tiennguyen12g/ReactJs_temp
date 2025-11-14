import React from "react";
import clsx from "clsx";
import { icons } from "../icons/Icons";

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
  icon?: React.ReactNode | React.ComponentType<{ className?: string }> | keyof typeof icons;
  iconPosition?: "left" | "right";
  iconClass?: string;
}

const sizeClasses = {
  sm: "px-2.5 py-1.5 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4.5 py-2.5 text-lg",
};

const variantClasses = {
  default: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  continue: "bg-green-500 hover:bg-green-600 text-white",
  agree: "bg-green-500 hover:bg-green-600 text-white",
  delete: "bg-red-400 hover:bg-red-600 text-white",
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
  icon,
  iconPosition = "left",
  iconClass,
}: ButtonCommonProps) {
  // Icon size based on button size
  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  // Spacing between icon and text
  const iconSpacing = iconPosition === "left" ? "mr-2" : "ml-2";

  // Helper function to render icon (handles string keys, component types, and ReactNode)
  const renderIcon = (
    icon: React.ReactNode | React.ComponentType<{ className?: string }> | keyof typeof icons | undefined,
    className?: string
  ) => {
    if (!icon) return null;

    // If it's already a ReactNode (rendered element), use it directly
    if (React.isValidElement(icon)) {
      return icon;
    }

    // If it's a string key from icons object, get the component
    if (typeof icon === "string" && icon in icons) {
      const IconComponent = icons[icon as keyof typeof icons];
      return <IconComponent className={className} />;
    }

    // If it's a component type (function), render it
    if (typeof icon === "function") {
      const IconComponent = icon;
      return <IconComponent className={className} />;
    }

    return icon;
  };

  const iconClassName = clsx(
    iconSizeClasses[size],
    iconSpacing,
    "transition-transform duration-200 ease-in-out",
    !disabled && "group-hover:scale-[1.2]",
    iconClass
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "group rounded-sm font-medium transition-all duration-200 h-fit",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center justify-center",
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
      {icon && iconPosition === "left" && renderIcon(icon, iconClassName)}
      <span className="flex justify-center items-center gap-2.5">{children}</span>
      {icon && iconPosition === "right" && renderIcon(icon, iconClassName)}
    </button>
  );
}
