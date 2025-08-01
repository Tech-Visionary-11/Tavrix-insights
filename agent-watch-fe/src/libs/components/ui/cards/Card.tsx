import React from "react";
import { cn } from "../../../utils/cn";
import { Skeleton } from "../skeleton/Skeleton";

type CardProps = {
  title?: React.ReactNode; 
  description?: string;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;  // NEW
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  footer,
  actions,
  children,
  className,
  loading = false,
}) => (
  <div
    className={cn(
      "bg-white rounded-2xl p-6 shadow-md ring-1 ring-gray-100",
      className
    )}
  >
    {(title || description || loading) && (
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          {loading ? (
            <>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </>
          ) : (
            <>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
            </>
          )}
        </div>
        {loading ? (
          // Don't show actions while loading or you can add skeleton here
          <Skeleton className="h-8 w-20" />
        ) : (
          actions
        )}
      </div>
    )}

    <div className="space-y-4">
      {loading ? (
        // Show 3 lines as skeleton by default; customize as needed
        <>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </>
      ) : (
        children
      )}
    </div>

    {footer && !loading && (
      <div className="mt-6 pt-4 text-sm text-gray-600 border-t border-gray-100">
        {footer}
      </div>
    )}

    {loading && (
      // Optionally a skeleton footer placeholder
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Skeleton className="h-4 w-1/3" />
      </div>
    )}
  </div>
);
