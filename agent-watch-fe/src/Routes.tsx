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
    handle: { name: "Dashboard", isParent: true },
  },
  {
    path: "/agents",
    element: <Agents />,
    handle: { name: "Agents", isParent: true },
  },
  {
    path: "/agents/add",
    element: <AddAgentPage />,
    handle: { name: "Add Agent", isParent: false },
  },
  {
    path: "/agents/edit/:id",
    element: <EditAgentPage />,
    handle: { name: "Edit Agent", isParent: false },
  },
  {
    path: "/agents/view/:id",
    element: <ViewAgentPage />,
    handle: { name: "View Agent", isParent: false },
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
