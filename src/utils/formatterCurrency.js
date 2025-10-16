export default function formatterCurrency(
  number = 0,
  currency = "UZS",
  locale = "ru",
  maximumSignificantDigits = 10
) {
  // Convert string to number
  if(typeof number === "string") {
    number = parseFloat(number);
  }
  
  // Handle invalid numbers (NaN, null, undefined)
  if (isNaN(number) || number === null || number === undefined) {
    number = 0;
  }
  
  return number.toLocaleString(locale, {
    style: "currency",
    currency: currency,
    maximumSignificantDigits: maximumSignificantDigits,
  });
}
