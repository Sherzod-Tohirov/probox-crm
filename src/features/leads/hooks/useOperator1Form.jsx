import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import useAlert from '@/hooks/useAlert';

const OPERATOR1_FIELDS = [
  'called',
  'callTime',
  'answered',
  'callCount',
  'interested',
  'rejectionReason',
  'passportVisit',
  'jshshir',
  'passportId',
];

export default function useOperator1Form(leadId, leadData, onSuccess) {
  const { alert } = useAlert();
  const form = useForm({
    defaultValues: {
      called: leadData?.called || false,
      callTime: leadData?.callTime || '',
      answered: leadData?.answered || false,
      callCount: leadData?.callCount || '',
      interested: leadData?.interested || '',
      rejectionReason: leadData?.rejectionReason || '',
      passportVisit: leadData?.passportVisit || '',
      jshshir: leadData?.jshshir || '',
      passportId: leadData?.passportId || '',
    },
  });

  const updateMutation = useMutateLead(leadId, {
    onSuccess: (data) => {
      alert("Lead ma'lumotlari muvaffaqiyatli yangilandi", { type: 'success' });
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      alert("Lead ma'lumotlarini yangilashda xatolik yuz berdi", { type: 'error' });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Filter only Operator1 fields
    const filteredData = {};
    OPERATOR1_FIELDS.forEach((field) => {
      if (data[field] !== undefined && data[field] !== '') {
        filteredData[field] = data[field];
      }
    });

    updateMutation.mutate(filteredData);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: updateMutation.isPending,
    error: updateMutation.error,
  };
}
