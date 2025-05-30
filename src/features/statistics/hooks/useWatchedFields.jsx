import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatisticsFilter } from "@store/slices/statisticsPageSlice";
import _ from "lodash";
const useWatchedFields = (watch) => {
  const dispatch = useDispatch();
  const [lastSlpCodeValue, setLastSlpCodeValue] = useState("");
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
        slpCode:
          lastSlpCodeValue.length && !slpCode.length
            ? ""
            : slpCode.length
            ? _.map(slpCode, "value").join(",")
            : filterState.slpCode,
      })
    );

    setLastSlpCodeValue(slpCode);
  }, [startDate, endDate, slpCode]);

  return {
    startDate,
    endDate,
    slpCode,
  };
};

export default useWatchedFields;
