import React from "react"
import {
  Bot,
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard />, href: "#" },
  { name: "Agents", icon: <Bot />, href: "#" },
  { name: "Sessions", icon: <Users />, href: "#" },
  { name: "Analytics", icon: <BarChart3 />, href: "#" },
  { name: "Settings", icon: <Settings />, href: "#" },
]

export function Sidebar() {
  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-white border-r px-4 py-6 flex flex-col">
      <h1 className="text-xl font-bold text-indigo-600 mb-10 px-2">AgentTrack</h1>

      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 text-sm hover:bg-gray-100 transition"
          >
            <span className="text-indigo-500">{item.icon}</span>
            {item.name}
          </a>
        ))}
      </nav>

      <footer className="text-xs text-muted-foreground px-2 pt-4 border-t">
        © 2025 AgentTrack
      </footer>
    </aside>
  )
}
