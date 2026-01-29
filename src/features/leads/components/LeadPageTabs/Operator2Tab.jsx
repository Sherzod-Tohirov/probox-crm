import { useEffect } from 'react';
import moment from 'moment';
import { Row } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useOperator2Form from '../../hooks/useOperator2Form.jsx';
import styles from './leadPageTabs.module.scss';
import { useSelectOptions } from '../../hooks/useSelectOptions';

export default function Operator2Tab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useOperator2Form(
    leadId,
    leadData,
    onSuccess
  );

  const { control, reset } = form || {};
  const { rejectReasonOptions } = useSelectOptions('common');
  const { callCountOptions } = useSelectOptions('operator2');

  // Reset form when leadData changes
  useEffect(() => {
    if (!form) return;
    if (leadData) {
      const meetingDate = (() => {
        if (!leadData.meetingDate) return '';
        const strict = moment(
          leadData.meetingDate,
          ['DD.MM.YYYY HH:mm', 'YYYY.MM.DD HH:mm', 'DD.MM.YYYY'],
          true
        );
        if (strict.isValid()) return strict.format('DD.MM.YYYY HH:mm');
        const loose = moment(leadData.meetingDate);
        return loose.isValid() ? loose.format('DD.MM.YYYY HH:mm') : '';
      })();
      reset({
        called2: leadData.called2,
        answered2: leadData.answered2,
        callCount2: leadData.callCount2 || '',
        meetingDate,
        rejectionReason2: leadData.rejectionReason2 || '',
        paymentInterest: leadData.paymentInterest || '',
        branch: leadData.branch || '',
        meetingHappened: leadData.meetingHappened,
      });
    }
  }, [leadData, reset, form]);

  const paymentInterestOptions = [
    { value: 'trade', label: 'Trade-in' },
    { value: 'nasiya', label: 'Nasiya' },
    { value: 'naqd', label: 'Naqd' },
  ];

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
            name="called2"
            label="Qo'ng'iroq qilindimi?"
            control={control}
            type="confirm"
            disabled={!canEdit}
          />
          <FormField
            name="answered2"
            label="Javob berildimi?"
            control={control}
            type="confirm"
            disabled={!canEdit}
          />
          <FormField
            name="callCount2"
            label="Qo'ng'iroqlar soni"
            control={control}
            type="select"
            options={callCountOptions}
            disabled={!canEdit}
          />
          <FormField
            name="rejectionReason2"
            label="Ikkinchi rad sababi"
            control={control}
            type="select"
            options={rejectReasonOptions}
            placeholderOption={true}
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="To'lov ma'lumotlari">
          <FormField
            name="paymentInterest"
            label="To'lov turi"
            control={control}
            type="select"
            options={paymentInterestOptions}
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
