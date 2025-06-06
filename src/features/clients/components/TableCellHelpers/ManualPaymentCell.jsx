import moment from "moment";
import { useForm } from "react-hook-form";
import { Input, Box } from "@components/ui";
import { memo, useCallback, useEffect, useMemo } from "react";
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

const useManualPaymentCell = (column) => {
  const { user } = useAuth();
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
  const isStatusPaid = useMemo(() => {
    const statusCalc =
      parseFloat(column.InsTotal) - parseFloat(column.PaidToDate);
    if (statusCalc === 0) return true;
    return false;
  }, [column]);

  return { paymentOptions, canUserModify, isStatusPaid };
};

const ManualPaymentCell = ({ column }) => {
  const modalId = `${column?.["DocEntry"]}-manual-payment-modal`;
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      partial: Boolean(column?.["partial"]), // Convert to boolean
    },
  });

  // Add modalOpen state tracking
  const isModalOpen = useSelector((state) => state.toggle.modals[modalId]);

  const dispatch = useDispatch();
  const mutation = useMutatePartialPayment();
  const partialField = watch("partial");

  const { paymentOptions, canUserModify, isStatusPaid } =
    useManualPaymentCell(column);
  const { currentClient } = useSelector((state) => state.page.clients);

  // Sync form with column changes
  useEffect(() => {
    if (column?.["partial"] !== undefined) {
      setValue("partial", Boolean(column["partial"]), {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [column?.["partial"], setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      reset({
        partial: Boolean(column?.["partial"]),
      });
    }
  }, [isModalOpen, column, reset]);

  const handleApply = useCallback(
    async (data) => {
      const formattedDueDate = moment(currentClient["DueDate"]).format(
        "YYYY.MM.DD"
      );

      const payload = {
        docEntry: currentClient?.["DocEntry"],
        installmentId: currentClient?.["InstlmntID"],
        data: {
          partial: data.partial === "true", // Ensure boolean
          DueDate: formattedDueDate,
        },
      };

      try {
        await mutation.mutateAsync(payload);
        dispatch(toggleModal(modalId));
      } catch (error) {
        console.error("Payment update failed:", error);
      }
    },
    [currentClient, modalId, mutation, dispatch]
  );

  const handleClose = useCallback(() => {
    dispatch(toggleModal(modalId));
    reset();
  }, [dispatch, modalId, reset]);

  return (
    <ModalWrapper
      allowClick={!canUserModify || isStatusPaid}
      modalId={modalId}
      column={column}
      title={<Title column={column} />}>
      {canUserModify && !isStatusPaid ? (
        <ModalCell
          title={"To'lov holatini o'zgartirish"}
          onClose={handleClose}
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
            value={partialField} // Add controlled value
            {...register("partial")}
          />
        </ModalCell>
      ) : null}
    </ModalWrapper>
  );
};

export default memo(ManualPaymentCell);
