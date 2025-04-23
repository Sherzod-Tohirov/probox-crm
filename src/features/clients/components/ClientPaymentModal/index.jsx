import { Modal, Input, Typography, Row, Col, Button } from "@components/ui";
import styles from "./clientPaymentModal.module.scss";
import formatterCurrency from "@utils/formatterCurrency";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import RadioInput from "./RadioInput";
import moment from "moment/moment";
import { useForm } from "react-hook-form";
import { CURRENCY_MAP } from "@utils/constants";
import { useSelector } from "react-redux";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import { AnimatePresence } from "framer-motion";
import { PAYMENT_ACCOUNTS } from "@utils/constants";

const ModalFooter = memo(({ onClose, isLoading = false }) => {
  return (
    <Row direction="row" align="center" justify="center" gutter={4}>
      <Col flexGrow>
        <Button fullWidth variant={"filled"} color={"danger"} onClick={onClose}>
          Bekor qilish
        </Button>
      </Col>
      <Col flexGrow>
        <Button
          form={"payment_form"}
          fullWidth
          variant={"filled"}
          isLoading={isLoading}
          // onClick={onClose}
          type={"submit"}>
          Tasdiqlash
        </Button>
      </Col>
    </Row>
  );
});

export default function ClientPaymentModal({ isOpen, onClose, onApply }) {
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const { register, handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      sum: 0,
      date: moment().format("DD.MM.YYYY"),
      paymentType: "cash",
      account: "5040",
    },
  });
  const paymentType = watch("paymentType");
  const { data: currencyData } = useFetchCurrency();
  const currenctClient = useSelector(
    (state) => state.page.clients.currentClient
  );

  const branchOptions = useMemo(
    () => [
      { value: "5040", label: "Qoratosh" },
      {
        value: "5010",
        label: "Sag'bon",
      },
    ],
    []
  );

  const handlePriceChange = useCallback((e) => {
    let value = e.target.value.replace(/[^0-9.,-]/g, ""); // Remove non-numeric characters

    if (value === "" || value === "." || value === "-") {
      setPrice(value); // Allow empty input, "." or "-" temporarily
      setValue("sum", value);
      return;
    }

    const numericValue = Number(value.replace(/,/g, "")); // Convert to number
    setPrice(numericValue);
    setValue("sum", numericValue); // Store the raw numeric value
  });

  useEffect(() => {
    if (paymentType === "cash") {
      setCurrency("usd");
    } else {
      setCurrency("uzs");
    }
  }, [paymentType]);

  const customOnApply = useCallback(
    (data) => {
      const extendedData = {
        ...data,
        currency,
        cardCode: currenctClient["CardCode"],
      };

      const mutation = onApply(
        paymentType === "cash"
          ? extendedData
          : {
              ...extendedData,
              account: PAYMENT_ACCOUNTS[extendedData.paymentType],
            }
      );
      setIsLoading(mutation?.isPending);
      reset();
    },
    [setValue]
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"To'lov qo'shish"}
      footer={<ModalFooter onClose={onClose} isLoading={isLoading} />}>
      <form
        id={"payment_form"}
        className={styles["modal-form"]}
        onSubmit={handleSubmit(customOnApply)}>
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
                  value={
                    price === ""
                      ? ""
                      : formatterCurrency(price, "UZS")
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
