import moment from 'moment';

export function getAge(birthDate) {
  if (!birthDate) return '';
  const age = moment().diff(moment(birthDate, 'DD.MM.YYYY'), 'years');
  console.log(age, 'age');
  return age;
}
