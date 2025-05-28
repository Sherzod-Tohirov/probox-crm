import { Col, Row, Table } from "@components/ui";
import Filter from "@features/statistics/components/Filter";
import StatisticChart from "@features/statistics/components/StatisticChart";
import useStatisticsData from "@features/statistics/hooks/useStatisticsData";
import styles from "./style.module.scss";
import useAuth from "@hooks/useAuth";
import { useSelector } from "react-redux";
import formatDate from "@utils/formatDate";
import { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { insTotalCalculator } from "@utils/calculator";
const generalStatisticColumn = [
  { key: "month", title: "Month", icon: "calendar" },
  { key: "plan", title: "Plan", icon: "card" },
  { key: "fakt", title: "Fakt", icon: "income" },
  { key: "foiz", title: "Foiz", icon: "presentationChart" },
  { key: "kpi", title: "KPI", icon: "moneyAdd" },
  { key: "oylik", title: "Oylik", icon: "calendarFact" },
  { key: "umumiySoni", title: "Umumiy soni", icon: "calendarFact" },
  { key: "oylik2", title: "Oylik", icon: "calendarFact" },
];

const generalStatisticData = Array.from({ length: 1 }, (_, index) => ({
  month: "November",
  plan: "94 089,64 $",
  fakt: "88 552,00 $",
  foiz: "94.11%",
  kpi: "442,61 $",
  oylik: "2 000 000 UZS",
  umumiySoni: "953 000 UZS",
  oylik2: "5 400 000 UZS",
}));

const table2Columns = [
  { key: "sana", title: "Sana", icon: "calendar" },
  { key: "plan", title: "Plan", icon: "calendarFact" },
  { key: "fakt", title: "Fakt", icon: "calendarFact" },
  { key: "foiz", title: "Foiz", icon: "presentationChart" },
];

const table2Data = Array.from({ length: 20 }, (_, index) => ({
  sana: "November",
  plan: "94 089,64 $",
  fakt: "88 552,00 $",
  foiz: "94.11%",
}));

export default function Statistics() {
  const filterState = useSelector((state) => state.page.statistics.filter);
  const { user } = useAuth();
  const [params, setParams] = useState(() => ({
    startDate: formatDate(filterState.startDate, "DD.MM.YYYY", "YYYY.MM.DD"),
    endDate: formatDate(filterState.endDate, "DD.MM.YYYY", "YYYY.MM.DD"),
    slpCode: filterState.slpCode === "" ? user?.slpCode : filterState.slpCode,
  }));
  const [formattedMonthlyData, setFormattedMonthlyData] = useState([]);
  const { monthly, salesPerson } = useStatisticsData(params);
  console.log(monthly, "monthly statistics data");
  console.log(salesPerson, "sales person statistics data");
  const handleFilter = useCallback(
    (data) => {
      setParams({
        startDate: formatDate(data.startDate, "DD.MM.YYYY", "YYYY.MM.DD"),
        endDate: formatDate(data.endDate, "DD.MM.YYYY", "YYYY.MM.DD"),
        slpCode: _.map(data.slpCode, "value").join(",") || user?.slpCode,
      });
    },
    [user?.slpCode]
  );
  useEffect(() => {
    if (monthly?.data?.length) {
      const formattedData = monthly.data.map((item) => ({
        day: formatDate(item["DueDate"], "YYYY.MM.DD", "DD.MM"),
        qoplandi: parseInt(item["PaidToDate"], 10),
        jami: parseInt(
          insTotalCalculator({
            paidToDate: item["PaidToDate"],
            sumApplied: item["SumApplied"],
            insTotal: item["InsTotal"],
          }),
          10
        ),
      }));
      setFormattedMonthlyData(formattedData);
    } else {
      setFormattedMonthlyData([]);
    }
  }, [monthly?.data]);
  return (
    <Row gutter={8}>
      <Col fullWidth className={styles["sticky-col"]}>
        <Filter onFilter={handleFilter} />
      </Col>
      <Col fullWidth>
        <Table columns={generalStatisticColumn} data={generalStatisticData} />
      </Col>
      <Col fullWidth>
        <StatisticChart
          title={"Oylik statistika"}
          date={{
            startDate: formatDate(params.startDate, "YYYY.MM.DD", "DD.MM.YYYY"),
            endDate: formatDate(params.endDate, "YYYY.MM.DD", "DD.MM.YYYY"),
          }}
          data={formattedMonthlyData}
          isLoading={monthly.isLoading}
          keys={{
            name: "day",
            firstLine: "qoplandi",
            secondLine: "jami",
          }}
        />
      </Col>
      <Col fullWidth>
        <Table columns={table2Columns} data={table2Data} />
      </Col>
      <Col fullWidth>
        <Table columns={table2Columns} data={table2Data} />
      </Col>
    </Row>
  );
}
