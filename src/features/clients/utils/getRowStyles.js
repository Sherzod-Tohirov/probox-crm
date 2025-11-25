import moment from 'moment';

/**
 * Get dynamic row styles for clients table based on row data and theme
 * @param {Object} row - The row data
 * @param {Object} currentClient - The currently selected client
 * @param {string} currentTheme - Current theme ('dark' or 'light')
 * @returns {Object|undefined} Style object or undefined
 */
export default function getRowStyles(row, currentClient, currentTheme) {
  // Highlight currently selected row
  if (row?.['DocEntry'] === currentClient?.['DocEntry']) {
    return {
      backgroundColor:
        currentTheme === 'dark'
          ? 'rgba(96, 165, 250, 0.15)'
          : 'rgba(206, 236, 249, 0.94)',
    };
  }

  // Highlight rows with payment due today
  const paymentDate = moment(row?.DueDate ?? row?.NewDueDate ?? null);
  const today = moment();
  const isTodayPayment = paymentDate.isSame(today, 'day');

  if (isTodayPayment) {
    return {
      backgroundColor:
        currentTheme === 'dark'
          ? 'rgba(115, 115, 87, 0.73)'
          : 'rgba(244, 244, 173, 0.76)',
    };
  }

  return undefined;
}
