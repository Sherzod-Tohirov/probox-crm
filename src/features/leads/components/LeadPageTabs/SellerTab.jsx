import { useEffect, useMemo, useCallback } from 'react';
import { Row, Col } from '@components/ui';
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

  let canOperatorEdit = isOperatorM || isOperator1 || isOperator2;

  const { sellerOptions, sellTypeOptions, branchOptions } =
    useSelectOptions('seller');

  const { control, reset, watch, setValue } = form || {};
  const fieldBranch = watch?.('branch2');
  const searchBranchFilter = watch?.('searchBranchFilter');
  const conditionFilter = watch?.('conditionFilter');
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
  } = useSelectedDevices({ rentPeriodOptions, monthlyLimit, conditionFilter });

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
            <DeviceSearchField
              canEdit={ canOperatorEdit || canEdit}
              selectedDevicesCount={selectedDevices.length}
              leadData={leadData}
              branchFilterOptions={branchFilterOptions}
                    control={control}
                  onSearch={handleDeviceSearch}
                  onSelect={handleSelectDevice}
                />

            {selectedDevices.length > 0 && (
              <SelectedDevicesTable
                selectedDeviceData={selectedDeviceData}
                selectedDevices={selectedDevices}
                rentPeriodOptions={rentPeriodOptions}
                canEdit={canOperatorEdit || canEdit}
                onImeiSelect={handleImeiSelect}
                onRentPeriodChange={handleRentPeriodChange}
                onFirstPaymentChange={handleFirstPaymentChange}
                onDeleteDevice={handleDeleteDevice}
                totalGrandTotal={totalGrandTotal}
                leadId={leadId}
              />
            )}

            <SignatureCanvas canEdit={canOperatorEdit || canEdit} />
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
