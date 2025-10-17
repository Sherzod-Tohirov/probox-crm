import formatterCurrency from './formatterCurrency';

export function formatterPayment(value, currency = 'UZS', rate = 1) {
  const parsedValue = parseFloat(value);
  const parsedRate = parseFloat(rate);
  if (isNaN(parsedValue) || isNaN(parsedRate)) {
    return '';
  }

  if (currency === 'USD') {
    return `${formatterCurrency(parsedValue * parsedRate, 'UZS')} (${formatterCurrency(
      parsedValue,
      'USD'
    )})`;
  }
  return `${formatterCurrency(parsedValue, 'UZS')} (${formatterCurrency(
    parseFloat(parsedValue / parsedRate).toFixed(3),
    'USD'
  )})`;
}
