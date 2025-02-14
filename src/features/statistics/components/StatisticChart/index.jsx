import { Col, Row, Typography } from "@components/ui";
import ButtonGroup from "./FilterToggle";
import Chart from "./Chart";
import styles from "./statistic.module.scss";
import { useState } from "react";

const data = [
  { name: "Jan", sales: 4000, revenue: 2400 },
  { name: "Feb", sales: 3000, revenue: 1398 },
  { name: "Mar", sales: 2000, revenue: 4400 },
  { name: "Apr", sales: 2780, revenue: 3908 },
  { name: "May", sales: 1890, revenue: 4800 },
  { name: "Jun", sales: 2390, revenue: 3800 },
  { name: "Jul", sales: 3490, revenue: 4300 },
  { name: "Aug", sales: 3550, revenue: 4500 },
  { name: "Sep", sales: 4500, revenue: 6500 },
];

const dataYear = [
  { name: "2018", sales: 3000, revenue: 2000 },
  { name: "2019", sales: 4000, revenue: 2400 },
  { name: "2020", sales: 3000, revenue: 1398 },
  { name: "2021", sales: 2000, revenue: 4400 },
  { name: "2022", sales: 4000, revenue: 5400 },
  { name: "2023", sales: 5000, revenue: 6400 },
];

export default function StatisticChart() {
  const [filterType, setFilterType] = useState("all");

  const dataMap = {
    all: data,
    year: dataYear,
    month: data.slice(0, 6),
  };

  return (
    <div className={styles.statistic}>
      <Row>
        <Col fullWidth>
          <Row direction={"row"} justify={"space-between"}>
            <Col>
              <Row>
                <Col>
                  <Typography element="strong" className={styles.title}>
                    Consolidated budget
                  </Typography>
                </Col>
                <Col>
                  <Typography element="span" className={styles.subtitle}>
                    last 12 months
                  </Typography>
                </Col>
              </Row>
            </Col>
            <Col>
              <ButtonGroup
                onFilter={(type) => {
                  console.log("worked type: ", type);
                  setFilterType(type);
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <Chart data={dataMap[filterType]} />
        </Col>
      </Row>
    </div>
  );
}
