import formatterCurrency from './formatterCurrency';

export function formatterPayment(value, currency = 'UZS', rate = 1) {
  return currency === 'USD'
    ? `${formatterCurrency(value * rate, 'UZS')} (${formatterCurrency(
        value,
        'USD'
      )})`
    : `${formatterCurrency(value, 'USD')} (${formatterCurrency(value, 'UZS')})`;
}
