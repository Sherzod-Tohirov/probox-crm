import moment from "moment";
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
    response, "response";
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

export const updateClientExecutor = async (payload = {}, params = {}) => {
  try {
    if (!payload?.installmentId || !payload?.docEntry)
      throw Error("Installment id and doc entry are required !");
    const response = await api.put(
      `/invoice/executor/${payload.docEntry}/${payload.installmentId}`,
      payload.data,
      {
        params: {
          ...params,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateClientImages = async (payload = {}, params = {}) => {
  try {
    if (!payload?.installmentId || !payload?.docEntry)
      throw Error("Installment id and doc entry are required !");
    const response = await api.put(
      `/invoice/upload/${payload.docEntry}/${payload.installmentId}`,
      payload.data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          ...params,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteClientImages = async (payload = {}, params = {}) => {
  try {
    if (!payload?.installmentId || !payload?.docEntry)
      throw Error("Installment id and doc entry are required !");

    const response = await api.delete(
      `/invoice/upload/${payload.docEntry}/${payload.installmentId}/${payload.id}`,
      {
        params: {
          ...params,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
