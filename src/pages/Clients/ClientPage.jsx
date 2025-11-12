import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Col, Row } from '@components/ui';
import Footer from '@components/Footer';
import StickyFooterPortal from '@components/Footer/StickyFooterPortal';
import Messenger from '@components/ui/Messenger';

import ClientPageForm from '@features/clients/components/ClientPageForm';
import ClientPageHeader from '@features/clients/components/ClientPageHeader';
import ClientPageTable from '@features/clients/components/ClientPageTable';
import ClientPageFooterContent from '@features/clients/components/ClientPageFooterContent';
import ClientPaymentModal from '@features/clients/components/ClientPaymentModal';
import ClientPaysListInfoModal from '@features/clients/components/PaysListInfoModal';

import useAuth from '@hooks/useAuth';
import useToggle from '@hooks/useToggle';
import useClickOutside from '@hooks/helper/useClickOutside';
import useMessengerActions from '@hooks/useMessengerActions';
import useClientsTableColumns from '@features/clients/hooks/useClientsTableColumns';
import useClientPageData from '@features/clients/hooks/useClientPageData';
import useClientPageSubmit from '@features/clients/hooks/useClientPageSubmit';
import useIsMobile from '@/hooks/useIsMobile';

import styles from './style.module.scss';

export default function ClientPage() {
  const [paymentModal, setPaymentModal] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [paysListModalInfo, setPaysListModalInfo] = useState(null);

  const { user } = useAuth();
  const { id } = useParams();
  const messengerRef = useRef(null);
  const isMobile = useIsMobile();
  const { isOpen, toggle } = useToggle('messenger');

  // Data fetching
  const {
    currentClient,
    clientEntries,
    isEntriesLoading,
    currency,
    isCurrencyLoading,
    messages,
    isMessagesLoading,
  } = useClientPageData(id, isOpen);

  // Table columns
  const { clientPageTableColumns } = useClientsTableColumns({
    onShowPaysListInfo: setPaysListModalInfo,
  });

  // Form submission
  const { handleSubmit, isSubmitting } = useClientPageSubmit(
    currentClient,
    () => setIsSaveButtonDisabled(true)
  );

  // Messenger actions
  const { sendMessage, editMessage, deleteMessage } = useMessengerActions();

  // Handle outside click to close messenger
  useClickOutside(messengerRef, toggle, isOpen);

  return (
    <>
      <div className={styles['page-container']}>
        <Row direction="column" gutter={6}>
          <Col fullWidth>
            <ClientPageHeader
              isSaveButtonDisabled={isSaveButtonDisabled}
              isLoading={isSubmitting}
            />
          </Col>
          <Col fullWidth>
            <Row
              direction={{ xs: 'column', md: 'row' }}
              align={{ xs: 'stretch', md: 'start' }}
              gutter={{ xs: 4, sm: 6, md: 8, lg: 8 }}
              style={{ position: 'relative', minWidth: 0 }}
              wrap
            >
              {/* Form Section */}
              <Col
                fullWidth={isMobile}
                span={{ xs: 24, md: 12 }}
                style={{ minWidth: 0 }}
              >
                <ClientPageForm
                  formId="clientForm"
                  setIsSaveButtonDisabled={setIsSaveButtonDisabled}
                  onSubmit={handleSubmit}
                  isCompactLayout
                />
              </Col>

              {/* Table Section */}
              <Col fullWidth={isMobile} span={{ xs: 24, md: 12 }} flexGrow>
                <ClientPageTable
                  columns={clientPageTableColumns}
                  data={clientEntries}
                  isLoading={isEntriesLoading}
                  currentInstallmentId={currentClient?.['InstlmntID']}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <StickyFooterPortal>
        <Footer className={styles['footer-container']}>
          <ClientPageFooterContent
            currentClient={currentClient}
            currency={currency}
            isCurrencyLoading={isCurrencyLoading}
            user={user}
            onAddPayment={() => setPaymentModal(true)}
          />
        </Footer>
      </StickyFooterPortal>

      <ClientPaymentModal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
      />
      <ClientPaysListInfoModal
        isOpen={!!paysListModalInfo}
        onClose={() => setPaysListModalInfo(null)}
        data={paysListModalInfo}
      />
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
