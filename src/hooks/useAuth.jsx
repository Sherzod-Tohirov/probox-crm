import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "@store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authService";

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const mutation = useMutation({
    mutationFn: login,
    onError: (error) => {
      console.log("Error while logging in: ", error);
    },
    onSuccess: (response) => {
      console.log("Login successful: ", response);

      if (!response?.data) return;

      dispatch(setUser(response));
    },
  });
  const handleLogin = useCallback(async (credentials) => {
    mutation.mutate(credentials);
  }, []);

  const handleLogout = useCallback(async () => {
    // await logout();
    dispatch(logoutUser());
  }, []);

  return {
    user,
    isAuthenticated,
    loginState: mutation,
    handleLogin,
    handleLogout,
  };
}
