import { useEffect } from 'react';
import { Row } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useSellerForm from '../../hooks/useSellerForm.jsx';
import styles from './leadPageTabs.module.scss';
import { useSelectOptions } from '../../hooks/useSelectOptions.jsx';
import moment from 'moment';

export default function SellerTab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useSellerForm(
    leadId,
    leadData,
    onSuccess
  );

  const { control, reset, watch, setValue } = form || {};

  // Reset form when leadData changes
  const { sellerOptions, sellTypeOptions, branchOptions } =
    useSelectOptions('seller');

  const fieldPurchase = watch('purchase');
  const fieldSellType = watch('saleType');

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
      });
    }
  }, [leadData, reset]);

  useEffect(() => {
    if (!form) return;
    if (fieldSellType && fieldPurchase !== null) {
      setValue('purchaseDate', moment().format('DD.MM.YYYY'));
    }
  }, [fieldSellType, setValue, fieldPurchase]);

  return (
    <Row direction="column" className={styles['tab-content']}>
      <TabHeader
        title="Sotuvchi Ma'lumotlari"
        onSave={handleSubmit}
        disabled={!canEdit}
        isSubmitting={isSubmitting}
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup title="Uchrashuv ma'lumotlari">
          <FormField
            name="meetingConfirmed"
            label="Uchrashuv tasdiqlandi"
            control={control}
            type="confirm"
            disabled={!canEdit}
          />
          <FormField
            name="meetingConfirmedDate"
            label="Tasdiqlangan sana"
            control={control}
            type="date"
            disabled={!canEdit}
          />
          <FormField
            name="branch2"
            label="Filial"
            control={control}
            type="select"
            options={branchOptions}
            placeholderOption={true}
            disabled={!canEdit}
          />
          <FormField
            name="seller"
            label="Sotuvchi"
            type="select"
            options={sellerOptions}
            placeholderOption={{ value: 'null', label: '-' }}
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>
        {!leadData?.finalLimit && fieldSellType === 'nasiya' && canEdit && (
          <Row className={styles['error-message']}>
            Xaridni tasdiqlash uchun limit mavjud emas
          </Row>
        )}
        <FieldGroup title="Xarid ma'lumotlari">
          <FormField
            name="saleType"
            label="Savdo turi"
            type="select"
            options={sellTypeOptions}
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="purchase"
            label="Xarid amalga oshdimi?"
            control={control}
            type={
              !leadData.finalLimit && fieldSellType === 'nasiya'
                ? 'confirmOnlyFalse'
                : 'confirm'
            }
            disabled={!canEdit}
          />
          <FormField
            name="purchaseDate"
            label="Xarid sanasi"
            control={control}
            type="date"
            disabled={!canEdit || fieldPurchase !== 'true'}
          />
        </FieldGroup>

        <FieldGroup title="Hujjat ma'lumotlari">
          <FormField
            name="passportId"
            label="Pasport ID"
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="jshshir"
            label="JSHSHIR"
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>
      </form>

      {error && (
        <Row className={styles['error-message']}>
          Xatolik yuz berdi: {error.message}
        </Row>
      )}
    </Row>
  );
}
