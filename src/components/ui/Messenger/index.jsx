import classNames from 'classnames';
import { motion } from 'framer-motion';
import styles from './styles/messenger.module.scss';
import { Typography, Button } from '@components/ui';
import useToggle from '@hooks/useToggle';
import MessageForm from './MessageForm';
import MessageRenderer from './MessageRenderer';
import { ClipLoader } from 'react-spinners';
import { forwardRef, useCallback, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Messenger = (
  {
    messages = [],
    isLoading = false,
    onSendMessage,
    onEditMessage,
    onDeleteMessage,
    hasToggleControl = false,
    entityType = 'client',
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
    deletingId = null,
    isRefetching = false,
  },
  ref
) => {
  const { isOpen, toggle } = useToggle('messenger');
  const [isSending, setIsSending] = useState(false);
  const pendingIdRef = useRef(0);

  const [showDelayNotice, setShowDelayNotice] = useState(entityType === 'lead');

  const handleSendMessage = useCallback(
    async (data) => {
      pendingIdRef.current++;
      setIsSending(true);
      try {
        await onSendMessage(data);
      } finally {
        setIsSending(false);
      }
    },
    [onSendMessage]
  );
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  return createPortal(
    <motion.div
      ref={ref}
      id="messenger"
      initial={{ x: '100%', display: 'none' }}
      animate={{
        x: isOpen ? '0' : '100%',
        display: isOpen ? 'flex' : 'none',
      }}
      exit={{ x: '100%', display: 'none' }}
      transition={{ type: 'spring', stiffness: 100, damping: 16 }}
      className={classNames(styles.messenger)}
    >
      <div className={styles['messenger-header']}>
        <Button
          className={styles['toggle-button']}
          variant="text"
          iconSize={24}
          icon="toggleOpen"
          onClick={toggle}
        ></Button>
        <Typography element="h2" className={styles.title}>
          Xabarnoma
        </Typography>
      </div>
      {showDelayNotice && (
        <div className={styles['messenger-delay-notice']}>
          <span>⏳</span>
          <span>
            Chat yuklanishida kechikish bo&apos;lishi mumkin. Noqulaylik uchun
            uzr so&apos;raymiz!
          </span>
          <button
            className={styles['messenger-delay-notice-close']}
            onClick={() => setShowDelayNotice(false)}
          >
            ✕
          </button>
        </div>
      )}
      {isRefetching && !isLoading && (
        <div className={styles['messenger-refetch-indicator']}>
          <ClipLoader size={12} color="currentColor" />
          <span style={{ fontSize: '2.8rem' }}>
            Ma&apos;lumotlar yangilanmoqda...
          </span>
        </div>
      )}
      <div className={styles['messenger-body']}>
        {isLoading ? (
          <div className={styles['messenger-body-loader-wrapper']}>
            <ClipLoader color="black" size={28} />
          </div>
        ) : (
          <>
            <MessageRenderer
              hasToggleControl={hasToggleControl}
              onEditMessage={onEditMessage}
              onDeleteMessage={onDeleteMessage}
              messages={messages}
              onLoadMore={onLoadMore}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              deletingId={deletingId}
            />
          </>
        )}
      </div>
      <div className={styles['messenger-footer']}>
        <MessageForm
          onSubmit={handleSendMessage}
          entityType={entityType}
          isSending={isSending}
        />
      </div>
    </motion.div>,
    document.body
  );
};

export default forwardRef(Messenger);
