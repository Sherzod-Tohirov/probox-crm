import styles from "./filter.module.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import useWatchFilterFields from "@features/clients/hooks/useWatchFilterFields";
import useFilter from "@features/clients/hooks/useFilter";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Input, Row } from "@components/ui";
import { filterClientFormSchema } from "@utils/validationSchemas";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
import useAuth from "@hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { setClientsFilter } from "@store/slices/clientsPageSlice";
import formatPhoneNumber from "@utils/formatPhoneNumber";

export default function Filter({ onFilter }) {
  const filterState = useSelector((state) => state.page.clients.filter);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: filterState,
    resolver: yupResolver(filterClientFormSchema),
    mode: "all",
  });

  const [toggleSearchFields, setToggleSearchFields] = useState({
    search: false,
    phone: false,
  });

  const dispatch = useDispatch(); // Add dispatch
  const filterObj = useSelector((state) => state.page.clients.filter);
  const { user } = useAuth();
  const { query, phone } = useFilter();
  const { data: executors } = useFetchExecutors();
  const watchedFields = useWatchFilterFields(watch);
  
  const executorsOptions = useMemo(() => {
    const allOption = [{ value: "", label: "All" }];
    const executorOption =
      executors?.data.map((executor) => ({
        value: executor.SlpCode,
        label: executor.SlpName,
      })) || [];
    return [...allOption, ...executorOption];
  }, [executors?.data]);
  console.log(executorsOptions, "executoropiotns");
  const defaultExecutor = useMemo(
    () =>
      executors?.data?.find((executor) => executor.SlpCode === user?.SlpCode)
        ?.SlpCode,
    [user?.SlpCode] || executorsOptions?.[0]?.value
  );

  const handleSearchSelect = useCallback((client) => {
    const formattedPhone = formatPhoneNumber(client.Phone1);
    setValue("search", client.CardName);
    setValue("phone", formattedPhone);

    dispatch(
      setClientsFilter({
        ...filterObj, // Preserve existing filters
        search: client.CardName,
        phone: formattedPhone,
      })
    );
    setToggleSearchFields((prev) => ({
      ...prev,
      search: false,
      phone: false,
    }));
  }, []);

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
            searchText={watchedFields.search}
            onFocus={() =>
              setToggleSearchFields((prev) => ({ ...prev, search: true }))
            }
            onSearch={query.onSearch}
            onSearchSelect={handleSearchSelect}
            renderSearchItem={query.renderItem}
            searchable={toggleSearchFields.search}
            control={control}
            icon={"avatar"}
            {...register("search")}
          />
          <Input
            variant={"outlined"}
            label={"Phone number"}
            type={"tel"}
            searchable={toggleSearchFields.phone}
            searchText={watchedFields.phone}
            onSearch={phone.onSearch}
            onFocus={() => {
              console.log("Phone focused ");
              setToggleSearchFields((prev) => ({ ...prev, phone: true }));
            }}
            onSearchSelect={handleSearchSelect}
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
            {...register("paymentStatus")}
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
