import { useMemo } from 'react';
import { Input, Button } from '@components/ui';
import styles from '../leadPageTabs.module.scss';
import {
  formatNumberWithSeparators,
  getMarkupPercentage,
} from '../../../utils/deviceUtils';

export const useSelectedDevicesColumns = ({
  rentPeriodOptions,
  canEdit,
  onImeiSelect,
  onRentPeriodChange,
  onFirstPaymentChange,
  onFirstPaymentBlur,
  onDeleteDevice,
  isRentPeriodDisabled = false,
  isFirstPaymentDisabled = false,
}) => {
  const rentPeriodOptionsWithPct = useMemo(() => {
    if (!Array.isArray(rentPeriodOptions)) return [];

    return rentPeriodOptions.map((opt) => {
      const valueNum = Number(opt?.value);

      // 0 yoki noto‘g‘ri value bo‘lsa, label’ni o‘zgartirmaymiz
      if (!Number.isFinite(valueNum) || valueNum <= 0) return opt;

      // const pct = Math.round(getMarkupPercentage(valueNum) * 100);

      return {
        ...opt,
        label: `${valueNum}`,
      };
    });
  }, [rentPeriodOptions]);

  return useMemo(
    () => [
      {
        key: 'order',
        title: 'T/r',
        horizontal: 'start',
        width: '4%',
        renderCell: (_, rowIndex) => <span>{rowIndex + 1}</span>,
      },
      {
        key: 'name',
        title: 'Model',
        horizontal: 'start',
        width: '18%',
      },
      {
        key: 'imei',
        title: 'IMEI/SN',
        horizontal: 'start',
        width: '18%',
        renderCell: (row) => {
          if (row.imeiLoading) {
            return (
              <span className={styles['selected-device-imei']}>
                IMEI yuklanmoqda...
              </span>
            );
          }

          if (row.imeiError) {
            return (
              <span className={styles['selected-device-imei-error']}>
                {row.imeiError}
              </span>
            );
          }

          if (!row?.imeiOptions?.length) {
            return (
              <span className={styles['selected-device-imei']}>
                IMEI topilmadi
              </span>
            );
          }

          if (row.imeiOptions.length === 1) {
            const singleOption = row.imeiOptions[0];
            return (
              <div className={styles['selected-device-imei-wrapper']}>
                <span className={styles['selected-device-imei']}>
                  {singleOption.label ?? singleOption.value}
                </span>
              </div>
            );
          }

          return (
            <div className={styles['selected-device-imei-wrapper']}>
              <Input
                type="select"
                options={row.imeiOptions}
                value={row.imeiValue || ''}
                placeholderOption={{ value: '', label: 'IMEI tanlang' }}
                onChange={(value) => onImeiSelect(row.id, value)}
                disabled={!canEdit}
                width="100%"
                variant="outlined"
                hasIcon={true}
              />
            </div>
          );
        },
      },
      {
        key: 'price',
        title: 'Narx',
        horizontal: 'start',
        width: '10%',
        renderCell: (row) => (
          <span className={styles['selected-device-price']}>
            {row.price ? row.price : "0 so'm"}
          </span>
        ),
      },
      {
        key: 'rentPeriod',
        title: 'Ijara oyi',
        horizontal: 'start',
        width: '12%',
        renderCell: (row) => {
          // Agar disabled bo'lsa va rentPeriod 0 bo'lsa, 0 ni ko'rsatamiz
          const isDisabled = !canEdit || isRentPeriodDisabled;
          const value =
            isRentPeriodDisabled && row.rentPeriod === 0
              ? 0
              : (row.rentPeriod ??
                rentPeriodOptionsWithPct[0]?.value ??
                undefined);

          // Agar disabled bo'lsa va value 0 bo'lsa, maxsus options yaratamiz
          const options =
            isRentPeriodDisabled && value === 0
              ? rentPeriodOptionsWithPct.some((o) => Number(o?.value) === 0)
                ? rentPeriodOptionsWithPct
                : [{ value: 0, label: '0' }, ...rentPeriodOptionsWithPct]
              : rentPeriodOptionsWithPct;

          return (
            <Input
              type="select"
              options={options}
              value={value}
              onChange={(nextValue) => onRentPeriodChange(row.id, nextValue)}
              disabled={isDisabled}
              width="100%"
              variant="outlined"
              hasIcon={true}
            />
          );
        },
      },
      {
        key: 'firstPayment',
        title: 'Birinchi tolov',
        horizontal: 'start',
        width: '15%',
        renderCell: (row) => (
          <Input
            type="text"
            value={formatNumberWithSeparators(row.firstPayment)}
            width="100%"
            variant="outlined"
            inputMode="numeric"
            onChange={(event) => {
              const newValue = event?.target?.value ?? '';
              onFirstPaymentChange(row.id, newValue);
            }}
            onBlur={() => {
              if (onFirstPaymentBlur) {
                onFirstPaymentBlur(row.id);
              }
            }}
            hasIcon={false}
            disabled={!canEdit || isFirstPaymentDisabled}
          />
        ),
      },
      {
        key: 'monthlyPayment',
        title: 'Oylik tolov',
        horizontal: 'start',
        width: '12%',
        renderCell: (row) => (
          <span className={styles['selected-device-price']}>
            {row.monthlyPayment}
          </span>
        ),
      },
      {
        key: 'totalPayment',
        title: "Jami to'lov",
        horizontal: 'start',
        width: '12%',
        renderCell: (row) => (
          <span className={styles['selected-device-price']}>
            {row.totalPayment || ''}
          </span>
        ),
      },
      {
        key: 'actions',
        title: '',
        horizontal: 'center',
        width: '5%',
        renderCell: (row) => (
          <Button
            type="button"
            variant="outlined"
            onClick={() => onDeleteDevice(row.id)}
            disabled={!canEdit}
          >
            ×
          </Button>
        ),
      },
    ],
    [
      canEdit,
      onDeleteDevice,
      onFirstPaymentChange,
      onFirstPaymentBlur,
      onImeiSelect,
      onRentPeriodChange,
      rentPeriodOptions,
      isRentPeriodDisabled,
      isFirstPaymentDisabled,
    ]
  );
};
