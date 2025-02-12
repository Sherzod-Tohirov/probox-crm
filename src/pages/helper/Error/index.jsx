import { Button, Row, Col } from "@components/ui";
import styles from "./error.module.scss";

export default function Error({
  error = {
    message: "Iltimos, qayta urinib ko'ring.",
  },
  onRetry,
}) {
  return (
    <div className={styles["page-error"]}>
      <Row gutter={2}>
        <Col>
          <h1 className={styles.title}>Kechirasiz, xatolik yuz berdi {":)"}</h1>
        </Col>
        <Col>
          <p className={styles.desc}>
            <strong>Message: </strong> {error.message}
          </p>
        </Col>
        <Col style={{ marginTop: "18px" }}>
          <Button
            icon={"refresh"}
            iconColor={"secondary"}
            variant={"filled"}
            onClick={onRetry}>
            Yangilash
          </Button>
        </Col>
      </Row>
    </div>
  );
}
