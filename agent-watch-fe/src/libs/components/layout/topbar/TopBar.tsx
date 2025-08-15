import { Bell, ArrowLeft, LogOut } from "lucide-react";
import {  useNavigate, useMatches } from "react-router-dom";
 import Cookies from 'js-cookie';

type RouteHandle = {
  name?: string;
  isParent?: boolean;
};

export function Topbar() {
  const navigate = useNavigate();
  const matches = useMatches();
  const handleBackClick = () => navigate(-1);

  const handleLogout = async () => {
    Cookies.remove("auth_token");
    navigate("/login");
  };

  // Route label logic
  const getCurrentPageInfo = () => {
    const currentMatch = matches[matches.length - 1] as { handle?:RouteHandle};
    return currentMatch?.handle || { name: "Dashboard", isParent: true };
  };
  const currentPageInfo = getCurrentPageInfo();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white/90 backdrop-blur px-4 sm:px-6 py-3 shadow-sm ring-1 ring-gray-100">
      {/* Left */}
      <div className="flex items-center gap-4">
        {!currentPageInfo.isParent && (
          <button onClick={handleBackClick} className="p-2 rounded-md hover:bg-gray-100 transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-900">{currentPageInfo.name}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
      </div>
    </header>
  )
}