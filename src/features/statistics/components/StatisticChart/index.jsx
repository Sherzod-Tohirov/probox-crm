import { Col, Row, Typography } from "@components/ui";
import ButtonGroup from "./FilterToggle";
import Chart from "./Chart";
import styles from "./statistic.module.scss";

export default function StatisticChart() {
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
              <ButtonGroup />
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <Chart />
        </Col>
      </Row>
    </div>
  );
}
