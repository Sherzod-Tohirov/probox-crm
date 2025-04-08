import api from "./axiosConfig";

export const getClients = async (params = {}) => {
  try {
    const response = await api.get("/invoice", {
      params: {
        page: params.page,
        limit: params.limit,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getClientEntriesById = async (id, params = {}) => {
  try {
    const response = await api.get(`/invoice/${id}`, {
      // Changed from "/invoice/:id" to `/invoice/${id}`
      params: {
        page: params.page,
        limit: params.limit,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const searchClients = async (params = {}) => {
  try {
    const response = await api.get("/search", {
      params: {
        page: params.page,
        limit: params.limit,
        ...params,
      },
    });
    console.log(response, "response");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
