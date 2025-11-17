import { Col, Table } from '@components/ui';
import styles from '../leadPageTabs.module.scss';
import { formatCurrencyUZS } from '../../../utils/deviceUtils';
import { useSelectedDevicesColumns } from './useSelectedDevicesColumns';

export default function SelectedDevicesTable({
  selectedDeviceData,
  rentPeriodOptions,
  canEdit,
  onImeiSelect,
  onRentPeriodChange,
  onFirstPaymentChange,
  onDeleteDevice,
  totalGrandTotal,
}) {
  const selectedDeviceColumns = useSelectedDevicesColumns({
    rentPeriodOptions,
    canEdit,
    onImeiSelect,
    onRentPeriodChange,
    onFirstPaymentChange,
    onDeleteDevice,
  });

  if (!selectedDeviceData.length) return null;

  return (
    <>
      <Col direction="column" fullWidth>
        <span className={styles['selected-device-table-label']}>
          Tanlangan qurilmalar
        </span>
        <Table
          id="selected-device-table"
          data={selectedDeviceData}
          columns={selectedDeviceColumns}
          containerHeight="auto"
          scrollable={false}
          uniqueKey="id"
          onRowClick={() => {}}
          getRowStyles={() => ({
            cursor: 'default',
          })}
        />
      </Col>
      <Col>
        <div className={styles['selected-device-table-total-price']}>
          Jami to'lov: {formatCurrencyUZS(totalGrandTotal)}
        </div>
      </Col>
    </>
  );
}
