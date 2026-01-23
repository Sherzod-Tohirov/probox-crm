export function getPurchasePermissions(role, status) {
  return {
    canEditItems: role === 'Seller' && status === 'draft',
    canSendForApprovel: role === 'Seller' && status === 'draft',
    canApprove: role === 'CEO' && status === 'pending',
    canDownload: role === 'CEO' && status === 'approved',
  };
}
