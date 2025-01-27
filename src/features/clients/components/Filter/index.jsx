import { Button, Col, Input, Row } from "../../../../components/ui";
import styles from "./filter.module.scss";

export default function Filter({ onFilter }) {
  return (
    <form className={styles["filter-form"]}>
      <Row direction={"row"} gutter={6.25}>
        <Col gutter={4}>
          <Input
            variant={"filter"}
            label={"Email"}
            type={"email"}
            placeholder={"Email"}
          />
          <Input
            variant={"filter"}
            icon={"avatar"}
            label={"Name"}
            type={"text"}
            placeholder={"Akmal Toshev"}
          />
          <Input
            variant={"filter"}
            label={"Phone number"}
            type={"tel"}
            placeholder={"90 123 45 67"}
          />
          <Input
            variant={"filter"}
            label={"Start date"}
            type={"date"}
            placeholder={"01.01.2025"}
          />
          <Input
            variant={"filter"}
            label={"End date"}
            type={"date"}
            placeholder={"01/01/2025"}
          />
          <Input
            variant={"filter"}
            label={"Status"}
            type={"select"}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </Col>
        <Col align="end">
          <Button className={styles["filter-btn"]} variant={"primary"}>
            Поиск
          </Button>
        </Col>
      </Row>
    </form>
  );
}
