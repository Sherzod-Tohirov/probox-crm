import api from "./axiosConfig";

export const fetchData = async (apiUrl, apiName = "data") => {
  try {
    const response = await api.get(apiUrl);
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
