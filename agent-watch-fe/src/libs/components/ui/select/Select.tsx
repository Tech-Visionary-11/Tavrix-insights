// src/libs/components/ui/Select.tsx
import React from "react";
import { cn } from "../../../utils/cn";

type Option = {
  label: string;
  value: string;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
  className?: string;
  wrapperClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  className,
  wrapperClassName,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-1", wrapperClassName)}>
      {label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <select
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
