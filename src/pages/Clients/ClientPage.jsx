import moment from "moment";
import * as _ from "lodash";

import {
  Col,
  Navigation,
  Row,
  Button,
  Typography,
  Table,
} from "@components/ui";

import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Footer from "@components/Footer";
import Messenger from "@components/ui/Messenger";

import ClientPageForm from "@features/clients/components/ClientPageForm";
import ClientPaymentModal from "@features/clients/components/ClientPaymentModal";

import useAlert from "@hooks/useAlert";
import useAuth from "@hooks/useAuth";
import useToggle from "@hooks/useToggle";
import hasRole from "@utils/hasRole";
import useTableColumns from "@hooks/useTableColumns";
import formatterCurrency from "@utils/formatterCurrency";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import useMutateClientPageForm from "@hooks/data/useMutateClientPageForm";
import useFetchClientEntriesById from "@hooks/data/useFetchClientEntriesById";
import useFetchMessages from "@hooks/data/useFetchMessages";
import { setCurrentClient } from "@store/slices/clientsPageSlice";
import formatDate from "@utils/formatDate";
import useClickOutside from "@hooks/helper/useClickOutside";
import useMessengerActions from "@hooks/useMessengerActions";

export default function ClientPage() {
  const [paymentModal, setPaymentModal] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const { user } = useAuth();
  const { id } = useParams();
  const { alert } = useAlert();
  const dispatch = useDispatch();
  const messengerRef = useRef(null);
  const updateMutation = useMutateClientPageForm();
  const { isOpen, toggle } = useToggle("messenger");
  const { clientPageTableColumns } = useTableColumns();
  const { sendMessage, editMessage, deleteMessage } = useMessengerActions();

  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );
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

  // Handle outside click to close messenger
  useClickOutside(messengerRef, toggle, isOpen);

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
      const formattedDueDate = moment(currentClient["DueDate"]).format(
        "YYYY.MM.DD"
      );

      const payload = {
        docEntry: currentClient?.["DocEntry"],
        installmentId: currentClient?.["InstlmntID"],
        data: {
          slpCode: data?.executor,
          DueDate: formattedDueDate,
          ...(formattedAgreementDate
            ? { newDueDate: formattedAgreementDate }
            : {}),
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
        setIsSaveButtonDisabled(true);
      } catch (error) {
        console.log(error);
      }
    },
    [currentClient, updateMutation]
  );

  return (
    <>
      <Row direction="column" gutter={6}>
        <Col fullWidth>
          <Row>
            <Col fullWidth>
              <Row direction="row" align="center" justify="space-between">
                <Col>
                  <Navigation fallbackBackPath={"/clients"} />
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
            Qolgan qarzdorlik summasi:{" "}
            {formatterCurrency(
              Number(currentClient["MaxDocTotal"]) -
                Number(currentClient["MaxTotalPaidToDate"]) || 0,
              "USD"
            )}
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
        ref={messengerRef}
        messages={messages}
        isLoading={isMessagesLoading}
        onSendMessage={sendMessage}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
      />
    </>
  );
}
