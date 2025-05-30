import classNames from "classnames";
import useAuth from "@hooks/useAuth";
import { useForm } from "react-hook-form";
import { memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Input, Button } from "@components/ui";
import useFilter from "@features/statistics/hooks/useFilter";
import getSelectOptionsFromKeys from "@utils/getSelectOptionsFromKeys";
import useWatchedFields from "@features/statistics/hooks/useWatchedFields";
import { initialStatisticsFilterState } from "@utils/store/initialStates";
import { setStatisticsFilter } from "@store/slices/statisticsPageSlice";

import styles from "./style.module.scss";
import _ from "lodash";

const Filter = ({ onFilter, setParams }) => {
  const { executors } = useFilter();
  const { user } = useAuth();
  const dispatch = useDispatch();
  console.log(executors, "executors");

  const filterState = useSelector((state) => state.page.statistics.filter);
  console.log(
    filterState,
    getSelectOptionsFromKeys(executors.options, filterState.slpCode),
    "filterState in Filter component"
  );
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...filterState,
      slpCode: getSelectOptionsFromKeys(executors.options, filterState.slpCode),
    },
    mode: "all",
  });
  const watchedFields = useWatchedFields(watch);
  const handleFilterClear = useCallback(() => {
    dispatch(setStatisticsFilter(initialStatisticsFilterState));
    reset({
      ...initialStatisticsFilterState,
      slpCode: getSelectOptionsFromKeys(
        executors.options,
        initialStatisticsFilterState.slpCode
      ),
    });
    setParams({
      ...initialStatisticsFilterState,
    });
  }, [initialStatisticsFilterState, executors.options]);

  useEffect(() => {
    if (_.isEmpty(executors.options)) return;

    reset({
      ...filterState,
      slpCode: getSelectOptionsFromKeys(
        executors.options,
        filterState.slpCode ? filterState.slpCode : String(user?.SlpCode) || ""
      ),
    });
    setParams({
      ...filterState,
      slpCode: filterState.slpCode || String(user?.SlpCode) || "",
    });
  }, [executors.options, reset]);

  return (
    <form
      className={styles["filter-form"]}
      onSubmit={handleSubmit(onFilter)}
      autoComplete="off">
      <Row direction={"row"} gutter={6.25}>
        <Col gutter={4} flexGrow>
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
            type={"select"}
            size={"full-grow"}
            canClickIcon={false}
            multipleSelect={true}
            options={executors.options}
            variant={"outlined"}
            label={"Mas'ul ijrochi"}
            isLoading={executors.isLoading}
            control={control}
            {...register("slpCode")}
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
                variant={"filled"}>
                Qidiruv
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
};

export default memo(Filter);
