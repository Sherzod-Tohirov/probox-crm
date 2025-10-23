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
    Object.keys(fields).forEach(key => {
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
