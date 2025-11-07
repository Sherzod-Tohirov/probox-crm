const hasRole = (user, allowedRoles) => {
  if (!user || !allowedRoles) return false;
  if (!Array.isArray(allowedRoles)) return false;
  let role = user;
  if (typeof user === 'object' && user?.U_role) {
    role = user?.U_role;
    if (role === 'CEO') return true;
  }
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(role);
  }
  return role === allowedRoles;
};

export default hasRole;
