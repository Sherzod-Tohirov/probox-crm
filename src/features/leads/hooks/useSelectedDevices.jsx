import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_RENT_PERIOD } from '../utils/deviceUtils';
import {
  extractNumericValue,
  formatCurrencyUZS,
  formatNumberWithSeparators,
  calculatePaymentDetails,
} from '../utils/deviceUtils';
import { alert } from '@/utils/globalAlert';

export const useSelectedDevices = ({ 
  rentPeriodOptions, 
  monthlyLimit, 
  conditionFilter,
  calculationTypeFilter = '',
  finalPercentage = null,
  maximumLimit = null,
}) => {
  const [selectedDevices, setSelectedDevices] = useState([]);

  const handleImeiSelect = useCallback((deviceId, value) => {
    setSelectedDevices((prev) =>
      prev.map((device) => {
        if (device.id !== deviceId) return device;

        const matchedOption = Array.isArray(device.imeiOptions)
          ? device.imeiOptions.find((opt) => opt.value === value)
          : null;

        const nextPrice =
          matchedOption?.meta?.calculatedPriceText || device.price;

        return {
          ...device,
          imeiValue: value,
          price: nextPrice || device.price,
        };
      })
    );
  }, []);

  const handleDeleteDevice = useCallback((deviceId) => {
    setSelectedDevices((prev) => prev.filter((device) => device.id !== deviceId));
  }, []);

  // Helper funksiya: actualFirstPayment ni hisoblash
  const getActualFirstPayment = useCallback((device) => {
    const totalPrice = extractNumericValue(device.price);
    const period =
      Number(device.rentPeriod) ||
      rentPeriodOptions[0]?.value ||
      DEFAULT_RENT_PERIOD;
    const userFirstPayment =
      device.firstPayment === '' || device.firstPayment === null || device.firstPayment === undefined
        ? null
        : Number(device.firstPayment);

    console.log('[getActualFirstPayment] Input:', {
      deviceId: device.id,
      deviceFirstPayment: device.firstPayment,
      userFirstPayment,
      isFirstPaymentManual: device.isFirstPaymentManual,
      totalPrice,
      period,
    });

    // Agar foydalanuvchi firstPayment kiritgan bo'lsa, uni ishlatamiz
    if (userFirstPayment !== null && Number.isFinite(userFirstPayment) && userFirstPayment > 0) {
      console.log('[getActualFirstPayment] Using user first payment:', userFirstPayment);
      return userFirstPayment;
    }

    // Aks holda avtomatik hisoblaymiz
    // Agar price yoki period yo'q bo'lsa, 0 qaytaramiz
    if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0 || !Number.isFinite(period) || period <= 0) {
      console.log('[getActualFirstPayment] Invalid price or period, returning 0');
      return 0;
    }

    // Agar monthlyLimit null bo'lsa, calculatedFirstPayment 0 bo'ladi
    const paymentDetails = calculatePaymentDetails({
      price: totalPrice,
      period,
      monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
      firstPayment: 0,
      calculationType: calculationTypeFilter || 'markup',
      finalPercentage: finalPercentage,
      maximumLimit: maximumLimit,
    });

    const calculated = paymentDetails.calculatedFirstPayment || 0;
    console.log('[getActualFirstPayment] Calculated first payment:', calculated);
    return calculated;
  }, [rentPeriodOptions, monthlyLimit, calculationTypeFilter, finalPercentage, maximumLimit]);

  const handleRentPeriodChange = useCallback((deviceId, value) => {
    setSelectedDevices((prev) => {
      const updated = prev.map((device) => {
        if (device.id !== deviceId) return device;

        const newPeriod =
          Number(value) ||
          Number(device.rentPeriod) ||
          DEFAULT_RENT_PERIOD;

        // Ijara oyi o'zgarganda, birinchi to'lovni yangi period uchun avtomatik hisoblangan summasiga qaytaramiz
        const totalPrice = extractNumericValue(device.price);
        let newFirstPayment = '';

        // Agar firstPayment bo'sh bo'lsa yoki null bo'lsa, avtomatik hisoblaymiz
        if (totalPrice && monthlyLimit) {
          const paymentDetails = calculatePaymentDetails({
            price: totalPrice,
            period: newPeriod,
            monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
            firstPayment: 0,
            calculationType: calculationTypeFilter || 'markup',
            finalPercentage: finalPercentage,
            maximumLimit: maximumLimit,
          });
          
          // Ijara oyi o'zgarganda, har doim yangi calculatedFirstPayment ni ishlatamiz
          newFirstPayment = paymentDetails.calculatedFirstPayment || '';
        }

        return {
          ...device,
          rentPeriod: newPeriod,
          firstPayment: newFirstPayment !== null && newFirstPayment !== undefined ? newFirstPayment : '',
          // Ijara oyi o'zgarganda, birinchi to'lov avtomatik hisoblangan bo'ladi
          isFirstPaymentManual: false,
        };
      });
      
      return updated;
    });
  }, [monthlyLimit, calculationTypeFilter, finalPercentage, maximumLimit, rentPeriodOptions]);

  const handleFirstPaymentChange = useCallback((deviceId, rawValue) => {
    setSelectedDevices((prev) =>
      prev.map((device) => {
        if (device.id !== deviceId) return device;

        const stringValue =
          typeof rawValue === 'string'
            ? rawValue
            : rawValue === null || rawValue === undefined
              ? ''
              : String(rawValue);
        
        const sanitized = stringValue.replace(/[^\d]/g, '');
        
        if (!sanitized) {
          return {
            ...device,
            firstPayment: '',
            // Foydalanuvchi maydonni bo'shatdi – bu ham qo'lda tahrir hisoblanadi
            // shuning uchun avtomatik qiymat bilan to'ldirmaymiz
            isFirstPaymentManual: true,
          };
        }
        
        const parsed = Number(sanitized);
        
        if (Number.isNaN(parsed)) {
          return {
            ...device,
            firstPayment: '',
            isFirstPaymentManual: true,
          };
        }

        // onChange da faqat qiymatni saqlaymiz, validatsiyani onBlur da qilamiz
        return {
          ...device,
          firstPayment: parsed,
          isFirstPaymentManual: true, // Foydalanuvchi qo'lda kiritdi
        };
      })
    );
  }, []);

  const handleFirstPaymentBlur = useCallback((deviceId) => {
    setSelectedDevices((prev) =>
      prev.map((device) => {
        if (device.id !== deviceId) return device;

        const currentFirstPayment = 
          device.firstPayment === '' || device.firstPayment === null || device.firstPayment === undefined
            ? null
            : Number(device.firstPayment);

        if (currentFirstPayment === null || !Number.isFinite(currentFirstPayment) || currentFirstPayment <= 0) {
          return device;
        }

        // Avtomatik hisoblangan birinchi to'lovni topish
        const totalPrice = extractNumericValue(device.price);
        const period =
          Number(device.rentPeriod) ||
          rentPeriodOptions[0]?.value ||
          DEFAULT_RENT_PERIOD;
        
        let autoCalculatedFirstPayment = 0;
        if (totalPrice !== null && Number.isFinite(totalPrice) && totalPrice > 0 && Number.isFinite(period) && period > 0) {
          const paymentDetails = calculatePaymentDetails({
            price: totalPrice,
            period,
            monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
            firstPayment: 0,
            calculationType: calculationTypeFilter || 'markup',
            finalPercentage: finalPercentage,
            maximumLimit: maximumLimit,
          });
          autoCalculatedFirstPayment = paymentDetails.calculatedFirstPayment || 0;
        }
        
        // Agar avtomatik hisoblangan qiymat mavjud bo'lsa, 10% cheklovni tekshiramiz
        if (autoCalculatedFirstPayment > 0 && currentFirstPayment < autoCalculatedFirstPayment * 0.9) {
          // 10%dan ko'p kamaytirishga urinilmoqda
          const minAllowedFirstPaymentRaw = Math.round(autoCalculatedFirstPayment * 0.9);
          // 1000 ga yaxlitlash
          const minAllowedFirstPayment = Math.floor(minAllowedFirstPaymentRaw / 1000) * 1000;
          
          // Warning ko'rsatish (setTimeout orqali render paytida emas)
          setTimeout(() => {
            alert(
              `Birinchi to'lovni avtomatik hisoblangan summaning 10%dan ko'p kamaytirish mumkin emas. Minimum ruxsat etilgan summa: ${formatCurrencyUZS(minAllowedFirstPayment)}`,
              { type: 'info' }
            );
          }, 0);
          
          // 90%ni yozish (yaxlitlangan)
          return {
            ...device,
            firstPayment: minAllowedFirstPayment,
            isFirstPaymentManual: true,
          };
        }

        // Foydalanuvchi kiritgan qiymatni ham 1000 ga yaxlitlash
        const roundedFirstPayment = Math.floor(currentFirstPayment / 1000) * 1000;
        if (roundedFirstPayment !== currentFirstPayment) {
          return {
            ...device,
            firstPayment: roundedFirstPayment,
            isFirstPaymentManual: true,
          };
        }

        return device;
      })
    );
  }, [rentPeriodOptions, monthlyLimit, calculationTypeFilter, finalPercentage, maximumLimit]);

  const selectedDeviceData = useMemo(
    () => {
      // Condition filter bo'yicha filter qilish
      let filteredDevices = selectedDevices;
      if (conditionFilter && conditionFilter !== 'all') {
        filteredDevices = selectedDevices.filter((device) => {
          const deviceCondition = device?.condition ?? device?.raw?.U_PROD_CONDITION ?? device?.raw?.u_prod_condition ?? '';
          return deviceCondition === conditionFilter;
        });
      }

      // Disabled holatni aniqlash
      const isRentPeriodDisabled = 
        (calculationTypeFilter === 'markup' && (maximumLimit === null || maximumLimit === undefined || maximumLimit === 0)) ||
        (calculationTypeFilter === 'firstPayment' && (finalPercentage === null || finalPercentage === undefined));
      
      const isFirstPaymentDisabled = 
        (calculationTypeFilter === 'markup' && (maximumLimit === null || maximumLimit === undefined || maximumLimit === 0)) ||
        (calculationTypeFilter === 'firstPayment' && (finalPercentage === null || finalPercentage === undefined));

      return filteredDevices.map((device) => ({
        id: device.id ?? device.name,
        name: device.name,
        storage: device.storage,
        color: device.color,
        price: device.price,
        whsName: device.whsName || '',
        imeiOptions: device.imeiOptions ?? [],
        imeiValue:
          device.imeiValue ??
          (Array.isArray(device.imeiOptions) && device.imeiOptions.length === 1
            ? device.imeiOptions[0].value
            : ''),
        imeiLoading: Boolean(device.imeiLoading),
        imeiError:
          device.imeiError === undefined || device.imeiError === null
            ? ''
            : device.imeiError,
        rentPeriod: isRentPeriodDisabled 
          ? 0 
          : (Number(device.rentPeriod) ||
            rentPeriodOptions[0]?.value ||
            DEFAULT_RENT_PERIOD),
        firstPayment: (() => {
          // Agar disabled bo'lsa, 0 qaytaramiz
          if (isFirstPaymentDisabled) {
            return 0;
          }

          // Agar foydalanuvchi birinchi to'lovni qo'lda tahrir qilgan bo'lsa,
          // hech qanday avtomatik hisob-kitob qilmaymiz – aynan o'sha qiymatni (yoki bo'sh) ko'rsatamiz
          if (device.isFirstPaymentManual) {
            if (
              device.firstPayment === '' ||
              device.firstPayment === null ||
              device.firstPayment === undefined
            ) {
              return '';
            }
            const manual = Number(device.firstPayment);
            return Number.isFinite(manual) && manual > 0 ? manual : '';
          }

          const totalPrice = extractNumericValue(device.price);
          if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0) {
            return '';
          }

          const userFirstPayment =
            device.firstPayment === '' || device.firstPayment === null || device.firstPayment === undefined
              ? null
              : Number(device.firstPayment);

          // Agar foydalanuvchi firstPayment kiritgan bo'lsa, uni qaytaramiz
          if (userFirstPayment !== null && Number.isFinite(userFirstPayment) && userFirstPayment > 0) {
            return userFirstPayment;
          }

          // Aks holda avtomatik hisoblaymiz
          const actual = getActualFirstPayment(device);
          return actual || '';
        })(),
        condition: device?.condition ?? device?.raw?.U_PROD_CONDITION ?? device?.raw?.u_prod_condition ?? '',
        monthlyPayment: (() => {
          // Agar disabled bo'lsa, 0 qaytaramiz
          if (isRentPeriodDisabled || isFirstPaymentDisabled) {
            return formatCurrencyUZS(0);
          }

          const totalPrice = extractNumericValue(device.price);
          const period = isRentPeriodDisabled 
            ? 0 
            : (Number(device.rentPeriod) ||
              rentPeriodOptions[0]?.value ||
              DEFAULT_RENT_PERIOD);
          
          // Price yoki period noto'g'ri bo'lsa
          if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0 || !Number.isFinite(period) || period <= 0) {
            return '';
          }

          // Foydalanuvchi qo'lda kiritgan birinchi to'lovni olish
          let actualFirstPayment = 0;
          
          // Agar foydalanuvchi qo'lda kiritgan bo'lsa, to'g'ridan-to'g'ri device.firstPayment dan olamiz
          if (device.isFirstPaymentManual) {
            const manualFirstPayment = 
              device.firstPayment === '' || device.firstPayment === null || device.firstPayment === undefined
                ? null
                : Number(device.firstPayment);
            
            if (manualFirstPayment !== null && Number.isFinite(manualFirstPayment) && manualFirstPayment > 0) {
              actualFirstPayment = manualFirstPayment;
            } else {
              // Agar qo'lda kiritilgan bo'lsa lekin bo'sh yoki 0 bo'lsa, avtomatik hisoblaymiz
              actualFirstPayment = getActualFirstPayment(device);
            }
          } else {
            // Agar avtomatik bo'lsa, getActualFirstPayment dan olamiz
            actualFirstPayment = getActualFirstPayment(device);
          }

          console.log('[monthlyPayment] Device:', {
            id: device.id,
            price: totalPrice,
            period,
            deviceFirstPayment: device.firstPayment,
            isFirstPaymentManual: device.isFirstPaymentManual,
            actualFirstPayment,
            monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
          });

          const paymentDetails = calculatePaymentDetails({
            price: totalPrice,
            period,
            monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
            firstPayment: actualFirstPayment,
            isFirstPaymentManual: device.isFirstPaymentManual || false,
            calculationType: calculationTypeFilter || 'markup',
            finalPercentage: finalPercentage,
            maximumLimit: maximumLimit,
          });

          console.log('[monthlyPayment] Payment Details:', {
            monthlyPayment: paymentDetails.monthlyPayment,
            calculatedFirstPayment: paymentDetails.calculatedFirstPayment,
            grandTotal: paymentDetails.grandTotal,
          });

          return formatCurrencyUZS(paymentDetails.monthlyPayment);
        })(),
        totalPayment: (() => {
          const totalPrice = extractNumericValue(device.price);
          
          // Agar "limit" tanlangan va maximum limit mavjud bo'lmasa, narx bilan bir xil qaytaramiz
          if (calculationTypeFilter === 'markup' && (maximumLimit === null || maximumLimit === undefined || maximumLimit === 0)) {
            if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0) {
              return '';
            }
            return formatCurrencyUZS(totalPrice);
          }

          // Agar disabled bo'lsa va "percent" tanlangan bo'lsa, 0 qaytaramiz
          if ((isRentPeriodDisabled || isFirstPaymentDisabled) && calculationTypeFilter === 'firstPayment') {
            return formatCurrencyUZS(0);
          }

          const period = isRentPeriodDisabled 
            ? 0 
            : (Number(device.rentPeriod) ||
              rentPeriodOptions[0]?.value ||
              DEFAULT_RENT_PERIOD);
          
          // Price yoki period noto'g'ri bo'lsa
          if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0 || !Number.isFinite(period) || period <= 0) {
            return '';
          }

          // Foydalanuvchi qo'lda kiritgan birinchi to'lovni olish
          let actualFirstPayment = 0;
          
          // Agar foydalanuvchi qo'lda kiritgan bo'lsa, to'g'ridan-to'g'ri device.firstPayment dan olamiz
          if (device.isFirstPaymentManual) {
            const manualFirstPayment = 
              device.firstPayment === '' || device.firstPayment === null || device.firstPayment === undefined
                ? null
                : Number(device.firstPayment);
            
            if (manualFirstPayment !== null && Number.isFinite(manualFirstPayment) && manualFirstPayment > 0) {
              actualFirstPayment = manualFirstPayment;
            } else {
              // Agar qo'lda kiritilgan bo'lsa lekin bo'sh yoki 0 bo'lsa, avtomatik hisoblaymiz
              actualFirstPayment = getActualFirstPayment(device);
            }
          } else {
            // Agar avtomatik bo'lsa, getActualFirstPayment dan olamiz
            actualFirstPayment = getActualFirstPayment(device);
          }

          const paymentDetails = calculatePaymentDetails({
            price: totalPrice,
            period,
            monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
            firstPayment: actualFirstPayment,
            isFirstPaymentManual: device.isFirstPaymentManual || false,
            calculationType: calculationTypeFilter || 'markup',
            finalPercentage: finalPercentage,
            maximumLimit: maximumLimit,
          });

          return formatCurrencyUZS(paymentDetails.grandTotal);
        })(),
      }));
    },
    [rentPeriodOptions, selectedDevices, monthlyLimit, getActualFirstPayment, conditionFilter, calculationTypeFilter, finalPercentage, maximumLimit]
  );

  const totalSelectedPrice = useMemo(
    () =>
      selectedDeviceData.reduce(
        (acc, device) => acc + (extractNumericValue(device.price) || 0),
        0
      ),
    [selectedDeviceData]
  );

  const totalGrandTotal = useMemo(
    () =>
      selectedDeviceData.reduce((acc, device) => {
        const totalPrice = extractNumericValue(device.price);
        
        // Price noto'g'ri bo'lsa, skip qilamiz
        if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0) {
          return acc;
        }

        // Agar "limit" tanlangan va maximum limit mavjud bo'lmasa, narx bilan bir xil qaytaramiz
        if (calculationTypeFilter === 'markup' && (maximumLimit === null || maximumLimit === undefined || maximumLimit === 0)) {
          return acc + totalPrice;
        }

        const period =
          Number(device.rentPeriod) ||
          rentPeriodOptions[0]?.value ||
          DEFAULT_RENT_PERIOD;
        
        // Period noto'g'ri bo'lsa, skip qilamiz
        if (!Number.isFinite(period) || period <= 0) {
          return acc;
        }

        // selectedDeviceData dan device obyektini topish
        const originalDevice = selectedDevices.find(d => d.id === device.id || d.name === device.name);
        
        const actualFirstPayment = getActualFirstPayment({
          ...device,
          rentPeriod: device.rentPeriod || period,
        });

        const paymentDetails = calculatePaymentDetails({
          price: totalPrice,
          period,
          monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
          firstPayment: actualFirstPayment,
          isFirstPaymentManual: originalDevice?.isFirstPaymentManual || false,
          calculationType: calculationTypeFilter || 'markup',
          finalPercentage: finalPercentage,
          maximumLimit: maximumLimit,
        });

        return acc + (paymentDetails.grandTotal || 0);
      }, 0),
    [selectedDeviceData, selectedDevices, rentPeriodOptions, monthlyLimit, getActualFirstPayment, calculationTypeFilter, finalPercentage, maximumLimit]
  );

  return {
    selectedDevices,
    setSelectedDevices,
    selectedDeviceData,
    totalSelectedPrice,
    totalGrandTotal,
    handleImeiSelect,
    handleDeleteDevice,
    handleRentPeriodChange,
    handleFirstPaymentChange,
    handleFirstPaymentBlur,
  };
};

