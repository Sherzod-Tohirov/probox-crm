import moment from "moment";
import { memo, useCallback, useEffect, useMemo } from "react";
import { Input, Status } from "@components/ui";
import { useForm } from "react-hook-form";
import ModalCell from "./helper/ModalCell";
import ModalWrapper from "./helper/ModalWrapper";
import useMutatePhoneConfiscated from "@hooks/data/clients/useMutatePhoneConfiscated";
import useAuth from "@hooks/useAuth";
import hasRole from "@utils/hasRole";

import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "@store/slices/toggleSlice";
const Title = ({ column }) => {
  let status = "unpaid";
  if (column.phoneConfiscated) status = "product";
  else if (column.partial) status = "manual_paid";
  else {
    const statusCalc =
      parseFloat(column.InsTotal) - parseFloat(column.PaidToDate);
    if (statusCalc > 0 && statusCalc < column.InsTotal) status = "partial";
    if (statusCalc === 0) status = "paid";
  }

  return <Status status={status} />;
};

const useProductCell = (column) => {
  const { user } = useAuth();
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
  const canUserModify =
    hasRole(user, ["Manager", "Cashier"]) && !column.partial;
  return { productOptions, canUserModify };
};
const ProductCell = ({ column }) => {
  const modalId = `${column?.["DocEntry"]}-product-modal`;
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      phoneConfiscated: column?.["phoneConfiscated"],
    },
  });

  const mutation = useMutatePhoneConfiscated();
  const { currentClient } = useSelector((state) => state.page.clients);
  const { productOptions, canUserModify } = useProductCell(column);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
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

  // Sync form with column changes
  useEffect(() => {
    if (column?.["phoneConfiscated"] !== undefined) {
      setValue("phoneConfiscated", Boolean(column["phoneConfiscated"]), {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [column?.["phoneConfiscated"], setValue]);
  return (
    <ModalWrapper
      allowClick={!canUserModify}
      modalId={modalId}
      column={column}
      title={<Title column={column} />}>
      {canUserModify ? (
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
