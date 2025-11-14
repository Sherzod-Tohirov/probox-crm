import { computeAllowInput } from './flatpickrHourOnly';

export const buildDateOptions = ({ includeTime, defaultDate, datePickerOptions = {}, hourOnly }) => {
  const effectiveAllowInput = computeAllowInput(datePickerOptions.allowInput, hourOnly);
  return {
    enableTime: !!includeTime,
    defaultDate: defaultDate || new Date(),
    dateFormat: includeTime ? 'd.m.Y H:i' : 'd.m.Y',
    ...(includeTime ? { time_24hr: true } : {}),
    locale: { firstDayOfWeek: 1 },
    clickOpens: true,
    allowInput: effectiveAllowInput,
    disableMobile: true,
    static: false,
    ...(datePickerOptions || {}),
    ...(hourOnly ? { allowInput: false } : {}),
  };
};

export const buildTimeOptions = ({ defaultDate, datePickerOptions = {}, hourOnly }) => {
  const effectiveAllowInput = computeAllowInput(datePickerOptions.allowInput, hourOnly);
  return {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time_24hr: true,
    clickOpens: true,
    allowInput: effectiveAllowInput,
    disableMobile: true,
    static: false,
    ...(datePickerOptions || {}),
    ...(hourOnly ? { allowInput: false } : {}),
  };
};

export const buildDateTimeLocalOptions = ({ defaultDate, datePickerOptions = {}, hourOnly }) => {
  const effectiveAllowInput = computeAllowInput(datePickerOptions.allowInput, hourOnly);
  return {
    enableTime: true,
    dateFormat: 'd.m.Y H:i',
    time_24hr: true,
    clickOpens: true,
    allowInput: effectiveAllowInput,
    disableMobile: true,
    static: false,
    ...(datePickerOptions || {}),
    ...(hourOnly ? { allowInput: false } : {}),
  };
};
