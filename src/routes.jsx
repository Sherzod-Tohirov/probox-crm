import { Navigate, createBrowserRouter } from "react-router-dom";
import PageLoader from "./pages/helper/PageLoader";
import Error from "./pages/helper/Error";
import { lazy, Suspense } from "react";

const App = lazy(() => import("./App"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Clients = lazy(() => import("./pages/Clients"));
const ClientPage = lazy(() => import("./pages/Clients/ClientPage"));
const Statistics = lazy(() => import("./pages/Statistics"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader fullscreen={true} />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" />,
        errorElement: <Error />,
      },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Error />
          </Suspense>
        ),
        errorElement: <Error />,
      },
      {
        path: "/clients",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <Clients />
              </Suspense>
            ),
            errorElement: <Error />,
          },
          {
            path: "/clients/:name",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ClientPage />
              </Suspense>
            ),
            errorElement: <Error />,
          },
        ],
        errorElement: <Error />,
      },
      {
        path: "/calendar",
        element: <>Calendar</>,
      },
      {
        path: "/statistics",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Statistics />
          </Suspense>
        ),
        errorElement: <Error />,
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
    errorElement: <Error />,
  },
]);

export default router;
