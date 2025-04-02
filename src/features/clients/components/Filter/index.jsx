import styles from "./filter.module.scss";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useFilter from "../../hooks/useFilter";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Input, Row } from "@components/ui";
import { filterClientFormSchema } from "@utils/validationSchemas";
import useWatchFilterFields from "../../hooks/useWatchFilterFields";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
import useAuth from "@hooks/useAuth";
import { useMemo } from "react";
export default function Filter({ onFilter }) {
  const filterState = useSelector((state) => state.page.clients.filter);
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
  const { query, phone } = useFilter();
  const watchedFields = useWatchFilterFields(watch);
  const { data: executors } = useFetchExecutors();

  const { user } = useAuth();

  const executorsOptions = useMemo(
    () =>
      executors?.data.map((executor) => ({
        value: executor.SlpCode,
        label: executor.SlpName,
      })),
    [executors?.data]
  );

  const defaultExecutor = useMemo(
    () =>
      executors?.data?.find((executor) => executor.SlpCode === user?.SlpCode)
        ?.SlpCode,
    [user?.SlpCode] || executorsOptions?.[0]?.value
  );

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
            searchText={watchedFields.query}
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
            searchable={true}
            searchText={watchedFields.phone}
            onSearch={phone.onSearch}
            onSelect={(item) => console.log(item)}
            renderSearchItem={phone.renderItem}
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
              { value: "partial", label: "Partially paid" },
              { value: "unpaid", label: "Not paid" },
            ]}
          />
          <Input
            variant={"outlined"}
            label={"Executor"}
            type={"select"}
            {...register("executor")}
            defaultValue={defaultExecutor}
            options={executorsOptions}
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
