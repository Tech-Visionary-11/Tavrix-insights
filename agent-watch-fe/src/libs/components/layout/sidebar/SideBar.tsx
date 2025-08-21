import {
  Bot,
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "./UseSidebar";
import logo from "/logo.png";

const landingHelpUrl = import.meta.env.VITE_LANDING_PAGE_URL ? `${import.meta.env.VITE_LANDING_PAGE_URL}/help-docs` : "/help-docs";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Agents",    icon: Bot,             href: "/agents" },
  { name: "Sessions",  icon: Users,           href: "/sessions" },
  { name: "Analytics", icon: BarChart3,       href: "/analytics" },
  // Change Help to external landing URL
  { name: "Help", icon: HelpCircle, href: landingHelpUrl, external: true },
  { name: "Settings",  icon: Settings,         href: "/settings" },
];
const allowedMenuNames = ["Agents", "Help"];

export function Sidebar() {
  const { isOpen, collapsed, toggleMobile, toggleCollapse, closeMobile } = useSidebar();
  const { pathname } = useLocation();

  /* mobile overlay */
  const Overlay = (
    <div
      onClick={closeMobile}
      className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden transition-opacity ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    />
  );

  return (
    <>
      {/* Overlay for mobile */}
      {Overlay}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-full
          flex flex-col
          "w-64 shrink-0
          bg-white shadow-md ring-1 ring-gray-100
          transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "w-20" : "w-64"} md:rounded-r-2xl`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-5 md:hidden">
          <span className="text-lg font-bold text-indigo-700">
            <img src={logo} alt="agent-watch-logo" /> Travix Insights
          </span>
          <button onClick={closeMobile} className="text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Brand & Collapse Toggle (desktop) */}
        <div
          className={`hidden md:flex items-center px-6 pt-6 pb-8 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {collapsed ? (
            <img src={logo} alt="agent-watch-logo" />
          ) : (
            <div className="flex items-center gap-2">
              <img src={logo} alt="agent-watch-logo" className="w-6 h-6" />
              <span className="text-xl font-bold text-indigo-700">Travix Insights</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2">
          {navItems.map(({ name, icon: Icon, href, external }) => {
            const active = pathname === href;
            const isDisabled = !allowedMenuNames.includes(name);

            if (external) {
              // For external links like Help, render <a> with target _blank
              return (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                    text-gray-700 hover:bg-gray-50
                    ${collapsed ? "justify-center px-0" : ""}
                    ${isDisabled ? "opacity-50 pointer-events-none cursor-not-allowed hover:bg-transparent" : ""}
                  `}
                  onClick={isDisabled ? (e) => e.preventDefault() : closeMobile}
                >
                  <Icon
                    size={18}
                    className={`text-gray-500 ${
                      collapsed ? "" : "group-hover:text-indigo-600"
                    }`}
                  />
                  {!collapsed && name}
                </a>
              );
            } else {
              // Internal navigation using react-router-dom Link
              return (
                <Link
                  key={href}
                  to={isDisabled ? "#" : href} // prevent navigation if disabled
                  onClick={isDisabled ? (e) => e.preventDefault() : closeMobile}
                  className={`
                    relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                    ${active ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}
                    ${collapsed ? "justify-center px-0" : ""}
                    ${isDisabled ? "opacity-50 pointer-events-none cursor-not-allowed hover:bg-transparent" : ""}
                  `}
                >
                  {active && !isDisabled && (
                    <span className="absolute left-0 top-0 h-full w-1 rounded-r bg-indigo-600" />
                  )}
                  <Icon
                    size={18}
                    className={`${active ? "text-indigo-600" : "text-gray-500"} ${
                      collapsed ? "" : "group-hover:text-indigo-600"
                    }`}
                  />
                  {!collapsed && name}
                </Link>
              );
            }
          })}
        </nav>

        {/* Collapse Button - neatly at bottom */}
        <div className="hidden md:flex justify-start py-4 ms-5 mt-auto">
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-full border hover:bg-gray-100 transition"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Mobile toggle button (only on mobile, outside sidebar) */}
      <button
        onClick={toggleMobile}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>
    </>
  );
}
