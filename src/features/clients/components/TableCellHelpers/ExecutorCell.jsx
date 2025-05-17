import moment from "moment";
import { memo, useCallback, useMemo } from "react";
import { Input } from "@components/ui";
import ModalWrapper from "./helper/ModalWrapper";
import ModalCell from "./helper/ModalCell";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
import useMutateClientPageForm from "@hooks/data/useMutateClientPageForm";
import useAuth from "@hooks/useAuth";
import selectOptionsCreator from "@utils/selectOptionsCreator";
import hasRole from "@utils/hasRole";
import styles from "./style.module.scss";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "@store/slices/toggleSlice";

const Title = ({ executor, user }) => {
  if (!executor) return "-";

  if (user.SlpCode === executor?.SlpCode) return "Siz";
  return executor.SlpName || "-";
};

const ExecutorCell = ({ column }) => {
  const modalId = `${column?.["DocEntry"]}-executor-modal`;
  const { data: executors } = useFetchExecutors();
  const executor = useMemo(() => {
    const foundExecutor = executors.find(
      (executor) => Number(executor.SlpCode) === Number(column?.SlpCode)
    );
    return foundExecutor;
  }, [column, executors]);
  const {
    reset,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: { executor: executor?.SlpCode ?? "" },
  });

  const mutation = useMutateClientPageForm();
  const { currentClient } = useSelector((state) => state.page.clients);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
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

  const handleApply = useCallback(
    async (data) => {
      const formattedDueDate = moment(currentClient["DueDate"]).format(
        "YYYY.MM.DD"
      );

      const payload = {
        docEntry: currentClient?.["DocEntry"],
        installmentId: currentClient?.["InstlmntID"],
        data: {
          slpCode: data?.executor,
          DueDate: formattedDueDate,
        },
      };
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
          <Input
            inputBoxClassName={styles["modal-input-wrapper"]}
            className={styles["modal-input"]}
            type="select"
            variant={"outlined"}
            options={executorsOptions}
            canClickIcon={false}
            {...register("executor")}
          />
        </ModalCell>
      ) : null}
    </ModalWrapper>
  );
};

export default memo(ExecutorCell);
