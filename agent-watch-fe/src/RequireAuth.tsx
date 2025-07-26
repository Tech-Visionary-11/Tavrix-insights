import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
}

const isAuthenticated = () => {
  // Example: check if token exists in localStorage
  return Boolean(localStorage.getItem("token"));
};

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login page preserving intended route
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
