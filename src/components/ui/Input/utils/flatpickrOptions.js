import { computeAllowInput } from './flatpickrHourOnly';

const uzLocale = {
  firstDayOfWeek: 1,
  weekdays: {
    shorthand: ['Ya', 'Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha'],
    longhand: [
      'Yakshanba',
      'Dushanba',
      'Seshanba',
      'Chorshanba',
      'Payshanba',
      'Juma',
      'Shanba',
    ],
  },
  months: {
    shorthand: [
      'Yan',
      'Fev',
      'Mar',
      'Apr',
      'May',
      'Iyun',
      'Iyul',
      'Avg',
      'Sen',
      'Okt',
      'Noy',
      'Dek',
    ],
    longhand: [
      'Yanvar',
      'Fevral',
      'Mart',
      'Aprel',
      'May',
      'Iyun',
      'Iyul',
      'Avgust',
      'Sentyabr',
      'Oktyabr',
      'Noyabr',
      'Dekabr',
    ],
  },
};

export const buildDateOptions = ({
  includeTime,
  defaultDate,
  datePickerOptions = {},
  hourOnly,
}) => {
  const effectiveAllowInput = computeAllowInput(
    datePickerOptions.allowInput,
    hourOnly
  );
  return {
    enableTime: !!includeTime,
    defaultDate: defaultDate || new Date(),
    dateFormat: includeTime ? 'd.m.Y H:i' : 'd.m.Y',
    ...(includeTime ? { time_24hr: true } : {}),
    locale: uzLocale,
    clickOpens: true,
    allowInput: effectiveAllowInput,
    disableMobile: true,
    static: false,
    ...(datePickerOptions || {}),
    ...(hourOnly ? { allowInput: false } : {}),
  };
};

export const buildTimeOptions = ({
  defaultDate,
  datePickerOptions = {},
  hourOnly,
}) => {
  const effectiveAllowInput = computeAllowInput(
    datePickerOptions.allowInput,
    hourOnly
  );
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

export const buildDateTimeLocalOptions = ({
  defaultDate,
  datePickerOptions = {},
  hourOnly,
}) => {
  const effectiveAllowInput = computeAllowInput(
    datePickerOptions.allowInput,
    hourOnly
  );
  return {
    enableTime: true,
    dateFormat: 'd.m.Y H:i',
    time_24hr: true,
    locale: uzLocale,
    clickOpens: true,
    allowInput: effectiveAllowInput,
    disableMobile: true,
    static: false,
    ...(datePickerOptions || {}),
    ...(hourOnly ? { allowInput: false } : {}),
  };
};
