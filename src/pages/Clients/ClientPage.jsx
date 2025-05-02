import {
  Col,
  Navigation,
  Row,
  Button,
  Typography,
  Table,
} from "@components/ui";

import { useCallback, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Footer from "@components/Footer";
import Messenger from "@components/ui/Messenger";

import ClientPageForm from "@features/clients/components/ClientPageForm";
import ClientPaymentModal from "@features/clients/components/ClientPaymentModal";

import useAlert from "@hooks/useAlert";
import useAuth from "@hooks/useAuth";
import useToggle from "@hooks/useToggle";
import formatDueDate from "@utils/formatDueDate";
import hasRole from "@utils/hasRole";
import useTableColumns from "@hooks/useTableColumns";
import formatterCurrency from "@utils/formatterCurrency";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import useMutateClientPageForm from "@hooks/data/useMutateClientPageForm";
import useFetchClientEntriesById from "@hooks/data/useFetchClientEntriesById";
import useFetchMessages from "@hooks/data/useFetchMessages";
import * as _ from "lodash";
import useMutateMessages from "@hooks/data/useMutateMessages";
import { setCurrentClient } from "@store/slices/clientsPageSlice";
import formatDate from "@utils/formatDate";

export default function ClientPage() {
  const [paymentModal, setPaymentModal] = useState(false);
  const { isOpen } = useToggle("messenger");
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const { alert } = useAlert();
  const { user } = useAuth();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { clientPageTableColumns } = useTableColumns();
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );
  const updateMutation = useMutateClientPageForm();
  const { data: messages, isLoading: isMessagesLoading } = useFetchMessages({
    docEntry: currentClient?.["DocEntry"],
    installmentId: currentClient?.["InstlmntID"],
    enabled: isOpen,
  });
  console.log(isMessagesLoading, "isLoadingMeessssee");
  const {
    data: clientEntries,
    isLoading,
    error,
  } = useFetchClientEntriesById(id);
  const postMessageMutation = useMutateMessages("post");

  const [modifiedClientEntries, setModifiedClientEntries] = useState(
    clientEntries || []
  );

  useLayoutEffect(() => {
    if (clientEntries) {
      if (clientEntries.length < currentClient["Installmnt"]) {
        let monthCounter = 1;
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
      } else {
        setModifiedClientEntries(clientEntries);
      }
    }
  }, [clientEntries]);

  const { data: currency } = useFetchCurrency();

  if (error) {
    alert({
      type: "error",
      message: error.message,
    });
  }

  const handleClientPageSubmit = useCallback(
    async (data) => {
      const formattedAgreementDate = formatDate(
        data?.agreementDate,
        "DD.MM.YYYY",
        "YYYY.MM.DD"
      );
      const payload = {
        docEntry: currentClient?.["DocEntry"],
        installmentId: currentClient?.["InstlmntID"],
        data: {
          slpCode: data?.executor,
          DueDate: currentClient?.["DueDate"],
          newDueDate: formattedAgreementDate || currentClient?.["DueDate"],
        },
      };
      try {
        await updateMutation.mutateAsync(payload);
        dispatch(
          setCurrentClient({
            ...currentClient,
            NewDueDate: formattedAgreementDate || currentClient?.["DueDate"],
          })
        );
      } catch (error) {
        console.log(error);
      }
      setIsSaveButtonDisabled(true);
    },
    [currentClient, updateMutation]
  );

  const handleSendMessage = useCallback(
    async (data) => {
      const payload = { Comments: data.msgText };
      await postMessageMutation.mutateAsync(payload);
    },
    [currentClient]
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
            style={{ fontSize: "3.7rem" }}
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
            {formatterCurrency(currentClient["MaxTotalPaidToDate"] || 0, "USD")}
          </Typography>
          <Col>
            {_.get(currency, "Rate", 0) > 0 ? (
              hasRole(user, ["Manager", "Cashier"]) ? (
                <Button
                  variant={"filled"}
                  onClick={() => setPaymentModal(true)}>
                  To'lov qo'shish
                </Button>
              ) : null
            ) : null}
          </Col>
        </Row>
        <ClientPaymentModal
          isOpen={paymentModal}
          onClose={() => setPaymentModal(false)}
        />
      </Footer>
      <Messenger
        messages={messages}
        isLoading={isMessagesLoading}
        onSendMessage={handleSendMessage}
      />
    </>
  );
}
