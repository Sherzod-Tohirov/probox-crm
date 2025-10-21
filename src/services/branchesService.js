import { fetchData } from './utilities';

export const getBranches = async (params) => {
  const response = await fetchData('/branches', 'branches', params);
  // Branches API returns { content: [...] } instead of { data: [...] }
  return response.content || response.data || response;
};
