import React from "react";
import clsx from "clsx";

interface GradientButtonProps {
  children: React.ReactNode;
  variant?:
    | "purpleBlue"
    | "cyanBlue"
    | "greenBlue"
    | "purplePink"
    | "pinkOrange"
    | "tealLime"
    | "redYellow"
    | "purple"
    | "orange"
    | "blue"
    | string;
  size?: "sm" | "md" | "lg";
  padding?: string;
  margin?: string;
  border?: string;
  rounded?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

// const sizeClasses = {
//   sm: "text-sm px-3 py-1.5",
//   md: "text-base px-4 py-2",
//   lg: "text-lg px-6 py-1.5",
// };
const sizeClasses = {
  sm: "px-2.5 py-1.5 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4.5 py-2.5 text-lg",
};


// Tailwind gradient variants
const tailwindVariants: Record<string, string> = {
  purpleBlue: "bg-gradient-to-tr from-purple-600 to-blue-500",
  cyanBlue: "bg-gradient-to-tr from-cyan-500 to-blue-500",
  greenBlue: "bg-gradient-to-tr from-green-400 to-blue-600",
  purplePink: "bg-gradient-to-tr from-purple-500 to-pink-500",
  pinkOrange: "bg-gradient-to-tr from-pink-500 to-orange-400",
  tealLime: "bg-gradient-to-tr from-teal-300 to-lime-300",
  redYellow: "bg-gradient-to-tr from-red-200 via-red-300 to-yellow-200",
};

// Custom gradient variants with specific hex colors (use inline styles)
const customGradients: Record<string, { gradient: string; hoverGradient: string }> = {
  purple: {
    gradient: "linear-gradient(to right, #DA22FF 0%, #9733EE 51%, #DA22FF 100%)",
    hoverGradient: "linear-gradient(to right, #DA22FF 0%, #9733EE 51%, #DA22FF 100%)",
  },
  orange: {
    gradient: "linear-gradient(to right, #fe8c00 0%, #f83600 51%, #fe8c00 100%)",
    hoverGradient: "linear-gradient(to right, #fe8c00 0%, #f83600 51%, #fe8c00 100%)",
  },
  blue: {
    gradient: "linear-gradient(to right, #00c6ff 0%, #0072ff 51%, #00c6ff 100%)",
    hoverGradient: "linear-gradient(to right, #00c6ff 0%, #0072ff 51%, #00c6ff 100%)",
  },
};

export default function GradientButton({
  children,
  variant = "orange",
  size = "sm",
  padding,
  margin,
  border,
  rounded,
  fullWidth,
  disabled,
  onClick,
  className,
}: GradientButtonProps) {
  const isCustomGradient = variant && customGradients[variant];
  const isTailwindVariant = variant && tailwindVariants[variant];

  // Get background style for custom gradients with hover support
  const backgroundStyle: React.CSSProperties = isCustomGradient
    ? {
        backgroundImage: customGradients[variant].gradient,
        backgroundSize: "200% auto",
        backgroundPosition: "left center",
        transition: "background-position 0.3s ease",
      }
    : {};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={backgroundStyle}
      onMouseEnter={(e) => {
        if (isCustomGradient && !disabled) {
          e.currentTarget.style.backgroundPosition = "right center";
        }
      }}
      onMouseLeave={(e) => {
        if (isCustomGradient && !disabled) {
          e.currentTarget.style.backgroundPosition = "left center";
        }
      }}
      className={clsx(
        // Base styles
        "text-white font-semibold shadow-md transition-all duration-300 active:scale-95 h-fit",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        
        // Tailwind gradient variants
        !isCustomGradient && isTailwindVariant && tailwindVariants[variant],
        !isCustomGradient && !isTailwindVariant && "bg-gradient-to-tr from-orange-400 via-orange-500 to-red-500",
        !isCustomGradient && "hover:opacity-90",

        // Dynamic classes
        sizeClasses[size],
        fullWidth && "w-full",
        padding && padding,
        margin && margin,
        border && border,
        rounded ?? "rounded-sm",

        className
      )}
    >
      {children}
    </button>
  );
}

// ex:
// <GradientButton size="sm">Small</GradientButton>
//       <GradientButton size="md">Medium</GradientButton>
//       <GradientButton size="lg">Large</GradientButton>
//       <GradientButton padding="px-10 py-2">Big Padding</GradientButton>
//       <GradientButton margin="mt-40 ml-20">With Margin</GradientButton>
//       <GradientButton border="border border-yellow-400">Border</GradientButton>
//       <GradientButton rounded="rounded-full">Full Round</GradientButton>
//       <GradientButton fullWidth>Create Account</GradientButton>
//       <GradientButton disabled>Loading...</GradientButton>