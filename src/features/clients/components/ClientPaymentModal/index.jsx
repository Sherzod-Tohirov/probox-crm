import { Modal, Input, Typography, Row, Col, Button } from "@components/ui";
import styles from "./clientPaymentModal.module.scss";
import moment from "moment/moment";
import formatterCurrency from "@utils/formatterCurrency";
import { useCallback, useState } from "react";
import RadioInput from "./RadioInput";

const ModalFooter = ({ onClose, onApply }) => {
  return (
    <Row direction="row" align="center" justify="center" gutter={4}>
      <Col flexGrow>
        <Button fullWidth variant={"filled"} color={"danger"} onClick={onClose}>
          Отмена
        </Button>
      </Col>
      <Col flexGrow>
        <Button fullWidth variant={"filled"} onClick={onApply}>
          Оплатить
        </Button>
      </Col>
    </Row>
  );
};

export default function ClientPaymentModal({ isOpen, onClose, onApply }) {
  const [price, setPrice] = useState(0);
  const handlePriceChange = useCallback((e) => {
    let value = e.target.value.replace(/[^0-9.,-]/g, ""); // Remove non-numeric characters

    if (value === "" || value === "." || value === "-") {
      setPrice(value); // Allow empty input, "." or "-" temporarily
      return;
    }

    const numericValue = Number(value.replace(/,/g, "")); // Convert to number
    setPrice(numericValue); // Store the raw numeric value
  });
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Добавить платеж"}
      footer={<ModalFooter onClose={onClose} onApply={onApply} />}>
      <form className={styles["modal-form"]} onSubmit={onApply}>
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
                  placeholder="Цена"
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
                  variant={"outlined"}
                  placeholder={moment().format("DD.MM.YYYY")}
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
                  name={"payment_type"}
                  label={"Наличные"}
                  icon={"walletFilled"}
                  defaultChecked
                />
              </Col>
              <Col flexGrow>
                <RadioInput
                  id={"payment_type_card"}
                  name={"payment_type"}
                  label={"Карта"}
                  icon={"cardFilled"}
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
                />
              </Col>
              <Col flexGrow>
                <RadioInput
                  id={"currency_uzs"}
                  name={"currency"}
                  label={"Сум"}
                  icon={"card"}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </form>
    </Modal>
  );
}
