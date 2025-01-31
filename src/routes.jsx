import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";

import { Navigate } from "react-router-dom";
import ClientPage from "./pages/Clients/ClientPage";
import ClientPageLayout from "./layouts/ClientPageLayout";

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
        children: [
          {
            index: true,
            element: <Clients />,
          },
          {
            path: "/clients/:name",
            element: <ClientPage />,
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
