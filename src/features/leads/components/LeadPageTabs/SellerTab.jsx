import { useEffect, useMemo, useCallback, useState } from 'react';
import { Row, Col, Button } from '@components/ui';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useSellerForm from '../../hooks/useSellerForm.jsx';
import styles from './leadPageTabs.module.scss';
import { useSelectOptions } from '../../hooks/useSelectOptions.jsx';
import moment from 'moment';
import { useBranchFilters } from '../../hooks/useBranchFilters';
import { useDeviceSeries } from '../../hooks/useDeviceSeries';
import { useDeviceSearch } from '../../hooks/useDeviceSearch';
import { useSelectedDevices } from '../../hooks/useSelectedDevices';
import { useDeviceSelection } from '../../hooks/useDeviceSelection';
import SellerFormFields from './SellerTab/SellerFormFields';
import DeviceSearchField from './SellerTab/DeviceSearchField';
import SelectedDevicesTable from './SellerTab/SelectedDevicesTable';
import SignatureCanvas from './SellerTab/SignatureCanvas';
import useAuth from '@/hooks/useAuth';
import useInvoice from '@/hooks/data/leads/useInvoice';
import useUploadInvoiceFile from '@/hooks/data/leads/useUploadInvoiceFile';
import { alert } from '@/utils/globalAlert';
import { generateInvoicePdf } from '@/utils/invoicePdf';
import { useWatch } from 'react-hook-form';

export default function SellerTab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useSellerForm(
    leadId,
    leadData,
    onSuccess
  );
  const { user } = useAuth();
  const isOperatorM = user.U_role === 'OperatorM';
  const isOperator1 = user.U_role === 'Operator1';
  const isOperator2 = user.U_role === 'Operator2';
  const isCEO = user.U_role === 'CEO';

  let canOperatorEdit = isOperatorM || isOperator1 || isOperator2 || isCEO;

  const { sellerOptions, sellTypeOptions, branchOptions } =
    useSelectOptions('seller');

  const { control, reset, watch, setValue } = form || {};
  const fieldBranch = watch?.('branch2');
  const searchBranchFilter = watch?.('searchBranchFilter');
  const conditionFilter = watch?.('conditionFilter');
  const calculationTypeFilter = watch?.('calculationTypeFilter');
  const fieldPurchase = watch('purchase');
  const fieldSellType = watch('saleType');

  const {
    branchCodeToNameMap,
    contractWhsCode,
    activeWhsCode,
    branchFilterOptions,
  } = useBranchFilters({
    branchOptions,
    fieldBranch,
    searchBranchFilter,
    leadData,
    form,
    watch,
    setValue,
    leadId,
  });

  const rentPeriodOptions = useMemo(
    () =>
      Array.from({ length: 15 }, (_, index) => {
        const month = index + 1;
        return { value: month, label: String(month) };
      }),
    []
  );

  const monthlyLimit = useMemo(() => {
    // Oylik limit = finalLimit / muddat (agar finalLimit bo'lsa)
    // Yoki finalLimit ni oylik limit sifatida ishlatish
    if (leadData?.finalLimit === null || leadData?.finalLimit === undefined) {
      return null;
    }
    const limit = Number(leadData.finalLimit);
    return Number.isFinite(limit) && limit > 0 ? limit : null;
  }, [leadData?.finalLimit]);

  const finalPercentage = useMemo(() => {
    if (leadData?.finalPercentage === null || leadData?.finalPercentage === undefined) {
      return null;
    }
    const percentage = Number(leadData.finalPercentage);
    return Number.isFinite(percentage) && percentage > 0 ? percentage : null;
  }, [leadData?.finalPercentage]);

  const maximumLimit = useMemo(() => {
    if (leadData?.finalLimit === null || leadData?.finalLimit === undefined) {
      return null;
    }
    const limit = Number(leadData.finalLimit);
    return Number.isFinite(limit) && limit > 0 ? limit : null;
  }, [leadData?.finalLimit]);

  // Disabled holatini aniqlash
  const isRentPeriodDisabled = useMemo(() => {
    // Agar "limit" tanlangan va maximum limit mavjud bo'lmasa
    if (calculationTypeFilter === 'markup' && (maximumLimit === null || maximumLimit === undefined || maximumLimit === 0)) {
      return true;
    }
    // Agar "percent" tanlangan va final percentage mavjud bo'lmasa
    if (calculationTypeFilter === 'firstPayment' && (finalPercentage === null || finalPercentage === undefined)) {
      return true;
    }
    return false;
  }, [calculationTypeFilter, maximumLimit, finalPercentage]);

  const isFirstPaymentDisabled = useMemo(() => {
    // Agar "limit" tanlangan va maximum limit mavjud bo'lmasa
    if (calculationTypeFilter === 'markup' && (maximumLimit === null || maximumLimit === undefined || maximumLimit === 0)) {
      return true;
    }
    // Agar "percent" tanlangan va final percentage mavjud bo'lmasa
    if (calculationTypeFilter === 'firstPayment' && (finalPercentage === null || finalPercentage === undefined)) {
      return true;
    }
    return false;
  }, [calculationTypeFilter, maximumLimit, finalPercentage]);

  const {
    selectedDevices,
    setSelectedDevices,
    selectedDeviceData,
    totalSelectedPrice,
    totalGrandTotal,
    handleImeiSelect,
    handleDeleteDevice,
    handleRentPeriodChange,
    handleFirstPaymentChange,
    handleFirstPaymentBlur,
  } = useSelectedDevices({ 
    rentPeriodOptions, 
    monthlyLimit, 
    conditionFilter,
    calculationTypeFilter: calculationTypeFilter || '',
    finalPercentage: finalPercentage,
    maximumLimit: maximumLimit,
  });

  const { fetchDeviceSeries } = useDeviceSeries({
    branchCodeToNameMap,
    setSelectedDevices,
  });

  const { handleDeviceSearch } = useDeviceSearch({
    activeWhsCode,
    searchBranchFilter,
    branchCodeToNameMap,
    conditionFilter,
  });

  const { handleSelectDevice } = useDeviceSelection({
    activeWhsCode,
    branchFilterOptions,
    setValue,
    setSelectedDevices,
    fetchDeviceSeries,
  });

  // Imzo state'ini saqlash
  const [userSignature, setUserSignature] = useState(null);

  const handleSignatureChange = useCallback((signatureDataUrl) => {
    setUserSignature(signatureDataUrl);
  }, []);

  // Invoice yuborish logikasi
  const { mutateAsync: uploadInvoiceFile } = useUploadInvoiceFile();
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
            currentUser: user || null,
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

  const handleSendInvoice = useCallback(async () => {
    // Imzo qo'yilganligini birinchi navbatda tekshirish
    if (!userSignature) {
      alert('Invoice yuborishdan oldin imzo qo\'yishingiz kerak', { type: 'error' });
      return;
    }

    // To'lov turi tanlanganligini tekshirish
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
      await sendInvoice({ leadId, selectedDevices, paymentType, calculationTypeFilter });
    } catch (error) {
      // Error already handled in onError callback
    }
  }, [userSignature, paymentType, leadId, selectedDevices, sendInvoice, calculationTypeFilter]);

  useEffect(() => {
    if (!form) return;
    if (leadData) {
      reset({
        meetingConfirmed: leadData.meetingConfirmed,
        meetingConfirmedDate: leadData.meetingConfirmedDate
          ? moment(leadData.meetingConfirmedDate, 'YYYY.MM.DD').format(
              'DD.MM.YYYY'
            )
          : '',
        branch2: leadData?.branch2,
        seller: leadData.seller === null ? 'null' : leadData.seller,
        purchase: leadData.purchase,
        purchaseDate: leadData.purchaseDate
          ? moment(leadData.purchaseDate, 'YYYY.MM.DD').format('DD.MM.YYYY')
          : '',
        saleType: leadData.saleType,
        passportId: leadData.passportId,
        jshshir: leadData.jshshir,
        conditionFilter: 'all',
        searchBranchFilter: 'all',
      });
    }
  }, [leadData, reset, form]);

  useEffect(() => {
    if (!form) return;
    if (fieldSellType && fieldPurchase !== null) {
      setValue('purchaseDate', moment().format('DD.MM.YYYY'));
    }
  }, [fieldSellType, setValue, fieldPurchase, form]);

  return (
    <Row direction="column" className={styles['tab-content']}>
      <TabHeader
        title="Sotuvchi Ma'lumotlari"
        onSave={handleSubmit}
        disabled={!canEdit}
        isSubmitting={isSubmitting}
      />

      <form onSubmit={handleSubmit}>
        <SellerFormFields
          control={control}
          canEdit={canEdit}
          leadData={leadData}
          fieldSellType={fieldSellType}
          fieldPurchase={fieldPurchase}
          sellerOptions={sellerOptions}
          sellTypeOptions={sellTypeOptions}
          branchOptions={branchOptions}
        />
      </form>

      <FieldGroup title="Shartnoma ma'lumotlari">
        <Col span={{ xs: 24, md: 24 }} flexGrow fullWidth>
          <Row>
            <Col fullWidth>
              <DeviceSearchField
                canEdit={canOperatorEdit || canEdit}
                selectedDevicesCount={selectedDevices.length}
                leadData={leadData}
                branchFilterOptions={branchFilterOptions}
                control={control}
                onSearch={handleDeviceSearch}
                onSelect={handleSelectDevice}
              />
            </Col>
            {selectedDevices.length > 0 && (
              <Col fullWidth>
                <SelectedDevicesTable
                  selectedDeviceData={selectedDeviceData}
                  selectedDevices={selectedDevices}
                  rentPeriodOptions={rentPeriodOptions}
                  canEdit={canOperatorEdit || canEdit}
                  onImeiSelect={handleImeiSelect}
                  onRentPeriodChange={handleRentPeriodChange}
                  onFirstPaymentChange={handleFirstPaymentChange}
                  onFirstPaymentBlur={handleFirstPaymentBlur}
                  onDeleteDevice={handleDeleteDevice}
                  totalGrandTotal={totalGrandTotal}
                  control={control}
                  isRentPeriodDisabled={isRentPeriodDisabled}
                  isFirstPaymentDisabled={isFirstPaymentDisabled}
                />
              </Col>
            )}

            <Col fullWidth>
              <SignatureCanvas
                canEdit={canOperatorEdit || canEdit}
                onSignatureChange={handleSignatureChange}
              />
            </Col>
            {canOperatorEdit || canEdit ? (
              <Col fullWidth className={styles.mt}>
                <Button
                  variant="filled"
                  onClick={handleSendInvoice}
                  isLoading={isSendingInvoice}
                  disabled={isSendingInvoice || selectedDevices.length === 0 || !userSignature}
                >
                  Invoice yuborish
                </Button>
              </Col>
            ) : null}
          </Row>
        </Col>
      </FieldGroup>

      {error && (
        <Row className={styles['error-message']}>
          Xatolik yuz berdi: {error.message}
        </Row>
      )}
    </Row>
  );
}
