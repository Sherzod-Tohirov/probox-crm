import {
  Col,
  Navigation,
  Row,
  Button,
  Typography,
  Table,
} from "@components/ui";

import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Footer from "@components/Footer";

import usePaymentModal from "@features/clients/hooks/usePaymentModal";
import ClientPageForm from "@features/clients/components/ClientPageForm";
import ClientPaymentModal from "@features/clients/components/ClientPaymentModal";

import useAlert from "@hooks/useAlert";
import useTableColumns from "@hooks/useTableColumns";
import formatterCurrency from "@utils/formatterCurrency";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import useMutateClientPageForm from "@hooks/data/useMutateClientPageForm";
import useFetchClientEntriesById from "@hooks/data/useFetchClientEntriesById";

import * as _ from "lodash";

export default function ClientPage() {
  const [paymentModal, setPaymentModal] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const { alert } = useAlert();
  const { id } = useParams();
  const { clientPageTableColumns } = useTableColumns();
  const { onApplyPayment } = usePaymentModal();
  const updateMutation = useMutateClientPageForm();

  const {
    data: clientEntries,
    isLoading,
    error,
  } = useFetchClientEntriesById(id);

  const { data: currency } = useFetchCurrency();

  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );

  if (error) {
    alert({
      type: "error",
      message: error.message,
    });
  }

  const handleClientPageSubmit = useCallback(async (data) => {
    const payload = {
      docEntry: currentClient?.["DocEntry"],
      installmentId: currentClient?.["InstlmntID"],
      data: { slpCode: data?.executor, DueDate: currentClient?.["DueDate"] },
    };
    await updateMutation.mutateAsync(payload);
    setIsSaveButtonDisabled(true);
  }, []);

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
                    disabled={isSaveButtonDisabled}
                    isLoading={updateMutation.isPending}
                    type={"submit"}
                    form={"clientForm"}
                    variant={"filled"}>
                    Saqlash
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <ClientPageForm
            setIsSaveButtonDisabled={setIsSaveButtonDisabled}
            onSubmit={handleClientPageSubmit}
            currentClient={currentClient}
            formId={"clientForm"}
          />
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
            Mijoz tomonidan jami to'langan summa:{" "}
            {formatterCurrency(currentClient["TotalPaidToDate"] || 0, "USD")}
          </Typography>
          <Col>
            {_.get(currency, "Rate", 0) > 0 ? (
              <Button variant={"filled"} onClick={() => setPaymentModal(true)}>
                To'lov qo'shish
              </Button>
            ) : (
              ""
            )}
          </Col>
        </Row>
        <ClientPaymentModal
          isOpen={paymentModal}
          onClose={() => setPaymentModal(false)}
          onApply={onApplyPayment}
        />
      </Footer>
    </>
  );
}
