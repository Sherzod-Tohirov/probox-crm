import { useEffect } from 'react';
import { Row } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useOperator2Form from '../../hooks/useOperator2Form.jsx';
import styles from './leadPageTabs.module.scss';

export default function Operator2Tab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useOperator2Form(
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
        answered2: leadData.answered2 || false,
        callCount2: leadData.callCount2 || '',
        meetingDate: leadData.meetingDate || '',
        rejectionReason2: leadData.rejectionReason2 || '',
        paymentInterest: leadData.paymentInterest || '',
        branch: leadData.branch || '',
        meetingHappened: leadData.meetingHappened || false,
      });
    }
  }, [leadData, reset]);

  return (
    <Row direction="column" className={styles['tab-content']}>
      <TabHeader
        title="Operator2 Ma'lumotlari"
        onSave={handleSubmit}
        disabled={!canEdit}
        isSubmitting={isSubmitting}
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup title="Qo'ng'iroq ma'lumotlari">
          <FormField
            name="answered2"
            label="Javob oldimi?"
            control={control}
            type="boolean"
            disabled={!canEdit}
          />
          <FormField
            name="callCount2"
            label="Qo'ng'iroqlar soni"
            control={control}
            type="number"
            disabled={!canEdit}
          />
          <FormField
            name="rejectionReason2"
            label="Ikkinchi rad sababi"
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="Uchrashuv ma'lumotlari">
          <FormField
            name="meetingDate"
            label="Uchrashuv sanasi"
            control={control}
            type="date"
            disabled={!canEdit}
          />
          <FormField
            name="branch"
            label="Filial"
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="meetingHappened"
            label="Uchrashuv bo'ldimi?"
            control={control}
            type="boolean"
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="To'lov ma'lumotlari">
          <FormField
            name="paymentInterest"
            label="To'lov turi"
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
