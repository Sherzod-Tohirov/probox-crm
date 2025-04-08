import { Status } from "@components/ui";
import moment from "moment";
import formatterCurrency from "@utils/formatterCurrency";
export const clientsTableColumns = [
  { key: "DocEntry", title: "Код документа", width: "12%", icon: "barCodeFilled" },
  { key: "CardName", title: "Имя клиента", width: "22%", icon: "avatarFilled" },
  { key: "Dscription", title: "Товар", width: "15%", icon: "calendar" },
  {
    key: "InsTotal",
    title: "Месячная оплата",
    renderCell: (column) => {
      return formatterCurrency(column.InsTotal, "USD") || "Unknown";
    },
    width: "12%",
    icon: "income",
  },
  {
    key: "PaidToDate",
    title: "Оплачено",
    renderCell: (column) => {
      return formatterCurrency(column.PaidToDate, "USD") || "Unknown";
    },
    width: "10%",
    icon: "income",
  },
  {
    key: "status",
    title: "Status",
    renderCell: (column) => {
      let status = "unpaid";

      const statusCalc =
        parseFloat(column.InsTotal) - parseFloat(column.PaidToDate);
      if (statusCalc > 0 && statusCalc < column.InsTotal) status = "partial";
      if (statusCalc === 0) status = "paid";

      return <Status status={status} />;
    },
    width: "8%",
    icon: "calendarFact",
  },

  {
    key: "executor",
    title: "Исполнитель",
    renderCell: (column) => {
      if (!column.SlpCode) return "Unknown";

      const executors = useFetchExecutors();
      const { user } = useAuth();
      const executor = executors?.data?.find(
        (executor) => executor.SlpCode === column.SlpCode
      );
      if (user.SlpCode === executor.SlpCode) return "You";
      return executor.SlpName || "Unknown";
    },
    width: "12%",
    icon: "calendarFact",
  },
  {
    key: "term",
    title: "Срок",
    renderCell: (column) => {
      if (!column.DueDate) return "Unknown";
      return moment(column.DueDate).format("DD.MM.YYYY");
    },
    width: "8%",
    icon: "calendar",
  },
];
