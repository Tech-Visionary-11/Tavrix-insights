import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

interface RequireAuthProps {
  children: JSX.Element;
}


const isAuthenticated = () => {
  const token = Cookies.get("auth_token");

  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < currentTime) {
      // Token is expired
      return false;
    }

    return true;
  } catch (err:any) {
    // Invalid token
    return false;
  }
};
export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login page preserving intended route
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
