/**
 * Centralized route permissions configuration
 *
 * This ensures sidebar visibility and route access use the same rules
 *
 * Each route can have:
 * - allowedRoles: Array of roles that can access this route. If not specified, all roles can access.
 * - excludedRoles: Array of roles that cannot access this route. Takes precedence over allowedRoles.
 *
 * Priority: excludedRoles > allowedRoles > default (accessible to all authenticated users)
 */
const routePermissions = {
  '/dashboard': {
    // Accessible to all authenticated users
  },
  '/clients': {
    excludedRoles: ['Operator1', 'Operator2', 'Seller', 'OperatorM'], // Operators cannot access statistics
  },
  '/clients/statistics': {
    excludedRoles: ['Operator1', 'Operator2', 'Scoring', 'Seller', 'OperatorM'],
  },
  '/calendar': {
    // Accessible to all authenticated users
  },
  '/statistics': {
    excludedRoles: ['Operator1', 'Operator2', 'Scoring', 'Seller', 'OperatorM'], // Operators cannot access statistics
  },
  '/products': {
    // Accessible to all authenticated users
  },
  '/leads': {
    allowedRoles: [
      'Operator1',
      'Operator2',
      'Scoring',
      'Seller',
      'OperatorM',
      'CEO',
      'Manager',
    ], // Only specific roles can access leads
  },
  '/leads/:id': {
    allowedRoles: [
      'Operator1',
      'Operator2',
      'Scoring',
      'Seller',
      'OperatorM',
      'CEO',
      'Manager',
    ], // Only specific roles can access leads
  },
  '/leads/statistics': {
    allowedRoles: [
      'Operator1',
      'Operator2',
      'Scoring',
      'Seller',
      'OperatorM',
      'CEO',
      'Manager',
    ],
  },
};

/**
 * Get permissions for a specific route
 * @param {string} path - The route path
 * @returns {Object} Permissions object with allowedRoles and excludedRoles
 */
export const getRoutePermissions = (path) => {
  return routePermissions[path] || {};
};

/**
 * Check if a user has access to a specific route
 * @param {string} path - The route path
 * @param {Object} user - User object containing role information
 * @returns {boolean} True if user can access the route
 */
export const canAccessRoute = (path, user) => {
  if (!user || !user.U_role) {
    return false;
  }

  const permissions = getRoutePermissions(path);
  const userRole = user.U_role;

  // Check if user role is excluded
  if (permissions.excludedRoles && Array.isArray(permissions.excludedRoles)) {
    if (permissions.excludedRoles.includes(userRole)) {
      return false;
    }
  }

  // Check if user role is allowed (if allowedRoles is specified)
  if (permissions.allowedRoles && Array.isArray(permissions.allowedRoles)) {
    if (!permissions.allowedRoles.includes(userRole)) {
      return false;
    }
  }

  return true;
};

export default routePermissions;
