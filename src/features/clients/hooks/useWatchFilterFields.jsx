import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClientsFilter } from "@store/slices/clientsPageSlice";
import moment from "moment";
import _ from "lodash";

const useWatchFilterFields = (watch) => {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.page.clients.filter);

  const [search, phone, startDate, endDate, paymentStatus, slpCode] = watch([
    "search",
    "phone",
    "startDate",
    "endDate",
    "paymentStatus",
    "slpCode",
  ]);

  const watchedFields = {
    search,
    phone,
    startDate,
    endDate,
    paymentStatus,
    slpCode,
  };

  useEffect(() => {
    dispatch(
      setClientsFilter({
        ...watchedFields,
        paymentStatus: _.map(watchedFields.paymentStatus, "value").join(","),
      })
    );
  }, [search, phone, startDate, endDate, paymentStatus, slpCode]);

  return watchedFields;
};

export default useWatchFilterFields;
