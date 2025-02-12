import { useState } from "react";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return {
    isAuthenticated,
    setIsAuthenticated,
    user: {
      name: "John Doe",
      email: "john.doe@mail.ru",
    },
  };
}
