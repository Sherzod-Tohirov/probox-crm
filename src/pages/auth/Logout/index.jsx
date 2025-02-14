import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import { useEffect } from "react";

export default function Logout() {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(false);
    navigate("/login");
  }, [setIsAuthenticated, navigate]);

  return null;
}
