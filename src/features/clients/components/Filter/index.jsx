import styles from "./filter.module.scss";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useFilter from "../../hooks/useFilter";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Input, Row } from "@components/ui";
import { filterClientFormSchema } from "@utils/validationSchemas";
import { useEffect } from "react";
import useWatchFilterFields from "../../hooks/useWatchFilterFields";
export default function Filter({ onFilter }) {
  const filterState = useSelector((state) => state.page.clients.filter);
  console.log(filterState, "filterState");
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: filterState,
    resolver: yupResolver(filterClientFormSchema),
    mode: "all",
  });

  const { query } = useFilter();
  console.log("query", watch("query"));
  const watchedFields = useWatchFilterFields(watch);

  return (
    <form
      className={styles["filter-form"]}
      onSubmit={handleSubmit(onFilter)}
      autoComplete="off">
      <Row direction={"row"} gutter={6.25}>
        <Col gutter={4}>
          <Input
            style={{ width: "240px" }}
            variant={"outlined"}
            label={"IMEI | Name"}
            type={"text"}
            placeholder={"4567890449494 | Azam Toshev"}
            searchText={watch("query")}
            onSearch={query.onSearch}
            onSelect={(item) => console.log(item)}
            renderSearchItem={query.renderItem}
            searchable={true}
            control={control}
            icon={"avatar"}
            {...register("query")}
          />
          <Input
            variant={"outlined"}
            label={"Phone number"}
            type={"tel"}
            // searchable={true}
            placeholder={"90 123 45 67"}
            control={control}
            name={"phone"}
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
            datePickerOptions={{ minDate: watch("startDate") }}
            error={errors?.endDate?.message}
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
        <Col style={{ marginTop: "25px" }}>
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
