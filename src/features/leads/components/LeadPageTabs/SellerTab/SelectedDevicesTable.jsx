import { Col, Table, Button } from '@components/ui';
import styles from '../leadPageTabs.module.scss';
import { formatCurrencyUZS } from '../../../utils/deviceUtils';
import { useSelectedDevicesColumns } from './useSelectedDevicesColumns';
import useInvoice from '@/hooks/data/leads/useInvoice';
import { alert } from '@/utils/globalAlert';

export default function SelectedDevicesTable({
  selectedDeviceData,
  selectedDevices,
  rentPeriodOptions,
  canEdit,
  onImeiSelect,
  onRentPeriodChange,
  onFirstPaymentChange,
  onDeleteDevice,
  totalGrandTotal,
  leadId,
}) {
  const selectedDeviceColumns = useSelectedDevicesColumns({
    rentPeriodOptions,
    canEdit,
    onImeiSelect,
    onRentPeriodChange,
    onFirstPaymentChange,
    onDeleteDevice,
  });

  const { mutateAsync: sendInvoice, isPending: isSendingInvoice } = useInvoice({
    onSuccess: () => {
      alert('Invoice muvaffaqiyatli yuborildi!', { type: 'success' });
    },
    onError: (error) => {
      const errorMessage = error?.message || error?.response?.data?.message || 'Invoice yuborishda xatolik yuz berdi';
      alert(errorMessage, { type: 'error' });
    },
  });

  const handleSendInvoice = async () => {
    if (!leadId) {
      alert('Lead ID topilmadi', { type: 'error' });
      return;
    }

    if (!selectedDevices || selectedDevices.length === 0) {
      alert('Qurilma tanlanmagan', { type: 'error' });
      return;
    }

    // IMEI tanlanganligini tekshirish
    const devicesWithoutImei = selectedDevices.filter(
      (device) => !device.imeiValue || device.imeiValue === ''
    );

    if (devicesWithoutImei.length > 0) {
      alert('Barcha qurilmalar uchun IMEI tanlanishi kerak', { type: 'error' });
      return;
    }

    try {
      await sendInvoice({ leadId, selectedDevices });
    } catch (error) {
      // Error already handled in onError callback
      console.error('Invoice yuborishda xatolik:', error);
    }
  };

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
      <Col direction="column" gap={2}>
        <div className={styles['selected-device-table-total-price']}>
          Jami to'lov: {formatCurrencyUZS(totalGrandTotal)}
        </div>
        {canEdit && (
          <Button
            variant="filled"
            onClick={handleSendInvoice}
            isLoading={isSendingInvoice}
            disabled={isSendingInvoice || selectedDevices.length === 0}
          >
            Invoice yuborish
          </Button>
        )}
      </Col>
    </>
  );
}
