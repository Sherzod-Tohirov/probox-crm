import moment from "moment";
import { memo, useCallback, useMemo } from "react";
import { Input, Box } from "@components/ui";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import useMutatePhoneConfiscated from "@hooks/data/clients/useMutatePhoneConfiscated";
import useAuth from "@hooks/useAuth";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import { useQueryClient } from "@tanstack/react-query";
import { toggleModal } from "@store/slices/toggleSlice";
import hasRole from "@utils/hasRole";
import ModalCell from "./helper/ModalCell";
import ModalWrapper from "./helper/ModalWrapper";
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
      phoneConfiscated: column?.["phoneConfiscated"],
    },
  });
  const mutation = useMutatePhoneConfiscated();
  const { currentClient } = useSelector((state) => state.page.clients);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const handleApply = useCallback(async (data) => {}, [currentClient]);

  const paymentOptions = useMemo(
    () => [
      {
        value: "true",
        label: "To'liq qoplash",
      },
      {
        value: "false",
        label: "Belgilanmagan",
      },
    ],
    []
  );
  return (
    <ModalWrapper
      modalId={modalId}
      column={column}
      title={<Title column={column} />}>
      {/* {hasRole(user, ["Manager", "Cashier"]) && !column.PhoneConfiscated ? (
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
            {...register("phoneConfiscated")}
          />
        </ModalCell>
      ) : null} */}
    </ModalWrapper>
  );
};

export default memo(ManualPaymentCell);
