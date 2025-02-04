import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMessenger, toggleSidebar } from "../store/slices/toggleSlice";

export default function useToggle(toggleName) {
  const dispatch = useDispatch();

  const toggleNameUpper = toggleName[0].toUpperCase() + toggleName.slice(1);
  const toggleFuncMap = useMemo(
    () => ({
      sidebar: toggleSidebar,
      messenger: toggleMessenger,
    }),
    []
  );

  const isOpen = useSelector(
    (state) => state.toggle["is" + toggleNameUpper + "Open"]
  );

  const toggle = useCallback(
    () => dispatch(toggleFuncMap[toggleName]()),
    [dispatch, toggleFuncMap, toggleName]
  );

  return {
    isOpen,
    [`toggle${toggleNameUpper}`]: toggle,
  };
}
