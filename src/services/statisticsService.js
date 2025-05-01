import { fetchData } from "./utilities";

export const getStatistics = async (params = {}) => {
  const response = await fetchData("invoice/report", "statistics", params);
  console.log(response, "response from getStatistics");
  return response;
};
