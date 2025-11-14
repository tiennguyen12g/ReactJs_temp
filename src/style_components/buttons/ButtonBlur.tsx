import React from "react";
import clsx from "clsx";

interface ButtonBlurProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  iconPosition?: "left" | "right";
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-6 py-3 text-lg",
};

const variantClasses = {
  default: {
    bg: "bg-white/15",
    border: "border-white/20",
    hoverBg: "hover:bg-white/25",
    hoverBorder: "hover:border-white/40",
    text: "text-white",
  },
  light: {
    bg: "bg-white/20",
    border: "border-white/30",
    hoverBg: "hover:bg-white/30",
    hoverBorder: "hover:border-white/50",
    text: "text-white",
  },
  dark: {
    bg: "bg-black/15",
    border: "border-black/20",
    hoverBg: "hover:bg-black/25",
    hoverBorder: "hover:border-black/40",
    text: "text-gray-900",
  },
};

export default function ButtonBlur({
  children,
  onClick,
  variant = "default",
  size = "md",
  disabled = false,
  fullWidth = false,
  className,
  type = "button",
  icon,
  iconPosition = "left",
}: ButtonBlurProps) {
  const variantStyle = variantClasses[variant];

  // Icon size based on button size
  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  // Spacing between icon and text
  const iconSpacing = iconPosition === "left" ? "mr-2" : "ml-2";

  // Helper function to render icon (handles both component types and ReactNode)
  const renderIcon = (
    icon: React.ReactNode | React.ComponentType<{ className?: string }> | undefined,
    className?: string
  ) => {
    if (!icon) return null;

    // If it's already a ReactNode (rendered element), use it directly
    if (React.isValidElement(icon)) {
      return icon;
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
    !disabled && "group-hover:scale-[1.2]"
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        // Base styles
        "group rounded-lg font-medium cursor-pointer",
        "transition-all duration-300 ease-in-out",
        "backdrop-blur-[10px]",
        "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
        // Variant styles
        variantStyle.bg,
        variantStyle.border,
        variantStyle.text,
        "border",
        // Hover effects
        !disabled && variantStyle.hoverBg,
        !disabled && variantStyle.hoverBorder,
        !disabled && "hover:-translate-y-0.5",
        // Active state
        "active:translate-y-0",
        // Size
        sizeClasses[size],
        // Full width
        fullWidth && "w-full",
        // Flex layout for icon support
        "flex items-center justify-center",
        className
      )}
    >
      {icon && iconPosition === "left" && renderIcon(icon, iconClassName)}
      <span>{children}</span>
      {icon && iconPosition === "right" && renderIcon(icon, iconClassName)}
    </button>
  );
}

