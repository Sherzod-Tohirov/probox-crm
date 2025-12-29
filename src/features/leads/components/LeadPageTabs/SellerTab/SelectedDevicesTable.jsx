import { Row, Col, Table } from '@components/ui';
import styles from '../leadPageTabs.module.scss';
import { formatCurrencyUZS } from '../../../utils/deviceUtils';
import { useSelectedDevicesColumns } from './useSelectedDevicesColumns';

export default function SelectedDevicesTable({
  selectedDeviceData,
  selectedDevices,
  rentPeriodOptions,
  canEdit,
  onImeiSelect,
  onRentPeriodChange,
  onFirstPaymentChange,
  onFirstPaymentBlur,
  onDeleteDevice,
  totalGrandTotal,
  isRentPeriodDisabled = false,
  isFirstPaymentDisabled = false,
}) {
  const selectedDeviceColumns = useSelectedDevicesColumns({
    rentPeriodOptions,
    canEdit,
    onImeiSelect,
    onRentPeriodChange,
    onFirstPaymentChange,
    onFirstPaymentBlur,
    onDeleteDevice,
    isRentPeriodDisabled,
    isFirstPaymentDisabled,
  });

  if (!selectedDeviceData.length) return null;

  return (
    <Row>
      <Col direction="column" fullWidth>
        <span className={styles['selected-device-table-label']}>
          Tanlangan qurilmalar
        </span>
        <Table
          id="selected-device-table"
          data={selectedDeviceData}
          columns={selectedDeviceColumns}
          scrollHeight="auto"
          scrollable={true}
          uniqueKey="id"
          onRowClick={() => {}}
          getRowStyles={() => ({
            cursor: 'default',
          })}
        />
      </Col>
      <Col justify={'end'} gap={2}>
        <Row>
          <Col>
            {' '}
            <div className={styles['selected-device-table-total-price']}>
              Jami to'lov: {formatCurrencyUZS(totalGrandTotal)}
            </div>
          </Col>

        </Row>
      </Col>
    </Row>
  );
}
