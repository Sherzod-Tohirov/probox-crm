export const extractNumericValue = (priceText) => {
  if (!priceText && priceText !== 0) return null;
  if (typeof priceText === 'number') {
    return Number.isNaN(priceText) || !Number.isFinite(priceText)
      ? null
      : priceText;
  }
  const digits = priceText.toString().replace(/[^\d]/g, '');
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isNaN(parsed) || !Number.isFinite(parsed) ? null : parsed;
};

export const formatNumberWithSeparators = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '';
  const rounded = Math.round(numeric);
  if (!Number.isFinite(rounded)) return '';
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatCurrencyUZS = (value) => {
  const formatted = formatNumberWithSeparators(value);
  return formatted ? `${formatted} so'm` : '';
};

// Narxni minglikka pastga tushirish: 13 684 230 -> 13 684 000
export const floorToThousands = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.floor(num / 1000) * 1000;
};

/**
 * Qurilma uchun bazaviy USD narxini hisoblash
 * - U_PROD_CONDITION = "B/U" bo'lsa: PurchasePrice dan foydalanib, foiz qo'shamiz
 * - Aks holda (Yangi yoki null): SalePrice dan foydalanamiz
 *
 * Foiz qo'shish qoidalari (faqat B/U uchun):
 *  - <= 500      => +10%
 *  - 500-1000   => +6%
 *  - > 1000 => +3%
 */
export const getItemBasePriceUSD = (item) => {
  if (!item) return null;

  const condition = item?.U_PROD_CONDITION ?? item?.u_prod_condition ?? null;

  const parsePrice = (value) => {
    if (value === null || value === undefined) return null;
    const num =
      typeof value === 'number'
        ? value
        : parseFloat(String(value).replace(',', '.'));
    return Number.isFinite(num) && num > 0 ? num : null;
  };

  const salePriceUSD = parsePrice(item?.SalePrice ?? item?.salePrice);
  const purchasePriceUSD = parsePrice(
    item?.PurchasePrice ?? item?.purchasePrice
  );

  // faqat B/U uchun: Faqat PurchasePrice dan foydalanamiz, SalePrice NI UMUMAN ishlatmaymiz
  if (condition === 'B/U') {
    const base = purchasePriceUSD;
    if (!base) {
      // PurchasePrice yo'q bo'lsa, narxni hisoblamaymiz
      return null;
    }

    let multiplier = 1;

    if (base <= 500) {
      // 10 foiz
      multiplier = 1.1; // +10%
    } else if (base > 500 && base <= 1000) {
      // 6foiz
      multiplier = 1.06; // +6%
    } else if (base > 1000) {
      multiplier = 1.03; // +3%
    }

    return base * multiplier;
  }

  // Yangi (yoki condition bo'sh) holatlarda faqat SalePrice dan foydalanamiz
  if (condition === 'Yangi' || !condition) {
    const base = salePriceUSD;
    if (!base) return null;

    return base;
  }

  // Boshqa kutilmagan holatlar uchun hech narsa qaytarmaymiz
  return null;
};

export const normalizeContractItems = (
  items = [],
  branchCodeToNameMap,
  currencyRate
) => {
  return items.map((item, index) => {
    // Condition ma'lumotini U_PROD_CONDITION maydonidan olamiz (narx hisoblashdan oldin)
    const condition = item?.U_PROD_CONDITION ?? item?.u_prod_condition ?? '';

    // Avvalo USD dagi bazaviy narxni aniqlaymiz (U_PROD_CONDITION va Purchase/SalePrice bo'yicha)
    const basePriceUSD = getItemBasePriceUSD(item);

    let priceText = '';

    // Agar U_PROD_CONDITION "Yangi" bo'lsa, SalePrice allaqachon UZS formatida,
    // shuning uchun uni dollar kursiga ko'paytirmaslik kerak
    if (condition === 'Yangi' && basePriceUSD) {
      // Yangi mahsulotlar uchun SalePrice to'g'ridan-to'g'ri UZS formatida
      priceText = formatCurrencyUZS(basePriceUSD);
    } else {
      // B/U yoki boshqa holatlar uchun: Agar kurs bo'lsa, USD -> UZS ga o'tkazib, formatlaymiz
      const rateNum =
        currencyRate !== null && currencyRate !== undefined
          ? Number(currencyRate)
          : null;

      if (basePriceUSD && rateNum && Number.isFinite(rateNum) && rateNum > 0) {
        const priceUZSRaw = basePriceUSD * rateNum;
        const priceUZS =
          condition === 'B/U' ? floorToThousands(priceUZSRaw) : priceUZSRaw;
        priceText = formatCurrencyUZS(priceUZS);
      } else {
        // Fallback: eski PhonePrice maydonlari bo'yicha
        const priceValue = item?.PhonePrice ?? item?.phonePrice ?? null;
        priceText =
          priceValue !== null &&
          priceValue !== undefined &&
          (priceValue || priceValue === 0)
            ? formatCurrencyUZS(priceValue)
            : '';
      }
    }

    const onHand = item?.OnHand ?? item?.onHand ?? 0;
    const onHandText = onHand > 0 ? `${onHand} ta bor` : '';

    const whsCode = item?.WhsCode ?? item?.whsCode ?? '';
    const whsName =
      item?.WhsName ??
      item?.whsName ??
      branchCodeToNameMap.get(String(whsCode)) ??
      '';

    return {
      id:
        item?.id ??
        item?.itemCode ??
        item?.ItemCode ??
        `${item?.name ?? item?.ItemName ?? 'contract-item'}-${index}`,
      name: item?.ItemName ?? item?.name ?? "Noma'lum qurilma",
      storage:
        item?.U_Memory ?? item?.storage ?? item?.memory ?? item?.Storage ?? '',
      color: item?.U_Color ?? item?.color ?? item?.Color ?? '',
      price: priceText,
      imei: item?.IMEI ?? item?.imei ?? '',
      onHand: onHandText,
      whsCode: whsCode,
      whsName: whsName,
      condition: condition,
      raw: item,
    };
  });
};

export const resolveItemCode = (item) => {
  if (!item) return '';
  return (
    item?.raw?.ItemCode ??
    item?.raw?.itemCode ??
    item?.ItemCode ??
    item?.itemCode ??
    item?.id ??
    ''
  );
};

export const DEFAULT_CONTRACT_CONDITION = 'Yangi';
export const DEFAULT_RENT_PERIOD = 1;

export const CONTRACT_CONDITION_OPTIONS = [
  { value: '', label: 'Barchasi' },
  { value: 'Yangi', label: 'Yangi' },
  { value: 'B/U', label: 'B/U' },
];

export const PAYMENT_INTEREST_OPTIONS = [
  { value: '', label: 'Tanlash' },
  { value: 'Cash', label: 'Naqd pul' },
  { value: 'Card', label: 'Karta' },
];
export const CALCULATION_TYPE_OPTIONS = [
  { value: '', label: 'Tanlash' },
  { value: 'markup', label: 'Limit' },
  { value: 'internalLimit', label: 'Ichki limit' },
  { value: 'firstPayment', label: 'Foiz' },
];
// Ustama foizlari periodga qarab
const MARKUP_PERCENTAGES = {
  1: 0.05, // 5%
  2: 0.09, // 9%
  3: 0.14, // 14%
  4: 0.18, // 18%
  5: 0.22, // 22%
  6: 0.26, // 26%
  7: 0.31, // 31%
  8: 0.35, // 35%
  9: 0.39, // 39%
  10: 0.44, // 44%
  11: 0.48, // 48%
  12: 0.52, // 52%
  13: 0.56, // 56%
  14: 0.61, // 61%
  15: 0.65, // 65%
};

export const getMarkupPercentage = (period) => {
  const periodNum = Number(period);
  if (!periodNum || periodNum < 1) return 0.05;
  if (periodNum > 15) return 0.65;
  return MARKUP_PERCENTAGES[periodNum] || 0.05;
};

// Excel formulalariga moslashtirilgan hisob-kitoblar
export const calculatePaymentDetails = ({
  price,
  period,
  monthlyLimit,
  firstPayment = 0,
  isFirstPaymentManual = false,
  calculationType = 'markup', // 'markup' (Limit) yoki 'firstPayment' (Foiz)
  finalPercentage = null, // Inspection Officer tabidagi final percentage
  maximumLimit = null, // Maximum limit (finalLimit)
}) => {
  // Null va undefined holatlarini tekshirish
  if (price === null || price === undefined) {
    return {
      markup: 0,
      calculatedFirstPayment: 0,
      monthlyPayment: 0,
      totalPayment: 0,
      grandTotal: 0,
    };
  }

  const priceNum = Number(price);
  const periodNum = Number(period) || 1;
  const monthlyLimitNum =
    monthlyLimit !== null && monthlyLimit !== undefined
      ? Number(monthlyLimit) || 0
      : 0;
  const firstPaymentNum =
    firstPayment !== null && firstPayment !== undefined
      ? Number(firstPayment) || 0
      : 0;
  const finalPercentageNum =
    finalPercentage !== null && finalPercentage !== undefined
      ? Number(finalPercentage) || null
      : null;
  const maximumLimitNum =
    maximumLimit !== null && maximumLimit !== undefined
      ? Number(maximumLimit) || null
      : null;

  // Price yoki period noto'g'ri bo'lsa
  if (
    !Number.isFinite(priceNum) ||
    priceNum <= 0 ||
    !Number.isFinite(periodNum) ||
    periodNum <= 0
  ) {
    return {
      markup: 0,
      calculatedFirstPayment: 0,
      monthlyPayment: 0,
      totalPayment: 0,
      grandTotal: 0,
    };
  }

  // Calculation type bo'yicha logika
  // 1. Agar "limit" (markup) yoki "internalLimit" tanlangan va maximum limit mavjud bo'lmasa
  if (
    (calculationType === 'markup' || calculationType === 'internalLimit') &&
    (maximumLimitNum === null ||
      maximumLimitNum === undefined ||
      maximumLimitNum === 0)
  ) {
    // Bu holatda jami to'lov narx bilan bir xil bo'lishi kerak, lekin 1000 ga yaxlitlangan
    const roundedPrice = Math.floor(priceNum / 1000) * 1000;
    return {
      markup: 0,
      calculatedFirstPayment: 0,
      monthlyPayment: 0,
      totalPayment: roundedPrice,
      grandTotal: roundedPrice,
    };
  }

  // 2. Agar "percent" (firstPayment) tanlangan va final percentage mavjud bo'lmasa
  if (
    calculationType === 'firstPayment' &&
    (finalPercentageNum === null || finalPercentageNum === undefined)
  ) {
    return {
      markup: 0,
      calculatedFirstPayment: 0,
      monthlyPayment: 0,
      totalPayment: 0,
      grandTotal: 0,
    };
  }

  // 3. Agar "percent" (firstPayment) tanlangan va final percentage mavjud bo'lsa
  if (
    calculationType === 'firstPayment' &&
    finalPercentageNum !== null &&
    finalPercentageNum !== undefined
  ) {
    // Agar foydalanuvchi birinchi to'lovni qo'lda kiritgan bo'lsa, uni ishlatamiz
    // Aks holda, finalPercentage dan hisoblaymiz
    let actualFirstPayment;
    if (isFirstPaymentManual && firstPaymentNum > 0) {
      // Foydalanuvchi qo'lda kiritgan birinchi to'lovni 1000 ga yaxlitlaymiz
      actualFirstPayment = Math.floor(firstPaymentNum / 1000) * 1000;
    } else {
      // First payment = price * finalPercentage / 100, 1000 ga yaxlitlangan
      actualFirstPayment =
        Math.floor((priceNum * finalPercentageNum) / 100 / 1000) * 1000;
    }

    // Monthly payment = price - firstPayment
    const remainingPrice = priceNum - actualFirstPayment;

    // Ustama foizini olish
    const markup = getMarkupPercentage(periodNum);

    // Foydalanuvchi taklifi: avval yaxlitlanmagan qiymatlarni olish, jami to'lovni hisoblash, keyin yaxlitlash
    // Oylik to'lov (yaxlitlanmagan): ((remainingPrice) * (1 + markup)) / period
    const monthlyPaymentBeforeRound =
      (remainingPrice * (1 + markup)) / periodNum;

    // Jami to'lov (yaxlitlanmagan): monthlyPaymentBeforeRound * period
    const totalPaymentBeforeRound = monthlyPaymentBeforeRound * periodNum;

    // Jami to'lov (yaxlitlanmagan): totalPaymentBeforeRound + actualFirstPayment
    const grandTotalBeforeRound = totalPaymentBeforeRound + actualFirstPayment;

    // Jami to'lovni 1000 ga yaxlitlash (ROUND)
    const grandTotal = Math.round(grandTotalBeforeRound / 1000) * 1000;

    // Jami to'lov (ustama bilan): grandTotal - actualFirstPayment
    const totalPayment = grandTotal - actualFirstPayment;

    // Oylik to'lov: totalPayment / period, 1000 ga yaxlitlangan
    const monthlyPayment = Math.round(totalPayment / periodNum / 1000) * 1000;

    return {
      markup,
      calculatedFirstPayment: actualFirstPayment,
      monthlyPayment,
      totalPayment,
      grandTotal,
    };
  }

  // 4. Agar "limit" (markup) yoki "internalLimit" tanlangan va maximum limit mavjud bo'lsa
  // Ustama foizini olish
  const markup = getMarkupPercentage(periodNum);

  // Boshlang'ich to'lovni hisoblash: FLOOR(MAX(0; price - (monthlyLimit * period)/(1 + markup)); 1000)
  const calculatedFirstPayment =
    monthlyLimitNum > 0
      ? Math.floor(
          Math.max(0, priceNum - (monthlyLimitNum * periodNum) / (1 + markup)) /
            1000
        ) * 1000
      : 0;

  // Agar foydalanuvchi firstPayment kiritgan bo'lsa, uni ishlatamiz va 1000 ga yaxlitlaymiz
  // MUHIM: isFirstPaymentManual flag'ini tekshirish kerak!
  let actualFirstPayment;
  if (isFirstPaymentManual && firstPaymentNum > 0) {
    // Foydalanuvchi qo'lda kiritgan birinchi to'lovni 1000 ga yaxlitlaymiz
    actualFirstPayment = Math.floor(firstPaymentNum / 1000) * 1000;
    // console.log('>>> USING MANUAL firstPayment:', {
    //   isFirstPaymentManual,
    //   firstPaymentNum,
    //   actualFirstPayment,
    // });
  } else {
    // Avtomatik hisoblangan qiymatni ishlatamiz
    actualFirstPayment = calculatedFirstPayment;
    // console.log('>>> USING AUTO-CALCULATED firstPayment:', {
    //   isFirstPaymentManual,
    //   firstPaymentNum,
    //   calculatedFirstPayment,
    //   actualFirstPayment,
    // });
  }

  // Foydalanuvchi taklifi: avval yaxlitlanmagan qiymatlarni olish, jami to'lovni hisoblash, keyin yaxlitlash
  // Oylik to'lov (yaxlitlanmagan): MIN(monthlyLimit; ((price - firstPayment)*(1 + markup))/period)
  // Agar foydalanuvchi birinchi to'lovni o'zi kiritgan bo'lsa, monthlyLimit cheklovi qo'llanmaydi
  const monthlyPaymentWithoutLimit =
    ((priceNum - actualFirstPayment) * (1 + markup)) / periodNum;
  const monthlyPaymentRaw =
    isFirstPaymentManual || monthlyLimitNum === 0
      ? monthlyPaymentWithoutLimit
      : Math.min(monthlyLimitNum, monthlyPaymentWithoutLimit);

  // Jami to'lov (yaxlitlanmagan): monthlyPaymentRaw * period
  const totalPaymentBeforeRound = monthlyPaymentRaw * periodNum;

  // Jami to'lov (yaxlitlanmagan): totalPaymentBeforeRound + actualFirstPayment
  const grandTotalBeforeRound = totalPaymentBeforeRound + actualFirstPayment;

  // Jami to'lovni 1000 ga yaxlitlash (ROUND)
  const grandTotal = Math.round(grandTotalBeforeRound / 1000) * 1000;

  // Jami to'lov (ustama bilan): grandTotal - actualFirstPayment
  const totalPayment = grandTotal - actualFirstPayment;

  // Oylik to'lov: totalPayment / period, 1000 ga yaxlitlangan
  const monthlyPayment = Math.round(totalPayment / periodNum / 1000) * 1000;

  return {
    markup,
    calculatedFirstPayment: actualFirstPayment, // Return the actual value used (manual or auto)
    monthlyPayment,
    totalPayment,
    grandTotal,
  };
};
