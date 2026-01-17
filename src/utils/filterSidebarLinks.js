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

  const canSee = (link) => {
    if (link.excludedRoles && Array.isArray(link.excludedRoles)) {
      if (link.excludedRoles.includes(userRole)) return false;
    }
    if (link.allowedRoles && Array.isArray(link.allowedRoles)) {
      if (!link.allowedRoles.includes(userRole)) return false;
    }
    return true;
  };

  const filterRecursive = (items) => {
    return (items || []).reduce((acc, item) => {
      const children = Array.isArray(item.children)
        ? filterRecursive(item.children)
        : undefined;
      const visibleSelf = canSee(item);
      // Keep item if itself is visible OR it has any visible children
      if (visibleSelf || (children && children.length)) {
        if (item?.mode?.includes('dev')) return acc;
        acc.push({ ...item, ...(children ? { children } : {}) });
      }
      return acc;
    }, []);
  };

  return filterRecursive(links);
};

export default filterSidebarLinks;
