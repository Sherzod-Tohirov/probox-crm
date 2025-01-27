import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";

import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/clients",
        element: <Clients />,
        children: [
          {
            path: "/clients/:name",
            element: <>Client</>,
          },
        ],
      },
      {
        path: "/calendar",
        element: <>Calendar</>,
      },
      {
        path: "/products",
        element: <>Products</>,
      },
      {
        path: "/leads",
        element: <>Leads</>,
      },
    ],
  },
]);

export default router;
