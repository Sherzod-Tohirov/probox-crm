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

import { useCallback, useMemo, useState } from "react";
import { setClientsFilter } from "@store/slices/clientsPageSlice";
import formatPhoneNumber from "@utils/formatPhoneNumber";
import selectOptionsCreator from "@utils/selectOptionsCreator";
import getSelectOptionsFromKeys from "@utils/getSelectOptionsFromKeys";
import { statusOptions } from "@utils/options";

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
    defaultValues: {
      ...filterState,
      paymentStatus: getSelectOptionsFromKeys(
        statusOptions,
        filterState.paymentStatus
      ),
    },
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
  console.log(executors, "executors2");
  const watchedFields = useWatchFilterFields(watch);

  const executorsOptions = useMemo(() => {
    return selectOptionsCreator(executors?.data, {
      label: "SlpName",
      value: "SlpCode",
      includeAll: true,
    });
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
            style={{ width: "300px" }}
            variant={"outlined"}
            label={"IMEI | FIO"}
            type={"text"}
            placeholder={"4567890449494 | Ismi Sharif"}
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
            label={"Telefon raqami"}
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
            id={"startDate"}
            style={{ width: "140px" }}
            variant={"outlined"}
            label={"Boshlanish vaqti"}
            canClickIcon={false}
            type={"date"}
            control={control}
            {...register("startDate")}
          />
          <Input
            style={{ width: "140px" }}
            variant={"outlined"}
            label={"Tugash vaqti"}
            canClickIcon={false}
            type={"date"}
            datePickerOptions={{ minDate: watch("startDate") }}
            error={errors?.endDate?.message}
            control={control}
            {...register("endDate")}
          />
          <Input
            style={{ minWidth: "170px" }}
            canClickIcon={false}
            variant={"outlined"}
            label={"Holati"}
            type={"select"}
            {...register("paymentStatus")}
            control={control}
            options={statusOptions}
            multipleSelect={true}
          />
          <Input
            style={{ width: "130px" }}
            canClickIcon={false}
            variant={"outlined"}
            label={"Mas'ul ijrochi"}
            type={"select"}
            {...register("slpCode")}
            defaultValue={defaultExecutor}
            options={executorsOptions}
          />
        </Col>
        <Col style={{ marginTop: "25px" }}>
          <Button
            className={styles["filter-btn"]}
            icon={"search"}
            variant={"filled"}>
            Qidiruv
          </Button>
        </Col>
      </Row>
    </form>
  );
}
