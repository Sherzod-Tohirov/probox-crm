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

    const defaultValues = {
      operator: lead?.operator ? String(lead.operator) : '',
      operator2: lead?.operator2 ? String(lead.operator2) : '',
    };

    resetAssignments(defaultValues, {
      keepDirty: false,
    });
  }, [lead, resetAssignments]);

  const operator1Options = useMemo(() => {
    const operator1Executors = executors.filter(
      (executor) => String(executor.U_role) === 'Operator1'
    );
    return selectOptionsCreator(operator1Executors, {
      label: 'SlpName',
      value: 'SlpCode',
      includeEmpty: true,
      isEmptySelectable: true,
    });
  }, [executors]);

  const operator2Options = useMemo(() => {
    const operator2Executors = executors.filter(
      (executor) => String(executor.U_role) === 'Operator2'
    );
    return selectOptionsCreator(operator2Executors, {
      label: 'SlpName',
      value: 'SlpCode',
      includeEmpty: true,
      isEmptySelectable: true,
    });
  }, [executors]);

  const operatorName = useMemo(
    () => findExecutor(executors, lead?.operator)?.SlpName || '-',
    [executors, lead?.operator]
  );

  const operator2Name = useMemo(
    () => findExecutor(executors, lead?.operator2)?.SlpName || '-',
    [executors, lead?.operator2]
  );

  const onSubmit = handleAssignmentsSubmit((values) => {
    const payload = {
      operator: String(values?.operator) || '',
      operator2: String(values?.operator2) || '',
    };
    onSave(payload);
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
                options={operator1Options}
                disabled={!isOperatorManager}
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <FormField
                name="operator2"
                label="Operator 2"
                control={assignmentsControl}
                type="select"
                options={operator2Options}
                disabled={!isOperatorManager}
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <FormField
                name="seller"
                label="Sotuvchi"
                control={null}
                disabled
                defaultValue={findExecutor(executors, lead?.seller)?.SlpName}
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <FormField
                name="scoring"
                label="Scoring"
                control={null}
                disabled
                defaultValue={findExecutor(executors, lead?.scoring)?.SlpName}
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
            defaultValue={operatorName}
          />
          <FormField
            name="operator2"
            label="Operator 2"
            control={null}
            disabled
            span={{ xs: 24, md: 8 }}
            defaultValue={operator2Name}
          />
          <FormField
            name="seller"
            label="Sotuvchi"
            control={null}
            disabled
            span={{ xs: 24, md: 8 }}
            defaultValue={findExecutor(executors, lead?.seller)?.SlpName}
          />
          <FormField
            name="scoring"
            label="Scoring"
            control={null}
            disabled
            span={{ xs: 24, md: 8 }}
            defaultValue={findExecutor(executors, lead?.scoring)?.SlpName}
          />
        </>
      )}
    </FieldGroup>
  );
}
