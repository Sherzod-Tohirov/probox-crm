import { useCallback } from 'react';
import useFetchItemSeries from '@/hooks/data/leads/useFetchItemSeries';
import useFetchCurrency from '@/hooks/data/useFetchCurrency';
import { formatCurrencyUZS } from '../utils/deviceUtils';

export const useDeviceSeries = ({ branchCodeToNameMap, setSelectedDevices }) => {
  const { mutateAsync: fetchItemSeries } = useFetchItemSeries();
  const { data: currency } = useFetchCurrency();

  const currencyRate =
    currency && currency.Rate !== null && currency.Rate !== undefined
      ? Number(currency.Rate)
      : null;

  const fetchDeviceSeries = useCallback(
    async ({ deviceId, itemCode, whsCode, whsName, deviceCondition }) => {
      if (!deviceId) return;

      const deviceWhsName = whsName || branchCodeToNameMap.get(String(whsCode || '')) || '';

      setSelectedDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, imeiLoading: true, imeiError: null }
            : device
        )
      );

      if (!itemCode || !whsCode) {
        setSelectedDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  imeiLoading: false,
                  imeiOptions: [],
                  imeiValue: '',
                  imeiError: !whsCode
                    ? "Filial tanlanmagani uchun IMEI olinmadi"
                    : 'ItemCode topilmadi',
                }
              : device
          )
        );
        return;
      }

      try {
        const response = await fetchItemSeries({ whsCode, itemCode });
        const seriesItems = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
            ? response
            : response?.data ?? [];

        // Device itemning condition ni ishlatamiz (IMEI seriyadan emas)
        const condition = deviceCondition ?? null;

        const options = seriesItems.map((series) => {
          const imei = series.IMEI ?? series.DistNumber ?? series.SysNumber;

          let priceText = '';
          const purchaseRaw = series.PurchasePrice ?? series.purchasePrice;
          const saleRaw = series.SalePrice ?? series.salePrice;

          const parsePrice = (value) => {
            if (value === null || value === undefined) return null;
            const num =
              typeof value === 'number'
                ? value
                : parseFloat(String(value).replace(',', '.'));
            return Number.isFinite(num) && num > 0 ? num : null;
          };

          const purchaseUSD = parsePrice(purchaseRaw);
          const saleUSD = parsePrice(saleRaw);

          let baseUsd = null;

          if (condition === 'B/U') {
            // B/U uchun faqat PurchasePrice, lekin foizlar bilan
            if (!purchaseUSD) {
              baseUsd = null;
            } else {
              // B/U uchun PurchasePrice ga foizlar qo'shamiz
              let multiplier = 1;
              if (purchaseUSD < 500) {
                multiplier = 1.15; // +15%
              } else if (purchaseUSD >= 500 && purchaseUSD < 1000) {
                multiplier = 1.1; // +10%
              } else if (purchaseUSD >= 1000 && purchaseUSD < 2000) {
                multiplier = 1.05; // +5%
              } else if (purchaseUSD >= 2000) {
                multiplier = 1.03; // +3%
              }
              baseUsd = purchaseUSD * multiplier;
            }
          } else if (condition === 'Yangi' || !condition) {
            // Yangi yoki condition yo'q bo'lsa faqat SalePrice (foizsiz)
            baseUsd = saleUSD;
          }

          let calculatedPriceUZS = null;

          if (baseUsd && currencyRate && Number.isFinite(currencyRate) && currencyRate > 0) {
            const uzs = baseUsd * currencyRate;
            calculatedPriceUZS = uzs;
            priceText = formatCurrencyUZS(uzs);
          } else if (baseUsd) {
            priceText = `${baseUsd} USD`;
          }

          return {
            value: imei,
            label: priceText ? `${imei} - ${priceText}` : imei,
            meta: {
              ...series,
              calculatedPriceUZS,
              calculatedPriceText: priceText || '',
            },
          };
        });

        setSelectedDevices((prev) =>
          prev.map((device) => {
            if (device.id !== deviceId) return device;

            const autoSelectedOption =
              options.length === 1 ? options[0] : null;

            // Agar avtomatik bitta IMEI tanlansa va narx hisoblangan bo'lsa, devicening price ni ham yangilaymiz
            const nextPrice =
              autoSelectedOption?.meta?.calculatedPriceText || device.price;

            return {
              ...device,
              imeiOptions: options,
              imeiValue:
                options.length === 1
                  ? autoSelectedOption.value
                  : device.imeiValue || '',
              imeiLoading: false,
              imeiError: null,
              rawSeries: seriesItems,
              price: nextPrice || device.price,
            };
          })
        );
      } catch (err) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "IMEI ma'lumotini olishda xatolik";
        setSelectedDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  imeiLoading: false,
                  imeiOptions: [],
                  imeiValue: '',
                  imeiError: errorMessage,
                }
              : device
          )
        );
      }
    },
    [fetchItemSeries, branchCodeToNameMap, setSelectedDevices, currencyRate]
  );

  return { fetchDeviceSeries };
};

