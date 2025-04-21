import moment from "moment";
import api from "./axiosConfig";

export const getClients = async (params = {}) => {
  console.log("GetClients", params);
  try {
    const response = await api.get("/invoice", {
      params: {
        page: params.page,
        limit: params.limit,
        ...params,
      },
    });
    console.log(response, "responseClients");
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

export const distributeClients = async (params = {}) => {
  try {
    const response = await api.put(
      "/invoice/distribution",
      {},
      {
        params: {
          startDate:
            params?.startDate || moment().startOf("month").format("YYYY.MM.DD"),
          endDate:
            params?.endDate || moment().endOf("month").format("YYYY.MM.DD"),
          ...params,
        },
      }
    );
    console.log(response, "response put");
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

export const addClientPayment = async (data, params = {}) => {
  try {
    const response = await api.post(`/IncomingPayments`, data, {
      params: {
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
