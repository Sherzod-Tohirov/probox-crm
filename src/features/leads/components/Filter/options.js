import { AVAILABLE_LEAD_SOURCES } from '@features/leads/utils/constants';

export const sourceOptions = [
  ...AVAILABLE_LEAD_SOURCES.map((source) => ({ value: source, label: source })),
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
