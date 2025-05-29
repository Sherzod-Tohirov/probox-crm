import { useCallback, useMemo } from "react";
import useAuth from "@hooks/useAuth";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import useFetchExecutors from "@hooks/data/useFetchExecutors";

import formatDate from "@utils/formatDate";
import formatterCurrency from "@utils/formatterCurrency";

import { insTotalCalculator, calculatePercentage } from "@utils/calculator";
import { calculateKPI } from "@utils/calculator";
const useStatisticsTableColumns = () => {
  const { data: executors } = useFetchExecutors();
  const { data: currency } = useFetchCurrency();
  const { user } = useAuth();
  const calculateInsTotal = useCallback((column) => {
    return insTotalCalculator({
      paidToDate: column.PaidToDate,
      sumApplied: column.SumApplied,
      insTotal: column.InsTotal,
    });
  }, []);
  const monthlyStatisticsColumns = useMemo(() => [
    {
      key: "DueDate",
      title: "Sana",
      width: "2%",
      minWidth: "40px",
      icon: "calendarFilled",
      renderCell: (column) => {
        return formatDate(column.DueDate, "YYYY.MM.DD", "DD.MM.YYYY");
      },
    },
    {
      key: "InsTotal",
      title: "Plan",
      width: "2%",
      minWidth: "40px",
      icon: "calendarFact",
      renderCell: (column) => {
        return formatterCurrency(calculateInsTotal(column), "USD");
      },
    },
    {
      key: "SumApplied",
      title: "To'landi",
      width: "2%",
      minWidth: "40px",
      icon: "income",
      renderCell: (column) => {
        return formatterCurrency(column.SumApplied, "USD");
      },
    },
    {
      key: "confiscated",
      title: "Mahsulot",
      width: "2%",
      minWidth: "40px",
      icon: "income",
      renderCell: (column) => {
        if (!column.PhoneConfiscated) return "-";
        return formatterCurrency(column.Confiscated, "USD");
      },
    },
    {
      key: "percentage",
      title: "Foiz",
      width: "2%",
      minWidth: "40px",
      icon: "income",
      renderCell: (column) => {
        const insTotal = calculateInsTotal(column);
        return calculatePercentage(column.SumApplied, insTotal);
      },
    },
  ]);
  const salesPersonStatisticsColumns = useMemo(() => [
    {
      key: "slpCode",
      title: "Ijrochi",
      width: "2%",
      minWidth: "40px",
      icon: "calendarFilled",
      renderCell: (column) => {
        const foundExecutor = executors?.find(
          (executor) => executor.SlpCode === column.SlpCode
        );
        if (foundExecutor) {
          return foundExecutor.SlpName;
        }
        return "Umumiy";
      },
    },
    {
      key: "InsTotal",
      title: "Plan",
      width: "2%",
      minWidth: "40px",
      icon: "calendarFact",
      renderCell: (column) => {
        return formatterCurrency(calculateInsTotal(column), "USD");
      },
    },
    {
      key: "SumApplied",
      title: "Fakt",
      width: "2%",
      minWidth: "40px",
      icon: "income",
      renderCell: (column) => {
        return formatterCurrency(column.SumApplied, "USD");
      },
    },
    {
      key: "percentage",
      title: "Foiz",
      width: "2%",
      minWidth: "40px",
      icon: "income",
      renderCell: (column) => {
        const insTotal = calculateInsTotal(column);
        return calculatePercentage(column.SumApplied, insTotal);
      },
    },
    {
      key: "kpi",
      title: "KPI",
      width: "2%",
      minWidth: "40px",
      icon: "moneyAdd",
      renderCell: (column) => {
        if (column.SlpCode === null) return "-";
        const insTotal = calculateInsTotal(column);
        const percentage = ((column.SumApplied / insTotal) * 100).toFixed(2);
        const kpi = calculateKPI(percentage, column.SumApplied);
        return formatterCurrency(kpi, "USD");
      },
    },
    {
      key: "kpiUZS",
      title: "KPI (UZS)",
      width: "2%",
      minWidth: "40px",
      icon: "moneyAdd",
      renderCell: (column) => {
        if (column.SlpCode === null) return "-";
        const insTotal = calculateInsTotal(column);
        const percentage = ((column.SumApplied / insTotal) * 100).toFixed(2);
        const kpi = calculateKPI(percentage, column.SumApplied);
        return formatterCurrency(kpi * (currency?.Rate || 1), "UZS");
      },
    },
    {
      key: "salary",
      title: "Oylik (fiksa)",
      width: "2%",
      minWidth: "40px",
      icon: "income",
      renderCell: (column) => {
        if (column.SlpCode === null) return "-";
        const salary = 2000000;
        return formatterCurrency(salary);
      },
    },
    {
      key: "calculatedSalary",
      title: "Jami oylik",
      width: "2%",
      minWidth: "40px",
      icon: "income",
      renderCell: (column) => {
        if (column.SlpCode === null) return "-";
        const salary = 2000000;
        const insTotal = calculateInsTotal(column);
        const percentage = ((column.SumApplied / insTotal) * 100).toFixed(2);
        const kpi = calculateKPI(percentage, column.SumApplied);
        const kpiUZS = kpi * (currency?.Rate || 1);
        const calculatedSalary = salary + kpiUZS;
        return formatterCurrency(calculatedSalary);
      },
    },
  ]);

  return { monthlyStatisticsColumns, salesPersonStatisticsColumns };
};

export default useStatisticsTableColumns;
