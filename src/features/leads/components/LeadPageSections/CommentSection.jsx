import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Row, Col, Button } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';

export default function CommentSection({ lead, onSave }) {
  const commentsForm = useForm({
    defaultValues: {
      comment: lead?.comment || '',
    },
  });

  const {
    control: commentsControl,
    handleSubmit: handleCommentsSubmit,
    reset: resetComments,
  } = commentsForm;

  const isCommentsDirty = commentsForm.formState.isDirty;

  useEffect(() => {
    if (!lead) return;
    resetComments({
      comment: lead?.comment || '',
    });
  }, [lead, resetComments]);

  const onSubmit = handleCommentsSubmit((values) => {
    const payload = {
      comment: values?.comment ?? '',
    };
    onSave(payload);
  });

  return (
    <FieldGroup title="Izoh">
      <form onSubmit={onSubmit} style={{ width: '100%' }}>
        <Row direction="row" gutter={2} wrap>
          <Col span={{ xs: 24, md: 24 }}>
            <FormField
              name="comment"
              label="Izoh qoldirish"
              control={commentsControl}
              type="textarea"
              span={{ xs: 24, md: 24 }}
            />
          </Col>
        </Row>
        <Row gutter={2} style={{ marginTop: '8px' }}>
          <Col>
            <Button variant="filled" type="submit" disabled={!isCommentsDirty}>
              Izohni saqlash
            </Button>
          </Col>
        </Row>
      </form>
    </FieldGroup>
  );
}
