import { useEffect } from 'react';
import { Row } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useSellerForm from '../../hooks/useSellerForm.jsx';
import styles from './leadPageTabs.module.scss';

export default function SellerTab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useSellerForm(
    leadId,
    leadData,
    onSuccess
  );
  
  const { control, reset } = form || {};

  // Reset form when leadData changes
  useEffect(() => {
    if (!form) return;
    if (leadData) {
      reset({
        meetingConfirmed: leadData.meetingConfirmed || false,
        meetingConfirmedDate: leadData.meetingConfirmedDate || '',
        consultant: leadData.consultant || '',
        purchase: leadData.purchase || false,
        purchaseDate: leadData.purchaseDate || '',
        saleType: leadData.saleType || '',
        passportId: leadData.passportId || '',
        jshshir2: leadData.jshshir2 || '',
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
            type="boolean"
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
            name="consultant"
            label="Maslahatchi"
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="Xarid ma'lumotlari">
          <FormField
            name="purchase"
            label="Xarid amalga oshdimi?"
            control={control}
            type="boolean"
            disabled={!canEdit}
          />
          <FormField
            name="purchaseDate"
            label="Xarid sanasi"
            control={control}
            type="date"
            disabled={!canEdit}
          />
          <FormField
            name="saleType"
            label="Savdo turi"
            control={control}
            disabled={!canEdit}
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
