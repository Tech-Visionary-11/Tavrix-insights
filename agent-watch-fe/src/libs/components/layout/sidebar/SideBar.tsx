import React from "react"
import {
  Bot,
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  X,
  Menu,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard />, href: "#" },
  { name: "Agents", icon: <Bot />, href: "#" },
  { name: "Sessions", icon: <Users />, href: "#" },
  { name: "Analytics", icon: <BarChart3 />, href: "#" },
  { name: "Settings", icon: <Settings />, href: "#" },
]

export function Sidebar() {
  const [open, setOpen] = React.useState(true)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-40 px-4 py-6 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex`}
      >
        {/* Close on Mobile */}
        <div className="flex items-center justify-between mb-10 px-2 md:hidden">
          <h1 className="text-xl font-bold text-indigo-600">AgentTrack</h1>
          <button onClick={() => setOpen(false)} className="text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* App Name (desktop) */}
        <h1 className="text-xl font-bold text-indigo-600 mb-10 px-2 hidden md:block">
          AgentTrack
        </h1>

        {/* Navigation */}
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

        {/* Footer */}
        <footer className="text-xs text-muted-foreground px-2 pt-4 border-t">
          © 2025 AgentTrack
        </footer>
      </aside>
    </>
  )
}
