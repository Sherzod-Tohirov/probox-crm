import moment from 'moment';
import { PhoneIncoming, PhoneOutgoing, ArrowRightLeft } from 'lucide-react';
import {
  FIELD_LABELS,
  STATUS_LABELS,
  DATE_FIELDS,
  DATETIME_FIELDS,
  CURRENCY_FIELDS,
} from './constants';

export const translateFieldLabel = (field) => {
  const key = String(field || '').trim();
  if (!key) return 'Maydon';
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  const lowerKey = key.toLowerCase();
  if (FIELD_LABELS[lowerKey]) return FIELD_LABELS[lowerKey];

  const normalized = key
    .replace(/\./g, ' ')
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
  if (!normalized) return 'Maydon';
  return normalized[0].toUpperCase() + normalized.slice(1);
};

export const parseMomentFromUnknown = (rawValue) => {
  if (rawValue == null || rawValue === '') return null;
  if (moment.isMoment(rawValue) && rawValue.isValid()) return rawValue.clone();

  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
    const abs = Math.abs(rawValue);
    if (abs >= 1e12)
      return moment(rawValue).isValid() ? moment(rawValue) : null;
    if (abs >= 1e9)
      return moment.unix(rawValue).isValid() ? moment.unix(rawValue) : null;
    return null;
  }

  const value = String(rawValue).trim();
  if (!value) return null;
  if (/^\d{13}$/.test(value))
    return moment(+value).isValid() ? moment(+value) : null;
  if (/^\d{10}$/.test(value))
    return moment.unix(+value).isValid() ? moment.unix(+value) : null;
  return moment(value).isValid() ? moment(value) : null;
};

export const formatUnknownDateTime = (rawValue) => {
  const parsed = parseMomentFromUnknown(rawValue);
  if (!parsed) return null;

  const asString = String(rawValue ?? '');
  const hasTime =
    typeof rawValue === 'number' ||
    /^\d{10,13}$/.test(asString) ||
    asString.includes('T') ||
    /\d{2}:\d{2}/.test(asString);

  return hasTime
    ? parsed.local().format('HH:mm')
    : parsed.local().format('DD.MM.YYYY');
};

export const formatHistoryDateTime = (rawDate) => {
  return formatUnknownDateTime(rawDate) || '—';
};

export const formatCurrency = (value) => {
  const num = Number(String(value).replace(/[^\d.-]/g, ''));
  if (isNaN(num)) return String(value);
  return Math.round(num).toLocaleString('en-US');
};

export const formatChangeValue = (field, value) => {
  if (value == null || value === '') return '—';
  const strVal = String(value).toLowerCase();
  if (value === true || strVal === 'true') return 'Ha';
  if (value === false || strVal === 'false') return "Yo'q";

  const fieldKey = String(field || '').trim();

  // Status
  if (fieldKey === 'status') {
    return STATUS_LABELS[String(value)] || String(value);
  }

  // Sana (DD.MM.YYYY)
  if (DATE_FIELDS.has(fieldKey)) {
    const parsed = parseMomentFromUnknown(value);
    if (parsed) return parsed.local().format('DD.MM.YYYY');
  }

  // Sana + vaqt (DD.MM.YYYY HH:mm)
  if (DATETIME_FIELDS.has(fieldKey)) {
    const parsed = parseMomentFromUnknown(value);
    if (parsed) return parsed.local().format('DD.MM.YYYY HH:mm');
  }

  // Pul (1,000,000)
  if (CURRENCY_FIELDS.has(fieldKey)) {
    return formatCurrency(value);
  }

  // Yo'nalish
  const lowerKey = fieldKey.toLowerCase();
  if (lowerKey === 'accountcode' || lowerKey === 'direction') {
    const normalized = strVal;
    if (normalized === 'inbound') return 'Kiruvchi';
    if (normalized === 'outbound') return 'Chiquvchi';
  }

  return String(value);
};

export const getCallDirectionMeta = (msg = {}) => {
  const rawDirection = String(
    msg?.direction || msg?.pbx?.direction || msg?.pbx?.accountcode || ''
  ).toLowerCase();

  if (rawDirection === 'inbound') {
    return { icon: PhoneIncoming, label: "Kiruvchi qo'ng'iroq" };
  }
  if (rawDirection === 'outbound') {
    return { icon: PhoneOutgoing, label: "Chiquvchi qo'ng'iroq" };
  }
  return { icon: ArrowRightLeft, label: "Qo'ng'iroq yo'nalishi noma'lum" };
};

export const toRgba = (color, alpha = 1) => {
  if (!color) return '';
  const rgbaMatch = color.match(/^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbaMatch)
    return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${alpha})`;
  const hex = color.trim();
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    const [r, g, b] =
      hex.length === 4
        ? [hex[1] + hex[1], hex[2] + hex[2], hex[3] + hex[3]]
        : [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
    return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${alpha})`;
  }
  return color;
};
