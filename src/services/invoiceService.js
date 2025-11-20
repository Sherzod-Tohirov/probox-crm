import api from './axiosConfig';

export const createInvoice = async (data) => {
  try {
    const response = await api.post('/create/invoice', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
