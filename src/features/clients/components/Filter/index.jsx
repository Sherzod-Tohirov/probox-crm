import _ from "lodash";

import styles from "./filter.module.scss";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import useWatchFilterFields from "@features/clients/hooks/useWatchFilterFields";
import useFilter from "@features/clients/hooks/useFilter";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Input, Row } from "@components/ui";
import { filterClientFormSchema } from "@utils/validationSchemas";

import useFetchExecutors from "@hooks/data/clients/useFetchExecutors";

import { useCallback, useEffect, useMemo, useState } from "react";
import { setClientsFilter } from "@store/slices/clientsPageSlice";
import selectOptionsCreator from "@utils/selectOptionsCreator";
import getSelectOptionsFromKeys from "@utils/getSelectOptionsFromKeys";
import { statusOptions } from "@utils/options";

import moment from "moment";
import classNames from "classnames";

import { initialClientsFilterState } from "@utils/store/initialClientsFilterState";
import { productOptions } from "../../../../utils/options";

export default function Filter({ onFilter }) {
  const [paymentStatusMenu, setPaymentStatusMenu] = useState({
    isOpen: false,
    control: false,
  });

  const [executorMenu, setExecutorMenu] = useState({
    isOpen: false,
    control: false,
  });

  const [toggleSearchFields, setToggleSearchFields] = useState({
    search: false,
    phone: false,
  });

  const dispatch = useDispatch(); // Add dispatch

  const { data: executors, isPending: isExecutorsLoading } =
    useFetchExecutors();
  const { query, phone } = useFilter();

  const filterState = useSelector((state) => state.page.clients.filter);

  const executorsOptions = useMemo(() => {
    return selectOptionsCreator(executors, {
      label: "SlpName",
      value: "SlpCode",
    });
  }, [executors]);

  // const defaultExecutor = useMemo(() => {
  //   const foundExecutor = executors?.find(
  //     (executor) => Number(executor.SlpCode) === Number(filterState?.slpCode)
  //   );
  //   if (foundExecutor && _.has(foundExecutor, "SlpCode")) {
  //     return foundExecutor.SlpCode;
  //   }
  //   return executorsOptions?.[0]?.value || "";
  // }, [filterState?.slpCode, executors]);

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
      slpCode: getSelectOptionsFromKeys(executorsOptions, filterState.slpCode),
    },
    resolver: yupResolver(filterClientFormSchema),
    mode: "all",
  });

  const watchedFields = useWatchFilterFields(watch);

  const handleSearchSelect = useCallback((clientData, filterKey) => {
    setValue(filterKey, clientData);
    dispatch(
      setClientsFilter({
        ...filterState, // Preserve existing filters
        [filterKey]: clientData,
      })
    );

    setToggleSearchFields((prev) => ({
      ...prev,
      [filterKey]: false,
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
      slpCode: getSelectOptionsFromKeys(
        executorsOptions,
        initialClientsFilterState.slpCode
      ),
    });
    setExecutorMenu({
      isOpen: false,
      control: false,
    });
  }, [initialClientsFilterState, statusOptions, executorsOptions]);

  const handleFilter = useCallback((data) => {
    try {
      setExecutorMenu({
        isOpen: false,
        control: false,
      });
      setPaymentStatusMenu({
        isOpen: false,
        control: false,
      });
      onFilter(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

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

  useEffect(() => {
    if (!_.isEmpty(executorsOptions)) {
      dispatch(
        setClientsFilter({
          ...filterState,
          search: "",
          phone: "998",
          slpCode: _.map(watchedFields.slpCode, "value").join(","),
        })
      );
      setValue("search", "");
      setValue("phone", "998");
    }
  }, [watchedFields.slpCode, executorsOptions]);

  useEffect(() => {
    if (!_.isEmpty(executorsOptions)) {
      console.log(filterState, "filterState");
      const selectedOptions = getSelectOptionsFromKeys(
        executorsOptions,
        filterState.slpCode
      );
      const selectedPaymentStatus = getSelectOptionsFromKeys(
        statusOptions,
        filterState.paymentStatus
      );

      reset({
        ...filterState,
        paymentStatus: selectedPaymentStatus,
        slpCode: selectedOptions,
      });
    }
  }, [executorsOptions]);

  useEffect(() => {
    if (!watchedFields.search) {
      setValue("phone", "998");
    }
  }, [watchedFields.search]);

  return (
    <form
      className={styles["filter-form"]}
      onSubmit={handleSubmit(handleFilter)}
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
            onSearchSelect={(client) =>
              handleSearchSelect(client.CardName, "search")
            }
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
            onSearchSelect={(client) =>
              handleSearchSelect(client.Phone1, "phone")
            }
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
              setPaymentStatusMenu(() => ({
                control: false,
                isOpen: false,
              }));
            }}
            {...(paymentStatusMenu.control
              ? { menuIsOpen: paymentStatusMenu.isOpen }
              : {})}
            {...register("paymentStatus")}
          />
          <Input
            type={"select"}
            size={"full-grow"}
            canClickIcon={false}
            multipleSelect={true}
            options={executorsOptions}
            variant={"outlined"}
            label={"Mas'ul ijrochi"}
            isLoading={isExecutorsLoading}
            control={control}
            onFocus={() => {
              setExecutorMenu(() => ({
                control: false,
                isOpen: false,
              }));
            }}
            {...(executorMenu.control
              ? { menuIsOpen: executorMenu.isOpen }
              : {})}
            {...register("slpCode")}
          />
          <Input
            type={"select"}
            size={"full-grow"}
            canClickIcon={false}
            options={productOptions}
            variant={"outlined"}
            label={"Buyum"}
            {...register("phoneConfiscated")}
          />
        </Col>
        <Col style={{ marginTop: "25px" }}>
          <Row direction="row" gutter={2}>
            <Col>
              <Button
                className={classNames(styles["filter-btn"], styles["clear"])}
                onClick={handleFilterClear}
                icon={"delete"}
                iconSize={18}
                variant={"filled"}>
                Tozalash
              </Button>
            </Col>
            <Col>
              <Button
                className={styles["filter-btn"]}
                icon={"search"}
                iconSize={18}
                onClick={() => {
                  setPaymentStatusMenu({
                    isOpen: false,
                    control: true,
                  });

                  setExecutorMenu({
                    isOpen: false,
                    control: true,
                  });
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
