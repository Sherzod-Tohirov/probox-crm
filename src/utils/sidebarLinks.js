/**
 * Sidebar navigation links configuration with role-based access control
 *
 * Each link can have:
 * - allowedRoles: Array of roles that can see this link. If not specified, all roles can see it.
 * - excludedRoles: Array of roles that cannot see this link. Takes precedence over allowedRoles.
 *
 * Priority: excludedRoles > allowedRoles > default (visible to all)
 */
const sidebarLinks = [
  {
    title: "Asosiy",
    icon: "dashboard",
    path: "/dashboard",
    // Visible to all roles
  },
  {
    title: "Mijozlar",
    icon: "clients",
    path: "/clients",
    // Visible to all roles
  },
  {
    title: "Kalendar",
    icon: "calendar",
    path: "/calendar",
    // Visible to all roles
  },
  {
    title: "Statistika",
    icon: "presentationChart",
    path: "/statistics",
    excludedRoles: ['Operator1', 'Operator2'], // Operators cannot see statistics
  },
  {
    title: "Mahsulotlar",
    icon: "products",
    path: "/products",
    // Visible to all roles
  },
  {
    title: "Leadlar",
    icon: "leads",
    path: "/leads",
    allowedRoles: ['Operator1', 'Operator2', 'CEO'], // Only Admin and Manager can see leads
    // Visible to all roles
  },
  {
    title: "Chiqish",
    icon: "logoutFilled",
    path: "/logout",
    color: "danger",
    // Visible to all roles
  },
];

export default sidebarLinks;
