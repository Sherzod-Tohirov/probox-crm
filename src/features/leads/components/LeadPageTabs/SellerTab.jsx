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
import InvoicePaymentModal from './SellerTab/InvoicePaymentModal';
import useAuth from '@/hooks/useAuth';
import useInvoice from '@/hooks/data/leads/useInvoice';
import useUploadInvoiceFile from '@/hooks/data/leads/useUploadInvoiceFile';
import { alert } from '@/utils/globalAlert';
import { generateInvoicePdf } from '@/utils/invoicePdf';
import _ from 'lodash';

export default function SellerTab({
  leadId,
  leadData,
  invoiceScoreData,
  canEdit,
  onSuccess,
}) {
  const { form, handleSubmit, isSubmitting, error } = useSellerForm(
    leadId,
    leadData,
    onSuccess
  );
  const { user } = useAuth();
  const isOperatorM = user.U_role === 'OperatorM';
  const isOperator1 = user.U_role === 'Operator1';
  const isOperator2 = user.U_role === 'Operator2';
  const isSellerM = user.U_role === 'SellerM';
  const isCEO = user.U_role === 'CEO';

  let canOperatorEdit = isOperatorM || isOperator1 || isOperator2 || isCEO;

  const { sellerOptions, sellTypeOptions, branchOptions } =
    useSelectOptions('seller');
  const { rejectReasonOptions } = useSelectOptions('common');
  const { control, reset, watch, setValue } = form || {};
  const fieldBranch = watch?.('branch2');
  const searchBranchFilter = watch?.('searchBranchFilter');
  const conditionFilter = watch?.('conditionFilter');
  const calculationTypeFilter = watch?.('calculationTypeFilter');
  const fieldPurchase = watch('purchase');
  const fieldSellType = watch('saleType');
  const { branchCodeToNameMap, activeWhsCode, branchFilterOptions } =
    useBranchFilters({
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
    if (calculationTypeFilter === 'internalLimit') {
      if (!invoiceScoreData?.monthlyLimit) return null;
      const limit = Number(invoiceScoreData.monthlyLimit);
      return Number.isFinite(limit) && limit > 0 ? limit : null;
    }

    if (leadData?.finalLimit === null || leadData?.finalLimit === undefined) {
      return null;
    }
    const limit = Number(leadData.finalLimit);
    return Number.isFinite(limit) && limit > 0 ? limit : null;
  }, [
    leadData?.finalLimit,
    calculationTypeFilter,
    invoiceScoreData?.monthlyLimit,
  ]);

  const finalPercentage = useMemo(() => {
    if (
      leadData?.finalPercentage === null ||
      leadData?.finalPercentage === undefined
    ) {
      return null;
    }
    const percentage = Number(leadData.finalPercentage);
    return Number.isFinite(percentage) && percentage > 0 ? percentage : null;
  }, [leadData?.finalPercentage]);

  const maximumLimit = useMemo(() => {
    if (calculationTypeFilter === 'internalLimit')
      return Number(invoiceScoreData?.monthlyLimit ?? 0);
    if (leadData?.finalLimit === null || leadData?.finalLimit === undefined) {
      return null;
    }
    const limit =
      calculationTypeFilter === 'internalLimit'
        ? Number(invoiceScoreData?.monthlyLimit)
        : Number(leadData.finalLimit);
    return Number.isFinite(limit) && limit > 0 ? limit : null;
  }, [leadData?.finalLimit, calculationTypeFilter, invoiceScoreData]);
  // Disabled holatini aniqlash
  const isRentPeriodDisabled = useMemo(() => {
    // Agar "limit" yoki "internalLimit" tanlangan va maximum limit mavjud bo'lmasa
    if (
      (calculationTypeFilter === 'markup' ||
        calculationTypeFilter === 'internalLimit') &&
      (maximumLimit === null ||
        maximumLimit === undefined ||
        maximumLimit === 0)
    ) {
      return true;
    }
    // Agar "percent" tanlangan va final percentage mavjud bo'lmasa
    if (
      calculationTypeFilter === 'firstPayment' &&
      (finalPercentage === null || finalPercentage === undefined)
    ) {
      return true;
    }
    return false;
  }, [calculationTypeFilter, maximumLimit, finalPercentage]);

  const isFirstPaymentDisabled = useMemo(() => {
    // Agar "limit" yoki "internalLimit" tanlangan va maximum limit mavjud bo'lmasa
    if (
      (calculationTypeFilter === 'markup' ||
        calculationTypeFilter === 'internalLimit') &&
      (maximumLimit === null ||
        maximumLimit === undefined ||
        maximumLimit === 0)
    ) {
      return true;
    }
    // Agar "percent" tanlangan va final percentage mavjud bo'lmasa
    if (
      calculationTypeFilter === 'firstPayment' &&
      (finalPercentage === null || finalPercentage === undefined)
    ) {
      return true;
    }
    return false;
  }, [calculationTypeFilter, maximumLimit, finalPercentage]);

  const {
    selectedDevices,
    setSelectedDevices,
    selectedDeviceData,
    // totalSelectedPrice,
    totalGrandTotal,
    handleImeiSelect,
    handleDeleteDevice,
    handleRentPeriodChange,
    handlePriceChange,
    handleFirstPaymentChange,
    handleFirstPaymentBlur,
  } = useSelectedDevices({
    rentPeriodOptions,
    monthlyLimit,
    conditionFilter,
    calculationTypeFilter: calculationTypeFilter || '',
    finalPercentage: finalPercentage,
    maximumLimit: maximumLimit,
    bypassMinFirstPayment: isSellerM,
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

  // Invoice modal state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Invoice yuborish logikasi
  const { mutateAsync: uploadInvoiceFile } = useUploadInvoiceFile();

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
            await uploadInvoiceFile({
              file: pdfFile,
              leadId,
              docNum: invoiceData.invoiceDocNum,
            });
          }

          // Faqat bitta alert - invoice va PDF muvaffaqiyatli yuborilgandan keyin
          alert('Invoice va PDF fayl muvaffaqiyatli yuborildi!', {
            type: 'success',
          });
        } catch (error) {
          console.error('PDF fayl yaratish yoki yuborishda xatolik:', error);
          const errorMessage =
            error?.message ||
            'PDF fayl yaratish yoki yuborishda xatolik yuz berdi';
          alert(errorMessage, { type: 'error' });
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
  // Majburiy maydonlarni tekshirish
  const requiredAddressFields = [
    'region',
    'district',
    'neighborhood',
    'street',
    'house',
  ];
  const isAddressAvailable = _.every(requiredAddressFields, (key) =>
    _.get(leadData, key)
  );

  // Invoice modalni ochish
  const handleOpenInvoiceModal = useCallback(() => {
    // Manzilni tekshirish
    if (!isAddressAvailable) {
      alert("Invoice yuborishdan oldin manzilni to'liq to'ldirishingiz kerak", {
        type: 'error',
      });
      return;
    }
    // Imzo qo'yilganligini birinchi navbatda tekshirish
    if (!userSignature) {
      alert("Invoice yuborishdan oldin imzo qo'yishingiz kerak", {
        type: 'error',
      });
      return;
    }

    // Mijoz ismini tekshirish (kamida 3 qismdan iborat bo'lishi kerak)
    const names = [leadData?.clientFullName, leadData?.clientName].map((name) =>
      name.trim()
    );
    const nameParts = names.some(
      (name) => name.split(/\s+/).filter(Boolean).length >= 3
    );
    if (!nameParts) {
      alert(
        "Mijoz ismi to'liq to'ldirilishi kerak.\nMisol uchun: Alisherov Alisher Alisher o'g'li",
        {
          type: 'error',
        }
      );
      return;
    }

    // Mijoz statusini tekshirish
    if (['Closed'].includes(leadData?.status)) {
      alert("Mijoz statusi sotuv qilish uchun o'zgartirilishi kerak!", {
        type: 'error',
      });
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

    setIsInvoiceModalOpen(true);
  }, [userSignature, leadId, selectedDevices, isAddressAvailable, leadData]);

  // Invoice modal orqali yuborish
  const handleSendInvoice = useCallback(
    async (paymentData) => {
      if (!leadId) {
        alert('Lead ID topilmadi', { type: 'error' });
        return;
      }

      if (!selectedDevices || selectedDevices.length === 0) {
        alert('Qurilma tanlanmagan', { type: 'error' });
        return;
      }

      // // Validate required lead data
      // if (!leadData?.cardCode) {
      //   alert(
      //     "Mijoz CardCode mavjud emas. Iltimos, mijoz ma'lumotlarini to'ldiring.",
      //     { type: 'error' }
      //   );
      //   return;
      // }

      if (!leadData?.clientPhone) {
        alert('Mijoz telefon raqami mavjud emas', { type: 'error' });
        return;
      }

      if (!leadData?.clientName && !leadData?.clientFullName) {
        alert('Mijoz ismi mavjud emas', { type: 'error' });
        return;
      }

      // Validate devices have required fields
      const invalidDevices = selectedDevices.filter((d) => {
        const hasPrice = d.price && parseInt(d.price) > 0;
        const hasPeriod = d.rentPeriod && parseInt(d.rentPeriod) > 0;
        const hasImei = d.imeiValue;
        return !hasPrice || !hasPeriod || !hasImei;
      });

      if (invalidDevices.length > 0) {
        const missingFields = [];
        invalidDevices.forEach((d) => {
          const missing = [];
          if (!d.price || d.price <= 0) missing.push('narx');
          if (!d.rentPeriod || d.rentPeriod <= 0) missing.push('ijara muddati');
          if (!d.imeiValue) missing.push('IMEI');
          missingFields.push(`${d.name || 'Qurilma'}: ${missing.join(', ')}`);
        });
        alert(
          `Ba'zi qurilmalarda ma'lumotlar to'liq emas:\n${missingFields.join('\n')}`,
          { type: 'error' }
        );
        return;
      }

      try {
        // Payments array'ni formatlash
        const payments = [];
        if (paymentData.cash > 0) {
          payments.push({ type: 'Cash', amount: paymentData.cash });
        }
        if (paymentData.card > 0) {
          payments.push({ type: 'Card', amount: paymentData.card });
        }
        if (paymentData.terminal > 0) {
          payments.push({ type: 'Terminal', amount: paymentData.terminal });
        }
        // useInvoice hook'iga payments array'ni yuborish
        const paymentType = 'all';
        await sendInvoice({
          leadId,
          selectedDevices,
          paymentType,
          calculationTypeFilter,
          internalLimit: invoiceScoreData?.limit,
          payments,
          maximumLimit,
          monthlyLimit,
          finalPercentage,
        });
        setIsInvoiceModalOpen(false);
      } catch (error) {
        // Error already handled in onError callback
        console.error('Invoice send error:', error);
      }
    },
    [
      leadId,
      selectedDevices,
      sendInvoice,
      calculationTypeFilter,
      invoiceScoreData,
      leadData,
      maximumLimit,
      monthlyLimit,
      finalPercentage,
    ]
  );
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
        rejectionReason2: leadData.rejectionReason2,
        purchaseDate: leadData.purchaseDate
          ? moment(leadData.purchaseDate, 'YYYY.MM.DD').format('DD.MM.YYYY')
          : '',
        saleType: leadData.saleType,
        passportId: leadData.passportId,
        jshshir: leadData.jshshir,
        conditionFilter: 'all',
        searchBranchFilter: 'all',
        calculationTypeFilter: 'markup',
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
        disabled={isCEO ? !isCEO : !canEdit}
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
          rejectReasonOptions={rejectReasonOptions}
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
                calculationTypeFilter={calculationTypeFilter}
                internalLimit={invoiceScoreData?.monthlyLimit}
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
                  onPriceChange={handlePriceChange}
                  onFirstPaymentChange={handleFirstPaymentChange}
                  onFirstPaymentBlur={handleFirstPaymentBlur}
                  onDeleteDevice={handleDeleteDevice}
                  totalGrandTotal={totalGrandTotal}
                  isRentPeriodDisabled={isRentPeriodDisabled}
                  isFirstPaymentDisabled={isFirstPaymentDisabled}
                  isSellerM={isSellerM}
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
                  onClick={handleOpenInvoiceModal}
                  isLoading={isSendingInvoice}
                  disabled={
                    isSendingInvoice ||
                    selectedDevices.length === 0 ||
                    !userSignature
                  }
                >
                  Invoice yuborish
                </Button>
              </Col>
            ) : null}

            {/* Invoice Payment Modal */}
            <InvoicePaymentModal
              isOpen={isInvoiceModalOpen}
              onClose={() => setIsInvoiceModalOpen(false)}
              selectedDeviceData={selectedDeviceData}
              onConfirm={handleSendInvoice}
              isLoading={isSendingInvoice}
              leadId={leadId}
              leadData={leadData}
              selectedDevices={selectedDevices}
              calculationTypeFilter={calculationTypeFilter}
            />
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
