import { Bell, ArrowLeft } from "lucide-react";
import { useState } from "react";
import {  useNavigate, useMatches } from "react-router-dom";

type RouteHandle = {
  name?: string;
  isParent?: boolean;
};

export function Topbar() {
  const [hasNotifications] = useState(true);
  const navigate = useNavigate();
  const matches = useMatches();

  // Get current page info from router matches
  const getCurrentPageInfo = () => {
    // Get the last match (current route)
    const currentMatch = matches[matches.length - 1] as { handle?: RouteHandle };
    
    if (currentMatch?.handle) {
      return {
        name: currentMatch.handle?.name,
        isParent: currentMatch.handle?.isParent
      };
    }
    
    // Fallback for routes without handle
    return { name: 'Dashboard', isParent: true };
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const currentPageInfo = getCurrentPageInfo();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white/90 backdrop-blur px-4 sm:px-6 py-3 shadow-sm ring-1 ring-gray-100">
      {/* Left section */}
      <div className="flex items-center gap-4">
        
        {/* Back button (only shown for child routes) */}
        {!currentPageInfo.isParent && (
          <button
            onClick={handleBackClick}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        
        {/* Dynamic page name */}
        <h1 className="text-xl font-semibold text-gray-900">
          {currentPageInfo.name}
        </h1>
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