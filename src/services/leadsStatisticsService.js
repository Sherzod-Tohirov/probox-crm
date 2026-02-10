import api from "./axiosConfig";

/**
 * Get operators analytics
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getOperatorAnalytics = async (params) => {
  try {
    const response = await api.get('/leads/analytics/funnel-by-operators', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};