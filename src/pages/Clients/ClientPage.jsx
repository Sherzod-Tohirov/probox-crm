import {
  Col,
  Navigation,
  Row,
  Button,
  Typography,
  Table,
} from "@components/ui";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Footer from "@components/Footer";

import ClientPageForm from "@features/clients/components/ClientPageForm";
import ClientPaymentModal from "@features/clients/components/ClientPaymentModal";

import useAlert from "@hooks/useAlert";
import formatDueDate from "@utils/formatDueDate";
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
  const updateMutation = useMutateClientPageForm();

  const {
    data: clientEntries,
    isLoading,
    error,
  } = useFetchClientEntriesById(id);
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );

  const [modifiedClientEntries, setModifiedClientEntries] = useState(
    clientEntries || []
  );

  useEffect(() => {
    if (clientEntries) {
      if (clientEntries.length < currentClient["Installmnt"]) {
        let monthCounter = 0;
        const additionalEntries = [];
        for (
          let i = clientEntries.length + 1;
          i <= currentClient["Installmnt"];
          i++
        ) {
          const emptyObject = {
            DueDate: formatDueDate(currentClient["DueDate"], monthCounter),
            InstlmntID: i,
            PaidToDate: 0,
            InsTotal: currentClient["InsTotal"],
            PaysList: null,
          };
          additionalEntries.push(emptyObject);
          monthCounter++;
        }
        setModifiedClientEntries([...clientEntries, ...additionalEntries]);
      }
    }
  }, [clientEntries]);

  const { data: currency } = useFetchCurrency();

  console.log(clientEntries, "clientEntries");
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
            formId={"clientForm"}
          />
        </Col>
        <Col fullWidth>
          <Table
            columns={clientPageTableColumns}
            isLoading={isLoading}
            data={modifiedClientEntries}
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
        />
      </Footer>
    </>
  );
}
