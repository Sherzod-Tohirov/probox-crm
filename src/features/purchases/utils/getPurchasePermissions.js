export function getPurchasePermissions(role, status) {
  return {
    canAdd: ['Seller', 'SellerM', 'CEO'].includes(role),
    canEditItems:
      ['Seller', 'SellerM', 'CEO'].includes(role) &&
      ['draft', 'pending'].includes(status),
    canSendForApprovel:
      ['Seller', 'SellerM', 'CEO'].includes(role) &&
      ['draft', 'pending'].includes(status),
    canApprove: ['CEO'].includes(role) && ['pending'].includes(status),
    canDownload: ['CEO'].includes(role) && ['approved'].includes(status),
  };
}
