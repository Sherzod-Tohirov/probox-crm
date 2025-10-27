import { AVAILABLE_LEAD_SOURCES } from '@features/leads/utils/constants';

export const sourceOptions = [
  { value: '', label: 'Barchasi' },
  ...AVAILABLE_LEAD_SOURCES.map((source) => ({ value: source, label: source })),
];

export const booleanOptionsAll = [
  { value: '', label: 'Barchasi' },
  { value: true, label: 'Ha' },
  { value: false, label: "Yo'q" },
];

export const meetingOptions = [
  { value: '', label: 'Hammasi' },
  { value: true, label: "Uchrashuv sanasi bo'yicha" },
  { value: false, label: "Uchrashuv tasdiqlangan sana bo'yicha" },
];
