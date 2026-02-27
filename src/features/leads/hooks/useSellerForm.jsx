import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import useAlert from '@/hooks/useAlert';
import moment from 'moment';

const SELLER_FIELDS = [
  'meetingConfirmed',
  'meetingConfirmedDate',
  'consultant',
  'purchase',
  'purchaseDate',
  'branch2',
  'seller',
  'saleType',
  'passportId',
  'jshshir',
  'rejectionReason2',
];

const JSHSHIR_REGEX = /^\d{14}$/;
const PASSPORT_ID_REGEX = /^[A-Z]{2}\d{7}$/;

export default function useSellerForm(leadId, leadData, onSuccess) {
  const { alert } = useAlert();
  const form = useForm({
    defaultValues: {
      meetingConfirmed: leadData?.meetingConfirmed || false,
      meetingConfirmedDate: leadData?.meetingConfirmedDate
        ? moment(leadData?.meetingConfirmedDate, 'YYYY.MM.DD').format(
            'DD.MM.YYYY'
          )
        : '',
      consultant: leadData?.consultant || '',
      purchase: leadData?.purchase || false,
      rejectionReason2: leadData.rejectionReason2 || '',
      purchaseDate: leadData?.purchaseDate
        ? moment(leadData?.purchaseDate, 'YYYY.MM.DD').format('DD.MM.YYYY')
        : '',
      saleType: leadData?.saleType || '',
      passportId: leadData?.passportId || '',
      jshshir: leadData?.jshshir || '',
      conditionFilter: 'all',
      searchBranchFilter: 'all',
      calculationTypeFilter: 'markup',
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

    // Filter only Seller fields
    const filteredData = {};
    SELLER_FIELDS.forEach((field) => {
      if (data[field] !== undefined && data[field] !== '') {
        if (field === 'jshshir') {
          filteredData[field] = normalizedJshshir;
          return;
        }
        if (field === 'passportId') {
          filteredData[field] = normalizedPassportId;
          return;
        }
        if (field === 'meetingConfirmedDate' || field === 'purchaseDate') {
          filteredData[field] = moment(data[field], 'DD.MM.YYYY').format(
            'YYYY.MM.DD'
          );
          return;
        }
        if (field === 'seller' || field === 'branch2') {
          if (data[field] === 'null') {
            filteredData[field] = null;
            return;
          }
          filteredData[field] = String(data[field]);
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
