import moment from "moment";
import formatDate from "../utils/formatDate";

export const applyDefaultParams = (params) => {
  if (!params) return;
  if (
    !moment(params.startDate, "YYYY.MM.DD", true).isValid() ||
    !moment(params.endDate, "YYYY.MM.DD", true).isValid()
  ) {
    if (params.startDate)
      params.startDate = formatDate(
        params.startDate,
        "DD.MM.YYYY",
        "YYYY.MM.DD"
      );
    else params.startDate = moment().startOf("month").format("YYYY.MM.DD");
    if (params.endDate)
      params.endDate = formatDate(params.endDate, "DD.MM.YYYY", "YYYY.MM.DD");
    else params.endDate = moment().endOf("month").format("YYYY.MM.DD");
  }
  if (!params.page) params.page = 1;
};
