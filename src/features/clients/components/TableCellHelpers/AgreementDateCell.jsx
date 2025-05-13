import moment from "moment";
import { memo, useCallback, useState } from "react";
import ModalWrapper from "./helper/ModalWrapper";
import formatDate from "@utils/formatDate";
import ModalCell from "./helper/ModalCell";
import { Input } from "@components/ui";
import styles from "./style.module.scss";
import { useForm } from "react-hook-form";
const Title = ({ date }) => {
  if (!date) return "-";
  if (moment(date, "DD.MM.YYYY", true).isValid()) return date;
  return formatDate(date);
};

const AgreementDateCell = ({ column }) => {
  const [open, setOpen] = useState(false);
  const handleApply = useCallback((data) => {}, []);
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      agreementDate: column?.NewDueDate,
    },
  });
  return (
    <ModalWrapper
      open={open}
      setOpen={setOpen}
      column={column}
      title={<Title date={column?.NewDueDate} />}>
      <ModalCell
        title={"Muddatni o'zgartirish"}
        onClose={() => setOpen(false)}
        onApply={handleSubmit(handleApply)}>
        {column.SlpName}
        <Input
          inputBoxClassName={styles["modal-input-wrapper"]}
          className={styles["modal-input"]}
          type="date"
          variant={"outlined"}
          canClickIcon={false}
          control={control}
          {...register("agreementDate")}
        />
      </ModalCell>
    </ModalWrapper>
  );
};

export default memo(AgreementDateCell);
