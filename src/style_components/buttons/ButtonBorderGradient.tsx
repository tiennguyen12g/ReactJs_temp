import React from "react";
import clsx from "clsx";

interface ButtonBorderGradientProps {
  children: React.ReactNode;
  variant?: "purpleBlue" | "cyanBlue" | "greenBlue" | "purplePink" | "pinkOrange" | "tealLime" | "redYellow" | string;
  onClick?: () => void;
  padding?: string;
  rounded?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const variants: Record<string, string> = {
  purpleBlue: "from-purple-600 to-blue-500",
  cyanBlue: "from-cyan-500 to-blue-500",
  greenBlue: "from-green-400 to-blue-600",
  purplePink: "from-purple-500 to-pink-500",
  pinkOrange: "from-pink-500 to-orange-400",
  tealLime: "from-teal-300 to-lime-300",
  redYellow: "from-red-200 via-red-300 to-yellow-200",
};
const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-1.5 text-base",
  lg: "px-4 py-2 text-lg",
};
export default function ButtonBorderGradient({
  children,
  variant = "purpleBlue",
  onClick,
  className,
  size = "sm",
}: ButtonBorderGradientProps) {
  const rounded = `rounded-md`;
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative inline-flex items-center justify-center p-0.5 overflow-hidden",
        "text-sm font-medium text-gray-900 group",
        `bg-gradient-to-br ${variants[variant]}`,
        "hover:text-white dark:text-white",
        "focus:ring-4 focus:outline-none",
        rounded
      )}
    >
      <span
        className={clsx(
          "relative transition-all ease-in duration-75",
          "bg-white dark:bg-gray-900 ",
          "group-hover:bg-transparent group-hover:dark:bg-transparent",
          "rounded-sm",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </span>
    </button>
  );
}

// Ex:

// <ButtonBorderGradient variant="purpleBlue">
//   Purple to Blue
// </ButtonBorderGradient>

// <ButtonBorderGradient variant="cyanBlue">
//   Cyan to Blue
// </ButtonBorderGradient>

// <ButtonBorderGradient variant="purplePink">
//   Purple to Pink
// </ButtonBorderGradient>

// <ButtonBorderGradient variant="pinkOrange">
//   Pink to Orange
// </ButtonBorderGradient>
