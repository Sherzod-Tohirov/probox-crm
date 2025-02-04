import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../store/slices/toggleSlice";

export default function useToggle(toggleName) {
  const toggleNameUpper = toggleName[0].toUpperCase() + toggleName.slice(1);
  const toggleFuncMap = useMemo(() => {
    return {
      sidebar: toggleSidebar,
    };
  }, []);
  const dispatch = useDispatch();
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
