import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';

const OPERATOR1_FIELDS = [
  'called',
  'callTime',
  'answered',
  'callCount',
  'interested',
  'rejectionReason',
  'passportVisit',
  'jshshir',
  'idX',
];

export default function useOperator1Form(leadId, leadData, onSuccess) {
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
      idX: leadData?.idX || '',
    },
  });

  const updateMutation = useMutateLead(leadId, {
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
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
