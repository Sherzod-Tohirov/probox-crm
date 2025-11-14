import moment from 'moment';

export const formatDateUI = (date, includeTime = false) => {
  if (!date) return '';
  try {
    return moment(date).format(includeTime ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY');
  } catch (e) {
    return '';
  }
};

export const formatTimeUI = (date) => {
  if (!date) return '';
  try {
    return moment(date).format('HH:mm');
  } catch (e) {
    return '';
  }
};
