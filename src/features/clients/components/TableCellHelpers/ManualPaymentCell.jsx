import moment from "moment";
import { useForm } from "react-hook-form";
import { Input, Box } from "@components/ui";
import { memo, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import useAuth from "@hooks/useAuth";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import useMutatePartialPayment from "@hooks/data/clients/useMutatePartialPayment";

import hasRole from "@utils/hasRole";
import ModalCell from "./helper/ModalCell";
import ModalWrapper from "./helper/ModalWrapper";
import { toggleModal } from "@store/slices/toggleSlice";
import formatterCurrency from "@utils/formatterCurrency";

const Title = ({ column }) => {
  const { data: currency } = useFetchCurrency();

  const SUM = column.PaidToDate * currency?.["Rate"];
  return (
    (
      <Box gap={1}>
        <span style={{ color: "red" }}>
          {formatterCurrency(column.PaidToDate, "USD")}{" "}
        </span>
        <span style={{ fontWeight: 900, color: "red" }}>
          ({formatterCurrency(SUM || 0, "UZS")})
        </span>
      </Box>
    ) || "Unknown"
  );
};
const ManualPaymentCell = ({ column }) => {
  const modalId = `${column?.["DocEntry"]}-manual-payment-modal`;
  const {
    reset,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      partial: column?.["partial"],
    },
  });
  const mutation = useMutatePartialPayment();
  const { user } = useAuth();
  const { currentClient } = useSelector((state) => state.page.clients);
  const dispatch = useDispatch();
  const handleApply = useCallback(
    async (data) => {
      const formattedDueDate = moment(currentClient["DueDate"]).format(
        "YYYY.MM.DD"
      );
      const payload = {
        docEntry: currentClient?.["DocEntry"],
        installmentId: currentClient?.["InstlmntID"],
        data: {
          partial: data.partial === "true",
          DueDate: formattedDueDate,
        },
      };
      try {
        await mutation.mutateAsync(payload);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(toggleModal(modalId));
      }
    },
    [currentClient]
  );

  const paymentOptions = useMemo(
    () => [
      {
        value: true,
        label: "To'langan qilish",
      },
      {
        value: false,
        label: "Belgilanmagan",
      },
    ],
    []
  );
  const canUserModify =
    hasRole(user, ["Manager", "Cashier"]) && !column.phoneConfiscated;
  return (
    <ModalWrapper
      allowClick={!canUserModify}
      modalId={modalId}
      column={column}
      title={<Title column={column} />}>
      {canUserModify ? (
        <ModalCell
          title={"To'lov holatini o'zgartirish"}
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
            options={paymentOptions}
            variant={"outlined"}
            {...register("partial")}
          />
        </ModalCell>
      ) : null}
    </ModalWrapper>
  );
};

export default memo(ManualPaymentCell);
