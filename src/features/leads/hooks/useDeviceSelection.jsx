import { useCallback } from 'react';
import { DEFAULT_RENT_PERIOD } from '../utils/deviceUtils';
import { resolveItemCode } from '../utils/deviceUtils';

export const useDeviceSelection = ({
  activeWhsCode,
  branchFilterOptions,
  setValue,
  setSelectedDevices,
  fetchDeviceSeries,
}) => {
  const handleSelectDevice = useCallback(
    (item) => {
      const deviceId = item.id ?? item.name;
      const itemCode = resolveItemCode(item);
      const itemWhsCode = item?.whsCode || item?.raw?.WhsCode || activeWhsCode;
      const itemWhsName = item?.whsName || item?.raw?.WhsName || '';
      let wasAdded = false;

      setSelectedDevices((prev) => {
        const exists = prev.some((device) => device.id === deviceId);
        if (exists) {
          return prev;
        }
        wasAdded = true;
        return [
          ...prev,
          {
            ...item,
            id: deviceId,
            rentPeriod: DEFAULT_RENT_PERIOD,
            firstPayment: '',
            imeiOptions: [],
            imeiValue: '',
            imeiLoading: true,
            imeiError: null,
            whsCode: itemWhsCode,
            whsName: itemWhsName,
          },
        ];
      });

      if (wasAdded && itemWhsCode && branchFilterOptions?.length && setValue) {
        const hasItemWhsCode = branchFilterOptions.some(
          (opt) => String(opt.value) === String(itemWhsCode)
        );
        if (hasItemWhsCode) {
          setValue('searchBranchFilter', itemWhsCode);
        }

        fetchDeviceSeries({
          deviceId,
          itemCode,
          whsCode: itemWhsCode,
          whsName: itemWhsName,
        });
      } else if (wasAdded && itemWhsCode) {
        fetchDeviceSeries({
          deviceId,
          itemCode,
          whsCode: itemWhsCode,
          whsName: itemWhsName,
        });
      }
    },
    [
      activeWhsCode,
      fetchDeviceSeries,
      branchFilterOptions,
      setValue,
      setSelectedDevices,
    ]
  );

  return { handleSelectDevice };
};

