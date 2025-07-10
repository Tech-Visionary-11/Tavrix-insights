import React from "react"
import { cn } from "@utils/cn"

type CardProps = {
  title?: string
  description?: string
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  footer,
  children,
  className,
}) => {
  return (
    <div className={cn("bg-white border rounded-xl p-4 shadow-sm", className)}>
      {(title || description) && (
        <div className="mb-3">
          {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}

      <div className="space-y-2">{children}</div>

      {footer && <div className="mt-4 border-t pt-3">{footer}</div>}
    </div>
  )
}
