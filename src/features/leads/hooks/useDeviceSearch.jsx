import { useCallback } from 'react';
import useFetchCurrency from '@/hooks/data/useFetchCurrency';
import useMutateContractTerms from '@/hooks/data/leads/useMutateContractTerms';
import { normalizeContractItems } from '../utils/deviceUtils';

export const useDeviceSearch = ({
  activeWhsCode,
  searchBranchFilter,
  branchCodeToNameMap,
  conditionFilter,
}) => {
  const { mutateAsync: mutateContractTerms } = useMutateContractTerms();
  const { data: currency } = useFetchCurrency();

  const currencyRate = currency?.Rate;

  const handleDeviceSearch = useCallback(
    async (text, page = 1) => {
      const query = text?.trim();

      if (!query) {
        return { data: [], total: 0, totalPages: 0 };
      }

      const effectiveSearchBranchFilter =
        searchBranchFilter || (!activeWhsCode ? 'all' : null);

      if (!effectiveSearchBranchFilter) {
        return { data: [], total: 0, totalPages: 0 };
      }

      const isAllBranches = effectiveSearchBranchFilter === 'all';

      try {
        const params = {
          search: query,
          page,
        };

        if (!isAllBranches && activeWhsCode) {
          params.whsCode = activeWhsCode;
        }

        // condition parametrini faqat 'all' dan boshqa bo'lsa yuboramiz
        if (conditionFilter && conditionFilter !== 'all') {
          params.condition = conditionFilter;
        }

        const response = await mutateContractTerms(params);

        const items = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
            ? response
            : response?.data || [];

        const normalizedItems = normalizeContractItems(
          items,
          branchCodeToNameMap,
          currencyRate
        );

        return {
          data: normalizedItems,
          total: normalizedItems.length,
          totalPages: 1,
        };
      } catch {
        return { data: [], total: 0, totalPages: 0 };
      }
    },
    [
      activeWhsCode,
      searchBranchFilter,
      conditionFilter,
      mutateContractTerms,
      branchCodeToNameMap,
      currencyRate,
    ]
  );

  return { handleDeviceSearch };
};
