import { useEffect } from 'react';
import { Row, Col } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useOperator1Form from '../../hooks/useOperator1Form.jsx';
import styles from './leadPageTabs.module.scss';
import useIsMobile from '@/hooks/useIsMobile';
import { useSelectOptions } from '../../hooks/useSelectOptions';

export default function Operator1Tab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useOperator1Form(
    leadId,
    leadData,
    onSuccess
  );

  const { control, reset, watch } = form || {};
  const isMobile = useIsMobile();
  const { rejectReasonOptions } = useSelectOptions('common');
  const { passportVisitOptions } = useSelectOptions('operator1');
  const fieldAnswered = watch('answered');
  // Reset form when leadData changes
  useEffect(() => {
    if (!form) return;
    if (leadData) {
      reset({
        called: leadData.called,
        callTime: leadData.callTime,
        answered: leadData.answered,
        callCount: leadData.callCount,
        interested: leadData.interested,
        rejectionReason: leadData.rejectionReason,
        passportVisit: leadData.passportVisit,
        jshshir: leadData.jshshir,
        idX: leadData.idX,
      });
    }
  }, [leadData, reset]);

  return (
    <Row direction="column" className={styles['tab-content']}>
      <TabHeader
        title="Operator1 Ma'lumotlari"
        onSave={handleSubmit}
        disabled={!canEdit}
        isSubmitting={isSubmitting}
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup title="Qo'ng'iroq ma'lumotlari">
          <Row gutter={isMobile ? 2 : 6}>
            <Col>
              <Row direction={'row'} gutter={isMobile ? 2 : 3} wrap>
                <Col>
                  <FormField
                    name="called"
                    label="Qo'ng'iroq qilindimi?"
                    control={control}
                    type="boolean"
                    disabled={!canEdit}
                  />
                </Col>
                <Col>
                  <FormField
                    name="answered"
                    label="Javob berildimi?"
                    control={control}
                    type="confirm"
                    disabled={!canEdit}
                  />
                </Col>
                <Col>
                  <FormField
                    name="callTime"
                    label="Qo'ng'iroq vaqti"
                    control={control}
                    type="datetime"
                    disabled
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row direction={'row'} gutter={isMobile ? 2 : 3} wrap>
                <Col>
                  <FormField
                    name="callCount"
                    label="Qo'ng'iroqlar soni"
                    control={control}
                    type="number"
                    disabled={!canEdit}
                  />
                </Col>
                <Col>
                  <FormField
                    name="interested"
                    label="Qiziqish bildirildimi?"
                    control={control}
                    type="confirm"
                    disabled={!canEdit}
                  />
                </Col>
                <Col>
                  <FormField
                    name="rejectionReason"
                    label="Rad etish sababi"
                    control={control}
                    type="select"
                    options={rejectReasonOptions}
                    placeholderOption={true}
                    disabled={!canEdit}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </FieldGroup>
        <FieldGroup title="Shaxsiy hujjatlar">
          <FormField
            name="passportVisit"
            label="Pasport/Tashrif"
            control={control}
            type="select"
            options={passportVisitOptions}
            disabled={!canEdit}
          />
          <FormField
            name="jshshir"
            label="JSHSHIR"
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="idX"
            label="ID X"
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
