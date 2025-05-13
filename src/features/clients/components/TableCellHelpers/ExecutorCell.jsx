import { memo, useCallback, useMemo, useRef, useState } from "react";
import ModalWrapper from "./helper/ModalWrapper";
import { Input } from "@components/ui";
import ModalCell from "./helper/ModalCell";

import useFetchExecutors from "@hooks/data/useFetchExecutors";

import useAuth from "@hooks/useAuth";

import selectOptionsCreator from "@utils/selectOptionsCreator";

import styles from "./style.module.scss";
import { useForm } from "react-hook-form";

const Title = ({ executor, user }) => {
  if (!executor) return "-";

  if (user.SlpCode === executor?.SlpCode) return "Siz";
  return executor.SlpName || "-";
};

const ExecutorCell = ({ column }) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      executor: column?.SlpCode,
    },
  });

  const { data: executors } = useFetchExecutors();
  const { user } = useAuth();

  const executor = useMemo(() => {
    const foundExecutor = executors.find(
      (executor) => Number(executor.SlpCode) === Number(column?.SlpCode)
    );
    return foundExecutor;
  }, [column, executors]);

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

  const handleApply = useCallback((data) => {}, []);

  return (
    <ModalWrapper
      open={open}
      setOpen={setOpen}
      column={column}
      title={<Title executor={executor} user={user} />}>
      <ModalCell
        title={"Ijrochini o'zgartitish"}
        onClose={() => setOpen(false)}
        onApply={handleSubmit(handleApply)}>
        <Input
          inputBoxClassName={styles["modal-input-wrapper"]}
          className={styles["modal-input"]}
          type="select"
          variant={"outlined"}
          value={executor?.SlpCode ?? ""}
          options={executorsOptions}
          canClickIcon={false}
          {...register("executor")}
        />
      </ModalCell>
    </ModalWrapper>
  );
};

export default memo(ExecutorCell);
