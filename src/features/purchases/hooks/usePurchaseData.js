import { useState, useEffect } from 'react';

const DRAFT_STORAGE_KEY = 'purchase_draft_';

/**
 * Purchase ma'lumotlarini boshqarish uchun custom hook
 * Responsibilities: localStorage bilan ishlash, API ma'lumotlarini mapping qilish
 */
export function usePurchaseData({ purchase, contractNo, isNewPurchase }) {
  const [purchaseItems, setPurchaseItems] = useState([]);

  // Yangi xarid uchun localStorage dan yuklash
  useEffect(() => {
    if (isNewPurchase) {
      const draftKey = DRAFT_STORAGE_KEY + 'new';
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setPurchaseItems(draft.items || []);
        } catch (e) {
          console.error('Draft yuklashda xatolik:', e);
        }
      }
    } else if (contractNo) {
      // Mavjud xarid uchun localStorage dan o'zgarishlarni yuklash
      const draftKey = DRAFT_STORAGE_KEY + contractNo;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setPurchaseItems(draft.items || []);
        } catch (e) {
          console.error('Draft yuklashda xatolik:', e);
        }
      }
    }
  }, [isNewPurchase, contractNo]);

  // localStorage ga saqlash - yangi va mavjud xaridlar uchun
  useEffect(() => {
    if (purchaseItems.length > 0) {
      const draftKey = isNewPurchase
        ? DRAFT_STORAGE_KEY + 'new'
        : DRAFT_STORAGE_KEY + contractNo;
      localStorage.setItem(
        draftKey,
        JSON.stringify({
          items: purchaseItems,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }, [purchaseItems, isNewPurchase, contractNo]);

  // API dan ma'lumotlarni yuklash - faqat localStorage da draft bo'lmasa
  useEffect(() => {
    if (contractNo && purchase) {
      const draftKey = DRAFT_STORAGE_KEY + contractNo;
      const savedDraft = localStorage.getItem(draftKey);
      // Agar localStorage da draft bo'lmasa, API dan yuklash
      if (!savedDraft && purchase?.items?.length > 0) {
        // API formatini table formatiga mapping qilish
        const mappedItems = purchase.items.map((item, index) => ({
          id: item.docEntry
            ? `${item.docEntry}-${item.lineNum}`
            : `api-${index}`,
          product_id: item.itemCode,
          product_name: item.dscription,
          itemCode: item.itemCode,
          category: item?.ItemGroupName ?? '',
          imei: item?.serial || '',
          whsCode: item?.whsCode || purchase?.whsCode || '01',
          currency: purchase?.docCur || 'UZS',
          prodCondition: item?.prodCondition || '',
          batteryCapacity: item?.batteryCapacity || '',
          quantity: parseFloat(item?.lineQuantity) || 1,
          price: parseFloat(item?.price) || 0,
        }));
        setPurchaseItems(mappedItems);
      }
    }
  }, [purchase, contractNo]);

  // Asosiy sahifaga qaytganda localStorage ni tozalash
  useEffect(() => {
    return () => {
      // Component unmount bo'lganda va contractNo bo'lsa, draft ni tozalash
      if (contractNo) {
        const draftKey = DRAFT_STORAGE_KEY + contractNo;
        localStorage.removeItem(draftKey);
      }
    };
  }, [contractNo]);

  return { purchaseItems, setPurchaseItems };
}
