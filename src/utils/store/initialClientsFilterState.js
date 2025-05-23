import moment from "moment";

const today = moment().startOf("month").format("DD.MM.YYYY");
const endOfMonth = moment().endOf("month").format("DD.MM.YYYY");
export const initialClientsFilterState = {
  search: "",
  phone: "998",
  startDate: today,
  endDate: endOfMonth,
  paymentStatus: "all",
  slpCode: "",
  phoneConfiscated: "",
};
