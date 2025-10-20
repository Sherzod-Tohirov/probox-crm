import { fetchData } from './utilities';

export const getExecutors = async (params) => {
  const response = await fetchData('/executors', 'executors', params);
  return response.data;
};
