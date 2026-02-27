import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import useAlert from '@/hooks/useAlert';
import { normalizeDate } from '../utils/date';

const OPERATOR1_FIELDS = [
  'called',
  'callTime',
  'answered',
  'noAnswerCount',
  'callCount',
  'interested',
  'rejectionReason',
  'passportVisit',
  'jshshir',
  'passportId',
  'meetingHappened',
  'meetingDate',
  'branch',
];

const JSHSHIR_REGEX = /^\d{14}$/;
const PASSPORT_ID_REGEX = /^[A-Z]{2}\d{7}$/;

export default function useOperator1Form(leadId, leadData, onSuccess) {
  const { alert } = useAlert();
  const form = useForm({
    defaultValues: {
      called: leadData?.called ?? false,
      callTime: leadData?.callTime ?? '',
      answered: leadData?.answered ?? false,
      noAnswerCount: leadData?.noAnswerCount ?? '',
      callCount: leadData?.callCount ?? '',
      interested: leadData?.interested ?? '',
      rejectionReason: leadData?.rejectionReason ?? '',
      passportVisit: leadData?.passportVisit ?? '',
      jshshir: leadData?.jshshir ?? '',
      passportId: leadData?.passportId ?? '',
      meetingHappened: leadData?.meetingHappened ?? false,
      meetingDate: normalizeDate(leadData?.meetingDate),
      branch: leadData?.branch ?? '',
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
    const normalizedJshshir = String(data.jshshir || '').trim();
    const normalizedPassportId = String(data.passportId || '')
      .trim()
      .toUpperCase();

    let hasValidationError = false;

    if (normalizedJshshir && !JSHSHIR_REGEX.test(normalizedJshshir)) {
      form.setError('jshshir', {
        type: 'manual',
        message: 'JSHSHIR 14 ta raqam bo‘lishi kerak',
      });
      hasValidationError = true;
    } else {
      form.clearErrors('jshshir');
    }

    if (normalizedPassportId && !PASSPORT_ID_REGEX.test(normalizedPassportId)) {
      form.setError('passportId', {
        type: 'manual',
        message: 'Passport ID formati AA1234567 bo‘lishi kerak',
      });
      hasValidationError = true;
    } else {
      form.clearErrors('passportId');
    }

    if (hasValidationError) {
      alert("JSHSHIR yoki Passport ID formati noto'g'ri", {
        type: 'error',
      });
      return;
    }

    // Filter only Operator1 fields
    const filteredData = {};
    const numberFields = ['callCount', 'noAnswerCount'];
    OPERATOR1_FIELDS.forEach((field) => {
      if (data[field] !== undefined && data[field] !== '') {
        if (field === 'jshshir') {
          filteredData[field] = normalizedJshshir;
          return;
        }
        if (field === 'passportId') {
          filteredData[field] = normalizedPassportId;
          return;
        }
        if (numberFields.includes(field)) {
          filteredData[field] = Number(data[field]);
          return;
        }
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
