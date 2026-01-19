import { extractNumericValue } from '@/features/leads/utils/deviceUtils';
import { calculatePaymentDetails } from '@/features/leads/utils/deviceUtils';
import { numberToWordsUZ, numberToWordsRU } from './numberToWords';

/**
 * To'lov ma'lumotlarini hisoblaydi
 * @param {Array} selectedDevices - Tanlangan qurilmalar
 * @param {Array} DocumentLines - Document lines
 * @param {number} monthlyLimit - Oylik limit
 * @param {string} calculationType - Xisoblash turi (markup yoki firstPayment)
 * @param {number} finalPercentage - Final percentage (Foiz holatida)
 * @param {number} maximumLimit - Maximum limit
 * @returns {Object} To'lov ma'lumotlari
 */
export const calculatePaymentData = (
  selectedDevices,
  DocumentLines,
  monthlyLimit,
  calculationType = 'markup',
  finalPercentage = null,
  maximumLimit = null
) => {
  let grandTotal = 0;
  let totalFirstPayment = 0;
  let totalRemainingAmount = 0;
  let maxPeriod = 0;
  let totalMonthlyPayment = 0;

  const totalPrice = DocumentLines.reduce(
    (sum, line) => sum + (line.Price || 0),
    0
  );

  if (selectedDevices && selectedDevices.length > 0) {
    selectedDevices.forEach((device) => {
      const price = extractNumericValue(device.price);
      const period = Number(device.rentPeriod) || 0;
      const firstPayment = extractNumericValue(device.firstPayment) || 0;
      const isFirstPaymentManual = device?.isFirstPaymentManual || false;

      if (price && period > 0) {
        const paymentDetails = calculatePaymentDetails({
          price,
          period,
          monthlyLimit:
            monthlyLimit !== null && monthlyLimit !== undefined
              ? monthlyLimit
              : 0,
          firstPayment,
          isFirstPaymentManual: isFirstPaymentManual,
          calculationType: calculationType || 'markup',
          finalPercentage: finalPercentage,
          maximumLimit:
            maximumLimit !== null && maximumLimit !== undefined
              ? maximumLimit
              : monthlyLimit > 0
                ? monthlyLimit
                : null,
        });

        grandTotal += paymentDetails.grandTotal;
        // Use calculatedFirstPayment from paymentDetails which already handles manual vs calculated logic
        const actualFirstPayment = paymentDetails.calculatedFirstPayment;
        totalFirstPayment += actualFirstPayment || 0;
        maxPeriod = Math.max(maxPeriod, period);
        totalMonthlyPayment += paymentDetails.monthlyPayment || 0;
      }
    });

    totalRemainingAmount = grandTotal - totalFirstPayment;
  } else {
    grandTotal = totalPrice;
    totalRemainingAmount = totalPrice;
  }

  const grandTotalFormatted = Math.round(grandTotal).toLocaleString('uz-UZ');
  const firstPaymentFormatted =
    Math.round(totalFirstPayment).toLocaleString('uz-UZ');
  const remainingAmountFormatted =
    Math.round(totalRemainingAmount).toLocaleString('uz-UZ');

  // So'z ko'rinishlari
  const grandTotalWordsUZ = numberToWordsUZ(grandTotal);
  const grandTotalWordsRU = numberToWordsRU(grandTotal);
  const firstPaymentWordsUZ = numberToWordsUZ(totalFirstPayment);
  const firstPaymentWordsRU = numberToWordsRU(totalFirstPayment);
  const remainingAmountWordsUZ = numberToWordsUZ(totalRemainingAmount);
  const remainingAmountWordsRU = numberToWordsRU(totalRemainingAmount);

  return {
    grandTotal,
    totalFirstPayment,
    totalRemainingAmount,
    maxPeriod,
    totalMonthlyPayment,
    grandTotalFormatted,
    firstPaymentFormatted,
    remainingAmountFormatted,
    grandTotalWordsUZ,
    grandTotalWordsRU,
    firstPaymentWordsUZ,
    firstPaymentWordsRU,
    remainingAmountWordsUZ,
    remainingAmountWordsRU,
  };
};

/**
 * To'lov jadvalini hisoblaydi
 * @param {Array} selectedDevices - Tanlangan qurilmalar
 * @param {number} monthlyLimit - Oylik limit
 * @param {string} calculationType - Xisoblash turi (markup yoki firstPayment)
 * @param {number} finalPercentage - Final percentage (Foiz holatida)
 * @param {number} maximumLimit - Maximum limit
 * @returns {Array} To'lov jadvali
 */
export const calculatePaymentSchedule = (
  selectedDevices,
  monthlyLimit,
  calculationType = 'markup',
  finalPercentage = null,
  maximumLimit = null
) => {
  if (!selectedDevices || selectedDevices.length === 0) {
    return [];
  }

  const schedule = [];
  let maxPeriod = 0;
  const devicePayments = [];

  // Har bir qurilma uchun to'lov ma'lumotlarini hisoblash
  selectedDevices.forEach((device) => {
    const price = extractNumericValue(device.price);
    const period = Number(device.rentPeriod) || 0;
    const firstPayment = extractNumericValue(device.firstPayment) || 0;
    const isFirstPaymentManual = device?.isFirstPaymentManual || false;

    if (price && period > 0) {
      maxPeriod = Math.max(maxPeriod, period);

      const paymentDetails = calculatePaymentDetails({
        price,
        period,
        monthlyLimit:
          monthlyLimit !== null && monthlyLimit !== undefined
            ? monthlyLimit
            : 0,
        firstPayment,
        isFirstPaymentManual: isFirstPaymentManual,
        calculationType: calculationType || 'markup',
        finalPercentage: finalPercentage,
        maximumLimit:
          maximumLimit !== null && maximumLimit !== undefined
            ? maximumLimit
            : monthlyLimit > 0
              ? monthlyLimit
              : null,
      });

      // Use calculatedFirstPayment from paymentDetails which already handles manual vs calculated logic
      const actualFirstPayment = paymentDetails.calculatedFirstPayment;

      devicePayments.push({
        period,
        monthlyPayment: paymentDetails.monthlyPayment || 0,
        firstPayment: actualFirstPayment || 0,
      });
    }
  });

  if (maxPeriod <= 0) {
    return [];
  }

  // Jadvalda faqat oylik to'lovlar ko'rsatiladi, birinchi to'lov ko'rsatilmaydi
  // Har bir oy uchun oylik to'lovlarni hisoblash
  // number: 1 dan boshlanadi (birinchi to'lov jadvalda yo'q)
  const startNumber = 1;
  for (let month = 1; month <= maxPeriod; month++) {
    let monthlyTotal = 0;

    devicePayments.forEach((devicePayment) => {
      if (month <= devicePayment.period) {
        monthlyTotal += devicePayment.monthlyPayment;
      }
    });

    // Jadval sanalari joriy oydan emas, kelasi oydan boshlansin:
    // month=1 => +1 oy, month=2 => +2 oy, ...
    const paymentDate = new Date();
    paymentDate.setMonth(paymentDate.getMonth() + month);
    const dateStr = paymentDate.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    schedule.push({
      number: startNumber + month - 1, // Birinchi to'lov bo'lsa 2 dan boshlanadi, aks holda 1 dan
      date: dateStr,
      amount: Math.round(monthlyTotal),
      remaining: 0,
    });
  }

  return schedule;
};

/**
 * Sana ma'lumotlarini olish
 * @returns {Object} Sana ma'lumotlari
 */
export const getDateInfo = () => {
  const date = new Date();
  const day = date.getDate();
  const monthNames = [
    'yanvar',
    'fevral',
    'mart',
    'aprel',
    'may',
    'iyun',
    'iyul',
    'avgust',
    'sentyabr',
    'oktyabr',
    'noyabr',
    'dekabr',
  ];
  const monthNamesRu = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  const month = monthNames[date.getMonth()];
  const monthRu = monthNamesRu[date.getMonth()];
  const year = date.getFullYear();

  return { day, month, monthRu, year };
};
