// src/libs/components/ui/Switch.tsx
import React from "react";
import { cn } from "../../../utils/cn";

type SwitchProps = {
  id?: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  className?: string;
};

export const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  onCheckedChange,
  className,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
        checked ? "bg-indigo-600" : "bg-gray-300",
        className
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
};
