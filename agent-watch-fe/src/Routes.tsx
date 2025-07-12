import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Agents from './pages/agents/Agents';
import AddAgent from './pages/agents/AddAgent'; // <-- Import your AddAgent component

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
    path: "/agents/add",
    element: <AddAgent />, // <-- Add this route
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
