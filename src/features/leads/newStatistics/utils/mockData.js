export const mockOverviewTableData = [
  { levels: 'Yangi lead', leads: 8941, cr: 100 },
  { levels: "Qo'ng'iroq qilindi", leads: 8205, cr: 92 },
  { levels: 'Javob berdi', leads: 5035, cr: 56 },
  { levels: 'Qiziqish bildirdi', leads: 3415, cr: 38 },
  { levels: 'Pasport qabul qilindi', leads: 1683, cr: 19 },
  { levels: 'Tashrif buyurgan', leads: 3683, cr: 41 },
  { levels: 'Shartnoma imzolandi', leads: 1200, cr: 13 },
];

// TODO: Replace with real data from API
export const mockOverviewGaugeData = {
  total: { value: 8941, total: 8941, label: 'Jami leadlar' },
  items: [
    {
      value: 8205,
      total: 8941,
      label: "Qo'ng'iroq qilindi",
      color: 'green',
    },
    { value: 5035, total: 8941, label: 'Javob berdi', color: 'orange' },
    { value: 3415, total: 8941, label: 'Qiziqish bildirdi', color: 'red' },
    { value: 1683, total: 8941, label: 'Pasport qabul qilindi', color: 'red' },
    { value: 1683, total: 8941, label: 'Pasport qabul qilindi', color: 'red' },
    { value: 1683, total: 8941, label: 'Pasport qabul qilindi', color: 'red' },
    { value: 3683, total: 8941, label: 'Tashrif buyurgan', color: 'orange' },
    { value: 7200, total: 8941, label: 'Tashrif qilindi', color: 'green' },
  ],
};

export const sourceMockData = [
  {
    source: 'Community',
    leads: 2300,
    cr: '12%',
    byDay: {
        
    }
  },
  {
    source: 'Direct',
    leads: 1200,
    cr: '15%',
  },
  {
    source: 'Social Media',
    leads: 1500,
    cr: '8%',
  },
  {
    source: 'Referral',
    leads: 800,
    cr: '5%',
  },
  {
    source: 'Other',
    leads: 500,
    cr: '3%',
  },
  ...Array(5)
    .fill()
    .map((_, index) => ({
      source: `Source ${index + 1}`,
      leads: Math.floor(Math.random() * 1000),
      cr: `${Math.floor(Math.random() * 10)}%`,
    })),
];
