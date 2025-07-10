import React from "react"
import { cn } from "../../../utils/cn"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  loading = false,
  children,
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"

  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  )
}
