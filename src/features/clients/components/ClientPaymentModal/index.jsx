import moment from "moment/moment";
import styles from "./clientPaymentModal.module.scss";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Input, Typography, Row, Col, Button } from "@components/ui";
import RadioInput from "./RadioInput";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import formatterCurrency from "@utils/formatterCurrency";
import { CURRENCY_MAP } from "@utils/constants";
import { PAYMENT_ACCOUNTS } from "@utils/constants";
import useMutateClientPaymentModal from "@hooks/data/useMutateClientPayment";

const ModalFooter = memo(({ onClose, isLoading = false, isValid = false }) => {
  return (
    <Row direction="row" align="center" justify="center" gutter={4}>
      <Col flexGrow>
        <Button fullWidth variant={"filled"} color={"danger"} onClick={onClose}>
          Bekor qilish
        </Button>
      </Col>
      <Col flexGrow>
        <Button
          fullWidth
          form={"payment_form"}
          variant={"filled"}
          isLoading={isLoading}
          disabled={!isValid}
          type={"submit"}>
          Tasdiqlash
        </Button>
      </Col>
    </Row>
  );
});

const ERROR_MESSAGES = {
  required: "Bu maydonni to'ldirish shart",
  sumNull: "Summa 0 dan katta bo'lishi kerak",
  sumNegative: "Summa manfiy bo'lmasligi kerak",
  sumNotGreaterThanInsTotal: "Summa oylik to'lovdan katta bo'lmasligi kerak!",
};

export default function ClientPaymentModal({ isOpen, onClose }) {
  const { register, handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      sum: 0,
      date: moment().format("DD.MM.YYYY"),
      paymentType: "cash",
      account: "5040",
    },
  });
  const mutation = useMutateClientPaymentModal({
    onSuccess: () => {
      onClose();
      reset();
    },
  });
  const [hasError, setHasError] = useState({
    sum: false,
    date: false,
    paymentType: false,
    account: false,
  });
  const [isValid, setIsValid] = useState(true);
  const paymentType = watch("paymentType");
  const sum = watch("sum");
  const { data: currencyData } = useFetchCurrency();
  const [currency, setCurrency] = useState(
    paymentType === "cash" || paymentType === "visa" ? "USD" : "UZS"
  );
  const currenctClient = useSelector(
    (state) => state.page.clients.currentClient
  );

  const branchOptions = useMemo(
    () => [
      { value: "5040", label: "Qoratosh" },
      { value: "5010", label: "Sag'bon" },
    ],
    []
  );

  const handlePriceChange = useCallback((e) => {
    let value = e.target.value.replace(/[^0-9.,-]/g, ""); // Remove non-numeric characters

    if (value === "" || value === "." || value === "-") {
      setValue("sum", value);
      return;
    }

    const numericValue = Number(value.replace(/,/g, "")); // Convert to number
    setValue("sum", numericValue); // Store the raw numeric value
  });

  useEffect(() => {
    if (paymentType === "cash" || paymentType === "visa") {
      setCurrency("USD");
    } else {
      setCurrency("UZS");
    }
  }, [paymentType]);

  useEffect(() => {
    let currenctClientSum = currenctClient["InsTotal"];
    if (!(paymentType === "cash" || paymentType === "visa")) {
      currenctClientSum = currenctClient["InsTotal"] * currencyData?.["Rate"];
    }
    if (sum > currenctClientSum) {
      setHasError((prev) => ({ ...prev, sum: "sumNotGreaterThanInsTotal" }));
      setIsValid(false);
    } else {
      setHasError((prev) => ({ ...prev, sum: false }));
      setIsValid(true);
    }
  }, [sum, paymentType, currencyData, currenctClient]);

  const onPaymentApply = useCallback(
    (data) => {
      console.log(data, "data");
      const normalizedData = {
        CardCode: currenctClient["CardCode"],
        CashSum: data.sum,
        CashAccount:
          paymentType === "cash"
            ? data.account
            : PAYMENT_ACCOUNTS[data.paymentType],
        BankChargeAmount: 0,
        PaymentInvoices: [
          {
            SumApplied: data.sum,
            InstallmentId: currenctClient["InstlmntID"],
            DocEntry: currenctClient["DocEntry"],
          },
        ],
        DocCurrency: currency,
      };
      console.log(normalizedData, "normalizedData");
      mutation.mutate(normalizedData);
      console.log(mutation, "mutation");
    },
    [currenctClient, paymentType, currency, mutation]
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"To'lov qo'shish"}
      footer={
        <ModalFooter
          isValid={isValid}
          onClose={onClose}
          isLoading={mutation.isPending}
        />
      }>
      <form
        id={"payment_form"}
        className={styles["modal-form"]}
        onSubmit={handleSubmit(onPaymentApply)}>
        <Row direction="row" gutter={4}>
          <Col flexGrow>
            <Row gutter={1}>
              <Col>
                <Typography element="span" className={styles["modal-text"]}>
                  <strong>Oylik to'lov:</strong>{" "}
                  {formatterCurrency(currenctClient?.["InsTotal"] || 0, "usd")}
                </Typography>
              </Col>
              <Col fullWidth>
                <Input
                  size="full"
                  error={
                    hasError.sum
                      ? ERROR_MESSAGES[
                          hasError.sum || "sumNotGreaterThanInsTotal"
                        ]
                      : ""
                  }
                  value={
                    sum === ""
                      ? ""
                      : formatterCurrency(sum, "UZS")
                          .replace(/UZS|USD/, "")
                          .trim()
                  }
                  onChange={handlePriceChange}
                  type="text"
                  variant={"outlined"}
                  iconText={CURRENCY_MAP[currency]}
                  placeholder="Цена"
                  name={"sum"}
                />
              </Col>
            </Row>
          </Col>
          <Col flexGrow>
            <Row gutter={1}>
              <Col>
                <Typography element="span" className={styles["modal-text"]}>
                  <strong> Kurs:</strong>{" "}
                  {formatterCurrency(currencyData?.["Rate"] || 0)}
                </Typography>
              </Col>
              <Col fullWidth>
                <Input
                  size="full"
                  type="date"
                  control={control}
                  variant={"outlined"}
                  {...register("date")}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row align="center" justify={"center"} gutter={4}>
          <Col align="center" justify="center">
            <Typography element={"span"} className={styles["modal-subtitle"]}>
              To'lov turi
            </Typography>
          </Col>
          <Col fullWidth>
            <Row direction={"row"} gutter={4}>
              <Col flexGrow>
                <Row gutter={2}>
                  <Col fullWidth>
                    <RadioInput
                      id={"payment_type_cash"}
                      label={"Naqd pul"}
                      icon={"walletFilled"}
                      value={"cash"}
                      defaultChecked
                      {...register("paymentType")}
                    />
                  </Col>
                  <Col fullWidth>
                    <RadioInput
                      id={"payment_type_card"}
                      label={"Karta"}
                      icon={"cardFilled"}
                      value={"card"}
                      {...register("paymentType")}
                    />
                  </Col>
                </Row>
              </Col>
              <Col flexGrow>
                <Row gutter={2}>
                  {" "}
                  <Col fullWidth>
                    <RadioInput
                      id={"payment_type_visa"}
                      label={"Visa"}
                      icon={"cardFilled"}
                      value={"visa"}
                      {...register("paymentType")}
                    />
                  </Col>
                  <Col fullWidth>
                    <RadioInput
                      id={"payment_type_terminal"}
                      label={"Terminal"}
                      icon={"cardFilled"}
                      value={"terminal"}
                      {...register("paymentType")}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <AnimatePresence mode="popLayout">
          {paymentType === "cash" ? (
            <Row
              align="center"
              justify={"center"}
              gutter={4}
              animated={true}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}>
              <Col align="center" justify="center">
                <Typography
                  element={"span"}
                  className={styles["modal-subtitle"]}>
                  Filialni tanlang
                </Typography>
              </Col>
              <Col fullWidth>
                <Input
                  size={"full"}
                  type={"select"}
                  variant={"outlined"}
                  canClickIcon={false}
                  options={branchOptions}
                  placeholder={"Filialni tanlang..."}
                  {...register("account")}
                />
              </Col>
            </Row>
          ) : null}
        </AnimatePresence>
      </form>
    </Modal>
  );
}
