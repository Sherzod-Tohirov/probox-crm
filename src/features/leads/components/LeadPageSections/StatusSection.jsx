import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Row, Col, Button } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';
import { statusOptions } from '@/features/leads/utils/options';
import FollowUpModal from '@/features/leads/components/modals/FollowUpModal';

const RECALL_MODAL_CONFIG = {
  FollowUp: {
    title: 'Qayta aloqa sanasini belgilang',
    label: 'Qayta aloqa sanasi va vaqti',
  },
  WillVisitStore: {
    title: "Do'konga borish sanasi belgilash",
    label: "Do'konga borish sanasi va vaqti",
  },
};

export default function StatusSection({ lead, canEdit, onSave }) {
  const [recallModalStatus, setRecallModalStatus] = useState(null);

  const statusForm = useForm({
    defaultValues: {
      status: lead?.status || '',
    },
  });

  const {
    control: statusControl,
    handleSubmit: handleStatusSubmit,
    reset: resetStatus,
  } = statusForm;

  const isStatusDirty = statusForm.formState.isDirty;

  useEffect(() => {
    if (!lead) return;
    resetStatus({
      status: lead?.status || '',
    });
  }, [lead, resetStatus]);

  const onSubmit = handleStatusSubmit((values) => {
    if (RECALL_MODAL_CONFIG[values?.status]) {
      setRecallModalStatus(values.status);
      return;
    }

    const payload = {
      status: values?.status ?? '',
    };
    onSave(payload);
  });

  const handleRecallConfirm = (recallDate) => {
    const payload = {
      status: recallModalStatus,
      recallDate,
    };
    onSave(payload);
    setRecallModalStatus(null);
  };

  const handleRecallClose = () => {
    setRecallModalStatus(null);
    resetStatus({ status: lead?.status || '' });
  };

  const modalConfig = RECALL_MODAL_CONFIG[recallModalStatus] || {};

  return (
    <FieldGroup title="Status ma'lumotlari">
      <form onSubmit={onSubmit} style={{ width: '100%' }}>
        <Row gutter={4}>
          <Col>
            <FormField
              name="status"
              label="Status"
              type="select"
              control={statusControl}
              disabled={!canEdit}
              span={{ xs: 24, md: 12 }}
              placeholderOption={true}
              options={statusOptions}
              defaultValue={lead?.status}
            />
          </Col>
          <Col>
            {canEdit && (
              <Row>
                <Col>
                  <Button
                    disabled={!isStatusDirty}
                    variant="filled"
                    type="submit"
                  >
                    Statusni saqlash
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </form>
      <FollowUpModal
        isOpen={!!recallModalStatus}
        onClose={handleRecallClose}
        onConfirm={handleRecallConfirm}
        title={modalConfig.title}
        label={modalConfig.label}
        defaultValue={lead?.recallDate || ''}
      />
    </FieldGroup>
  );
}
