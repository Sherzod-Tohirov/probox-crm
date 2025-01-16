import { createBrowserRouter } from "react-router-dom";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <>Dashboard</>,
      },
      {
        path: "/clients",
        element: <>CLients</>,
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
