import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import useFetchExecutors from '@hooks/data/useFetchExecutors';
import selectOptionsCreator from '@utils/selectOptionsCreator';
const useFilter = () => {
  const { data: executors, isPending: isExecutorsLoading } = useFetchExecutors({
    include_role: ['Manager', 'Assistant'],
  });

  const executorsOptions = useMemo(() => {
    return selectOptionsCreator(executors, {
      label: 'SlpName',
      value: 'SlpCode',
    });
  }, [executors]);

  return {
    executors: {
      options: executorsOptions,
      data: executors,
      isLoading: isExecutorsLoading,
    },
  };
};

export default useFilter;
