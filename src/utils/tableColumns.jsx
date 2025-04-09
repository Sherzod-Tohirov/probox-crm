import { Status } from "@components/ui";
import moment from "moment";
import formatterCurrency from "@utils/formatterCurrency";
import formatDate from "@utils/formatDate";
import { List, Box } from "@components/ui";

export const clientsTableColumns = [
  {
    key: "DocEntry",
    title: "Код документа",
    width: "12%",
    icon: "barCodeFilled",
  },
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

export const clientPageTableColumns = [
  { key: "InstlmntID", title: "ID", width: "10%", icon: "barCodeFilled" },
  {
    key: "PaysList",
    title: "Список платежей",
    width: "15%",
    renderCell: (column) => {
      if (!column.PaysList) return "Unknown";
      return (
        <List
          items={column.PaysList}
          renderItem={(item) => {
            return (
              <Box
                key={item.AcctName}
                align="center"
                justify="start"
                style={{
                  padding: "0.2rem",
                }}>
                {item.AcctName && item.SumApplied
                  ? `${item.AcctName} - ${formatterCurrency(
                      item.SumApplied,
                      "USD"
                    )}`
                  : "-"}
              </Box>
            );
          }}
        />
      );
    },
    icon: "calendarFact",
  },

  {
    key: "InsTotal",
    title: "Общая сумма",
    width: "15%",
    renderCell: (column) => {
      if (!column.InsTotal) return "0$";
      return formatterCurrency(column.InsTotal, "USD");
    },
    icon: "income",
  },
  {
    key: "PaidToDate",
    title: "Оплачено",
    width: "10%",
    renderCell: (column) => {
      if (!column.PaidToDate) return "Unknown";
      return formatterCurrency(column.PaidToDate, "USD");
    },
    icon: "income",
  },
  {
    key: "DueDate",
    title: "Срок",
    width: "10%",
    renderCell: (column) => {
      if (!column.DueDate) return "Unknown";
      return formatDate(column.DueDate);
    },
    icon: "calendar",
  },
];
