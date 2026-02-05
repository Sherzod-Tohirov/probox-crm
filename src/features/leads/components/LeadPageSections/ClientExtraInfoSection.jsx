import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Row, Col, Button } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';
import { formatUZPhone } from '@/utils/formatPhoneNumber';

export default function ClientExtraInfoSection({ lead, onSave }) {
  const clientsExtraInfoForm = useForm({
    defaultValues: {
      clientPhone: formatUZPhone(lead?.clientPhone || ''),
      clientPhone2: formatUZPhone(lead?.clientPhone2 || ''),
      clientFullName: lead?.clientFullName || '',
    },
  });

  const {
    control: clientInfoExtraControl,
    handleSubmit: handleclientInfoExtraSubmit,
    reset: resetClientInfoExtra,
  } = clientsExtraInfoForm;

  const isclientInfoExtraDirty = clientsExtraInfoForm.formState.isDirty;

  useEffect(() => {
    if (!lead) return;
    resetClientInfoExtra({
      clientPhone: formatUZPhone(lead?.clientPhone || ''),
      clientPhone2: formatUZPhone(lead?.clientPhone2 || ''),
      clientFullName: lead?.clientFullName || '',
    });
  }, [lead, resetClientInfoExtra]);

  const onSubmit = handleclientInfoExtraSubmit((values) => {
    const payload = {
      clientFullName: values?.clientFullName ?? '',
      clientPhone: values?.clientPhone ?? '',
      clientPhone2: values?.clientPhone2 ?? '',
    };
    onSave(payload);
  });
  return (
    <FieldGroup title="Mijozning qo'shimcha ma'lumotlari">
      <form onSubmit={onSubmit} style={{ width: '100%' }}>
        <Row gutter={4}>
          {' '}
          <Col>
            {' '}
            <Row direction="row" gutter={2} wrap>
              <Col>
                <FormField
                  type="text"
                  name="clientFullName"
                  label="Mijoz F.I.O"
                  control={clientInfoExtraControl}
                />
              </Col>
              <Col>
                <FormField
                  type="tel"
                  name="clientPhone"
                  label="Telefon"
                  control={clientInfoExtraControl}
                />
              </Col>
              <Col>
                <FormField
                  type="tel"
                  name="clientPhone2"
                  label="Telefon 2"
                  control={clientInfoExtraControl}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row gutter={2}>
              <Col>
                <Button
                  variant="filled"
                  type="submit"
                  disabled={!isclientInfoExtraDirty}
                >
                  Qo'shimcha ma'lumotlarni saqlash
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </form>
    </FieldGroup>
  );
}
