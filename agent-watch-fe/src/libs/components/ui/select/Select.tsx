import React from "react"
// Update the import path to the correct relative location for 'cn'
import { cn } from "../../../utils/cn"

type Option = {
  label: string
  value: string
}

type SelectProps = {
  label?: string
  options: Option[]
  error?: string
  description?: string
  className?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>

export const Select: React.FC<SelectProps> = ({
  label,
  options,
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

      <select
        className={cn(
          "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        {...props}
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
