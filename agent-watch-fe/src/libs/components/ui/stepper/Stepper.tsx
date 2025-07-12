// src/libs/components/ui/Stepper.tsx
import { cn } from "../../../utils/cn";

type StepperProps = {
  steps: string[];
  active: number;
};

export function Stepper({ steps, active }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-6 mb-6">
      {steps.map((label, i) => {
        const isActive = i === active;
        return (
          <div key={label} className="flex items-center gap-2">
            {/* bullet */}
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 text-gray-700"
              )}
            >
              {i + 1}
            </span>

            {/* label */}
            <span
              className={cn(
                "text-sm font-medium",
                isActive ? "text-indigo-700" : "text-gray-600"
              )}
            >
              {label}
            </span>

            {/* divider except last */}
            {i < steps.length - 1 && (
              <span className="w-14 h-px bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}
