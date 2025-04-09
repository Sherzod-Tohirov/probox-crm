import {
  Col,
  Navigation,
  Row,
  Button,
  Typography,
  Table,
} from "@components/ui";

import { useParams } from "react-router-dom";
import { useState } from "react";

import Footer from "@components/Footer";
import ClientPageForm from "@features/clients/components/ClientPageForm";
import ClientPaymentModal from "@features/clients/components/ClientPaymentModal";
import useFetchClientEntriesById from "@hooks/data/useFetchClientEntriesById";
import useAlert from "@hooks/useAlert";
import { useSelector } from "react-redux";
import formatterCurrency from "@utils/formatterCurrency";
import { clientPageTableColumns } from "@utils/tableColumns";

export default function ClientPage() {
  const [paymentModal, setPaymentModal] = useState(false);
  const { alert } = useAlert();
  const { id } = useParams();
  const {
    data: clientEntries,
    isLoading,
    error,
  } = useFetchClientEntriesById(id);

  const onClose = () => setPaymentModal(false);

  console.log(clientEntries, "clientEntries");
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );

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
          <Table
            columns={clientPageTableColumns}
            isLoading={isLoading}
            data={clientEntries}
            getRowStyles={(row) => {
              return {
                ...(row["InstlmntID"] === currentClient["InstlmntID"]
                  ? { backgroundColor: "rgba(0,0,0,0.1)" }
                  : {}),
              };
            }}
          />
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
