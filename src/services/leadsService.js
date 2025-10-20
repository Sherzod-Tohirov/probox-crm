import api from './axiosConfig';

export const getLeads = async (params) => {
  try {
    const response = await api.get('/leads', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
