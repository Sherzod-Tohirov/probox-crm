import { postData } from "./utilities";

export const login = async ({ login, password }) => {
  const response = await postData("/login", { login, password });
  return response;
};

export const logout = async () => {
  const response = await postData("/logout", {});
  return response;
};
