import { useEffect } from 'react';
import { Row, Col } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useOperator1Form from '../../hooks/useOperator1Form.jsx';
import styles from './leadPageTabs.module.scss';
import useIsMobile from '@/hooks/useIsMobile';
import { useSelectOptions } from '../../hooks/useSelectOptions';
import useFetchBranches from '@/hooks/data/useFetchBranches';
import { normalizeDate } from '../../utils/date';

export default function Operator1Tab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useOperator1Form(
    leadId,
    leadData,
    onSuccess
  );
  const { data: branches } = useFetchBranches();

  const { control, reset } = form || {};
  const isMobile = useIsMobile();
  const { rejectReasonOptions } = useSelectOptions('common');
  const { passportVisitOptions, callCountOptions } =
    useSelectOptions('operator1');
  // Reset form when leadData changes
  useEffect(() => {
    if (!form) return;
    if (leadData) {
      reset({
        called: leadData.called ?? false,
        callTime: leadData.callTime ?? '',
        answered: leadData.answered ?? false,
        noAnswerCount: leadData?.noAnswerCount ?? '',
        callCount: leadData.callCount ?? '',
        interested: leadData.interested ?? '',
        rejectionReason: leadData.rejectionReason ?? '',
        passportVisit: leadData.passportVisit ?? '',
        jshshir: leadData.jshshir ?? '',
        passportId: leadData.passportId ?? '',
        meetingDate: normalizeDate(leadData.meetingDate),
        branch: leadData.branch ?? '',
        meetingHappened: leadData.meetingHappened ?? false,
      });
    }
  }, [leadData, reset, form]);

  const branchOptions = branches?.length
    ? [
        ...(branches?.map((branch) => ({
          value: branch?._id || branch.id,
          label: branch.name,
        })) || []),
      ]
    : [];

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
              <Row direction="row" gutter={isMobile ? 2 : 3} wrap>
                <Col>
                  <FormField
                    name="called"
                    label="Qo'ng'iroq qilindimi?"
                    control={control}
                    type="confirm"
                    disabled={true}
                  />
                </Col>
                <Col>
                  <FormField
                    name="answered"
                    label="Javob berildimi?"
                    control={control}
                    type="confirm"
                    disabled={true}
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
              <Row direction="row" gutter={isMobile ? 2 : 3} wrap>
                <Col>
                  <FormField
                    name="callCount"
                    type="select"
                    label="Umumiy qo'ng'iroqlar soni"
                    control={control}
                    options={callCountOptions}
                    disabled={!canEdit}
                  />
                </Col>
                <Col>
                  <FormField
                    name="noAnswerCount"
                    type="select"
                    label="Javob berilmagan qo'ng'iroqlar soni"
                    control={control}
                    options={callCountOptions}
                    disabled={!canEdit}
                  />
                </Col>
                {/* <Col>
                  <FormField
                    name="interested"
                    label="Qiziqish bildirildimi?"
                    control={control}
                    type="confirm"
                    disabled={!canEdit}
                  />
                </Col> */}
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
            name="jshshir"
            label="JSHSHIR"
            control={control}
            type="jshshir"
            disabled={!canEdit}
          />
          <FormField
            name="passportId"
            label="Passport ID"
            control={control}
            type="passportId"
            disabled={!canEdit}
          />
        </FieldGroup>
        <FieldGroup title="Uchrashuv ma'lumotlari">
          <FormField
            name="meetingDate"
            label="Uchrashuv sanasi"
            control={control}
            type="datetime"
            disabled={!canEdit}
          />
          <FormField
            name="branch"
            label="Filial"
            type="select"
            options={branchOptions}
            control={control}
            placeholderOption={true}
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
      </form>

      {error && (
        <Row className={styles['error-message']}>
          Xatolik yuz berdi: {error.message}
        </Row>
      )}
    </Row>
  );
}
