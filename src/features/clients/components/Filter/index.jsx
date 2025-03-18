import { Button, Col, Input, Row } from "@components/ui";
import styles from "./filter.module.scss";
import { useForm } from "react-hook-form";

export default function Filter({ onFilter }) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      startDate: "01.01.2025",
      endDate: "01.02.2025",
    },
  });
  return (
    <form
      className={styles["filter-form"]}
      onSubmit={handleSubmit(onFilter)}
      autoComplete="off">
      <Row direction={"row"} gutter={6.25}>
        <Col gutter={4}>
          <Input
            variant={"outlined"}
            label={"IMEI"}
            type={"text"}
            placeholder={"IMEI number"}
            icon={"barCode"}
            {...register("imei")}
          />
          <Input
            variant={"outlined"}
            icon={"avatar"}
            label={"Name"}
            type={"text"}
            placeholder={"Akmal Toshev"}
            searchable={true}
            control={control}
            {...register("name")}
          />
          <Input
            variant={"outlined"}
            label={"Phone number"}
            type={"tel"}
            placeholder={"90 123 45 67"}
            {...register("phone")}
          />
          <Input
            id={"Hello World"}
            variant={"outlined"}
            label={"Start date"}
            type={"date"}
            control={control}
            {...register("startDate")}
          />
          <Input
            variant={"outlined"}
            label={"End date"}
            type={"date"}
            placeholder={"01.01.2025"}
            control={control}
            {...register("endDate")}
          />
          <Input
            variant={"outlined"}
            label={"Status"}
            type={"select"}
            {...register("status")}
            options={[
              { value: "all", label: "All" },
              { value: "paid", label: "Paid" },
              { value: "partially_paid", label: "Partially paid" },
              { value: "not_paid", label: "Not paid" },
            ]}
          />
          <Input
            variant={"outlined"}
            label={"Executor"}
            type={"select"}
            {...register("executor")}
            options={[
              { value: "1", label: "Aziz Toshev" },
              { value: "2", label: "Tolib Yo'ldoshev" },
              { value: "3", label: "Salim Temirov" },
              { value: "4", label: "Fayzulla Berdiyev" },
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
