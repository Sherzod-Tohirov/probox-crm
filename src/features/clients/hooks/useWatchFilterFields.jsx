import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClientsFilter } from "@store/slices/clientsPageSlice";
import moment from "moment";

const useWatchFilterFields = (watch) => {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.page.clients.filter);

  const [query, phone, startDate, endDate, status, executor] = watch([
    "query",
    "phone",
    "startDate",
    "endDate",
    "status",
    "executor",
  ]);

  const watchedFields = {
    query,
    phone,
    startDate,
    endDate,
    status,
    executor,
  };

  console.log(watchedFields, "watchedFields");
  useEffect(() => {
    dispatch(
      setClientsFilter({
        ...watchedFields,
      })
    );
  }, [query, phone, startDate, endDate, status, executor]);

  return watchedFields;
};

export default useWatchFilterFields;
