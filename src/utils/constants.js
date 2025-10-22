export const CURRENCY_MAP = {
  USD: "$",
  UZS: "UZS",
};

export const PAYMENT_ACCOUNTS = {
  cash: [
    { key: "qoratosh", value: "5040" },
    { key: "sag'bon", value: "5010" },
  ],
  visa: "5210",
  card: "5020",
  terminal: "5710",
};

export const URL_PATH_LANG_MAP = {
  dashboard: "Asosiy",
  clients: "Mijozlar",
  calendar: "Kalendar",
  statistics: "Statistika",
  leads: "Leadlar",
};

export const CLIENT_PAYMENT_ERROR_MESSAGES = {
  required: "Bu maydonni to'ldirish shart",
  sumNull: "Summa 0 dan katta bo'lishi kerak",
  sumNegative: "Summa manfiy bo'lmasligi kerak",
  sumNotGreaterThanInsTotal: "Summa oylik to'lovdan katta bo'lmasligi kerak!",
};
