import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_RENT_PERIOD } from '../utils/deviceUtils';
import {
  extractNumericValue,
  formatCurrencyUZS,
  formatNumberWithSeparators,
  calculatePaymentDetails,
} from '../utils/deviceUtils';

export const useSelectedDevices = ({ rentPeriodOptions, monthlyLimit }) => {
  const [selectedDevices, setSelectedDevices] = useState([]);

  const handleImeiSelect = useCallback((deviceId, value) => {
    setSelectedDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, imeiValue: value } : device
      )
    );
  }, []);

  const handleDeleteDevice = useCallback((deviceId) => {
    setSelectedDevices((prev) => prev.filter((device) => device.id !== deviceId));
  }, []);

  const handleRentPeriodChange = useCallback((deviceId, value) => {
    setSelectedDevices((prev) =>
      prev.map((device) => {
        if (device.id !== deviceId) return device;

        const newPeriod =
          Number(value) ||
          Number(device.rentPeriod) ||
          DEFAULT_RENT_PERIOD;

        // Agar firstPayment bo'sh bo'lsa, avtomatik hisoblaymiz
        const totalPrice = extractNumericValue(device.price);
        const currentFirstPayment =
          device.firstPayment === '' || device.firstPayment === null
            ? 0
            : Number(device.firstPayment);

        let newFirstPayment = currentFirstPayment;

        // Agar firstPayment bo'sh bo'lsa yoki 0 bo'lsa, avtomatik hisoblaymiz
        if (!currentFirstPayment && totalPrice && monthlyLimit) {
          const paymentDetails = calculatePaymentDetails({
            price: totalPrice,
            period: newPeriod,
            monthlyLimit: monthlyLimit || 0,
            firstPayment: 0,
          });
          newFirstPayment = paymentDetails.calculatedFirstPayment;
        }

        return {
          ...device,
          rentPeriod: newPeriod,
          firstPayment: newFirstPayment || '',
        };
      })
    );
  }, [monthlyLimit]);

  const handleFirstPaymentChange = useCallback((deviceId, rawValue) => {
    setSelectedDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              firstPayment: (() => {
                const stringValue =
                  typeof rawValue === 'string'
                    ? rawValue
                    : rawValue === null || rawValue === undefined
                      ? ''
                      : String(rawValue);
                const sanitized = stringValue.replace(/[^\d]/g, '');
                if (!sanitized) {
                  return '';
                }
                const parsed = Number(sanitized);
                return Number.isNaN(parsed) ? '' : parsed;
              })(),
            }
          : device
      )
    );
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

    // Agar foydalanuvchi firstPayment kiritgan bo'lsa, uni ishlatamiz
    if (userFirstPayment !== null && Number.isFinite(userFirstPayment) && userFirstPayment > 0) {
      return userFirstPayment;
    }

    // Aks holda avtomatik hisoblaymiz
    // Agar price yoki period yo'q bo'lsa, 0 qaytaramiz
    if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0 || !Number.isFinite(period) || period <= 0) {
      return 0;
    }

    // Agar monthlyLimit null bo'lsa, calculatedFirstPayment 0 bo'ladi
    const paymentDetails = calculatePaymentDetails({
      price: totalPrice,
      period,
      monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
      firstPayment: 0,
    });

    return paymentDetails.calculatedFirstPayment || 0;
  }, [rentPeriodOptions, monthlyLimit]);

  const selectedDeviceData = useMemo(
    () =>
      selectedDevices.map((device) => ({
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
        rentPeriod:
          Number(device.rentPeriod) ||
          rentPeriodOptions[0]?.value ||
          DEFAULT_RENT_PERIOD,
        firstPayment: (() => {
          const totalPrice = extractNumericValue(device.price);
          if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0) {
            return '';
          }

          const actual = getActualFirstPayment(device);
          const userFirstPayment =
            device.firstPayment === '' || device.firstPayment === null || device.firstPayment === undefined
              ? null
              : Number(device.firstPayment);
          // Agar foydalanuvchi kiritgan bo'lsa, uni qaytaramiz, aks holda calculated
          return userFirstPayment !== null && Number.isFinite(userFirstPayment) && userFirstPayment > 0
            ? userFirstPayment
            : actual || '';
        })(),
        monthlyPayment: (() => {
          const totalPrice = extractNumericValue(device.price);
          const period =
            Number(device.rentPeriod) ||
            rentPeriodOptions[0]?.value ||
            DEFAULT_RENT_PERIOD;
          
          // Price yoki period noto'g'ri bo'lsa
          if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0 || !Number.isFinite(period) || period <= 0) {
            return '';
          }

          const actualFirstPayment = getActualFirstPayment(device);

          const paymentDetails = calculatePaymentDetails({
            price: totalPrice,
            period,
            monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
            firstPayment: actualFirstPayment,
          });

          return formatCurrencyUZS(paymentDetails.monthlyPayment);
        })(),
        totalPayment: (() => {
          const totalPrice = extractNumericValue(device.price);
          const period =
            Number(device.rentPeriod) ||
            rentPeriodOptions[0]?.value ||
            DEFAULT_RENT_PERIOD;
          
          // Price yoki period noto'g'ri bo'lsa
          if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0 || !Number.isFinite(period) || period <= 0) {
            return '';
          }

          const actualFirstPayment = getActualFirstPayment(device);

          const paymentDetails = calculatePaymentDetails({
            price: totalPrice,
            period,
            monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
            firstPayment: actualFirstPayment,
          });

          return formatCurrencyUZS(paymentDetails.grandTotal);
        })(),
      })),
    [rentPeriodOptions, selectedDevices, monthlyLimit, getActualFirstPayment]
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
        const period =
          Number(device.rentPeriod) ||
          rentPeriodOptions[0]?.value ||
          DEFAULT_RENT_PERIOD;
        
        // Price yoki period noto'g'ri bo'lsa, skip qilamiz
        if (totalPrice === null || !Number.isFinite(totalPrice) || totalPrice <= 0 || !Number.isFinite(period) || period <= 0) {
          return acc;
        }

        const actualFirstPayment = getActualFirstPayment({
          ...device,
          rentPeriod: device.rentPeriod || period,
        });

        const paymentDetails = calculatePaymentDetails({
          price: totalPrice,
          period,
          monthlyLimit: monthlyLimit !== null && monthlyLimit !== undefined ? monthlyLimit : 0,
          firstPayment: actualFirstPayment,
        });

        return acc + (paymentDetails.grandTotal || 0);
      }, 0),
    [selectedDeviceData, rentPeriodOptions, monthlyLimit, getActualFirstPayment]
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
  };
};

