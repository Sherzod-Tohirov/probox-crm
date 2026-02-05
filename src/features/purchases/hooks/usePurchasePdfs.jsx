import useFetchPurchasePdfs from '@/hooks/data/purchases/useFetchPurchasePdfs';
import { useUploadPurchasePdf } from '@/hooks/data/purchases/usePurchaseMutations';
import { useCallback } from 'react';

export default function usePurchasePdfs(docEntry) {
  const { data: pdfs, refetch: refetchPdfs } = useFetchPurchasePdfs({
    docEntry,
    enabled: false,
  });
  const uploadPdfsMutation = useUploadPurchasePdf();

  const checkPdfExists = useCallback(async () => {
    if (!docEntry) return;
    const result = await refetchPdfs();
    console.log(result, 'pdfs');
    return { exists: !!(result?.data?.items?.length > 0), data: result.data };
  }, [docEntry, refetchPdfs]);

  return {
    pdfs,
    refetchPdfs,
    checkPdfExists,
    uploadPdfsMutation,
  };
}
