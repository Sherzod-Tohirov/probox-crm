import { useEffect } from 'react';
import { Row } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useSellerForm from '../../hooks/useSellerForm.jsx';
import styles from './leadPageTabs.module.scss';
import { useSelectOptions } from '../../hooks/useSelectOptions.jsx';

export default function SellerTab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useSellerForm(
    leadId,
    leadData,
    onSuccess
  );

  const { control, reset, watch } = form || {};

  // Reset form when leadData changes
  const { consultantOptions, sellTypeOptions, branchOptions } =
    useSelectOptions('seller');
  const fieldPurchase = watch('purchase');
  useEffect(() => {
    if (!form) return;
    if (leadData) {
      reset({
        meetingConfirmed: leadData.meetingConfirmed,
        meetingConfirmedDate: leadData.meetingConfirmedDate,
        branch2: leadData?.branch2,
        consultant: leadData.consultant,
        purchase: leadData.purchase,
        purchaseDate: leadData.purchaseDate,
        saleType: leadData.saleType,
        passportId: leadData.passportId,
        jshshir2: leadData.jshshir2,
      });
    }
  }, [leadData, reset]);

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
            name="consultant"
            label="Consultant"
            type="select"
            options={consultantOptions}
            placeholderOption={true}
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>
        {!leadData?.limit && canEdit && (
          <Row className={styles['error-message']}>
            Xaridni tasdiqlash uchun limit mavjud emas
          </Row>
        )}
        <FieldGroup title="Xarid ma'lumotlari">
          <FormField
            name="purchase"
            label="Xarid amalga oshdimi?"
            control={control}
            type="confirm"
            disabled={!canEdit || !leadData?.limit || !leadData?.acceptedReason}
          />
          <FormField
            name="purchaseDate"
            label="Xarid sanasi"
            control={control}
            type="date"
            disabled={!canEdit || !fieldPurchase}
          />
          <FormField
            name="saleType"
            label="Savdo turi"
            type="select"
            options={sellTypeOptions}
            control={control}
            disabled={!canEdit || !fieldPurchase}
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
            name="jshshir2"
            label="JSHSHIR (2)"
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
