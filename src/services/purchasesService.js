import api from './api';

/**
 * Get purchases list with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.limit - Items per page
 * @returns {Promise} API response
 */
export const getPurchases = async (params = {}) => {
  try {
    const response = await api.get('/purchases', { params });
    return response.data;
  } catch (error) {
    console.error('Get purchases error:', error);
    throw error;
  }
};

/**
 * Get purchase by ID
 * @param {string|number} id - Purchase ID
 * @returns {Promise} API response
 */
export const getPurchaseById = async (id) => {
  try {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get purchase by ID error:', error);
    throw error;
  }
};

/**
 * Create new purchase
 * @param {Object} data - Purchase data
 * @returns {Promise} API response
 */
export const createPurchase = async (data) => {
  try {
    const response = await api.post('/purchases', data);
    return response.data;
  } catch (error) {
    console.error('Create purchase error:', error);
    throw error;
  }
};

/**
 * Update purchase
 * @param {string|number} id - Purchase ID
 * @param {Object} data - Updated purchase data
 * @returns {Promise} API response
 */
export const updatePurchase = async (id, data) => {
  try {
    const response = await api.put(`/purchases/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Update purchase error:', error);
    throw error;
  }
};

/**
 * Delete purchase
 * @param {string|number} id - Purchase ID
 * @returns {Promise} API response
 */
export const deletePurchase = async (id) => {
  try {
    const response = await api.delete(`/purchases/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete purchase error:', error);
    throw error;
  }
};
