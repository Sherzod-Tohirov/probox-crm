export default function formatterCurrency(
  number = 0,
  currency = "UZS",
  locale = "ru",
  maximumSignificantDigits = 10
) {
  if(typeof number === "string") {
    number = parseFloat(number);
  }
  return number.toLocaleString(locale, {
    style: "currency",
    currency: currency,
    maximumSignificantDigits: maximumSignificantDigits,
  });
}
