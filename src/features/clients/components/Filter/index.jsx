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
import { formatPhoneNumber } from "@utils/formatPhoneNumber";
import selectOptionsCreator from "@utils/selectOptionsCreator";
import getSelectOptionsFromKeys from "@utils/getSelectOptionsFromKeys";
import { statusOptions } from "@utils/options";
import _ from "lodash";
import moment from "moment";
import classNames from "classnames";
import { initialClientsFilterState } from "@utils/store/initialClientsFilterState";

export default function Filter({ onFilter }) {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [shouldPaymentStatusMenu, setShouldPaymentStatusMenu] = useState(false);
  const filterState = useSelector((state) => state.page.clients.filter);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
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

  const filterObj = useSelector((state) => state.page.clients.filter);
  const watchedFields = useWatchFilterFields(watch);
  const { data: executors } = useFetchExecutors();
  const { query, phone } = useFilter();
  const dispatch = useDispatch(); // Add dispatch
  const { user } = useAuth();

  const executorsOptions = useMemo(() => {
    return selectOptionsCreator(executors, {
      label: "SlpName",
      value: "SlpCode",
      includeAll: true,
    });
  }, [executors]);

  const defaultExecutor = useMemo(() => {
    const foundExecutor = executors?.find(
      (executor) => Number(executor.SlpCode) === Number(filterObj?.slpCode)
    );
    if (foundExecutor && _.has(foundExecutor, "SlpCode")) {
      return foundExecutor.SlpCode;
    }
    return executorsOptions?.[0]?.value || "";
  }, [filterObj?.slpCode, executors]);

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

  const handleFilterClear = useCallback(() => {
    dispatch(setClientsFilter(initialClientsFilterState));
    reset({
      ...initialClientsFilterState,
      paymentStatus: getSelectOptionsFromKeys(
        statusOptions,
        initialClientsFilterState.paymentStatus
      ),
    });
  }, [initialClientsFilterState, statusOptions]);

  useEffect(() => {
    const startDate = moment(watchedFields.startDate, "DD.MM.YYYY");
    const endDate = moment(watchedFields.endDate, "DD.MM.YYYY");

    const isSameMonth = startDate.isSame(endDate, "month");
    if (watchedFields.startDate && !isSameMonth) {
      let newEndDate = startDate.clone().endOf("month");
      if (newEndDate.date() !== startDate.date()) {
        newEndDate = newEndDate.endOf("month");
      }
      setValue("endDate", newEndDate.format("DD.MM.YYYY"));
    }
  }, [watchedFields.startDate, setValue]);
  console.log(shouldPaymentStatusMenu, "should");
  useEffect(() => {
    console.log(watchedFields, filterObj, "obj");
    if (watchedFields.slpCode !== filterObj.slpCode) {
      dispatch(
        setClientsFilter({
          ...filterObj,
          search: "",
          phone: "998",
          slpCode: watchedFields.slpCode,
        })
      );
      setValue("search", "");
      setValue("phone", "998");
    }
  }, [watchedFields.slpCode]);

  useEffect(() => {
    if (!watchedFields.search) {
      setValue("phone", "998");
    }
  }, [watchedFields.search]);

  return (
    <form
      className={styles["filter-form"]}
      onSubmit={handleSubmit(onFilter)}
      autoComplete="off">
      <Row direction={"row"} gutter={6.25}>
        <Col gutter={4} flexGrow>
          <Input
            style={{ minWidth: "230px" }}
            size={"full-grow"}
            variant={"outlined"}
            label={"IMEI | FIO"}
            type={"search"}
            placeholder={"4567890449494 | Ismi Sharif"}
            placeholderColor={"secondary"}
            searchText={watchedFields.search}
            onFocus={() => {
              setToggleSearchFields((prev) => ({ ...prev, search: true }));
            }}
            onSearch={query.onSearch}
            onSearchSelect={handleSearchSelect}
            renderSearchItem={query.renderItem}
            searchable={toggleSearchFields.search}
            control={control}
            {...register("search")}
          />
          <Input
            type={"tel"}
            size={"full-grow"}
            variant={"outlined"}
            label={"Telefon raqami"}
            onSearch={phone.onSearch}
            searchText={watchedFields.phone}
            searchable={toggleSearchFields.phone}
            onFocus={() => {
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
            size={"full-grow"}
            variant={"outlined"}
            label={"Boshlanish vaqti"}
            canClickIcon={false}
            type={"date"}
            control={control}
            {...register("startDate")}
          />
          <Input
            size={"full-grow"}
            variant={"outlined"}
            label={"Tugash vaqti"}
            canClickIcon={false}
            type={"date"}
            datePickerOptions={{ minDate: watchedFields.startDate }}
            error={errors?.endDate?.message}
            control={control}
            {...register("endDate")}
          />
          <Input
            size={"full-grow"}
            canClickIcon={false}
            variant={"outlined"}
            label={"Holati"}
            type={"select"}
            className={"paymentStatus"}
            control={control}
            options={statusOptions}
            multipleSelect={true}
            onFocus={() => {
              setIsStatusMenuOpen(false);
              setShouldPaymentStatusMenu(false);
            }}
            {...(shouldPaymentStatusMenu
              ? { menuIsOpen: isStatusMenuOpen }
              : {})}
            {...register("paymentStatus")}
          />
          <Input
            size={"full-grow"}
            canClickIcon={false}
            variant={"outlined"}
            label={"Mas'ul ijrochi"}
            type={"select"}
            {...register("slpCode")}
            value={defaultExecutor}
            options={executorsOptions}
          />
        </Col>
        <Col style={{ marginTop: "25px" }}>
          <Row direction="row" gutter={2}>
            <Col>
              <Button
                className={classNames(styles["filter-btn"], styles["clear"])}
                onClick={handleFilterClear}
                icon={"delete"}
                variant={"filled"}>
                Tozalash
              </Button>
            </Col>
            <Col>
              <Button
                className={styles["filter-btn"]}
                icon={"search"}
                onClick={() => {
                  setIsStatusMenuOpen(false);
                  setShouldPaymentStatusMenu(true);
                }}
                variant={"filled"}>
                Qidiruv
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
}
