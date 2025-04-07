import {
  Col,
  Navigation,
  Row,
  Button,
  Typography,
  Table,
} from "@components/ui";

import Footer from "@components/Footer";
import ClientPageForm from "@features/clients/components/ClientPageForm";
import ClientPaymentModal from "@features/clients/components/ClientPaymentModal";
import { useState } from "react";
import useAlert from "@hooks/useAlert";
import { useSelector } from "react-redux";
import formatterCurrency from "@utils/formatterCurrency";
const columns = [
  { key: "no", title: "No", width: "15%", icon: "" },
  { key: "date", title: "📅 Date", width: "15%", icon: "" },
  { key: "payment", title: "💰 Payment", width: "15%", icon: "" },
  { key: "paid", title: "✔ Paid", width: "10%", icon: "" },
  { key: "accountDate", title: "📅 Date hisob", width: "15%", icon: "" },
  { key: "account", title: "📅 Date hisob", width: "20%", icon: "" },
  { key: "bill", title: "💳 Счет", width: "10%", icon: "" },
];

const mockData = Array.from({ length: 50 }, (_, index) => ({
  no: index + 1,
  date: "2024.12.01",
  payment: "300.00 so'm",
  paid: "300.00",
  accountDate: "2024.11.01",
  account: "Samarqand Darvoza kassa",
  bill: "300.00",
}));
export default function ClientPage() {
  const [paymentModal, setPaymentModal] = useState(false);
  const onClose = () => setPaymentModal(false);
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );
  const { alert } = useAlert();
  return (
    <>
      <Row direction="column" gutter={6}>
        <Col fullWidth>
          <Row>
            <Col fullWidth>
              <Row direction="row" align="center" justify="space-between">
                <Col>
                  <Navigation />
                </Col>
                <Col>
                  <Button
                    type={"submit"}
                    form={"clientForm"}
                    variant={"filled"}>
                    Сохранить
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <ClientPageForm currentClient={currentClient} formId={"clientForm"} />
        </Col>
        <Col fullWidth>
          <Table columns={columns} data={mockData} />
        </Col>
      </Row>
      <Footer>
        <Row direction={"row"} align={"center"} justify={"space-between"}>
          <Typography style={{ fontSize: "4rem" }} element={"span"}>
            Всего оплачено клиентом:{" "}
            {formatterCurrency(currentClient["TotalPaidToDate"] || 0, "USD")}
          </Typography>
          <Col>
            <Button variant={"filled"} onClick={() => setPaymentModal(true)}>
              Оплатить
            </Button>
          </Col>
        </Row>
        <ClientPaymentModal
          isOpen={paymentModal}
          onClose={onClose}
          onApply={(data) => {
            alert("Платеж прошел успешно.");
            onClose();
            console.log(data, "data");
          }}
        />
      </Footer>
    </>
  );
}
