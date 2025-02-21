import { Button, Col, Input, Row } from "@components/ui";
import styles from "./filter.module.scss";

export default function Filter({ onFilter }) {
  return (
    <form className={styles["filter-form"]}>
      <Row direction={"row"} gutter={6.25}>
        <Col gutter={4}>
          <Input
            variant={"outlined"}
            label={"IMEI"}
            type={"text"}
            placeholder={"IMEI number"}
            icon={"barCode"}
          />
          <Input
            variant={"outlined"}
            icon={"avatar"}
            label={"Name"}
            type={"text"}
            placeholder={"Akmal Toshev"}
          />
          <Input
            variant={"outlined"}
            label={"Phone number"}
            type={"tel"}
            placeholder={"90 123 45 67"}
          />
          <Input
            variant={"outlined"}
            label={"Start date"}
            type={"date"}
            placeholder={"01.01.2025"}
          />
          <Input
            variant={"outlined"}
            label={"End date"}
            type={"date"}
            placeholder={"01/01/2025"}
          />
          <Input
            variant={"outlined"}
            label={"Status"}
            type={"select"}
            options={[
              { value: "all", label: "All" },
              { value: "paid", label: "Paid" },
              { value: "partially_paid", label: "Partially paid" },
              { value: "not_paid", label: "Not paid" },
            ]}
          />
        </Col>
        <Col align="end">
          <Button
            className={styles["filter-btn"]}
            icon={"search"}
            variant={"filled"}>
            Поиск
          </Button>
        </Col>
      </Row>
    </form>
  );
}
