import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';

const normalizeNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9,.-]/g, '').replace(/,/g, '.');
    if (!cleaned || cleaned === '-' || cleaned === '.') return null;
    const num = Number(cleaned);
    return Number.isNaN(num) ? null : num;
  }
  return null;
};

const parseNumber = (value) => {
  const normalized = normalizeNumber(value);
  console.log(normalized, 'normalized');
  return normalized === null ? '' : normalized;
};

const parseBoolean = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'null' || normalized === '-') return '';
    if (['true', '1', 'ha', 'yes'].includes(normalized)) return true;
    if (['false', '0', "yo'q", 'no'].includes(normalized)) return false;
  }
  return Boolean(value);
};

const SCORING_FIELDS = [
  'clientFullName',
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
  console.log(leadData, 'lead data');
  const form = useForm({
    defaultValues: {
      clientFullName: leadData?.clientFullName || '',
      birthDate: leadData?.birthDate || '',
      applicationDate: leadData?.applicationDate || '',
      age: parseNumber(leadData?.age),
      score: parseNumber(leadData?.score),
      katm: parseNumber(leadData?.katm),
      katmPayment: parseNumber(leadData?.katmPayment),
      paymentHistory: leadData?.paymentHistory || '',
      mib: parseNumber(leadData?.mib),
      mibIrresponsible:
        leadData?.mibIrresponsible === undefined
          ? ''
          : parseNumber(leadData?.mibIrresponsible),
      aliment: parseNumber(leadData?.aliment),
      officialSalary: parseNumber(leadData?.officialSalary),
      finalLimit: parseNumber(leadData?.finalLimit),
      finalPercentage: parseNumber(leadData?.finalPercentage),
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
    const buildPayload = (values) => {
      const payload = {};

      const numericFields = new Set([
        'age',
        'score',
        'katmPayment',
        'officialSalary',
        'finalLimit',
        'finalPercentage',
        'mib',
        'mibIrresponsible',
        'aliment',
      ]);

      const booleanFields = new Set([]);

      SCORING_FIELDS.forEach((field) => {
        const value = values[field];
        if (value === undefined || value === '') return;

        if (numericFields.has(field)) {
          const normalized = normalizeNumber(value);
          if (normalized !== null) payload[field] = normalized;
          return;
        }

        if (booleanFields.has(field)) {
          const boolVal = parseBoolean(value);
          if (boolVal !== '') payload[field] = boolVal;
          return;
        }

        payload[field] = value;
      });

      return payload;
    };

    const filteredData = buildPayload(data);

    updateMutation.mutate(filteredData);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: updateMutation.isPending,
    error: updateMutation.error,
  };
}
