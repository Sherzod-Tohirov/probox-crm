import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_RENT_PERIOD } from '../utils/deviceUtils';
import { extractNumericValue, formatCurrencyUZS, formatNumberWithSeparators } from '../utils/deviceUtils';

export const useSelectedDevices = ({ rentPeriodOptions }) => {
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
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              rentPeriod:
                Number(value) ||
                Number(device.rentPeriod) ||
                DEFAULT_RENT_PERIOD,
            }
          : device
      )
    );
  }, []);

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
        firstPayment:
          device.firstPayment === '' || device.firstPayment === null
            ? ''
            : Number(device.firstPayment),
        monthlyPayment: (() => {
          const totalPrice = extractNumericValue(device.price);
          const period =
            Number(device.rentPeriod) ||
            rentPeriodOptions[0]?.value ||
            DEFAULT_RENT_PERIOD;
          const firstPaymentValue =
            device.firstPayment === '' || device.firstPayment === null
              ? 0
              : Number(device.firstPayment);
          if (!totalPrice || !period) {
            return '';
          }
          const sanitizedFirstPayment = Number.isFinite(firstPaymentValue)
            ? Math.max(0, firstPaymentValue)
            : 0;
          const remaining = Math.max(0, totalPrice - sanitizedFirstPayment);
          return formatCurrencyUZS(remaining / period);
        })(),
      })),
    [rentPeriodOptions, selectedDevices]
  );

  const totalSelectedPrice = useMemo(
    () =>
      selectedDeviceData.reduce(
        (acc, device) => acc + (extractNumericValue(device.price) || 0),
        0
      ),
    [selectedDeviceData]
  );

  return {
    selectedDevices,
    setSelectedDevices,
    selectedDeviceData,
    totalSelectedPrice,
    handleImeiSelect,
    handleDeleteDevice,
    handleRentPeriodChange,
    handleFirstPaymentChange,
  };
};

