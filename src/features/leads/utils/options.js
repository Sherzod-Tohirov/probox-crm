import { AVAILABLE_LEAD_SOURCES } from '@features/leads/utils/constants';

export const sourceOptions = [
  ...AVAILABLE_LEAD_SOURCES.map((source) => ({
    value: source,
    label: source === 'Kiruvchi qongiroq' ? 'Eski qongiroq' : source,
  })),
];

export const booleanOptionsAll = [
  { value: '', label: 'Barchasi' },
  { value: 'yes', label: 'Ha' },
  { value: 'no', label: "Yo'q" },
  { value: 'unmarked', label: 'Belgilanmagan' },
];

export const meetingOptions = [
  { value: '', label: 'Hammasi' },
  { value: 'meetingDate', label: "Uchrashuv sanasi bo'yicha" },
  {
    value: 'meetingConfirmedDate',
    label: "Uchrashuv tasdiqlanish sanasi bo'yicha",
  },
  { value: 'time', label: "Lead qabul qilingan sana bo'yicha" },
];

export const statusOptions = [
  { value: 'Active', label: 'Yangi lead', isNotSelectable: true },
  { value: 'Blocked', label: 'Bloklangan', isNotSelectable: true },
  { value: 'Purchased', label: 'Xarid qildi', isNotSelectable: true },
  { value: 'Returned', label: 'Qaytarildi' },
  { value: 'Missed', label: "O'tkazib yuborildi", isNotSelectable: true },
  { value: 'Ignored', label: "E'tiborsiz", isNotSelectable: true },
  { value: 'NoAnswer', label: 'Javob bermadi', isNotSelectable: true },
  { value: 'FollowUp', label: "Qayta a'loqa" },
  { value: 'Considering', label: "O'ylab ko'radi" },
  { value: 'WillVisitStore', label: "Do'konga boradi" },
  { value: 'WillSendPassport', label: 'Passport yuboradi' },
  { value: 'Scoring', label: 'Skoring' },
  { value: 'ScoringResult', label: 'Skoring natija' },
  { value: 'VisitedStore', label: "Do'konga keldi" },
  { value: 'NoPurchase', label: "Xarid bo'lmadi", isNotSelectable: true },
  { value: 'Closed', label: 'Sifatsiz', isNotSelectable: true },
  // Legacy statuses
  { value: 'Archived', label: 'Arxivlangan', isNotSelectable: true },
  { value: 'Processing', label: 'Jarayonda', isNotSelectable: true },
];

export const passportVisitOptions = [
  { value: '', label: 'Hammasi' },
  { value: 'Passport', label: 'Passport' },
  { value: 'Visit', label: 'Tashrif' },
  { value: 'Processing', label: 'Jarayonda' },
];

export const statusFilterOptions = [
  { value: 'Active', label: 'Yang lead' },
  { value: 'Blocked', label: 'Bloklangan' },
  { value: 'Purchased', label: 'Xarid qildi' },
  { value: 'Returned', label: 'Qaytarildi' },
  { value: 'Missed', label: "O'tkazib yuborildi" },
  { value: 'Ignored', label: "E'tiborsiz" },
  { value: 'NoAnswer', label: 'Javob bermadi' },
  { value: 'FollowUp', label: "Qayta a'loqa" },
  { value: 'Considering', label: "O'ylab ko'radi" },
  { value: 'WillVisitStore', label: "Do'konga boradi" },
  { value: 'WillSendPassport', label: 'Passport yuboradi' },
  { value: 'Scoring', label: 'Skoring' },
  { value: 'ScoringResult', label: 'Skoring natija' },
  { value: 'VisitedStore', label: "Do'konga keldi" },
  { value: 'NoPurchase', label: "Xarid bo'lmadi" },
  { value: 'Closed', label: 'Sifatsiz' },
  // Legacy statuses
  { value: 'Archived', label: 'Arxivlangan' },
  { value: 'Processing', label: 'Jarayonda' },
];

export const callCountOptions = [
  {
    value: '',
    label: '-',
  },
  ...Array.from({ length: 11 }).map((_, i) => ({
    value: i,
    label: `${i}`,
  })),
];
