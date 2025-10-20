/**
 * Filters sidebar links based on user role and link permissions
 *
 * @param {Array} links - Array of sidebar link objects
 * @param {Object} user - User object containing role information
 * @returns {Array} Filtered array of sidebar links that the user can access
 *
 * Logic:
 * 1. If link has excludedRoles and user role is in it → hide link
 * 2. If link has allowedRoles and user role is NOT in it → hide link
 * 3. If link has neither excludedRoles nor allowedRoles → show link (visible to all)
 * 4. If no user is provided → show all links
 */
const filterSidebarLinks = (links, user) => {
  // If no user, show all links (fallback for unauthenticated state)
  if (!user || !user.U_role) {
    return links;
  }

  const userRole = user.U_role;

  return links.filter((link) => {
    // Check if user role is excluded
    if (link.excludedRoles && Array.isArray(link.excludedRoles)) {
      if (link.excludedRoles.includes(userRole)) {
        return false; // Hide link if user role is excluded
      }
    }

    // Check if user role is allowed (if allowedRoles is specified)
    if (link.allowedRoles && Array.isArray(link.allowedRoles)) {
      if (!link.allowedRoles.includes(userRole)) {
        return false; // Hide link if user role is not in allowed list
      }
    }

    // Show link if it passes all checks
    return true;
  });
};

export default filterSidebarLinks;
