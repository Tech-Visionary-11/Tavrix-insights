import React from "react"
import { cn } from "../../../utils/cn"

type InputProps = {
  label?: string
  error?: string
  description?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<InputProps> = ({
  label,
  error,
  description,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        className={cn(
          "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />

      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
