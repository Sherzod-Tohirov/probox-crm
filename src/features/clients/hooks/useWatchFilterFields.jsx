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
    const startDateFormatted = moment(startDate, "DD.MM.YYYY").format(
      "YYYY.MM.DD"
    );
    const endDateFormatted = moment(endDate, "DD.MM.YYYY").format("YYYY.MM.DD");
    const startDateValid = moment(startDate).isValid()
      ? startDateFormatted
      : moment().startOf("month").format("YYYY.MM.DD");
    const endDateValid = moment(endDate).isValid()
      ? endDateFormatted
      : moment().endOf("month").format("YYYY.MM.DD");

    dispatch(
      setClientsFilter({
        ...omit(filterState, ["startDate", "endDate"]), // Remove startDate and endDate from filterState
        startDate: startDateValid,
        endDate: endDateValid,
        paymentStatus: _.map(watchedFields.paymentStatus, "value").join(","),
      })
    );
  }, [search, phone, startDate, endDate, paymentStatus, slpCode]);

  return watchedFields;
};

export default useWatchFilterFields;
