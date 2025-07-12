import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Agents from './pages/agents/Agents';
import AddAgentPage from './pages/agents/AddAgent';
import EditAgentPage from './pages/agents/EditAgent';
import ViewAgentPage from './pages/agents/view/ViewAgent';


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
    element: <AddAgentPage />, // <-- Add this route
  },
    {
    path: "/agents/edit/:id",
    element: <EditAgentPage/>, // <-- Add this route
  },
     {
    path: "/agents/view/:id",
    element: <ViewAgentPage/>, // <-- Add this route
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
