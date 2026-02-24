/**
 * Role-based permissions for NewLeadPage tabs
 * Easy to control and extend for additional roles
 */

export const TAB_PERMISSIONS = {
  operator: {
    allowedRoles: ['Operator1', 'OperatorM'],
    fields: ['meetingConfirmed', 'meetingDate', 'branch', 'seller'],
  },
  seller: {
    allowedRoles: ['Seller', 'SellerM'],
    fields: ['meetingConfirmed', 'saleType', 'purchase'],
  },
  scoring: {
    allowedRoles: ['Scoring'],
    fields: ['scoringResult', 'katm', 'mib'],
  },
};

/**
 * Check if user role can edit specific tab
 * @param {string} userRole - Current user's role
 * @param {string} tabName - Tab name (operator, seller, scoring)
 * @returns {boolean}
 */
export const canEditTab = (userRole, tabName) => {
  const tabPermission = TAB_PERMISSIONS[tabName];
  if (!tabPermission) return false;
  return tabPermission.allowedRoles.includes(userRole);
};

/**
 * Get all tabs user can edit
 * @param {string} userRole - Current user's role
 * @returns {string[]} Array of tab names user can edit
 */
export const getUserEditableTabs = (userRole) => {
  return Object.keys(TAB_PERMISSIONS).filter((tabName) =>
    canEditTab(userRole, tabName)
  );
};

/**
 * Check if user can edit any service info tab
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export const canEditServiceInfo = (userRole) => {
  return getUserEditableTabs(userRole).length > 0;
};
