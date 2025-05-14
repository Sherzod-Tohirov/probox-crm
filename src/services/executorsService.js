import { fetchData } from "./utilities";

export const getExecutors = async () => {
  console.log("Executing getExecutors service... Get request sent to /executors endpoint");
  const response = await fetchData("/executors", "executors");
  return response.data;
};
