import { useEffect, useState } from "react";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("token", "token");
    } else {
      localStorage.removeItem("token");
    }
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    setIsAuthenticated,
    user: {
      name: "John Doe",
      email: "john.doe@mail.ru",
    },
  };
}
