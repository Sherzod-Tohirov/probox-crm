import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { Row, Col, Button } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';

const regionOptions = [
  { value: 'Toshkent shahar', label: 'Toshkent shahar' },
  { value: 'Toshkent', label: 'Toshkent viloyati' },
  { value: "Farg'ona", label: "Farg'ona viloyati" },
  { value: 'Namangan', label: 'Namangan viloyati' },
  { value: 'Andijon', label: 'Andijon viloyati' },
  { value: 'Sirdaryo', label: 'Sirdaryo viloyati' },
  { value: 'Jizzax', label: 'Jizzax viloyati' },
  { value: 'Samarqand', label: 'Samarqand viloyati' },
  { value: 'Qashqadaryo', label: 'Qashqadaryo viloyati' },
  { value: 'Surxondaryo', label: 'Surxondaryo viloyati' },
  { value: 'Navoiy', label: 'Navoiy viloyati' },
  { value: 'Buxoro', label: 'Buxoro viloyati' },
  { value: 'Xorazm', label: 'Xorazm viloyati' },
  { value: "Qoraqalpog'iston", label: "Qoraqalpog'iston viloyati" },
];

export default function AddressSection({ lead, canEdit, onSave, isPending }) {
  const defaultValues = useMemo(
    () => ({
      region: lead?.region ?? '',
      district: lead?.district ?? '',
      street: lead?.street ?? '',
      neighborhood: lead?.neighborhood ?? '',
      house: lead?.house ?? '',
      address2: lead?.address2 ?? '',
    }),
    [lead]
  );

  const addressForm = useForm({
    defaultValues,
  });

  const {
    control: addressControl,
    handleSubmit: handleAddressSubmit,
    reset: resetAddress,
  } = addressForm;

  useEffect(() => {
    if (!lead) return;
    resetAddress(defaultValues);
  }, [lead, resetAddress, defaultValues]);

  const onSubmit = handleAddressSubmit((values) => {
    const payload = {
      region: values?.region ?? '',
      district: values?.district ?? '',
      street: values?.street ?? '',
      neighborhood: values?.neighborhood ?? '',
      house: values?.house ?? '',
      address2: values.address2 ?? '',
    };
    onSave(payload);
  });

  return (
    <FieldGroup title="Manzil ma'lumotlari">
      <FormField
        name="region"
        label="Viloyat"
        control={addressControl}
        type="select"
        options={regionOptions}
        placeholderOption={true}
        disabled={!canEdit}
      />
      <FormField
        name="district"
        label="Tuman"
        control={addressControl}
        disabled={!canEdit}
      />
      <FormField
        name="neighborhood"
        label="Mahalla"
        control={addressControl}
        disabled={!canEdit}
      />
      <FormField
        name="street"
        label="Ko'cha"
        control={addressControl}
        disabled={!canEdit}
      />
      <FormField
        name="house"
        label="Uy"
        control={addressControl}
        disabled={!canEdit}
      />
      <FormField
        name="address2"
        label="Qo'shimcha manzil"
        control={addressControl}
        disabled={!canEdit}
      />
      <Row gutter={2} style={{ marginTop: '8px' }}>
        <Col>
          <Button
            variant="filled"
            onClick={onSubmit}
            disabled={!canEdit || isPending}
          >
            Manzilni saqlash
          </Button>
        </Col>
      </Row>
    </FieldGroup>
  );
}
