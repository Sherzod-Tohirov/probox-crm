import api from "./axiosConfig";

export const fetchData = async (apiUrl, apiName = "data", params = {}) => {
  try {
    const response = await api.get(apiUrl, { params });
    return response.data;
  } catch (error) {
    console.log(`Error while fetching ${apiName}: `, error);
    return error;
  }
};

export const postData = async (apiUrl, data) => {
  try {
    const response = await api.post(apiUrl, data);
    console.log(response, "response from postData");
    return response.data;
  } catch (error) {
    console.log(`Error while posting data to ${apiUrl}: `, error);
    throw error;
  }
};

export const putData = async (apiUrl, data) => {
  try {
    const response = await api.put(apiUrl, data);
    return response.data;
  } catch (error) {
    console.log(`Error while putting data to ${apiUrl}: `, error);
    throw error;
  }
};

export const deleteData = async (apiUrl) => {
  try {
    const response = await api.delete(apiUrl);
    return response.data;
  } catch (error) {
    console.log(`Error while deleting data from ${apiUrl}: `, error);
    throw error;
  }
};
