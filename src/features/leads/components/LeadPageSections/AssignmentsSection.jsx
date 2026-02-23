import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { Row, Col, Button } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';
import selectOptionsCreator from '@/utils/selectOptionsCreator';
import { findExecutor } from '@/utils/findExecutorById';

export default function AssignmentsSection({
  lead,
  executors,
  isOperatorManager,
  onSave,
}) {
  const assignmentsForm = useForm({
    defaultValues: {
      operator: lead?.operator ? String(lead.operator) : '',
      operator2: lead?.operator2 ? String(lead.operator2) : '',
      scoring: lead?.scoring ? String(lead?.scoring) : '',
    },
  });

  const {
    control: assignmentsControl,
    handleSubmit: handleAssignmentsSubmit,
    reset: resetAssignments,
  } = assignmentsForm;

  const isAssignmentsDirty = assignmentsForm.formState.isDirty;

  useEffect(() => {
    if (!lead) return;
    resetAssignments(
      {
        operator: lead.operator ? String(lead.operator) : '',
        operator2: lead.operator2 ? String(lead.operator2) : '',
        scoring: lead.scoring ? String(lead.scoring) : '',
      },
      { keepDirty: false }
    );
  }, [lead, resetAssignments]);

  const roleOptions = useMemo(() => {
    const byRole = (role) =>
      selectOptionsCreator(
        executors.filter((e) => String(e.U_role) === role),
        {
          label: 'SlpName',
          value: 'SlpCode',
          includeEmpty: true,
          isEmptySelectable: true,
        }
      );
    return {
      operator1: byRole('Operator1'),
      operator2: byRole('Operator2'),
      scoring: byRole('Scoring'),
    };
  }, [executors]);

  const executorName = (id) => findExecutor(executors, id)?.SlpName || '-';

  const onSubmit = handleAssignmentsSubmit((values) => {
    onSave({
      operator: values.operator ? String(values.operator) : '',
      operator2: values.operator2 ? String(values.operator2) : '',
      scoring: values.scoring ? String(values.scoring) : '',
    });
  });

  return (
    <FieldGroup title="Biriktirilgan xodimlar">
      {isOperatorManager ? (
        <form onSubmit={onSubmit} style={{ width: '100%' }}>
          <Row direction="row" gutter={2} wrap>
            <Col span={{ xs: 24, md: 8 }}>
              <FormField
                name="operator"
                label="Operator 1"
                control={assignmentsControl}
                type="select"
                options={roleOptions.operator1}
                disabled={!isOperatorManager}
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <FormField
                name="operator2"
                label="Operator 2"
                control={assignmentsControl}
                type="select"
                options={roleOptions.operator2}
                disabled={!isOperatorManager}
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <FormField
                name="seller"
                label="Sotuvchi"
                control={null}
                type="select"
                disabled
                defaultValue={findExecutor(executors, lead?.seller)?.SlpName}
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <FormField
                name="scoring"
                label="Scoring"
                control={assignmentsControl}
                type="select"
                options={roleOptions.scoring}
              />
            </Col>
          </Row>
          <Row gutter={2} style={{ marginTop: '16px' }}>
            <Col>
              <Button
                variant="filled"
                type="submit"
                disabled={!isAssignmentsDirty}
              >
                Biriktirishlarni saqlash
              </Button>
            </Col>
          </Row>
        </form>
      ) : (
        <>
          <FormField
            name="operator"
            label="Operator 1"
            control={null}
            disabled
            span={{ xs: 24, md: 8 }}
            defaultValue={executorName(lead?.operator)}
          />
          <FormField
            name="operator2"
            label="Operator 2"
            control={null}
            disabled
            span={{ xs: 24, md: 8 }}
            defaultValue={executorName(lead?.operator2)}
          />
          <FormField
            name="seller"
            label="Sotuvchi"
            control={null}
            disabled
            span={{ xs: 24, md: 8 }}
            defaultValue={executorName(lead?.seller)}
          />
          <FormField
            name="scoring"
            label="Scoring"
            control={null}
            disabled
            span={{ xs: 24, md: 8 }}
            defaultValue={executorName(lead?.scoring)}
          />
        </>
      )}
    </FieldGroup>
  );
}
