import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { canAccessRoute } from '@utils/routePermissions';

/**
 * Protected Route component that checks user role permissions
 * 
 * @param {Object} props
 * @param {JSX.Element} props.children - The component to render if access is granted
 * @param {Array<string>} props.allowedRoles - Array of roles that can access this route (optional if using centralized config)
 * @param {Array<string>} props.excludedRoles - Array of roles that cannot access this route (optional if using centralized config)
 * @param {boolean} props.useCentralizedConfig - If true, uses centralized route permissions from routePermissions.js
 * @returns {JSX.Element} Either the children or a redirect to 404
 * 
 * Logic:
 * 1. If not authenticated → redirect to login
 * 2. If user role is in excludedRoles → redirect to 404
 * 3. If allowedRoles exists and user role is NOT in it → redirect to 404
 * 4. Otherwise → allow access
 */
const ProtectedRoute = ({ children, allowedRoles, excludedRoles, useCentralizedConfig = false }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Use centralized config if specified
  if (useCentralizedConfig) {
    const hasAccess = canAccessRoute(location.pathname, user);
    if (!hasAccess) {
      return <Navigate to="/404" replace />;
    }
    return children;
  }

  // Otherwise use props (for backward compatibility and explicit overrides)
  const userRole = user?.U_role;

  // Check if user role is excluded
  if (excludedRoles && Array.isArray(excludedRoles)) {
    if (excludedRoles.includes(userRole)) {
      return <Navigate to="/404" replace />;
    }
  }

  // Check if user role is allowed (if allowedRoles is specified)
  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/404" replace />;
    }
  }

  // User has access, render the children
  return children;
};

export default ProtectedRoute;
