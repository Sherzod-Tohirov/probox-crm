import { useForm } from 'react-hook-form';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
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
  'jshshir2',
];

export default function useSellerForm(leadId, leadData, onSuccess) {
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
      purchaseDate: leadData?.purchaseDate
        ? moment(leadData?.purchaseDate, 'YYYY.MM.DD').format('DD.MM.YYYY')
        : '',
      saleType: leadData?.saleType || '',
      passportId: leadData?.passportId || '',
      jshshir2: leadData?.jshshir2 || '',
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
    // Filter only Seller fields
    const filteredData = {};
    SELLER_FIELDS.forEach((field) => {
      if (data[field] !== undefined && data[field] !== '') {
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
