import api from "./axiosConfig";

export const login = async ({login, password}) => {
    console.log(login, password, "credentials2");
  try {
    const response = await api.post("/login", { login, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.log("Error while logging  out: ", error);
  }
};
