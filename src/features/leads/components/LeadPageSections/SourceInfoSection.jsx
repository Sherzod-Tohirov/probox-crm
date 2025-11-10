import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';
import { Globe } from '@/assets/images/icons/Icons';

export default function SourceInfoSection({ lead }) {
  return (
    <FieldGroup title="Asosiy ma'lumotlar">
      <FormField
        name="source"
        label="Manba"
        control={null}
        disabled={true}
        span={{ xs: 24, md: 8 }}
        prefix={<Globe />}
        defaultValue={lead?.source}
      />
      <FormField
        name="time"
        label="Yozilgan vaqt"
        control={null}
        disabled={true}
        span={{ xs: 24, md: 24 }}
        defaultValue={lead?.time}
      />
    </FieldGroup>
  );
}
