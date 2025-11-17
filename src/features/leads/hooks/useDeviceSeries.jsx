import { useCallback } from 'react';
import useFetchItemSeries from '@/hooks/data/leads/useFetchItemSeries';

export const useDeviceSeries = ({ branchCodeToNameMap, setSelectedDevices }) => {
  const { mutateAsync: fetchItemSeries } = useFetchItemSeries();

  const fetchDeviceSeries = useCallback(
    async ({ deviceId, itemCode, whsCode, whsName }) => {
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

        const options = seriesItems.map((series) => {
          return {
            value: series.DistNumber,
            label: series.DistNumber,
            meta: series,
          };
        });

        setSelectedDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  imeiOptions: options,
                  imeiValue:
                    options.length === 1
                      ? options[0].value
                      : device.imeiValue || '',
                  imeiLoading: false,
                  imeiError: null,
                  rawSeries: seriesItems,
                }
              : device
          )
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
    [fetchItemSeries, branchCodeToNameMap, setSelectedDevices]
  );

  return { fetchDeviceSeries };
};

