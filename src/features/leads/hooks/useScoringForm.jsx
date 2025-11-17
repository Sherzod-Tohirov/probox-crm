import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import useAlert from '@/hooks/useAlert';
import moment from 'moment';
import formatterCurrency from '@/utils/formatterCurrency';
import {
  normalizeNumber,
  parseNumber,
  parseBoolean,
} from '@/features/leads/utils/helpers';

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
  'acceptedReason',
];

export default function useScoringForm(leadId, leadData, onSuccess) {
  const { alert } = useAlert();
  const formatCurrencyValue = (value) => {
    const num = normalizeNumber(value);
    if (num === null) return '';
    return formatterCurrency(num);
  };

  const form = useForm({
    defaultValues: {
      clientFullName: leadData?.clientFullName || '',
      birthDate: leadData?.birthDate
        ? moment(leadData.birthDate, 'YYYY.MM.DD', true).format('DD.MM.YYYY')
        : '',
      applicationDate: leadData?.applicationDate
        ? moment(leadData.applicationDate, 'YYYY.MM.DD', true).format(
            'DD.MM.YYYY'
          )
        : '',
      age: parseNumber(leadData?.age),
      score: parseNumber(leadData?.score),
      katm: parseNumber(leadData?.katm),
      katmPayment: formatCurrencyValue(leadData?.katmPayment),
      paymentHistory: leadData?.paymentHistory || '',
      mib: formatCurrencyValue(leadData?.mib),
      mibIrresponsible:
        leadData?.mibIrresponsible === undefined
          ? ''
          : parseNumber(leadData?.mibIrresponsible),
      aliment: formatCurrencyValue(leadData?.aliment),
      officialSalary: formatCurrencyValue(leadData?.officialSalary),
      finalLimit: formatCurrencyValue(leadData?.finalLimit),
      finalPercentage: parseNumber(leadData?.finalPercentage),
      acceptedReason: leadData?.acceptedReason || '',
    },
  });

  const updateMutation = useMutateLead(leadId, {
    onSuccess: (data) => {
      alert("Lead ma'lumotlari muvaffaqiyatli yangilandi", { type: 'success' });
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      alert("Lead ma'lumotlarini yangilashda xatolik yuz berdi", {
        type: 'error',
      });
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

        if (field === 'birthDate' || field === 'applicationDate') {
          const date = moment(value, 'DD.MM.YYYY', true);
          if (date.isValid()) payload[field] = date.format('YYYY.MM.DD');
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
