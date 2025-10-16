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
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Footer from '@components/Footer';
import StickyFooterPortal from '@components/Footer/StickyFooterPortal';
import Messenger from '@components/ui/Messenger';

import ClientPageForm from '@features/clients/components/ClientPageForm';
import ClientPaymentModal from '@features/clients/components/ClientPaymentModal';
import ClientPaysListInfoModal from '@features/clients/components/PaysListInfoModal';

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
import useIsMobile from '@/hooks/useIsMobile';

export default function ClientPage() {
  const [paymentModal, setPaymentModal] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [paysListModalInfo, setPaysListModalInfo] = useState(null);

  const { user } = useAuth();
  const { id } = useParams();
  const messengerRef = useRef(null);
  const screenshotRef = useRef(null);
  const updateMutation = useMutateClientPageForm();
  const isMobile = useIsMobile();
  const { isOpen, toggle } = useToggle('messenger');
  const { clientPageTableColumns } = useClientsTableColumns({
    onShowPaysListInfo: setPaysListModalInfo,
  });
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
  console.log(clientEntries, 'client entries');
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

  const remainingAmount = useMemo(() => {
    const insTotal = parseFloat(currentClient?.['InsTotal']) || 0;
    const insTotalFC = parseFloat(currentClient?.['InsTotalFC']) || 0;
    const rate = parseFloat(currency?.['Rate']) || 0;
    const value =
      currentClient?.DocCur === 'USD' ? insTotal * rate : insTotalFC;
    return (
      `${formatterCurrency(value, 'UZS')}` +
      (currentClient?.DocCur === 'USD'
        ? ` (${formatterCurrency(Math.round(insTotal), 'USD')})`
        : '')
    );
  }, [currentClient, currency]);

  return (
    <>
      <div className={styles['page-container']}>
        <Row direction="column" gutter={6}>
          <Col fullWidth>
            <Row>
              <Col fullWidth>
                <Row
                  direction="row"
                  align="center"
                  justify={'space-between'}
                  gutter={3}
                  wrap
                >
                  <Col>
                    <Navigation fallbackBackPath={'/clients'} />
                  </Col>
                  <Col>
                    <Row direction={'row'} gutter={3}>
                      {/* <Col>
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
                      </Col> */}
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
              direction={{ xs: 'column', md: 'row' }}
              align={{ xs: 'stretch', md: 'start' }}
              gutter={{ xs: 4, sm: 6, md: 8, lg: 8 }}
              ref={screenshotRef}
              style={{ position: 'relative', minWidth: 0 }}
              wrap
            >
              {/* Form Section - Takes 12/24 on desktop (50% - includes map) */}
              <Col
                fullWidth={isMobile}
                span={{ xs: 24, md: 12 }}
                style={{ minWidth: 0 }}
              >
                <ClientPageForm
                  formId={'clientForm'}
                  setIsSaveButtonDisabled={setIsSaveButtonDisabled}
                  onSubmit={handleClientPageSubmit}
                  isCompactLayout={true}
                />
              </Col>

              {/* Table Section - Takes 12/24 on desktop (50%) */}
              <Col fullWidth={isMobile} span={{ xs: 24, md: 12 }} flexGrow>
                <div className={styles['table-container']}>
                  <Table
                    scrollable
                    containerStyle={{
                      minHeight: 'calc(35dvh)',
                      maxHeight: 'calc(70vh)',
                      width: '100%',
                    }}
                    uniqueKey={'InstlmntID'}
                    style={{ fontSize: '3.2rem' }}
                    columns={clientPageTableColumns}
                    isLoading={isLoading}
                    data={clientEntries}
                    onSelectionChange={(selected) => {
                      console.log('Selected Rows:', selected);
                    }}
                    getRowStyles={(row) => {
                      const isDark =
                        document.documentElement.getAttribute('data-theme') ===
                        'dark';
                      return {
                        ...(row['InstlmntID'] === currentClient['InstlmntID']
                          ? {
                              backgroundColor: isDark
                                ? 'rgba(96, 165, 250, 0.15)'
                                : 'rgba(10, 77, 104, 0.1)',
                              borderLeft: isDark ? '3px solid #60a5fa' : '3px solid #0a4d68',
                            }
                          : {}),
                      };
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <StickyFooterPortal>
        <Footer className={styles['footer-container']}>
          <Row direction={'row'} align={'center'} justify={'space-between'}>
            <Typography variant={isMobile ? 'body2' : 'body1'} element={'span'}>
              Qolgan qarzdorlik summasi: {remainingAmount}
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
          <ClientPaysListInfoModal
            isOpen={!!paysListModalInfo}
            onClose={() => setPaysListModalInfo(null)}
            data={paysListModalInfo}
          />
        </Footer>
      </StickyFooterPortal>
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
