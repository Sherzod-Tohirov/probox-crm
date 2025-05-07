import moment from "moment";
import { useMemo } from "react";
import { Status, List, Box } from "@components/ui";

import useAuth from "@hooks/useAuth";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import useFetchExecutors from "@hooks/data/useFetchExecutors";

import formatDate from "@utils/formatDate";
import formatterCurrency from "@utils/formatterCurrency";
import { formatToReadablePhoneNumber } from "@utils/formatPhoneNumber";
import MessengerCell from "@features/clients/components/TableCellHelpers/MessengerCell";

const useTableColumns = () => {
  const { data: executors } = useFetchExecutors();
  const { data: currency } = useFetchCurrency();
  const { user } = useAuth();
  const clientsTableColumns = useMemo(
    () => [
      {
        key: "CardName",
        title: "FIO",
        width: "24%",
        minWidth: "200px",
        icon: "avatarFilled",
      },
      {
        key: "Phone1",
        title: "Telefon",
        renderCell: (column) => {
          if (!column?.["Phone1"]) return "-";
          return formatToReadablePhoneNumber(column["Phone1"]);
        },
        width: "8%",
        minWidth: "100px",
        icon: "telephoneFilled",
      },
      { key: "Dscription", title: "Mahsulot", width: "15%", icon: "products" },
      {
        key: "InsTotal",
        title: "To'lov",
        renderCell: (column) => {
          const SUM = column.InsTotal * currency?.["Rate"];
          return (
            (
              <Box gap={1}>
                <span>{formatterCurrency(column.InsTotal, "USD")} </span>
                <span style={{ fontWeight: 900, color: "steelblue" }}>
                  ({formatterCurrency(SUM || 0, "UZS")})
                </span>
              </Box>
            ) || "Unknown"
          );
        },
        width: "14%",
        minWidth: "120px",
        icon: "income",
      },
      {
        key: "PaidToDate",
        title: "To'landi",
        renderCell: (column) => {
          const SUM = column.PaidToDate * currency?.["Rate"];
          return (
            (
              <Box gap={1}>
                <span>{formatterCurrency(column.PaidToDate, "USD")} </span>
                <span style={{ fontWeight: 900, color: "steelblue" }}>
                  ({formatterCurrency(SUM || 0, "UZS")})
                </span>
              </Box>
            ) || "Unknown"
          );
        },
        width: "14%",
        icon: "income",
      },
      {
        key: "status",
        title: "Holati",
        renderCell: (column) => {
          let status = "unpaid";

          const statusCalc =
            parseFloat(column.InsTotal) - parseFloat(column.PaidToDate);
          if (statusCalc > 0 && statusCalc < column.InsTotal)
            status = "partial";
          if (statusCalc === 0) status = "paid";

          return <Status status={status} />;
        },
        width: "6%",
        icon: "calendarFact",
      },

      {
        key: "executor",
        title: "Ijrochi",
        renderCell: (column) => {
          if (!column.SlpCode) return "-";
          if (!executors) return "-";

          const executor = executors.find(
            (executor) => Number(executor.SlpCode) === Number(column.SlpCode)
          );
          if (!executor) return "-";

          if (user.SlpCode === executor?.SlpCode) return "Siz";
          return executor.SlpName || "-";
        },
        width: "8%",
        icon: "calendarFact",
      },
      {
        key: "comments",
        title: "Xabarlar",
        width: "2%",
        renderCell: (column) => <MessengerCell column={column} />,
        icon: "messengerFilled",
      },
      {
        key: "term",
        title: "Muddati",
        renderCell: (column) => {
          if (!column.DueDate) return "Unknown";
          return moment(column.DueDate).format("DD.MM.YYYY");
        },
        width: "6%",
        icon: "calendar",
      },
      {
        key: "NewDueDate",
        title: "Kelishildi",
        width: "15%",
        renderCell: (column) => {
          if (!column.NewDueDate) return "-";
          if (moment(column.NewDueDate, "DD.MM.YYYY", true).isValid())
            return column.NewDueDate;
          return formatDate(column.NewDueDate);
        },
        icon: "calendar",
      },
    ],
    [executors, user.SlpCode]
  );

  const clientPageTableColumns = useMemo(
    () => [
      {
        key: "InstlmntID",
        title: "ID",
        width: "1%",
        icon: "barCodeFilled",
        cellStyle: {
          textAlign: "center",
          outline: "1px solid rgba(0,0,0,0.05)",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
        },
      },
      {
        key: "PaysList",
        title: "To'lovlar ro'yhati",
        width: "18%",
        renderCell: (column) => {
          if (!column.PaysList) return "-";
          return (
            <List
              // layout
              itemProps={
                {
                  // initial: { scale: 0 },
                  // animate: { scale: 1 },
                  // exit: { scale: 0 },
                  // transition: { duration: 0.3, ease: "easeInOut", stiffness: 100000 },
                }
              }
              items={column.PaysList}
              isCollapsible={true}
              renderItem={(item) => {
                return (
                  <Box
                    // layout
                    key={item.AcctName}
                    align="center"
                    justify="start"
                    style={{
                      padding: "0.2rem",
                    }}>
                    {item.AcctName && item.SumApplied
                      ? `Sanasi: ${formatDate(item.DocDate)} => ${
                          item.AcctName
                        } - ${formatterCurrency(item.SumApplied, "USD")}`
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
        title: "Jami summa",
        width: "7%",
        renderCell: (column) => {
          if (!column.InsTotal) return "0$";
          return formatterCurrency(column.InsTotal, "USD");
        },
        icon: "income",
      },
      {
        key: "PaidToDate",
        title: "To'landi",
        width: "7%",
        renderCell: (column) => {
          if (!column.PaidToDate) return "0$";
          return formatterCurrency(column.PaidToDate, "USD");
        },
        icon: "income",
      },
      {
        key: "DueDate",
        title: "Muddati",
        width: "10%",
        renderCell: (column) => {
          if (!column.DueDate) return "-";
          if (moment(column.DueDate, "DD.MM.YYYY", true).isValid())
            return column.DueDate;
          return formatDate(column.DueDate);
        },
        icon: "calendar",
      },
      {
        key: "DueDate",
        title: "To'lovdagi kechikish",
        width: "10%",
        renderCell: (column) => {
          if (!column.DueDate) return "-";

          const payslist = (column.PaysList || []).sort((a, b) => {
            return moment(a.DocDate).diff(moment(b.DocDate), "days");
          });

          const lastPaymentDate = payslist[payslist.length - 1]?.DocDate;
          if (!lastPaymentDate) return "-";
          const diff = moment(lastPaymentDate).diff(
            moment(column.DueDate),
            "days"
          );
          const isAllPaid = payslist.reduce((acc, list) => {
            return acc + (Number(list.SumApplied) || 0);
          }, 0);

          if (isAllPaid < column.InsTotal) {
            return <span>{`To'liq emas`}</span>;
          }

          if (diff <= 0) {
            return (
              <span style={{ color: "#027243" }}>
                {diff < 0
                  ? `${Math.abs(diff)}-kun oldin to'landi`
                  : "O'z vaqtida to'landi"}
              </span>
            );
          }
          return (
            <span
              style={{
                color: "#d51629",
              }}>{`${diff}-kun kechikib to'landi`}</span>
          );
        },
        icon: "calendar",
      },
    ],
    []
  );

  return { clientsTableColumns, clientPageTableColumns };
};

export default useTableColumns;
