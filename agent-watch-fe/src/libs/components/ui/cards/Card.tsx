import React from "react"
import { cn } from "../../../utils/cn"

type CardProps = {
  title?: string
  description?: string
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
  withHover?: boolean
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  footer,
  children,
  className,
  withHover = false,
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition",
        withHover && "hover:shadow-md hover:border-gray-300",
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-3">{children}</div>

      {footer && <div className="mt-5 border-t pt-4 text-sm text-gray-600">{footer}</div>}
    </div>
  )
}
