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

export const normalizeContractItems = (items = [], branchCodeToNameMap) => {
  return items.map((item, index) => {
    const priceValue = item?.PhonePrice ?? item?.phonePrice ?? null;
    const priceText =
      priceValue !== null && priceValue !== undefined && (priceValue || priceValue === 0)
        ? formatCurrencyUZS(priceValue)
        : '';

    const onHand = item?.OnHand ?? item?.onHand ?? 0;
    const onHandText = onHand > 0 ? `${onHand}ta bor` : '';

    const whsCode = item?.WhsCode ?? item?.whsCode ?? '';
    const whsName = item?.WhsName ?? item?.whsName ?? branchCodeToNameMap.get(String(whsCode)) ?? '';

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

