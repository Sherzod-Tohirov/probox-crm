import moment from "moment";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Input, Row, Col, Button } from "@components/ui";
import ModalWrapper from "./helper/ModalWrapper";
import ModalCell from "./helper/ModalCell";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
import useMutateClientPageForm from "@hooks/data/clients/useMutateClientPageForm";
import useAuth from "@hooks/useAuth";
import selectOptionsCreator from "@utils/selectOptionsCreator";
import hasRole from "@utils/hasRole";
import styles from "./style.module.scss";
import { useForm, useFormState } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "@store/slices/toggleSlice";
import { setLastAction } from "@store/slices/clientsPageSlice";

const Title = ({ executor, user }) => {
  if (!executor) return "-";

  if (user.SlpCode === executor?.SlpCode) return "Siz";
  return executor.SlpName || "-";
};

const ExecutorCell = ({ column }) => {
  const { data: executors } = useFetchExecutors();
  const modalId = `${column?.["DocEntry"]}-executor-modal`;
  const queryClient = useQueryClient();

  const executor = useMemo(() => {
    const foundExecutor = executors?.find(
      (executor) => Number(executor.SlpCode) === Number(column?.SlpCode)
    );
    return foundExecutor;
  }, [column, executors]);

  const { reset, register, setValue, handleSubmit, control, watch } = useForm({
    defaultValues: { slpCode: executor?.SlpCode ?? "" },
  });

  const { isDirty } = useFormState({ control });
  const slpCodeField = watch("slpCode");
  const dispatch = useDispatch();
  const mutation = useMutateClientPageForm();

  const { currentClient } = useSelector((state) => state.page.clients);
  const { user } = useAuth();

  const lastAction = useSelector((state) => state.page.clients.lastAction);

  const hasLastAction = useMemo(
    () =>
      lastAction.find(
        (action) =>
          action.id === currentClient?.["DocEntry"] &&
          action.type === "slpCode_update"
      ),
    [lastAction, currentClient, dispatch]
  );

  const executorsOptions = useMemo(
    () =>
      selectOptionsCreator(executors, {
        label: "SlpName",
        value: "SlpCode",
        includeEmpty: true,
        isEmptySelectable: false,
      }),
    [executors]
  );

  const [isLastActionBtnDisabled, setIsLastActionBtnDisabled] = useState(
    !hasLastAction
  );

  useEffect(() => {
    if (hasLastAction) {
      setIsLastActionBtnDisabled(slpCodeField == hasLastAction?.oldValue);
    } else {
      setIsLastActionBtnDisabled(true);
    }
  }, [slpCodeField, hasLastAction]);

  const handleLastAction = useCallback(() => {
    if (hasLastAction) {
      setValue("slpCode", Number(hasLastAction?.oldValue), {
        shouldDirty: true,
      });
    }
  }, [hasLastAction]);

  useEffect(() => {
    if (executor) {
      reset({ slpCode: executor?.SlpCode ?? "" });
    }
  }, [executor?.SlpCode, reset]);

  const handleApply = useCallback(
    async (data) => {
      const formattedDueDate = moment(currentClient["DueDate"]).format(
        "YYYY.MM.DD"
      );

      const payload = {
        docEntry: currentClient?.["DocEntry"],
        installmentId: currentClient?.["InstlmntID"],
        data: {
          slpCode: data?.slpCode,
          DueDate: formattedDueDate,
        },
      };
      if (hasLastAction) {
        const copiedLastAction = { ...hasLastAction };
        copiedLastAction.oldValue = String(currentClient?.["SlpCode"]);
        copiedLastAction.currentValue = String(data?.slpCode);
        const updatedActions = lastAction.map((action) => {
          if (
            action.id === copiedLastAction.id &&
            action.type === copiedLastAction.type
          ) {
            return copiedLastAction;
          }
          return action;
        });
        dispatch(setLastAction(updatedActions));
      } else {
        dispatch(
          setLastAction([
            ...lastAction,
            {
              id: currentClient?.["DocEntry"],
              type: "slpCode_update",
              oldValue: String(currentClient?.["SlpCode"]),
              currentValue: String(data?.slpCode),
            },
          ])
        );
      }
      try {
        await mutation.mutateAsync(payload);
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        });
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(toggleModal(modalId));
      }
    },
    [currentClient]
  );

  return (
    <ModalWrapper
      modalId={modalId}
      column={column}
      title={<Title executor={executor} user={user} />}>
      {hasRole(user, ["Manager", "Cashier"]) ? (
        <ModalCell
          title={"Ijrochini o'zgartirish"}
          onClose={() => {
            dispatch(toggleModal(modalId));
            reset();
          }}
          onApply={handleSubmit(handleApply)}
          applyButtonProps={{
            disabled: !isDirty,
            isLoading: mutation.isPending,
          }}>
          <Row direction={"row"} gutter={2} align={"center"}>
            <Col flexGrow>
              <Input
                inputBoxClassName={styles["modal-input-wrapper"]}
                className={styles["modal-input"]}
                type="select"
                variant={"outlined"}
                options={executorsOptions}
                canClickIcon={false}
                {...register("slpCode")}
              />
            </Col>
            <Col>
              <Button
                title={"Oxirgi holatga qaytarish"}
                iconSize={16}
                disabled={isLastActionBtnDisabled}
                variant={"filled"}
                iconColor={"secondary"}
                onClick={handleLastAction}
                icon={"refresh"}></Button>
            </Col>
          </Row>
        </ModalCell>
      ) : null}
    </ModalWrapper>
  );
};

export default memo(ExecutorCell);
