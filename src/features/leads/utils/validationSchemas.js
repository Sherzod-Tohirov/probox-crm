import * as yup from 'yup';

export const addNewLeadFormSchema = yup.object().shape({
  clientName: yup
    .string()
    .required('Ismni kiritish majburiy')
    .test(
      'lead-full-name',
      "Ism va sharifni to'liq kiritishingiz kerak",
      (value) => {
        if (!value) return false;
        const parts = value.trim().split(/\s+/).filter(Boolean);
        return parts.length >= 3;
      }
    ),
});
