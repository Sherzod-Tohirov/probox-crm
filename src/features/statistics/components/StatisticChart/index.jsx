import { Col, Row, Typography } from "@components/ui";
import ButtonGroup from "./ButtonGroup";
import Chart from "./Chart";
import styles from "./statistic.module.scss";

export default function StatisticChart() {
  return (
    <div className={styles.statistic}>
      <Row>
        <Col>
          <Row>
            <Col>
              <Row>
                <Col>
                  <Typography element="strong" className={styles.title}>
                    Consolidated budget
                  </Typography>
                </Col>
                <Col>Years</Col>
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
