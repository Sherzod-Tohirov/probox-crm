const hasRole = (user, allowedRoles) => {
  if (!user || !allowedRoles) return false;
  if (!Array.isArray(allowedRoles)) return false;
  return allowedRoles.includes(user?.U_role);
};

export default hasRole;
