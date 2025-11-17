export const extractNumericValue = (priceText) => {
  if (!priceText) return null;
  const digits = priceText.toString().replace(/[^\d]/g, '');
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isNaN(parsed) ? null : parsed;
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

