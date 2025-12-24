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
    // API response format: { score: { score: 9.8, totalContracts: 1, ... } }
    return response?.data?.score ?? response?.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Invoice PDF / fayllarini yuklash servisi
// Backend: /lead-images/upload method: POST
// payload: { image: file.pdf, leadId: 123, docNum: invoiceDocNum }
export const uploadInvoiceFile = async ({ file, leadId, docNum }) => {
  try {
    const formData = new FormData();

    if (file) {
      formData.append('image', file);
    }

    if (leadId) {
      formData.append('leadId', leadId);
    }

    if (docNum) {
      formData.append('docNum', docNum);
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
