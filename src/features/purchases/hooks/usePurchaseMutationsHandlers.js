import { useCallback } from 'react';

/**
 * Purchase mutations uchun handler funksiyalar
 * Responsibilities: API ga so'rov yuborish uchun ma'lumotlarni tayyorlash
 */
export function usePurchaseMutationsHandlers({
  purchaseItems,
  supplier,
  warehouseValue,
  isNewPurchase,
  docEntry,
  createPurchaseMutation,
  updatePurchaseMutation,
  approvePurchaseMutation,
  cancelPurchaseMutation,
}) {
  // Xarid yuborish yoki yangilash
  const handleSendToApprovel = useCallback(() => {
    const payload = {
      cardCode: supplier?.code,
      whsCode: warehouseValue,
      rows: purchaseItems.map((item) => ({
        itemCode: item?.itemCode,
        quantity: item?.quantity,
        price: item?.price,
        currency: item?.currency,
        batteryCapacity: item?.batteryCapacity,
        prodCondition: item?.prodCondition,
        imei: item?.imei,
        whsCode: item?.whsCode || warehouseValue,
      })),
    };

    // Mavjud xaridni yangilash yoki yangi yaratish
    if (isNewPurchase) {
      createPurchaseMutation.mutate(payload);
    } else if (docEntry) {
      updatePurchaseMutation.mutate({ id: docEntry, data: payload });
    }
  }, [
    purchaseItems,
    supplier,
    warehouseValue,
    isNewPurchase,
    docEntry,
    createPurchaseMutation,
    updatePurchaseMutation,
  ]);

  // Xaridni tasdiqlash
  const handleConfirmPurchase = useCallback(() => {
    approvePurchaseMutation.mutate({ docEntry });
  }, [docEntry, approvePurchaseMutation]);

  // Xaridni bekor qilish
  const handleCancelPurchase = useCallback(() => {
    cancelPurchaseMutation.mutate({ docEntry });
  }, [docEntry, cancelPurchaseMutation]);

  return {
    handleSendToApprovel,
    handleConfirmPurchase,
    handleCancelPurchase,
  };
}
