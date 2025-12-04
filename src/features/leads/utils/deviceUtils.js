export const extractNumericValue = (priceText) => {
  if (!priceText && priceText !== 0) return null;
  if (typeof priceText === 'number') {
    return Number.isNaN(priceText) || !Number.isFinite(priceText) ? null : priceText;
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

/**
 * Qurilma uchun bazaviy USD narxini hisoblash
 * - U_PROD_CONDITION = "B/U" bo'lsa: PurchasePrice dan foydalanib, foiz qo'shamiz
 * - Aks holda (Yangi yoki null): SalePrice dan foydalanamiz
 *
 * Foiz qo'shish qoidalari (faqat B/U uchun):
 *  - < 500      => +15%
 *  - 500-1000   => +10%
 *  - 1000-2000  => +5%
 *  - > 2000     => +3%
 */
export const getItemBasePriceUSD = (item) => {
  if (!item) return null;

  const condition = item?.U_PROD_CONDITION ?? item?.u_prod_condition ?? null;

  const parsePrice = (value) => {
    if (value === null || value === undefined) return null;
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
    return Number.isFinite(num) && num > 0 ? num : null;
  };

  const salePriceUSD = parsePrice(item?.SalePrice ?? item?.salePrice);
  const purchasePriceUSD = parsePrice(item?.PurchasePrice ?? item?.purchasePrice);

  // faqat B/U uchun: Faqat PurchasePrice dan foydalanamiz, SalePrice NI UMUMAN ishlatmaymiz
  if (condition === 'B/U') {
    const base = purchasePriceUSD;
    if (!base) {
      // PurchasePrice yo'q bo'lsa, narxni hisoblamaymiz
      return null;
    }

    let multiplier = 1;

    if (base < 500) {
      multiplier = 1.15; // +15%
    } else if (base >= 500 && base < 1000) {
      multiplier = 1.1; // +10%
    } else if (base >= 1000 && base < 2000) {
      multiplier = 1.05; // +5%
    } else if (base >= 2000) {
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

export const normalizeContractItems = (items = [], branchCodeToNameMap, currencyRate) => {
  return items.map((item, index) => {
    // Avvalo USD dagi bazaviy narxni aniqlaymiz (U_PROD_CONDITION va Purchase/SalePrice bo'yicha)
    const basePriceUSD = getItemBasePriceUSD(item);

    let priceText = '';

    // Agar kurs bo'lsa, USD -> UZS ga o'tkazib, formatlaymiz
    const rateNum =
      currencyRate !== null && currencyRate !== undefined
        ? Number(currencyRate)
        : null;

    if (basePriceUSD && rateNum && Number.isFinite(rateNum) && rateNum > 0) {
      const priceUZS = basePriceUSD * rateNum;
      priceText = formatCurrencyUZS(priceUZS);
    } else {
      // Fallback: eski PhonePrice maydonlari bo'yicha
      const priceValue = item?.PhonePrice ?? item?.phonePrice ?? null;
      priceText =
        priceValue !== null && priceValue !== undefined && (priceValue || priceValue === 0)
          ? formatCurrencyUZS(priceValue)
          : '';
    }

    const onHand = item?.OnHand ?? item?.onHand ?? 0;
    const onHandText = onHand > 0 ? `${onHand} ta bor` : '';

    const whsCode = item?.WhsCode ?? item?.whsCode ?? '';
    const whsName = item?.WhsName ?? item?.whsName ?? branchCodeToNameMap.get(String(whsCode)) ?? '';

    // Condition ma'lumotini U_PROD_CONDITION maydonidan olamiz
    const condition = item?.U_PROD_CONDITION ?? item?.u_prod_condition ?? '';

    return {
      id:
        item?.id ??
        item?.itemCode ??
        item?.ItemCode ??
        `${item?.name ?? item?.ItemName ?? 'contract-item'}-${index}`,
      name: item?.ItemName ?? item?.name ?? "Noma'lum qurilma",
      storage: item?.U_Memory ?? item?.storage ?? item?.memory ?? item?.Storage ?? '',
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
  { value: '', label: 'Barchasi' },
  { value: 'Cash', label: 'Naqd pul' },
  { value: 'Card', label: 'Karta' },
];
// Ustama foizlari periodga qarab
const MARKUP_PERCENTAGES = {
  1: 0.05,   // 5%
  2: 0.10,   // 10%
  3: 0.17,   // 17%
  4: 0.25,   // 25%
  5: 0.35,   // 35%
  6: 0.38,   // 38%
  7: 0.43,   // 43%
  8: 0.47,   // 47%
  9: 0.50,   // 50%
  10: 0.55,  // 55%
  11: 0.58,  // 58%
  12: 0.63,  // 63%
  13: 0.65,  // 65%
  14: 0.68,  // 68%
  15: 0.70,  // 70%
};

export const getMarkupPercentage = (period) => {
  const periodNum = Number(period);
  if (!periodNum || periodNum < 1) return 0.05;
  if (periodNum > 15) return 0.70;
  return MARKUP_PERCENTAGES[periodNum] || 0.05;
};

// Excel formulalariga moslashtirilgan hisob-kitoblar
export const calculatePaymentDetails = ({
  price,
  period,
  monthlyLimit,
  firstPayment = 0,
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
  const monthlyLimitNum = monthlyLimit !== null && monthlyLimit !== undefined 
    ? Number(monthlyLimit) || 0 
    : 0;
  const firstPaymentNum = firstPayment !== null && firstPayment !== undefined
    ? Number(firstPayment) || 0
    : 0;

  // Price yoki period noto'g'ri bo'lsa
  if (!Number.isFinite(priceNum) || priceNum <= 0 || !Number.isFinite(periodNum) || periodNum <= 0) {
    return {
      markup: 0,
      calculatedFirstPayment: 0,
      monthlyPayment: 0,
      totalPayment: 0,
      grandTotal: 0,
    };
  }

  // Ustama foizini olish
  const markup = getMarkupPercentage(periodNum);

  // Boshlang'ich to'lovni hisoblash: FLOOR(MAX(0; price - (monthlyLimit * period)/(1 + markup)); 1000)
  const calculatedFirstPayment = monthlyLimitNum > 0
    ? Math.floor(Math.max(0, priceNum - (monthlyLimitNum * periodNum) / (1 + markup)) / 1000) * 1000
    : 0;

  // Agar foydalanuvchi firstPayment kiritgan bo'lsa, uni ishlatamiz
  const actualFirstPayment = firstPaymentNum > 0 ? firstPaymentNum : calculatedFirstPayment;

  // Oylik to'lov: MIN(monthlyLimit; ((price - firstPayment)*(1 + markup))/period)
  const monthlyPaymentWithoutLimit = ((priceNum - actualFirstPayment) * (1 + markup)) / periodNum;
  const monthlyPayment = monthlyLimitNum > 0
    ? Math.min(monthlyLimitNum, monthlyPaymentWithoutLimit)
    : monthlyPaymentWithoutLimit;

  // Jami to'lov (ustama bilan): FLOOR((price - firstPayment)*(1 + markup); 1000)
  const totalPayment = Math.floor((priceNum - actualFirstPayment) * (1 + markup) / 1000) * 1000;

  // Jami to'lov (boshlang'ich + jami): totalPayment + firstPayment
  const grandTotal = totalPayment + actualFirstPayment;

  return {
    markup,
    calculatedFirstPayment,
    monthlyPayment,
    totalPayment,
    grandTotal,
  };
};

