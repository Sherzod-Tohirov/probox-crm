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
  { value: 'Active', label: 'Yangi' },
  { value: 'Archived', label: 'Arxivlangan' },
  // { value: 'Closed', label: 'Yopilgan' },
  // { value: 'Blocked', label: 'Bloklangan' },
  { value: 'Processing', label: 'Jarayonda' },
  { value: 'Closed', label: 'Yopilgan' },
  { value: 'Returned', label: 'Qaytarilgan' },
];

export const passportVisitOptions = [
  { value: '', label: 'Hammasi' },
  { value: 'Passport', label: 'Passport' },
  { value: 'Visit', label: 'Tashrif' },
  { value: 'Processing', label: 'Jarayonda' },
];

export const statusFilterOptions = [
  { value: 'unmarked', label: 'Barchasi' },
  { value: 'Active', label: 'Yangi' },
  { value: 'Archived', label: 'Arxivlangan' },
  { value: 'Processing', label: 'Jarayonda' },
  { value: 'Closed', label: 'Yopilgan' },
  { value: 'Returned', label: 'Qaytarilgan' },
  { value: 'Missed', label: "O'tkazib yuborilgan" },
];

export const callCountOptions = [
  {
    value: '',
    label: '-',
  },
  ...Array.from({ length: 10 }).map((_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  })),
];
