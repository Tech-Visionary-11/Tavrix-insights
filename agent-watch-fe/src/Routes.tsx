import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Agents from './pages/agents/Agents';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/agents",
    element: <Agents />,
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
