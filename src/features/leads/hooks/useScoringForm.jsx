import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';

const SCORING_FIELDS = [
  'employeeName',
  'region',
  'district',
  'address',
  'birthDate',
  'applicationDate',
  'age',
  'score',
  'katm',
  'katmPayment',
  'paymentHistory',
  'mib',
  'mibIrresponsible',
  'aliment',
  'officialSalary',
  'finalLimit',
  'finalPercentage',
];

export default function useScoringForm(leadId, leadData, onSuccess) {
  const form = useForm({
    defaultValues: {
      employeeName: leadData?.employeeName || '',
      region: leadData?.region || '',
      district: leadData?.district || '',
      address: leadData?.address || '',
      birthDate: leadData?.birthDate || '',
      applicationDate: leadData?.applicationDate || '',
      age: leadData?.age || '',
      score: leadData?.score || '',
      katm: leadData?.katm || '',
      katmPayment: leadData?.katmPayment || '',
      paymentHistory: leadData?.paymentHistory || '',
      mib: leadData?.mib || '',
      mibIrresponsible: leadData?.mibIrresponsible || false,
      aliment: leadData?.aliment || '',
      officialSalary: leadData?.officialSalary || '',
      finalLimit: leadData?.finalLimit || '',
      finalPercentage: leadData?.finalPercentage || '',
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
    // Filter only Scoring fields
    const filteredData = {};
    SCORING_FIELDS.forEach((field) => {
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
