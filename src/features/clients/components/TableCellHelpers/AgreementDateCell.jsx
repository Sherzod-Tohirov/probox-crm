import moment from "moment";
import { memo, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import formatDate from "@utils/formatDate";

const Title = ({ date }) => {
  if (!date) return "-";
  if (moment(date, "DD.MM.YYYY", true).isValid()) return date;
  return formatDate(date);
};

const AgreementDateCell = ({ column }) => {
  const [open, setOpen] = useState(false);
  return (
    <ModalWrapper
      open={open}
      setOpen={setOpen}
      column={column}
      title={<Title date={column?.NewDueDate} />}></ModalWrapper>
  );
};

export default memo(AgreementDateCell);
