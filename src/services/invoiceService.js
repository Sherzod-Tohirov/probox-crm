import api from './axiosConfig';

export const createInvoice = async (data) => {
  try {
    const response = await api.post('/create/invoice', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getInvoiceScore = async ({ CardCode }) => {
  try {
    const response = await api.get('/invoice/score', {
      params: { CardCode },
    });
    // API turlicha qaytarishi mumkin: {data: ...} yoki to'g'ridan-to'g'ri qiymat
    return response?.data?.data ?? response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Invoice PDF / fayllarini yuklash servisi
// Backend: /lead-images/upload method: POST
// payload: { image: file.pdf, leadId: 123 }
export const uploadInvoiceFile = async ({ file, leadId }) => {
  try {
    const formData = new FormData();

    if (file) {
      formData.append('image', file);
    }

    if (leadId) {
      formData.append('leadId', leadId);
    }

    const config = {
      timeout: 60000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    const response = await api.post('/lead-images/upload', formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
