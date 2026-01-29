import api from './axiosConfig';

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
export const getPurchaseById = async (params = {}) => {
  try {
    const response = await api.get(
      `/purchases/${params.source}/${params.docEntry}`
    );
    return response.data;
  } catch (error) {
    console.error('Get purchase by ID error:', error);
    throw error;
  }
};

/**
 * Get suppliers list
 * @returns {Promise} API response
 */
export const getSuppliers = async (params = {}) => {
  try {
    const response = await api.get(`/suppliers`, { params });
    return response.data;
  } catch (error) {
    console.error('Get suppliers error:', error);
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
    const response = await api.post('/purchases/drafts', data);
    return response.data;
  } catch (error) {
    console.error('Create purchase error:', error);
    throw error;
  }
};

/**
 * Confirm purchase
 * @param {Object} params - Purchase params
 * @returns {Promise} API response
 */
export const confirmPurchase = async (params) => {
  if (!params.docEntry) return;
  try {
    const response = await api.post(
      `/purchases/drafts/${params.docEntry}/approve`
    );
    return response.data;
  } catch (error) {
    console.error('Confirm purchase error:', error);
    throw error;
  }
};

/**
 * Cancel purchase
 * @param {Object} params - Purchase params
 * @returns {Promise} API response
 */
export const cancelPurchase = async (params) => {
  if (!params.docEntry) return;
  try {
    const response = await api.post(
      `/purchases/drafts/${params.docEntry}/cancel`
    );
    return response.data;
  } catch (error) {
    console.error('Cancel purchase error:', error);
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

/**
 * Create purchase item
 * @param {string|number} contractNo - Purchase contract number
 * @param {Object} data - Item data (product_id, product_code, category, imei, status, battery, count, price)
 * @returns {Promise} API response
 */
export const createPurchaseItem = async (contractNo, data) => {
  try {
    const response = await api.post(`/purchase/${contractNo}/items`, data);
    return response.data;
  } catch (error) {
    console.error('Create purchase item error:', error);
    throw error;
  }
};

/**
 * Update purchase item field
 * @param {string|number} contractNo - Purchase contract number
 * @param {string|number} itemId - Item ID
 * @param {Object} data - Updated field data
 * @returns {Promise} API response
 */
export const updatePurchaseItem = async (contractNo, itemId, data) => {
  try {
    const response = await api.patch(
      `/purchase/${contractNo}/items/${itemId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Update purchase item error:', error);
    throw error;
  }
};

/**
 * Delete purchase item
 * @param {string|number} contractNo - Purchase contract number
 * @param {string|number} itemId - Item ID
 * @returns {Promise} API response
 */
export const deletePurchaseItem = async (contractNo, itemId) => {
  try {
    const response = await api.delete(
      `/purchase/${contractNo}/items/${itemId}`
    );
    return response.data;
  } catch (error) {
    console.error('Delete purchase item error:', error);
    throw error;
  }
};
