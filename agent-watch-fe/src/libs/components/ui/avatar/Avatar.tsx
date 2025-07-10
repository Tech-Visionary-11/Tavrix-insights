import React from "react"
import { cn } from "@utils/cn"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg"
  rounded?: boolean
}

const sizeMap = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  fallback = "?",
  size = "md",
  rounded = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gray-100 text-gray-700 font-medium overflow-hidden border border-gray-300",
        sizeMap[size],
        rounded ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn("object-cover", "w-full h-full", rounded ? "rounded-full" : "rounded-md")}
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  )
}
