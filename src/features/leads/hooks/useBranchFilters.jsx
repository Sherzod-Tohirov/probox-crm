import { useMemo, useEffect, useRef } from 'react';

export const useBranchFilters = ({
  branchOptions,
  fieldBranch,
  searchBranchFilter,
  leadData,
  form,
  watch,
  setValue,
  leadId,
}) => {
  const branchCodeMap = useMemo(() => {
    if (!branchOptions?.length) return new Map();
    return branchOptions.reduce((map, option) => {
      const key = String(option.value ?? '');
      if (!key) return map;
      map.set(key, option.code ?? key);
      return map;
    }, new Map());
  }, [branchOptions]);

  const branchCodeToNameMap = useMemo(() => {
    if (!branchOptions?.length) return new Map();
    return branchOptions.reduce((map, option) => {
      const code = String(option.code ?? option.value ?? '');
      const name = option.label || option.name || '';
      if (code && name) {
        map.set(code, name);
      }
      return map;
    }, new Map());
  }, [branchOptions]);

  const branchFilterInitializedRef = useRef(false);
  const contractWhsCodeRef = useRef('');

  const normalizedBranchValue =
    fieldBranch && fieldBranch !== 'null' ? fieldBranch : '';
  const normalizedLeadBranch =
    leadData?.branch2 && leadData.branch2 !== 'null' ? leadData.branch2 : '';
  const selectedBranchValue =
    normalizedBranchValue || normalizedLeadBranch || '';
  const contractWhsCode =
    branchCodeMap.get(String(selectedBranchValue)) ??
    (selectedBranchValue ? String(selectedBranchValue) : '');

  const activeWhsCode = useMemo(() => {
    if (searchBranchFilter && searchBranchFilter !== 'all') {
      return searchBranchFilter;
    }
    return contractWhsCode || '';
  }, [contractWhsCode, searchBranchFilter]);

  const branchFilterOptions = useMemo(() => {
    const normalized =
      branchOptions?.map((branch) => ({
        value: branch.code ?? String(branch.value ?? ''),
        label: branch.label,
      })) ?? [];

    const uniqueByValue = normalized.reduce((acc, option) => {
      if (!option.value || acc.some((item) => item.value === option.value)) {
        return acc;
      }
      return [...acc, option];
    }, []);

    return [
      { value: 'all', label: 'Barcha filiallar' },
      ...uniqueByValue,
    ];
  }, [branchOptions]);

  useEffect(() => {
    branchFilterInitializedRef.current = false;
  }, [leadId]);

  useEffect(() => {
    if (!form || !branchFilterOptions?.length || !setValue) return;

    const currentValue = watch?.('searchBranchFilter');
    const hasContractWhsCode = contractWhsCode && branchFilterOptions.some(
      (opt) => String(opt.value) === String(contractWhsCode)
    );
    const initialValue = hasContractWhsCode ? contractWhsCode : 'all';

    const contractWhsCodeChanged = contractWhsCodeRef.current !== contractWhsCode;
    contractWhsCodeRef.current = contractWhsCode;

    if (!currentValue || currentValue === '' || !branchFilterInitializedRef.current) {
      setValue('searchBranchFilter', initialValue);
      branchFilterInitializedRef.current = true;
    } else if (hasContractWhsCode && contractWhsCodeChanged && contractWhsCode) {
      setValue('searchBranchFilter', contractWhsCode);
    }
  }, [contractWhsCode, form, setValue, watch, branchFilterOptions]);

  return {
    branchCodeMap,
    branchCodeToNameMap,
    contractWhsCode,
    activeWhsCode,
    branchFilterOptions,
  };
};

