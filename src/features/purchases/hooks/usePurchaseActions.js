import { useCallback } from 'react';

/**
 * Purchase harakatlari uchun custom hook
 * Responsibilities: Item qo'shish, yangilash, o'chirish
 */
export function usePurchaseActions({ setPurchaseItems, warehouseValue }) {
  // Yangi mahsulot qo'shish
  const handleProductSelect = useCallback(
    (row, product) => {
      const newItem = {
        id: Date.now(),
        product_id: product.ItemCode,
        product_name: product.ItemName,
        itemCode: product.ItemCode,
        category: product.ItemGroupName || '',
        imei: '',
        whsCode: warehouseValue || '01',
        currency: 'UZS',
        prodCondition: product?.U_PROD_CONDITION || '',
        batteryCapacity: product?.Battery || '',
        quantity: 1,
        price: 0,
      };
      setPurchaseItems((prev) => [...prev, newItem]);
    },
    [setPurchaseItems, warehouseValue]
  );

  // Field yangilash
  const handleFieldUpdate = useCallback(
    (itemId, field, value) => {
      if (field === 'delete') {
        setPurchaseItems((prev) => prev.filter((item) => item.id !== itemId));
        return;
      }
      // Yangi va mavjud xaridlar uchun local state ni yangilash
      setPurchaseItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      );
    },
    [setPurchaseItems]
  );

  // Item o'chirish (modal orqali)
  const handleDeleteItem = useCallback(
    (itemId) => {
      if (itemId) {
        setPurchaseItems((prev) => prev.filter((item) => item.id !== itemId));
      }
    },
    [setPurchaseItems]
  );

  return {
    handleProductSelect,
    handleFieldUpdate,
    handleDeleteItem,
  };
}
