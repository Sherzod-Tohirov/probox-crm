import moment from 'moment';

const formatDate = (
  dateString,
  inputFormat = 'YYYY-MM-DD HH:mm:ss.SSSSSSSSS',
  outputFormat = 'DD.MM.YYYY'
) => {
  try {
    if (!dateString) return '-';
    return moment(dateString, inputFormat).format(outputFormat);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatDateWithHour = (
  dateString,
  inputFormat = 'YYYY-MM-DD HH:mm:ss.SSSSSSSSS'
) => {
  try {
    if (!dateString) return '-';

    let parsed;
    if (
      typeof dateString === 'string' &&
      /t/i.test(dateString) &&
      (dateString.includes('Z') || /[+-]\d{2}:?\d{2}$/.test(dateString))
    ) {
      parsed = moment.utc(dateString);
    } else if (inputFormat) {
      parsed = moment(dateString, inputFormat);
    } else {
      parsed = moment(dateString);
    }

    if (!parsed.isValid()) return dateString;

    return parsed.local().format('DD.MM.YYYY HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export default formatDate;
