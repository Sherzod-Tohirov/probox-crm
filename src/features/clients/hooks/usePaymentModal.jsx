import { useCallback } from "react";
import useMutateClientPayment from "@hooks/data/useMutateClientPayment";

export default function usePaymentModal() {
  const mutation = useMutateClientPayment();
  const onApplyPayment = useCallback((data = {}) => {
    try {
      const normalizedData = {
        CardCode: data.cardCode,
        CashSum: data.sum,
        CashAccount: data.account,
        PaymentInvoices: [],
        DocCurrency: data.currency,
      };
      console.log(data, "data in usePaymentModal");
      console.log(mutation, "mutation in usePaymentModal");
      //  mutation.mutate(normalizedData);
    } catch (error) {
      console.log(error);
    }
    return mutation;
  }, []);

  return { onApplyPayment };
}
