import { Col, Row, Table } from "@components/ui";
import StatisticChart from "@features/statistics/components/StatisticChart";

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
  return (
    <Row gutter={8}>
      <Col fullWidth>
        <Table columns={generalStatisticColumn} data={generalStatisticData} />
      </Col>
      <Col fullWidth>
        <StatisticChart />
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
