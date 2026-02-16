import { Navigate, createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './hocs/ProtectedRoute';

// Base app
const App = lazy(() => import('./App'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Logout = lazy(() => import('./pages/auth/Logout'));

// Dashboard page
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Client pages
const Clients = lazy(() => import('./pages/Clients'));
const ClientPage = lazy(() => import('./pages/Clients/ClientPage'));
const ClientsStatistics = lazy(
  () => import('./pages/Clients/ClientsStatistics')
);

// Lead pages
const Leads = lazy(() => import('./pages/Leads'));
const LeadPage = lazy(() => import('./pages/Leads/LeadPage'));
const NewLeadPage = lazy(() => import('./pages/Leads/NewLeadPage'));
const LeadsStatistics = lazy(() => import('./pages/Leads/LeadsStatistics'));
const NewLeadsStatistics = lazy(
  () => import('./pages/Leads/NewLeadsStatistics')
);

// Calculator
const Calculator = lazy(() => import('./pages/Calculator/Calculator'));

// Products
const Products = lazy(() => import('./pages/Products/Products'));

// Purchases
const Purchases = lazy(() => import('./pages/Purchases/Purchases'));
const Purchase = lazy(() => import('./pages/Purchases/Purchase'));

// Helper pages
const NotFound = lazy(() => import('./pages/helper/NotFound'));
const PageLoader = lazy(() => import('./pages/helper/PageLoader'));
const Error = lazy(() => import('./pages/helper/Error'));

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
              <ProtectedRoute
                excludedRoles={[
                  'Operator1',
                  'Operator2',
                  'Seller',
                  'OperatorM',
                ]}
              >
                <Suspense fallback={<PageLoader />}>
                  <Clients />
                </Suspense>
              </ProtectedRoute>
            ),
            errorElement: <Error />,
          },
          {
            path: '/clients/:id',
            element: (
              <ProtectedRoute
                excludedRoles={[
                  'Operator1',
                  'Operator2',
                  'Seller',
                  'OperatorM',
                ]}
              >
                <Suspense fallback={<PageLoader />}>
                  <ClientPage />
                </Suspense>
              </ProtectedRoute>
            ),
            errorElement: <Error />,
          },
          {
            path: '/clients/statistics',
            element: (
              <ProtectedRoute
                excludedRoles={[
                  'Operator1',
                  'Operator2',
                  'Scoring',
                  'Seller',
                  'OperatorM',
                ]}
              >
                <Suspense fallback={<PageLoader />}>
                  <ClientsStatistics />
                </Suspense>
              </ProtectedRoute>
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
        path: '/calculator',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader fullscreen={true} />}>
              <Calculator />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/products',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader fullscreen={true} />}>
              <Products />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/purchases',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Suspense fallback={<PageLoader fullscreen={true} />}>
                  <Purchases />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: '/purchases/:id',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<PageLoader fullscreen={true} />}>
                  <Purchase />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: '/purchases/new',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<PageLoader fullscreen={true} />}>
                  <Purchase />
                </Suspense>
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: '/leads',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute
                allowedRoles={[
                  'Operator1',
                  'Operator2',
                  'Scoring',
                  'Seller',
                  'OperatorM',
                  'CEO',
                  'Manager',
                ]}
              >
                <Suspense fallback={<PageLoader />}>
                  <Leads />
                </Suspense>
              </ProtectedRoute>
            ),
            errorElement: <Error />,
          },
          {
            path: '/leads/statistics',
            element: (
              <ProtectedRoute allowedRoles={['OperatorM', 'CEO', 'Manager']}>
                <Suspense fallback={<PageLoader />}>
                  <LeadsStatistics />
                </Suspense>
              </ProtectedRoute>
            ),
            errorElement: <Error />,
          },
          {
            path: '/leads/statistics/new',
            element: (
              <ProtectedRoute allowedRoles={['OperatorM', 'CEO', 'Manager']}>
                <Suspense fallback={<PageLoader />}>
                  <NewLeadsStatistics />
                </Suspense>
              </ProtectedRoute>
            ),
            errorElement: <Error />,
          },
          {
            path: '/leads/:id',
            element: (
              <ProtectedRoute
                allowedRoles={[
                  'Operator1',
                  'Operator2',
                  'Scoring',
                  'Seller',
                  'OperatorM',
                  'CEO',
                  'Manager',
                ]}
              >
                <Suspense fallback={<PageLoader />}>
                  <LeadPage />
                </Suspense>
              </ProtectedRoute>
            ),
            errorElement: <Error />,
          },
          {
            path: '/leads/:id/new',
            element: (
              <ProtectedRoute
                allowedRoles={[
                  'Operator1',
                  'Operator2',
                  'Scoring',
                  'Seller',
                  'OperatorM',
                  'CEO',
                  'Manager',
                ]}
              >
                <Suspense fallback={<PageLoader />}>
                  <NewLeadPage />
                </Suspense>
              </ProtectedRoute>
            ),
            errorElement: <Error />,
          },
        ],
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
