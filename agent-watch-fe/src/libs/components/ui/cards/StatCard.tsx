import React from "react"
import { cn } from "../../../utils/cn"


type StatCardProps = {
  title: string
  value: string
  icon?: React.ReactNode
  description?: string
  descriptionColor?: "green" | "red" | "yellow" | "gray"
}

const colorMap = {
  green: "text-green-600",
  red: "text-red-600",
  yellow: "text-yellow-500",
  gray: "text-muted-foreground",
}

export function StatCard({
  title,
  value,
  icon,
  description,
  descriptionColor = "gray",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2 border">
      <div className="flex justify-between items-center">
        <h3 className="text-sm text-muted-foreground font-medium">{title}</h3>
        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-lg">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-black">{value}</div>
      {description && (
        <p className={cn("text-sm font-medium", colorMap[descriptionColor])}>
          {description}
        </p>
      )}
    </div>
  )
}
