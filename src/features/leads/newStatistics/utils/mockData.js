import moment from 'moment';

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

// Generate daily data for current month
const daysInMonth = moment().daysInMonth();
const generateDailyData = () =>
  Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 120 + 10));

export const sourceMockData = [
  { source: 'Community', leads: 2300, cr: '12%' },
  { source: 'Direct', leads: 1200, cr: '15%' },
  { source: 'Social Media', leads: 1500, cr: '8%' },
  { source: 'Referral', leads: 800, cr: '5%' },
  { source: 'Other', leads: 500, cr: '3%' },
  ...Array(5)
    .fill()
    .map((_, index) => ({
      source: `Source ${index + 1}`,
      leads: Math.floor(Math.random() * 1000),
      cr: `${Math.floor(Math.random() * 10)}%`,
    })),
];

// Source trend chart data
export const mockSourceTrendData = {
  dates: Array.from({ length: daysInMonth }, (_, i) =>
    moment().startOf('month').add(i, 'day').format('DD.MM')
  ),
  series: [
    { name: 'Community', data: generateDailyData(), color: '#3b82f6' },
    { name: 'Direct', data: generateDailyData(), color: '#10b981' },
    { name: 'Social Media', data: generateDailyData(), color: '#f59e0b' },
    { name: 'Referral', data: generateDailyData(), color: '#ef4444' },
    { name: 'Other', data: generateDailyData(), color: '#8b5cf6' },
  ],
};

// Leads by date bar chart data
export const mockLeadsByDateData = {
  dates: Array.from({ length: daysInMonth }, (_, i) =>
    moment().startOf('month').add(i, 'day').format('DD.MM')
  ),
  tabs: [
    { key: 'new', label: 'Yangilar' },
    { key: 'callback', label: 'Qayta aloqa' },
    { key: 'interested', label: 'Qiziqish' },
    { key: 'visited', label: 'Tashrif' },
    { key: 'contract', label: 'Shartnoma' },
  ],
  series: {
    new: [
      { name: 'Yangilar', data: generateDailyData(), color: '#3b82f6' },
      { name: 'Qayta aloqa', data: generateDailyData(), color: '#10b981' },
    ],
    callback: [
      { name: 'Qayta aloqa', data: generateDailyData(), color: '#10b981' },
    ],
    interested: [
      { name: 'Qiziqish', data: generateDailyData(), color: '#f59e0b' },
    ],
    visited: [
      { name: 'Tashrif', data: generateDailyData(), color: '#8b5cf6' },
    ],
    contract: [
      { name: 'Shartnoma', data: generateDailyData(), color: '#ef4444' },
    ],
  },
};

// Branch data
export const mockBranchData = [
  { branch: 'Chilonzor', leads: 1450, cr: '18%', sold: 261, revenue: '2.3 mlrd' },
  { branch: 'Yunusobod', leads: 1280, cr: '15%', sold: 192, revenue: '1.8 mlrd' },
  { branch: 'Sergeli', leads: 980, cr: '12%', sold: 117, revenue: '1.2 mlrd' },
  { branch: 'Mirzo Ulugbek', leads: 870, cr: '14%', sold: 121, revenue: '1.1 mlrd' },
  { branch: 'Yakkasaroy', leads: 750, cr: '11%', sold: 82, revenue: '0.9 mlrd' },
  { branch: 'Mirabad', leads: 620, cr: '9%', sold: 55, revenue: '0.7 mlrd' },
  { branch: 'Olmazor', leads: 540, cr: '10%', sold: 54, revenue: '0.6 mlrd' },
  { branch: 'Shayxontohur', leads: 480, cr: '8%', sold: 38, revenue: '0.5 mlrd' },
];

// Branch detailed data
export const mockBranchDetailedData = mockBranchData.map((b) => ({
  ...b,
  newLeads: Math.floor(b.leads * 0.3),
  called: Math.floor(b.leads * 0.85),
  answered: Math.floor(b.leads * 0.6),
  interested: Math.floor(b.leads * 0.4),
  passport: Math.floor(b.leads * 0.2),
  visited: Math.floor(b.leads * 0.35),
  contract: Math.floor(b.leads * 0.12),
}));

// Source detailed data
export const mockSourceDetailedData = sourceMockData.map((s) => ({
  ...s,
  newLeads: Math.floor(s.leads * 0.3),
  called: Math.floor(s.leads * 0.85),
  answered: Math.floor(s.leads * 0.6),
  interested: Math.floor(s.leads * 0.4),
  passport: Math.floor(s.leads * 0.2),
  visited: Math.floor(s.leads * 0.35),
  contract: Math.floor(s.leads * 0.12),
}));

// Distribution pie chart data
export const mockDistributionData = {
  bySource: [
    { name: 'Community', value: 2300, color: '#3b82f6' },
    { name: 'Direct', value: 1200, color: '#10b981' },
    { name: 'Social Media', value: 1500, color: '#f59e0b' },
    { name: 'Referral', value: 800, color: '#ef4444' },
    { name: 'Other', value: 500, color: '#8b5cf6' },
  ],
  byStatus: [
    { name: 'Yangi lead', value: 8941, color: '#3b82f6' },
    { name: "Qo'ng'iroq qilindi", value: 8205, color: '#10b981' },
    { name: 'Javob berdi', value: 5035, color: '#f59e0b' },
    { name: 'Shartnoma', value: 1200, color: '#ef4444' },
  ],
};

// Call center operators data
export const mockCallCenterData = [
  { operator: 'Aziza Karimova', leads: 420, called: 380, answered: 310, cr: '18%', avgTime: '2:30' },
  { operator: 'Bobur Aliyev', leads: 385, called: 360, answered: 290, cr: '15%', avgTime: '3:10' },
  { operator: 'Dilnoza Rahimova', leads: 350, called: 330, answered: 270, cr: '14%', avgTime: '2:45' },
  { operator: 'Eldor Toshmatov', leads: 310, called: 290, answered: 240, cr: '12%', avgTime: '3:25' },
  { operator: 'Farangiz Umarova', leads: 280, called: 260, answered: 210, cr: '11%', avgTime: '2:55' },
  { operator: 'Gulnora Saidova', leads: 250, called: 230, answered: 190, cr: '10%', avgTime: '3:40' },
];

// Staff performance chart data
export const mockStaffChartData = {
  operators: mockCallCenterData.map((o) => o.operator.split(' ')[0]),
  series: [
    {
      name: 'Leadlar',
      data: mockCallCenterData.map((o) => o.leads),
      color: '#3b82f6',
    },
    {
      name: "Qo'ng'iroqlar",
      data: mockCallCenterData.map((o) => o.called),
      color: '#10b981',
    },
    {
      name: 'Javoblar',
      data: mockCallCenterData.map((o) => o.answered),
      color: '#f59e0b',
    },
  ],
};

// Leads by time area chart data
export const mockLeadsByTimeData = {
  hours: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
  series: [
    {
      name: 'Dushanba',
      data: [2, 3, 1, 0, 0, 1, 8, 25, 45, 62, 58, 50, 35, 48, 55, 52, 40, 30, 20, 15, 10, 8, 5, 3],
      color: '#3b82f6',
    },
    {
      name: 'Seshanba',
      data: [1, 2, 1, 0, 1, 2, 10, 28, 42, 58, 55, 48, 38, 50, 58, 48, 38, 28, 18, 12, 8, 6, 4, 2],
      color: '#10b981',
    },
    {
      name: 'Chorshanba',
      data: [3, 2, 0, 1, 0, 3, 12, 30, 48, 65, 60, 52, 40, 52, 60, 55, 42, 32, 22, 14, 9, 7, 3, 2],
      color: '#f59e0b',
    },
  ],
};

// Branch trend chart data
export const mockBranchTrendData = {
  dates: Array.from({ length: daysInMonth }, (_, i) =>
    moment().startOf('month').add(i, 'day').format('DD.MM')
  ),
  series: mockBranchData.slice(0, 4).map((b, idx) => ({
    name: b.branch,
    data: generateDailyData(),
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][idx],
  })),
};
