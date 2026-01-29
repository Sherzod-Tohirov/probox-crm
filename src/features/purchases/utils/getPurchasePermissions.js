export function getPurchasePermissions(role, status) {
  return {
    canEditItems:
      ['Seller', 'CEO'].includes(role) && ['draft', 'pending'].includes(status),
    canSendForApprovel:
      ['Seller', 'CEO'].includes(role) && ['draft', 'pending'].includes(status),
    canApprove: ['CEO'].includes(role) && ['pending'].includes(status),
    canDownload: ['CEO'].includes(role) && ['approved'].includes(status),
  };
}
