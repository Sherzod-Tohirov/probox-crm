import moment from 'moment';

export const normalizeDate = (date) => {
  const strict = moment(
    date,
    ['DD.MM.YYYY HH:mm', 'YYYY.MM.DD HH:mm', 'DD.MM.YYYY'],
    true
  );
  if (strict.isValid()) return strict.format('DD.MM.YYYY HH:mm');
  const loose = moment(date);
  return loose.isValid() ? loose.format('DD.MM.YYYY HH:mm') : '';
};
