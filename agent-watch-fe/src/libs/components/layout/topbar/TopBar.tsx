import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "../sidebar/UseSidebar";

export function Topbar() {
  const [hasNotifications] = useState(true);
  const { toggleMobile, toggleCollapse } = useSidebar(); // new

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white/90 backdrop-blur px-4 sm:px-6 py-3 shadow-sm ring-1 ring-gray-100">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* SAME button for both mobile & desktop */}
        <button
          onClick={() => {
            // small screens => open/close drawer
            // md+ screens   => collapse/expand sidebar
            if (window.innerWidth < 768) toggleMobile();
            else toggleCollapse();
          }}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-600" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <div className="text-sm font-medium text-gray-900">Sarah Chen</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <img
            src="https://i.pravatar.cc/300"
            alt="User"
            className="w-9 h-9 rounded-full border object-cover"
          />
        </div>
      </div>
    </header>
  );
}
