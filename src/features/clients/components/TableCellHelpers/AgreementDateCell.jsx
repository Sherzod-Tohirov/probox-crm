import moment from "moment";
import { memo, useCallback, useState } from "react";
import { Input } from "@components/ui";
import { useForm } from "react-hook-form";
import ModalCell from "./helper/ModalCell";
import ModalWrapper from "./helper/ModalWrapper";
import useMutateClientPageForm from "@hooks/data/useMutateClientPageForm";

import formatDate from "@utils/formatDate";
import styles from "./style.module.scss";

import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../../../../store/slices/toggleSlice";
const Title = ({ date }) => {
  if (!date) return "-";
  if (moment(date, "DD.MM.YYYY", true).isValid()) return date;
  return formatDate(date);
};
const AgreementDateCell = ({ column }) => {
  const modalId = `${column?.["DocEntry"]}-agreement-date-modal`;
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      agreementDate: column?.NewDueDate,
    },
  });

  const mutation = useMutateClientPageForm();
  const { currentClient } = useSelector((state) => state.page.clients);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleApply = useCallback(
    async (data) => {
      const formattedDueDate = moment(currentClient["DueDate"]).format(
        "YYYY.MM.DD"
      );

      const formattedAgreementDate = formatDate(
        data?.agreementDate,
        "DD.MM.YYYY",
        "YYYY.MM.DD"
      );

      const payload = {
        docEntry: currentClient?.["DocEntry"],
        installmentId: currentClient?.["InstlmntID"],
        data: {
          slpCode: column?.SlpCode,
          DueDate: formattedDueDate,
          newDueDate: formattedAgreementDate,
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
      title={<Title date={column?.NewDueDate} />}>
      <ModalCell
        title={"Muddatni o'zgartirish"}
        onClose={() => {
          dispatch(toggleModal(modalId));
          reset();
        }}
        onApply={handleSubmit(handleApply)}
        applyButtonProps={{
          disabled: !isDirty,
          isLoading: mutation.isPending,
        }}>
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
