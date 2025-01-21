import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar as toggle } from "../store/slices/sidebarSlice";

export default function useSidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const toggleSidebar = useCallback(() => dispatch(toggle()), [dispatch]);
  return { isOpen, toggleSidebar };
}
