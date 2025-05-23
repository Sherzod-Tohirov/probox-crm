import moment from "moment";
import { memo, useCallback, useMemo, useState } from "react";
import { Input } from "@components/ui";
import { useForm } from "react-hook-form";
import ModalCell from "./helper/ModalCell";
import ModalWrapper from "./helper/ModalWrapper";
import useMutatePhoneConfiscated from "@hooks/data/clients/useMutatePhoneConfiscated";
import useAuth from "@hooks/useAuth";
import hasRole from "@utils/hasRole";
import styles from "./style.module.scss";

import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "@store/slices/toggleSlice";
const Title = ({ phoneConfiscated }) => {
  if (!phoneConfiscated) return "-";
  return <span className={styles["product-box-text"]}>Mahsulot 📲</span>;
};
const ProductCell = ({ column }) => {
  const modalId = `${column?.["DocEntry"]}-product-modal`;
  const {
    reset,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      phoneConfiscated: column?.["phoneConfiscated"],
    },
  });

  const mutation = useMutatePhoneConfiscated();
  const { currentClient } = useSelector((state) => state.page.clients);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const handleApply = useCallback(
    async (data) => {
      const formattedDueDate = moment(currentClient["DueDate"]).format(
        "YYYY.MM.DD"
      );

      const payload = {
        docEntry: currentClient?.["DocEntry"],
        installmentId: currentClient?.["InstlmntID"],
        data: {
          phoneConfiscated: data.phoneConfiscated === "true",
          DueDate: formattedDueDate,
        },
      };
      console.log(payload, "payload");
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

  const productOptions = useMemo(
    () => [
      {
        value: "true",
        label: "Buyum bilan",
      },
      {
        value: "false",
        label: "Buyumsiz",
      },
    ],
    []
  );
  return (
    <ModalWrapper
      modalId={modalId}
      column={column}
      title={<Title phoneConfiscated={column?.["phoneConfiscated"]} />}>
      {hasRole(user, ["Manager", "Cashier"]) ? (
        <ModalCell
          title={"Buyum holatini o'zgartirish"}
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
            type={"select"}
            size={"full-grow"}
            canClickIcon={false}
            options={productOptions}
            variant={"outlined"}
            {...register("phoneConfiscated")}
          />
        </ModalCell>
      ) : null}
    </ModalWrapper>
  );
};

export default memo(ProductCell);
