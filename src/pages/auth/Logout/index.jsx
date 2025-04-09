import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth";
import { useEffect } from "react";

export default function Logout() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handleLogout();
    navigate("/login");
  }, [navigate]);

  return null;
}
