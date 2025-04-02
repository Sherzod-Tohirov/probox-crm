import api from "./axiosConfig";

export const getClients = async (params = {}) => {
  try {
    const response = await api.get("/invoice", {
      params: {
        page: params.page,
        limit: params.limit,
        // search: params.search,
        // startDate: params.startDate,
        // endDate: params.endDate,
        // status: params.status,
        // executor: params.executor,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
