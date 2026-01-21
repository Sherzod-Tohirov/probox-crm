import { getRoutePermissions } from './routePermissions';

/**
 * Sidebar navigation links configuration
 *
 * Role-based access control is managed centrally in routePermissions.js
 * This ensures sidebar visibility and route access use the same rules
 */
const sidebarLinks = [
  {
    title: 'Asosiy',
    icon: 'dashboard',
    path: '/dashboard',
    ...getRoutePermissions('/dashboard'),
  },
  {
    title: 'Mijozlar',
    icon: 'clients',
    path: '/clients',
    ...getRoutePermissions('/clients'),
    children: [
      {
        title: 'Statistika',
        icon: 'presentationChart',
        path: '/clients/statistics',
        ...getRoutePermissions('/clients/statistics'),
      },
    ],
  },
  {
    title: 'Kalendar',
    icon: 'calendar',
    path: '/calendar',
    ...getRoutePermissions('/calendar'),
  },
  {
    title: 'Kalkulyator',
    icon: 'calculator',
    path: '/calculator',
    ...getRoutePermissions('/calculator'),
  },
  {
    title: 'Mahsulotlar',
    icon: 'products',
    path: '/products',
    ...getRoutePermissions('/products'),
  },
  {
    title: 'Sotib olish',
    icon: 'checkList',
    path: '/purchases',
    mode: import.meta.env.VITE_APP_ENV !== 'development' ? 'dev' : '',
    ...getRoutePermissions('/purchases'),
  },
  {
    title: 'Leadlar',
    icon: 'leads',
    path: '/leads',
    ...getRoutePermissions('/leads'),
    children: [
      {
        title: 'Statistika',
        icon: 'presentationChart',
        path: '/leads/statistics',
        ...getRoutePermissions('/leads/statistics'),
      },
    ],
  },
  {
    title: 'Chiqish',
    icon: 'logoutFilled',
    path: '/logout',
    color: 'danger',
  },
];

export default sidebarLinks;
