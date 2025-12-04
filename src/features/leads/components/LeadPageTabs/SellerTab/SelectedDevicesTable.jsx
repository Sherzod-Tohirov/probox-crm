import { Row, Col, Table, Button } from '@components/ui';
import styles from '../leadPageTabs.module.scss';
import { formatCurrencyUZS, PAYMENT_INTEREST_OPTIONS } from '../../../utils/deviceUtils';
import { useSelectedDevicesColumns } from './useSelectedDevicesColumns';
import useInvoice from '@/hooks/data/leads/useInvoice';
import useUploadInvoiceFile from '@/hooks/data/leads/useUploadInvoiceFile';
import { alert } from '@/utils/globalAlert';
import { generateInvoicePdf } from '@/utils/invoicePdf';
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
  leadId,
  userSignature,
  currentUser,
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

  const { mutateAsync: uploadInvoiceFile, isPending: isUploadingInvoice } = useUploadInvoiceFile();

  // To'lov turini kuzatish
  const paymentType = useWatch({ control, name: 'invoicePaymentType' });

  const { mutateAsync: sendInvoice, isPending: isSendingInvoice } = useInvoice({
    onSuccess: async (invoiceData) => {
      // PDF fayl yaratish, yuklab olish va serverga yuborish
      if (invoiceData && leadId) {
        try {
          // Imzoni va user ma'lumotlarini invoiceData ga qo'shamiz (faqat PDF uchun, backendga yuborilmaydi)
          const pdfFile = await generateInvoicePdf({
            ...invoiceData,
            userSignature: userSignature || null,
            currentUser: currentUser || null,
          });
          
          // PDF faylni serverga yuborish
          if (pdfFile) {
            await uploadInvoiceFile({ file: pdfFile, leadId });
          }
          
          // Faqat bitta alert - invoice va PDF muvaffaqiyatli yuborilgandan keyin
          alert('Invoice va PDF fayl muvaffaqiyatli yuborildi!', { type: 'success' });
        } catch (error) {
          alert('PDF fayl yaratish yoki yuborishda xatolik yuz berdi', { type: 'error' });
        }
      } else {
        alert('Invoice muvaffaqiyatli yuborildi!', { type: 'success' });
      }
    },
    onError: (error) => {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        'Invoice yuborishda xatolik yuz berdi';
      alert(errorMessage, { type: 'error' });
    },
  });

  const handleSendInvoice = async () => {
    // To'lov turi tanlanganligini birinchi navbatda tekshirish
    if (!paymentType || paymentType === '' || paymentType === 'all') {
      alert('To\'lov turini tanlang', { type: 'error' });
      return;
    }

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
      await sendInvoice({ leadId, selectedDevices, paymentType });
    } catch (error) {
      // Error already handled in onError callback
    }
  };

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
            <>
              <Col>
                <FormField
                  label="To'lov turi"
                  type="select"
                  options={PAYMENT_INTEREST_OPTIONS.filter(opt => opt.value !== '')}
                  name="invoicePaymentType"
                  disabled={!canEdit}
                  control={control}
                />
              </Col>
              <Col>
                <Button
                  variant="filled"
                  onClick={handleSendInvoice}
                  isLoading={isSendingInvoice}
                  disabled={isSendingInvoice || selectedDevices.length === 0}
                >
                  Invoice yuborish
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Col>
    </Row>
  );
}
