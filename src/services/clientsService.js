import { fetchData } from "./utilities";

export const getClients = async () => {
  const response = await fetchData("/invoice", "invoices");
  return response;
};
