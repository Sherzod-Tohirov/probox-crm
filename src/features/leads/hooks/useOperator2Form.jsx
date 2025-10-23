import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';

const OPERATOR2_FIELDS = [
  'answered2',
  'callCount2',
  'meetingDate',
  'rejectionReason2',
  'paymentInterest',
  'branch',
  'meetingHappened'
];

export default function useOperator2Form(leadId, leadData, onSuccess) {
  const form = useForm({
    defaultValues: {
      answered2: leadData?.answered2 || false,
      callCount2: leadData?.callCount2 || '',
      meetingDate: leadData?.meetingDate || '',
      rejectionReason2: leadData?.rejectionReason2 || '',
      paymentInterest: leadData?.paymentInterest || '',
      branch: leadData?.branch || '',
      meetingHappened: leadData?.meetingHappened || false
    }
  });

  const updateMutation = useMutateLead(leadId, {
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Filter only Operator2 fields
    const filteredData = {};
    OPERATOR2_FIELDS.forEach(field => {
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
    error: updateMutation.error
  };
}
