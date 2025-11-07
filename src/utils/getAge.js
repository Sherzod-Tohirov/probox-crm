import moment from 'moment';

export function getAge(birthDate) {
  if (!birthDate) return '';
  const formats = ['DD.MM.YYYY', 'YYYY.MM.DD'];
  const age = moment().diff(moment(birthDate, formats), 'years');
  return age;
}
