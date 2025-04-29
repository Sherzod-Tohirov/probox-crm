import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClientsFilter } from "@store/slices/clientsPageSlice";
import moment from "moment";
import _, { omit } from "lodash";

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
    const startDateValid = moment(startDate, "DD.MM.YYYY").isValid()
      ? startDate
      : moment().startOf("month").format("DD.MM.YYYY");

    const endDateValid = moment(endDate, "DD.MM.YYYY").isValid()
      ? endDate
      : moment().endOf("month").format("DD.MM.YYYY");

    dispatch(
      setClientsFilter({
        ...omit(watchedFields, ["startDate", "endDate"]), // Remove startDate and endDate from filterState
        startDate: startDateValid,
        endDate: endDateValid,
        paymentStatus: _.map(watchedFields.paymentStatus, "value").join(","),
      })
    );
  }, [search, phone, startDate, endDate, paymentStatus, slpCode]);

  return watchedFields;
};

export default useWatchFilterFields;
