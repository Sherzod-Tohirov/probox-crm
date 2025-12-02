import api from './axiosConfig';

export const getLeads = async (params) => {
  try {
    const response = await api.get('/leads', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getLeadById = async (id) => {
  try {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateLead = async (id, data) => {
  try {
    const response = await api.put(`/leads/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateLeadFields = async (id, fields) => {
  try {
    // Filter out empty values
    const filteredFields = {};
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== undefined && fields[key] !== '') {
        filteredFields[key] = fields[key];
      }
    });

    const response = await api.put(`/leads/${id}`, filteredFields);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createLead = async (data) => {
  try {
    const response = await api.post('/leads', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteLead = async (id) => {
  try {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getLeadFiles = async ({ leadId }) => {
  try {
    const response = await api.get(`/lead-images/${leadId}`);
    return response.data;
  } catch (error) {
    console.log(error, 'Error file get files');
    throw error?.response?.data || error;
  }
};

export const postFileUpload = async ({
  formData,
  onUploadProgress,
  cancelToken,
} = {}) => {
  try {
    // formData must contain one or multiple 'images' entries
    // Do NOT set Content-Type here; axios will set multipart with boundary.
    const config = {
      timeout: 60000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };
    if (onUploadProgress) config.onUploadProgress = onUploadProgress;
    if (cancelToken) config.cancelToken = cancelToken;
    const response = await api.post(`/lead-images/upload`, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteFile = async ({ fileId }) => {
  try {
    const response = await api.delete(`/lead-images/${fileId}`, {
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// seeller tab leads's contract terms api
// api/items?whsCode=01&search=iphone 16&condition=Yangi

export const fetchContractTermsItems = async ({
  whsCode,
  search,
  condition,
}) => {
  try {
    const params = {
      search,
    };

    if (whsCode) {
      params.whsCode = whsCode;
    }

    if (condition) {
      params.condition = condition;
    }

    const response = await api.get('/items', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchItemSeries = async ({ whsCode, itemCode }) => {
  try {
    const response = await api.get('/item-series', {
      params: {
        whsCode,
        itemCode,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
