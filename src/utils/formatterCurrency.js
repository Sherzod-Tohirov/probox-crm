export default function formatterCurrency(
  number = 0,
  currencyOrOptions,
  locale = "ru",
  maximumSignificantDigits = 10
) {
  if (typeof number === "string") {
    number = parseFloat(number);
  }

  if (isNaN(number) || number === null || number === undefined) {
    number = 0;
  }

  // Options object support: formatterCurrency(value, { currency?: 'UZS'|'USD'|null, locale?, maximumSignificantDigits?, minimumFractionDigits?, maximumFractionDigits?, useGrouping? })
  if (currencyOrOptions && typeof currencyOrOptions === "object") {
    const {
      currency,
      locale: optLocale = locale,
      maximumSignificantDigits: optMaxSig = maximumSignificantDigits,
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping,
    } = currencyOrOptions;

    if (currency) {
      return number.toLocaleString(optLocale, {
        style: "currency",
        currency,
        ...(optMaxSig ? { maximumSignificantDigits: optMaxSig } : {}),
        ...(minimumFractionDigits !== undefined
          ? { minimumFractionDigits }
          : {}),
        ...(maximumFractionDigits !== undefined
          ? { maximumFractionDigits }
          : {}),
        ...(useGrouping !== undefined ? { useGrouping } : {}),
      });
    }

    return number.toLocaleString(optLocale, {
      ...(optMaxSig ? { maximumSignificantDigits: optMaxSig } : {}),
      ...(minimumFractionDigits !== undefined
        ? { minimumFractionDigits }
        : {}),
      ...(maximumFractionDigits !== undefined
        ? { maximumFractionDigits }
        : {}),
      ...(useGrouping !== undefined ? { useGrouping } : {}),
    });
  }

  // Backward-compatible behavior with a currency code string
  if (typeof currencyOrOptions === "string" && currencyOrOptions) {
    return number.toLocaleString(locale, {
      style: "currency",
      currency: currencyOrOptions,
      maximumSignificantDigits,
    });
  }

  // One-argument form: plain number formatting (no currency symbol)
  return number.toLocaleString(locale, {
    maximumSignificantDigits,
  });
}
