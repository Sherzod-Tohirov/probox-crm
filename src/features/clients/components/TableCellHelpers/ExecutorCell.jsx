import { memo, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
import useAuth from "@hooks/useAuth";
const Title = ({ slpCode }) => {
  const { data: executors } = useFetchExecutors();
  const { user } = useAuth();
  if (!slpCode) return "-";
  if (!executors) return "-";

  const executor = executors.find(
    (executor) => Number(executor.SlpCode) === Number(slpCode)
  );
  if (!executor) return "-";

  if (user.SlpCode === executor?.SlpCode) return "Siz";
  return executor.SlpName || "-";
};

const ExecutorCell = ({ column }) => {
  const [open, setOpen] = useState(false);
  return (
    <ModalWrapper
      open={open}
      setOpen={setOpen}
      column={column}
      title={<Title slpCode={column?.SlpCode} />}></ModalWrapper>
  );
};

export default memo(ExecutorCell);
