import { createBrowserRouter, Navigate } from "react-router-dom";
import { RequireAuth } from "./RequireAuth";
import Agents from "./pages/agents/Agents";
import Dashboard from "./pages/dashboard/Dashboard";
import AddAgentPage from "./pages/agents/AddAgent";
import EditAgentPage from "./pages/agents/EditAgent";
import ViewAgentPage from "./pages/agents/view/ViewAgent";
import { SignIn } from "./pages/login/SignIn";
import { SignUp } from "./pages/login/SignUp";
import HelpDocs from "./pages/help-docs/HelpDocs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/agents" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
    handle: { name: "Dashboard", isParent: true },
  },
  {
    path: "/agents",
    element: (
      <RequireAuth>
        <Agents />
      </RequireAuth>
    ),
    handle: { name: "Agents", isParent: true },
  },
  {
    path: "/agents/add",
    element: (
      <RequireAuth>
        <AddAgentPage />
      </RequireAuth>
    ),
    handle: { name: "Add Agent", isParent: false },
  },
  {
    path: "/agents/edit/:id",
    element: (
      <RequireAuth>
        <EditAgentPage />
      </RequireAuth>
    ),
    handle: { name: "Edit Agent", isParent: false },
  },
  {
    path: "/agents/view/:id",
    element: (
      <RequireAuth>
        <ViewAgentPage />
      </RequireAuth>
    ),
    handle: { name: "View Agent", isParent: false },
  },
     {
    path: "/help-docs/workflow",
    element: (
        <HelpDocs />
    ),
    handle: { name: "Help Doc", isParent: true },
  },
   {
    path: "/help-docs/workflow/:id",
    element: (
      <RequireAuth>
        <HelpDocs />
      </RequireAuth>
    ),
    handle: { name: "Help Doc", isParent: false },
  },
  {
    path: "/signin",
    element: <SignIn />,
    handle: { name: "signin", isParent: false },
  },
   {
    path: "/signup",
    element: <SignUp />,
    handle: { name: "Sign Up", isParent: false },
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
