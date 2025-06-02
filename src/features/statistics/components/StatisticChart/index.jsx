import { Col, Row, Typography } from "@components/ui";
import Chart from "./Chart";

import styles from "./statistic.module.scss";
import { ClipLoader } from "react-spinners";

export default function StatisticChart({
  title,
  data = [],
  keys = {},
  date = {},
  isLoading = false,
}) {
  console.log(date, "date");
  return (
    <div className={styles.statistic}>
      <Row>
        <Col fullWidth>
          <Row direction={"row"} justify={"space-between"}>
            <Col>
              <Row>
                <Col>
                  <Typography element="strong" className={styles.title}>
                    {title ?? "Statistika"}
                  </Typography>
                </Col>
                <Col>
                  <Typography element="span" className={styles.subtitle}>
                    {date?.startDate && date?.endDate ? (
                      <>
                        {date.startDate} - {date.endDate}
                      </>
                    ) : null}
                  </Typography>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          {isLoading ? (
            <div className={styles["loader-wrapper"]}>
              <ClipLoader color="#8979FF" size={40} />
            </div>
          ) : data?.length > 0 ? (
            <Chart data={data} keys={keys} />
          ) : (
            <div className={styles["loader-wrapper"]}>
              <Typography element="span" className={styles["no-data"]}>
                Ma'lumotlar mavjud emas
              </Typography>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
