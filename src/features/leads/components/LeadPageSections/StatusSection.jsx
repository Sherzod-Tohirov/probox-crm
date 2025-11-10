import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Row, Col, Button } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';
import { statusOptions } from '@/features/leads/utils/options';

export default function StatusSection({ lead, canEdit, onSave }) {
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
    const payload = {
      status: values?.status ?? '',
    };
    onSave(payload);
  });

  return (
    <FieldGroup title={"Status ma'lumotlari"}>
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
    </FieldGroup>
  );
}
