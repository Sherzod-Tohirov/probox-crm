import { fetchData } from "./utilities";

export const getExecutors = async () => {
  const response = await fetchData("/executors", "executors");
  return response.data;
};
