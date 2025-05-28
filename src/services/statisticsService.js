import { fetchData } from "./utilities";

export const getStatistics = async (params = {}) => {
  const response = await fetchData("invoice/report", "statistics", params);
  return response;
};

export const getMonthlyStatistics = async (params = {}) => {
  const response = await fetchData(
    "invoice/report-days",
    "monthly-statistics",
    params
  );
  return response;
};

export const getSalesPersonStatistics = async (params = {}) => {
  const response = await fetchData(
    "invoice/report-sales-person",
    "sales-person-statistics",
    params
  );
  return response;
};
