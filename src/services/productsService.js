import api from './axiosConfig';

export const getProducts = async (params) => {
  try {
    const response = await api.get('/items', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProductItems = async (params) => {
  try {
    const response = await api.get(`/item-series`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
