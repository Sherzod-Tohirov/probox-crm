import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClientsFilter } from "@store/slices/clientsPageSlice";
import moment from "moment";

const useWatchFilterFields = (watch) => {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.page.clients.filter);

  const [search, phone, startDate, endDate, status, executor] = watch([
    "search",
    "phone",
    "startDate",
    "endDate",
    "status",
    "executor",
  ]);

  const watchedFields = {
    search,
    phone,
    startDate,
    endDate,
    status,
    executor,
  };

  useEffect(() => {
    dispatch(
      setClientsFilter({
        ...watchedFields,
      })
    );
  }, [search, phone, startDate, endDate, status, executor]);

  return watchedFields;
};

export default useWatchFilterFields;
