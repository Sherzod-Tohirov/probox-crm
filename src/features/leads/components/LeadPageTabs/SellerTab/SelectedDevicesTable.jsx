import { Row, Col, Table } from '@components/ui';
import styles from '../leadPageTabs.module.scss';
import { formatCurrencyUZS, PAYMENT_INTEREST_OPTIONS } from '../../../utils/deviceUtils';
import { useSelectedDevicesColumns } from './useSelectedDevicesColumns';
import FormField from '../../LeadPageForm/FormField';
import { useWatch } from 'react-hook-form';

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
  control,
}) {
  const selectedDeviceColumns = useSelectedDevicesColumns({
    rentPeriodOptions,
    canEdit,
    onImeiSelect,
    onRentPeriodChange,
    onFirstPaymentChange,
    onFirstPaymentBlur,
    onDeleteDevice,
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

          {canEdit && (
            <Col className='mb-2'>
              <FormField
                label="To'lov turi"
                type="select"
                options={PAYMENT_INTEREST_OPTIONS}
                name="invoicePaymentType"
                disabled={!canEdit}
                control={control}
              />
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
}
