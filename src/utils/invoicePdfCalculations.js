import { extractNumericValue } from '@/features/leads/utils/deviceUtils';
import { calculatePaymentDetails } from '@/features/leads/utils/deviceUtils';
import { numberToWordsUZ, numberToWordsRU } from './numberToWords';

/**
 * To'lov ma'lumotlarini hisoblaydi
 * @param {Array} selectedDevices - Tanlangan qurilmalar
 * @param {Array} DocumentLines - Document lines
 * @param {number} monthlyLimit - Oylik limit
 * @returns {Object} To'lov ma'lumotlari
 */
export const calculatePaymentData = (selectedDevices, DocumentLines, monthlyLimit) => {
  let grandTotal = 0;
  let totalFirstPayment = 0;
  let totalRemainingAmount = 0;
  let maxPeriod = 0;
  let totalMonthlyPayment = 0;
  
  const totalPrice = DocumentLines.reduce((sum, line) => sum + (line.Price || 0), 0);
  
  if (selectedDevices && selectedDevices.length > 0) {
    selectedDevices.forEach((device) => {
      const price = extractNumericValue(device.price);
      const period = Number(device.rentPeriod) || 0;
      const firstPayment = extractNumericValue(device.firstPayment) || 0;
      
      if (price && period > 0) {
        const paymentDetails = calculatePaymentDetails({
          price,
          period,
          monthlyLimit,
          firstPayment,
        });
        
        grandTotal += paymentDetails.grandTotal;
        const actualFirstPayment = firstPayment > 0 ? firstPayment : paymentDetails.calculatedFirstPayment;
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
  const firstPaymentFormatted = Math.round(totalFirstPayment).toLocaleString('uz-UZ');
  const remainingAmountFormatted = Math.round(totalRemainingAmount).toLocaleString('uz-UZ');
  
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
 * @returns {Array} To'lov jadvali
 */
export const calculatePaymentSchedule = (selectedDevices, monthlyLimit) => {
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
    
    if (price && period > 0) {
      maxPeriod = Math.max(maxPeriod, period);
      
      const paymentDetails = calculatePaymentDetails({
        price,
        period,
        monthlyLimit,
        firstPayment,
      });
      
      const actualFirstPayment = firstPayment > 0 ? firstPayment : paymentDetails.calculatedFirstPayment;
      
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

  // Har bir oy uchun faqat oylik to'lovlarni hisoblash
  for (let month = 1; month <= maxPeriod; month++) {
    let monthlyTotal = 0;
    
    devicePayments.forEach((devicePayment) => {
      if (month <= devicePayment.period) {
        monthlyTotal += devicePayment.monthlyPayment;
      }
    });

    const paymentDate = new Date();
    paymentDate.setMonth(paymentDate.getMonth() + month - 1);
    const dateStr = paymentDate.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    schedule.push({
      number: month,
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
  const monthNames = ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'];
  const monthNamesRu = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const month = monthNames[date.getMonth()];
  const monthRu = monthNamesRu[date.getMonth()];
  const year = date.getFullYear();
  
  return { day, month, monthRu, year };
};

