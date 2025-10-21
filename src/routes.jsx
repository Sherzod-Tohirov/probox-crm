import { Navigate, createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './hocs/ProtectedRoute';

const App = lazy(() => import('./App'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const ClientPage = lazy(() => import('./pages/Clients/ClientPage'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Leads = lazy(() => import('./pages/Leads'));
const NotFound = lazy(() => import('./pages/helper/NotFound'));
const PageLoader = lazy(() => import('./pages/helper/PageLoader'));
const Error = lazy(() => import('./pages/helper/Error'));
const Login = lazy(() => import('./pages/auth/Login'));
const Logout = lazy(() => import('./pages/auth/Logout'));

const router = createBrowserRouter([
  {
    path: '/',
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
        path: '/dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
        errorElement: <Error />,
      },
      {
        path: '/clients',
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
            path: '/clients/:id',
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
        path: '/calendar',
        element: <h2 style={{ fontSize: '5rem' }}>Calendar</h2>,
      },
      {
        path: '/statistics',
        element: (
          <ProtectedRoute excludedRoles={['Operator1', 'Operator2']}>
            <Suspense fallback={<PageLoader />}>
              <Statistics />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <Error />,
      },
      {
        path: '/products',
        element: <h2 style={{ fontSize: '5rem' }}>Products</h2>,
      },
      {
        path: '/leads',
        element: (
          <ProtectedRoute allowedRoles={['Operator1', 'Operator2', 'CEO']}>
            <Suspense fallback={<PageLoader />}>
              <Leads />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <Error />,
      },
    ],
    errorElement: <Error />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader fullscreen={true} />}>
        <Login />
      </Suspense>
    ),
    errorElement: <Error />,
  },
  {
    path: '/logout',
    element: (
      <Suspense fallback={<PageLoader fullscreen={true} />}>
        <Logout />
      </Suspense>
    ),
    errorElement: <Error />,
  },
  {
    path: '/api/*',
    loader: () => {
      // This will cause the browser to handle the request normally
      // instead of React Router trying to handle it
      throw new Response('Not Found', { status: 404 });
    },
  },
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
  {
    path: '/404',
    element: (
      <Suspense fallback={<PageLoader fullscreen={true} />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
