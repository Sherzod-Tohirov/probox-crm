import moment from 'moment';
import * as _ from 'lodash';

import {
  Col,
  Navigation,
  Row,
  Button,
  Typography,
  Table,
} from '@components/ui';
import styles from './style.module.scss';
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Footer from '@components/Footer';
import Messenger from '@components/ui/Messenger';

import ClientPageForm from '@features/clients/components/ClientPageForm';
import ClientPaymentModal from '@features/clients/components/ClientPaymentModal';
import useSaveScreenshot from '@features/clients/hooks/useSaveScreenshot';

import useAuth from '@hooks/useAuth';
import useToggle from '@hooks/useToggle';
import useClientsTableColumns from '@features/clients/hooks/useClientsTableColumns';
import useFetchCurrency from '@hooks/data/useFetchCurrency';
import useFetchMessages from '@hooks/data/clients/useFetchMessages';
import useClickOutside from '@hooks/helper/useClickOutside';
import useMessengerActions from '@hooks/useMessengerActions';
import useMutateClientPageForm from '@hooks/data/clients/useMutateClientPageForm';
import useFetchClientEntriesById from '@hooks/data/clients/useFetchClientEntriesById';
import hasRole from '@utils/hasRole';
import formatDate from '@utils/formatDate';
import formatterCurrency from '@utils/formatterCurrency';

export default function ClientPage() {
  const [paymentModal, setPaymentModal] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const { user } = useAuth();
  const { id } = useParams();
  const dispatch = useDispatch();

  const messengerRef = useRef(null);
  const screenshotRef = useRef(null);
  const updateMutation = useMutateClientPageForm();
  const { handleSaveScreenshot } = useSaveScreenshot();
  const { isOpen, toggle } = useToggle('messenger');
  const { clientPageTableColumns } = useClientsTableColumns();
  const { sendMessage, editMessage, deleteMessage } = useMessengerActions();
  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );
  const { data: messages, isLoading: isMessagesLoading } = useFetchMessages({
    docEntry: currentClient?.['DocEntry'],
    installmentId: currentClient?.['InstlmntID'],
    enabled: isOpen,
  });

  const { data: clientEntries, isLoading } = useFetchClientEntriesById(id);

  // Handle outside click to close messenger
  useClickOutside(messengerRef, toggle, isOpen);

  const { data: currency } = useFetchCurrency();

  const handleClientPageSubmit = useCallback(
    async (data) => {
      const formattedAgreementDate = formatDate(
        data?.agreementDate,
        'DD.MM.YYYY',
        'YYYY.MM.DD'
      );

      const formattedDueDate = moment(currentClient['DueDate']).format(
        'YYYY.MM.DD'
      );

      const phonePayload = {
        ...(data.telephone ? { Phone1: data.telephone } : {}),
        ...(data.additional_telephone
          ? { Phone2: data.additional_telephone }
          : {}),
      };

      const payload = {
        docEntry: currentClient?.['DocEntry'],
        installmentId: currentClient?.['InstlmntID'],
        data: {
          slpCode: data?.executor,
          DueDate: formattedDueDate,
          ...phonePayload,
          ...(formattedAgreementDate
            ? { newDueDate: formattedAgreementDate }
            : {}),
          ...(!_.isEmpty(phonePayload)
            ? { CardCode: currentClient?.['CardCode'] }
            : {}),
        },
      };
      try {
        await updateMutation.mutateAsync(payload);
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
              <Row
                direction="row"
                align="center"
                justify={{ xs: 'start', md: 'space-between' }}
                gutter={3}
                wrap
              >
                <Col>
                  <Navigation fallbackBackPath={'/clients'} />
                </Col>
                <Col>
                  <Row direction={'row'} gutter={3}>
                    <Col>
                      <Button
                        type={'button'}
                        className={styles['screenshot-btn']}
                        onClick={() =>
                          _.debounce(handleSaveScreenshot, 200)(screenshotRef)
                        }
                        form={'clientForm'}
                        variant={'filled'}
                      >
                        Screenshot
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        disabled={isSaveButtonDisabled}
                        isLoading={updateMutation.isPending}
                        type={'submit'}
                        form={'clientForm'}
                        variant={'filled'}
                      >
                        Saqlash
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <Row
            gutter={6}
            ref={screenshotRef}
            style={{ position: 'relative' }}
            wrap
          >
            <Col fullWidth>
              <Row direction={'row'} gutter={6}>
                <Col>
                  <ClientPageForm
                    setIsSaveButtonDisabled={setIsSaveButtonDisabled}
                    onSubmit={handleClientPageSubmit}
                    formId={'clientForm'}
                  />
                </Col>
              </Row>
            </Col>

            <Col fullWidth>
              <Table
                scrollable
                containerStyle={{
                  minHeight: 'calc(35dvh)',
                }}
                uniqueKey={'InstlmntID'}
                style={{ fontSize: '3.7rem' }}
                columns={clientPageTableColumns}
                isLoading={isLoading}
                data={clientEntries}
                onSelectionChange={(selected) => {
                  console.log('Selected Rows:', selected);
                }}
                getRowStyles={(row) => {
                  return {
                    ...(row['InstlmntID'] === currentClient['InstlmntID']
                      ? { backgroundColor: 'rgba(0,0,0,0.1)' }
                      : {}),
                  };
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Footer>
        <Row direction={'row'} align={'center'} justify={'space-between'}>
          <Typography element={'span'}>
            Qolgan qarzdorlik summasi:{' '}
            {formatterCurrency(
              Number(currentClient['MaxDocTotal']) -
                Number(currentClient['MaxTotalPaidToDate']) || 0,
              'USD'
            )}
          </Typography>
          <Col>
            {_.get(currency, 'Rate', 0) > 0 ? (
              hasRole(user, ['Manager', 'Cashier']) ? (
                <Button
                  variant={'filled'}
                  onClick={() => setPaymentModal(true)}
                >
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
        hasToggleControl={true}
        isLoading={isMessagesLoading}
        onSendMessage={sendMessage}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
      />
    </>
  );
}
