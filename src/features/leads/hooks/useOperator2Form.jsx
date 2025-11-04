import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import moment from 'moment';

const OPERATOR2_FIELDS = [
  'answered2',
  'callCount2',
  'meetingDate',
  'rejectionReason2',
  'paymentInterest',
  'branch',
  'meetingHappened',
];

export default function useOperator2Form(leadId, leadData, onSuccess) {
  const form = useForm({
    defaultValues: {
      answered2: leadData?.answered2 || false,
      callCount2: leadData?.callCount2 || '',
      meetingDate: (() => {
        if (!leadData?.meetingDate) return '';
        const strict = moment(
          leadData.meetingDate,
          ['DD.MM.YYYY HH:mm', 'YYYY.MM.DD HH:mm', 'DD.MM.YYYY'],
          true
        );
        if (strict.isValid()) return strict.format('DD.MM.YYYY HH:mm');
        const loose = moment(leadData.meetingDate);
        return loose.isValid() ? loose.format('DD.MM.YYYY HH:mm') : '';
      })(),
      rejectionReason2: leadData?.rejectionReason2 || '',
      paymentInterest: leadData?.paymentInterest || '',
      branch: leadData?.branch || '',
      meetingHappened: leadData?.meetingHappened || false,
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
    console.log(data, 'form data');
    // Filter only Operator2 fields
    const filteredData = {};
    OPERATOR2_FIELDS.forEach((field) => {
      if (data[field] !== undefined && data[field] !== '') {
        if (field === 'meetingDate') {
          const raw = (data[field] ?? '').toString().trim();
          if (raw) {
            const strict = moment(
              raw,
              ['DD.MM.YYYY HH:mm', 'YYYY.MM.DD HH:mm', 'DD.MM.YYYY'],
              true
            );
            if (strict.isValid()) {
              filteredData[field] = strict.format('YYYY.MM.DD HH:mm');
            } else {
              const loose = moment(raw);
              if (loose.isValid()) {
                filteredData[field] = loose.format('YYYY.MM.DD HH:mm');
              }
              // else: omit meetingDate when invalid
            }
          }
        } else {
          filteredData[field] = data[field];
        }
      }
    });
    console.log(filteredData, 'filteredData');

    updateMutation.mutate(filteredData);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: updateMutation.isPending,
    error: updateMutation.error,
  };
}
