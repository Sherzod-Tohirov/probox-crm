import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Row, Col, Button } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';

const blockedOptions = [
  { value: 'false', label: 'Ochiq' },
  { value: 'true', label: 'Bloklangan' },
];

export default function BlockedStatusSection({ lead, canEdit, onSave }) {
  const blockedForm = useForm({
    defaultValues: {
      isBlocked: lead?.isBlocked ? 'true' : 'false',
    },
  });

  const {
    control: blockedControl,
    handleSubmit: handleBlockedSubmit,
    reset: resetBlocked,
  } = blockedForm;

  const isBlockedDirty = blockedForm.formState.isDirty;

  useEffect(() => {
    if (!lead) return;
    resetBlocked({
      isBlocked: lead?.isBlocked ? 'true' : 'false',
    });
  }, [lead, resetBlocked]);

  const onSubmit = handleBlockedSubmit((values) => {
    const payload = {
      isBlocked: values?.isBlocked === 'true',
    };
    onSave(payload);
  });

  return (
    <FieldGroup title="Bloklash holati">
      <form onSubmit={onSubmit} style={{ width: '100%' }}>
        <Row gutter={4}>
          <Col>
            <FormField
              name="isBlocked"
              label="Holat"
              type="select"
              control={blockedControl}
              disabled={!canEdit}
              span={{ xs: 24, md: 12 }}
              placeholderOption={false}
              options={blockedOptions}
              defaultValue={lead?.isBlocked ? 'true' : 'false'}
            />
          </Col>
          <Col>
            {canEdit && (
              <Row>
                <Col>
                  <Button
                    disabled={!isBlockedDirty}
                    variant="filled"
                    type="submit"
                  >
                    Holatni saqlash
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
