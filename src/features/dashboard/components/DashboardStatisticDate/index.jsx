import { Col, Row, Typography } from "@components/ui";
import iconsMap from "@/utils/iconsMap";
import styles from "./statistic.module.scss";

export default function DashboardStatisticDate({ startDate, endDate }) {
  return (
    <div className={styles["statistic-date"]}>
      <Row direction="row" justify={"center"} align={"center"} gutter={4}>
        <Col>
          <Row gutter={1}>
            <Col>
              <Typography element="p" className={styles.title}>
                Start date
              </Typography>
            </Col>
            <Col>
              <Typography element="span" className={styles.date}>
                {startDate || "01.02.2025"}
              </Typography>
            </Col>
          </Row>
        </Col>
        <Col>
          <Typography element="time" className={styles["arrow-icon"]}>
            {iconsMap["arrowRightLong"]}
          </Typography>
        </Col>
        <Col>
          <Row gutter={1}>
            <Col>
              <Typography element="p" className={styles.title}>
                End date
              </Typography>
            </Col>
            <Col>
              <Typography element="time" className={styles.date}>
                {endDate || "10.02.2025"}
              </Typography>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
