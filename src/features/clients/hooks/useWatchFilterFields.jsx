import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClientsFilter } from "@store/slices/clientsPageSlice";
import moment from "moment";
import _, { omit } from "lodash";

const useWatchFilterFields = (watch) => {
  const dispatch = useDispatch();

  const [
    search,
    phone,
    startDate,
    endDate,
    paymentStatus,
    slpCode,
    phoneConfiscated,
  ] = watch([
    "search",
    "phone",
    "startDate",
    "endDate",
    "paymentStatus",
    "slpCode",
    "phoneConfiscated",
  ]);

  const watchedFields = {
    search,
    phone,
    startDate,
    endDate,
    paymentStatus,
    slpCode,
    phoneConfiscated,
  };

  const filterState = useSelector((state) => state.page.clients.filter);
  useEffect(() => {
    const startDateValid = moment(startDate, "DD.MM.YYYY").isValid()
      ? startDate
      : moment().startOf("month").format("DD.MM.YYYY");

    const endDateValid = moment(endDate, "DD.MM.YYYY").isValid()
      ? endDate
      : moment().endOf("month").format("DD.MM.YYYY");

    if (filterState.slpCode && !watchedFields.slpCode.length) {
      return;
    }
    console.log(watchedFields, "watchedFields");
    dispatch(
      setClientsFilter({
        ...omit(watchedFields, [
          "startDate",
          "endDate",
          "slpCode",
          "paymentStatus",
        ]), // Remove startDate and endDate from filterState
        startDate: startDateValid,
        endDate: endDateValid,
        paymentStatus: _.map(watchedFields.paymentStatus, "value").join(","),
        slpCode: _.map(watchedFields.slpCode, "value").join(","),
      })
    );
  }, [
    search,
    phone,
    startDate,
    endDate,
    paymentStatus,
    slpCode,
    phoneConfiscated,
  ]);

  return watchedFields;
};

export default useWatchFilterFields;
