import { useQuery } from '@tanstack/react-query';
import { getInvoiceScore } from '@services/invoiceService';

export default function useFetchInvoiceScore(options = {}) {
  const { CardCode, enabled = true } = options;

  return useQuery({
    queryKey: ['invoiceScore', CardCode],
    queryFn: () => getInvoiceScore({ CardCode }),
    enabled: Boolean(enabled && CardCode),
  });
}


