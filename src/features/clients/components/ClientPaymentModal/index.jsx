import { Modal, Input, Typography, Row, Col, Button } from "@components/ui";
import styles from "./clientPaymentModal.module.scss";
import formatterCurrency from "@utils/formatterCurrency";
import { memo, useCallback, useState } from "react";
import RadioInput from "./RadioInput";
import moment from "moment/moment";
import { useForm } from "react-hook-form";
import { CURRENCY_MAP } from "@utils/constants";

const ModalFooter = memo(({ onClose }) => {
  return (
    <Row direction="row" align="center" justify="center" gutter={4}>
      <Col flexGrow>
        <Button fullWidth variant={"filled"} color={"danger"} onClick={onClose}>
          Отмена
        </Button>
      </Col>
      <Col flexGrow>
        <Button
          form={"payment_form"}
          fullWidth
          variant={"filled"}
          type={"submit"}>
          Оплатить
        </Button>
      </Col>
    </Row>
  );
});

export default function ClientPaymentModal({ isOpen, onClose, onApply }) {
  const [price, setPrice] = useState(0);
  const { register, handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      price: 0,
      date: moment().format("DD.MM.YYYY"),
      payment_type: "cash",
      currency: "usd",
    },
  });
  const handlePriceChange = useCallback((e) => {
    let value = e.target.value.replace(/[^0-9.,-]/g, ""); // Remove non-numeric characters

    if (value === "" || value === "." || value === "-") {
      setPrice(value); // Allow empty input, "." or "-" temporarily
      setValue("price", value);
      return;
    }

    const numericValue = Number(value.replace(/,/g, "")); // Convert to number
    setPrice(numericValue);
    setValue("price", numericValue); // Store the raw numeric value
  });
  const customOnApply = useCallback(
    (data) => {
      onApply(data);
      reset();
    },
    [setValue]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Добавить платеж"}
      footer={<ModalFooter onClose={onClose} />}>
      <form
        id={"payment_form"}
        className={styles["modal-form"]}
        onSubmit={handleSubmit(customOnApply)}>
        <Row direction="row" gutter={4}>
          <Col flexGrow>
            <Row gutter={1}>
              <Col>
                <Typography element="span" className={styles["modal-text"]}>
                  <strong>Оплата:</strong> 100$
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
                  iconText={CURRENCY_MAP[watch("currency") || "usd"]}
                  placeholder="Цена"
                  name={"price"}
                />
              </Col>
            </Row>
          </Col>
          <Col flexGrow>
            <Row gutter={1}>
              <Col>
                <Typography element="span" className={styles["modal-text"]}>
                  <strong> Курс:</strong> 13100so'm
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
              Способ оплаты
            </Typography>
          </Col>
          <Col fullWidth>
            <Row direction={"row"} gutter={4}>
              <Col flexGrow>
                <RadioInput
                  id={"payment_type_cash"}
                  label={"Наличные"}
                  icon={"walletFilled"}
                  value={"cash"}
                  defaultChecked
                  {...register("payment_type")}
                />
              </Col>
              <Col flexGrow>
                <RadioInput
                  id={"payment_type_card"}
                  label={"Карта"}
                  icon={"cardFilled"}
                  value={"card"}
                  {...register("payment_type")}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row align="center" justify={"center"} gutter={4}>
          <Col align="center" justify="center">
            <Typography element={"span"} className={styles["modal-subtitle"]}>
              Валюта
            </Typography>
          </Col>
          <Col fullWidth>
            <Row direction={"row"} gutter={4}>
              <Col flexGrow>
                <RadioInput
                  id={"currency_usd"}
                  name={"currency"}
                  label={"Доллар"}
                  icon={"cash"}
                  defaultChecked
                  value={"usd"}
                  {...register("currency")}
                />
              </Col>
              <Col flexGrow>
                <RadioInput
                  id={"currency_uzs"}
                  name={"currency"}
                  label={"Сум"}
                  icon={"card"}
                  value={"uzs"}
                  {...register("currency")}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </form>
    </Modal>
  );
}
