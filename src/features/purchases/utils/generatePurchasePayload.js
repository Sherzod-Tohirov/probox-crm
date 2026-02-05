/**
 * PDF uchun purchase ma'lumotlarini tayyorlash
 * Responsibility: Ma'lumotlarni PDF formatiga o'zgartirish
 */
export function generatePurchasePayload({
  contractNo,
  purchase,
  supplier,
  courierValue,
  warehouseValue,
  warehouseOptions,
  branches,
  user,
  purchaseItems,
  status,
  docEntry,
}) {
  return {
    contractNo: contractNo || purchase?.docNum || 'N/A',
    supplier:
      supplier?.name ||
      courierValue?.name ||
      courierValue ||
      purchase?.cardName ||
      'N/A',
    receiver: user?.U_name || 'N/A',
    supplierPhone: supplier?.phone || purchase?.supplierPhone || 'N/A',
    receiverPhone: user?.U_phone || 'N/A',
    warehouse:
      warehouseOptions.find((opt) => opt.value === warehouseValue)?.label ||
      purchase?.whsName ||
      'N/A',
    branch:
      branches?.find((b) => b.code === warehouseValue)?.name ||
      purchase?.branchName ||
      'N/A',
    date: purchase?.docDate
      ? new Date(purchase.docDate).toLocaleDateString('ru-RU')
      : new Date().toLocaleDateString('ru-RU'),
    items: purchaseItems,
    status: status,
    totalAmount: purchaseItems.reduce(
      (sum, item) => sum + (item.price * item.quantity || 0),
      0
    ),
    docEntry,
  };
}
