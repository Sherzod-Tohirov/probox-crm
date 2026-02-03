export const AVAILABLE_LEAD_SOURCES = [
  'Manychat',
  'Meta',
  'Organika',
  'Kiruvchi qongiroq',
  'Community',
  'Kiruvchi',
  'Chiquvchi',
  'Qayta sotuv',
];

export const AVAILABLE_LEAD_STATUSES = [
  'Active',
  'Archived',
  'Processing',
  'Closed',
  'Purchased',
  'Returned',
  'Missed',
];

export const ALLOWED_ROLES_FOR_SEEING_RETURNED_LEADS = [
  'Operator1',
  'Operator2',
  'OperatorM',
];

export const REJECTION_REASON_OPTIONS = [
  { value: '', label: '' },
  { value: 'not_interested', label: 'Qiziqish bildirilmadi' },
  { value: 'not_able_to_pay', label: "To'lov imkoniyati yo'q" },
  { value: 'not_able_to_visit', label: "Qo'ng'iroq qilish imkoniyati yo'q" },
  { value: 'not_able_to_visit', label: "Qo'ng'iroq qilish imkoniyati yo'q" },
  { value: 'other', label: 'Boshqa' },
];

export const PULT = {
  minBaseSalary: 2_000_000,
  maxMibDebt: 1_000_000,
  katmHistoryPatterns: [
    '0 Kun',
    '30 kun AQ',
    'Keyinga oy AQ',
    '31-60 kun AQ',
    '61-90 kun AQ',
    '91 kun AQ',
    'SUD',
    'SUD jarayoni AQ',
    '30 kun FOIZ',
    'Keyinga oy FOIZ',
    '31-60 kun FOIZ',
    '61-90 kun FOIZ',
    '91 kun AQ FOIZ',
    'SUD jarayoni FOIZ',
  ],
  // One-to-one with katmHistoryPatterns
  katmHistoryValues: [
    '0.00%', // 0 Kun
    '10.00%', // 30 kun AQ
    '20.00%', // Keyinga oy AQ
    '30.00%', // 31-60 kun AQ
    '40.00%', // 61-90 kun AQ
    '50.00%', // 91 kun AQ
    '100.00%', // SUD
    '100.00%', // SUD jarayoni AQ
    '20.00%', // 30 kun FOIZ
    '40.00%', // Keyinga oy FOIZ
    '60.00%', // 31-60 kun FOIZ
    '80.00%', // 61-90 kun FOIZ
    '100.00%', // 91 kun AQ FOIZ
    '100.00%', // SUD jarayoni FOIZ
  ],
  katmScoreKeys: [
    'A3',
    'A2',
    'A1',
    'B3',
    'B2',
    'B1',
    'C3',
    'C2',
    'C1',
    'D3',
    'D2',
    'D1',
    'E3',
    'E2',
    'E1',
  ],
  // One-to-one with katmScoreKeys
  katmScorePercents: [
    '0.00%', // A3
    '0.00%', // A2
    '0.00%', // A1
    '0.00%', // B3
    '0.00%', // B2
    '10.00%', // B1
    '30.00%', // C3
    '40.00%', // C2
    '50.00%', // C1
    '60.00%', // D3
    '70.00%', // D2
    '100.00%', // D1
    '100.00%', // E3
    '100.00%', // E2
    '100.00%', // E1
  ],
  maxKatmPayment: 0,
  minLeadAge: 20,
  maxAlimentDebt: 0,
  creditPressure: 0,
  maxMibIrresponsible: 0,
};
