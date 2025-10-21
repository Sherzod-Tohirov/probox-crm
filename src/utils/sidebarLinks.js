import { getRoutePermissions } from './routePermissions';

/**
 * Sidebar navigation links configuration
 * 
 * Role-based access control is managed centrally in routePermissions.js
 * This ensures sidebar visibility and route access use the same rules
 */
const sidebarLinks = [
  {
    title: "Asosiy",
    icon: "dashboard",
    path: "/dashboard",
    ...getRoutePermissions('/dashboard'),
  },
  {
    title: "Mijozlar",
    icon: "clients",
    path: "/clients",
    ...getRoutePermissions('/clients'),
  },
  {
    title: "Kalendar",
    icon: "calendar",
    path: "/calendar",
    ...getRoutePermissions('/calendar'),
  },
  {
    title: "Statistika",
    icon: "presentationChart",
    path: "/statistics",
    ...getRoutePermissions('/statistics'),
  },
  {
    title: "Mahsulotlar",
    icon: "products",
    path: "/products",
    ...getRoutePermissions('/products'),
  },
  {
    title: "Leadlar",
    icon: "leads",
    path: "/leads",
    ...getRoutePermissions('/leads'),
  },
  {
    title: "Chiqish",
    icon: "logoutFilled",
    path: "/logout",
    color: "danger",
  },
];

export default sidebarLinks;
