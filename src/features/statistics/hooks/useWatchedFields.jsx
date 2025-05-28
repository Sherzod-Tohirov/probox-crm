import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatisticsFilter } from "@store/slices/statisticsPageSlice";
import useFilter from "@features/statistics/hooks/useFilter";
import getSelectOptionsFromKeys from "@utils/getSelectOptionsFromKeys";
import _ from "lodash";
const useWatchedFields = (watch) => {
  const dispatch = useDispatch();
  const { executors } = useFilter();
  const [startDate, endDate, slpCode] = watch([
    "startDate",
    "endDate",
    "slpCode",
  ]);

  const filterState = useSelector((state) => state.page.statistics.filter);

  useEffect(() => {
    const startDateValid = moment(startDate, "DD.MM.YYYY").isValid()
      ? startDate
      : moment().startOf("month").format("DD.MM.YYYY");

    const endDateValid = moment(endDate, "DD.MM.YYYY").isValid()
      ? endDate
      : moment().endOf("month").format("DD.MM.YYYY");

    dispatch(
      setStatisticsFilter({
        startDate: startDateValid,
        endDate: endDateValid,
        slpCode: slpCode.length
          ? _.map(slpCode, "value").join(",")
          : filterState.slpCode,
      })
    );
  }, [startDate, endDate, slpCode]);

  return {
    startDate,
    endDate,
    slpCode,
  };
};

export default useWatchedFields;
