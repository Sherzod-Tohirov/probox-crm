import { useCallback } from 'react';
import useMutateContractTerms from '@/hooks/data/leads/useMutateContractTerms';
import { normalizeContractItems, DEFAULT_CONTRACT_CONDITION } from '../utils/deviceUtils';

export const useDeviceSearch = ({
  activeWhsCode,
  searchBranchFilter,
  branchCodeToNameMap,
}) => {
  const { mutateAsync: mutateContractTerms } = useMutateContractTerms();

  const handleDeviceSearch = useCallback(
    async (text, page = 1) => {
      const query = text?.trim();

      if (!query) {
        return { data: [], total: 0, totalPages: 0 };
      }

      const effectiveSearchBranchFilter = searchBranchFilter || (!activeWhsCode ? 'all' : null);

      if (!effectiveSearchBranchFilter) {
        return { data: [], total: 0, totalPages: 0 };
      }

      const isAllBranches = effectiveSearchBranchFilter === 'all';

      try {
        const params = {
          search: query,
          condition: DEFAULT_CONTRACT_CONDITION,
          page,
        };

        if (!isAllBranches && activeWhsCode) {
          params.whsCode = activeWhsCode;
        }

        const response = await mutateContractTerms(params);

        const items = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
            ? response
            : response?.data || [];

        const normalizedItems = normalizeContractItems(items, branchCodeToNameMap);

        return {
          data: normalizedItems,
          total: normalizedItems.length,
          totalPages: 1,
        };
      } catch (err) {
        return { data: [], total: 0, totalPages: 0 };
      }
    },
    [activeWhsCode, searchBranchFilter, mutateContractTerms, branchCodeToNameMap]
  );

  return { handleDeviceSearch };
};

