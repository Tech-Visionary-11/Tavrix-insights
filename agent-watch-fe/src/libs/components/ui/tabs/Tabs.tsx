import React from "react"
import { cn } from "@utils/cn"

type Tab = {
  label: string
  value: string
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ tabs, value, onChange, className }) => {
  return (
    <div className={cn("flex space-x-2", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          disabled={tab.disabled}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition",
            value === tab.value
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
