import { useMemo } from 'react';
import { Input, Button } from '@components/ui';
import styles from '../leadPageTabs.module.scss';
import { formatNumberWithSeparators } from '../../../utils/deviceUtils';

export const useSelectedDevicesColumns = ({
  rentPeriodOptions,
  canEdit,
  onImeiSelect,
  onRentPeriodChange,
  onFirstPaymentChange,
  onDeleteDevice,
}) => {
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
            {row.price ? row.price : '0 so\'m'}
          </span>
        ),
      },
      {
        key: 'rentPeriod',
        title: 'Ijara oyi',
        horizontal: 'start',
        width: '12%',
        renderCell: (row) => {
          const value =
            row.rentPeriod ?? rentPeriodOptions[0]?.value ?? undefined;
          return (
            <Input
              type="select"
              options={rentPeriodOptions}
              value={value}
              onChange={(nextValue) => onRentPeriodChange(row.id, nextValue)}
              disabled={!canEdit}
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
            onChange={(event) =>
              onFirstPaymentChange(row.id, event?.target?.value ?? '')
            }
            hasIcon={false}
            disabled={!canEdit}
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
        title: 'Jami to\'lov',
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
      onImeiSelect,
      onRentPeriodChange,
      rentPeriodOptions,
    ]
  );
};

