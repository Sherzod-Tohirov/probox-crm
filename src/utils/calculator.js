import getPercentageColor from './getPercentageColor';

export const insTotalCalculator = ({ paidToDate, sumApplied, insTotal }) => {
  if (Number(paidToDate) > Number(sumApplied)) {
    return Number(insTotal) - (Number(paidToDate) - Number(sumApplied));
  }
  return insTotal;
};

export const calculatePercentage = (part, total, color = false) => {
  if (total === 0) return '0.00 %'; // Avoid division by zero
  const value = parseFloat((part / total) * 100).toFixed(2);
  const percentage = String(value) + ' %'; // Return percentage with two decimal places
  if (color) {
    return { value: percentage, color: getPercentageColor(Number(value)) };
  }
  return percentage;
};

export const getValue = (percent, role) => {
  const ROLE_MANAGER = 'Manager';
  if (percent >= 80 && percent < 90) {
    if (role === ROLE_MANAGER) return 0.1;
    return 0.4;
  } else if (percent >= 90 && percent < 95) {
    if (role === ROLE_MANAGER) return 0.2;
    return 0.5;
  } else if (percent >= 95 && percent < 96) {
    if (role === ROLE_MANAGER) return 0.25;
    return 0.55;
  } else if (percent >= 96 && percent < 97) {
    if (role === ROLE_MANAGER) return 0.26;
    return 0.56;
  } else if (percent >= 97 && percent < 98) {
    if (role === ROLE_MANAGER) return 0.27;
    return 0.57;
  } else if (percent >= 98 && percent < 99) {
    if (role === ROLE_MANAGER) return 0.28;
    return 0.58;
  } else if (percent >= 99 && percent < 100) {
    if (role === ROLE_MANAGER) return 0.29;
    return 0.59;
  } else if (percent === 100) {
    if (role === ROLE_MANAGER) return 0.3;
    return 0.6;
  } else {
    return null;
  }
};

export const calculateKPI = (percentage, sumApplied, role = 'Assistant') => {
  const value = getValue(percentage, role);
  return parseFloat((sumApplied / 100) * value).toFixed(2);
};
