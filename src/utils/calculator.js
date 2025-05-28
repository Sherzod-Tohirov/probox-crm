export const insTotalCalculator = ({ paidToDate, sumApplied, insTotal }) => {
  if (Number(paidToDate) > Number(sumApplied)) {
    return Number(insTotal) - (Number(paidToDate) - Number(sumApplied));
  }
  return insTotal;
};
