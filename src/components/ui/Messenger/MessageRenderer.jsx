import _ from 'lodash';
import moment from 'moment';
import Message from './Message';
import { groupBy } from 'ramda';
import MessageDate from './MessageDate';
import { Box, Button } from '@components/ui';
import { AnimatePresence } from 'framer-motion';
import styles from './styles/messenger.module.scss';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
const MessageRenderer = ({
  messages = [],
  onEditMessage,
  onDeleteMessage,
  hasToggleControl = true,
  size = '',
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}) => {
  const scrollRef = useRef(null);
  const [formattedMessages, setFormattedMessages] = useState([]);
  const [lastMonthMessages, setLastMonthMessages] = useState([]);
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  // Normalize messages to array to avoid runtime errors
  // Memoize to prevent infinite loops in useLayoutEffect dependencies
  const safeMessages = useMemo(() => {
    return Array.isArray(messages) ? messages : [];
  }, [messages]);

  // Scroll to bottom when new message is added
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [safeMessages]);

  useLayoutEffect(() => {
    const now = moment();
    const filteredMessages = safeMessages.filter((msg) => {
      const msgDate = moment(msg.created_at);
      return !now.isSame(msgDate, 'month');
    });
    setLastMonthMessages(filteredMessages);
  }, [safeMessages]);

  useLayoutEffect(() => {
    if (hasToggleControl) {
      if (isToggleOpen) {
        setFormattedMessages(safeMessages);
        return;
      }
      const now = moment();
      const filteredMessages = safeMessages.filter((msg) => {
        const msgDate = moment(msg.created_at);
        return now.isSame(msgDate, 'month');
      });
      setFormattedMessages(filteredMessages);
    } else {
      setFormattedMessages(safeMessages);
    }
  }, [safeMessages, hasToggleControl, isToggleOpen]);
  return (
    <div className={styles['messenger-messages']} ref={scrollRef}>
      {/* Load More Button for infinite scroll */}
      {hasMore && onLoadMore && (
        <Box
          align={'center'}
          justify={'center'}
          style={{ marginBottom: '1rem' }}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onLoadMore();
            }}
            className={styles['messenger-messages-toggle-btn']}
            variant={'text'}
            icon={'arrowDown'}
            disabled={isLoadingMore}
            isLoading={isLoadingMore}
          >
            {isLoadingMore ? 'Yuklanmoqda...' : 'Eski xabarlar'}
          </Button>
        </Box>
      )}
      {hasToggleControl && lastMonthMessages.length > 0 ? (
        <Box align={'center'} justify={'center'}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsToggleOpen((p) => !p);
            }}
            className={styles['messenger-messages-toggle-btn']}
            variant={'text'}
            icon={isToggleOpen ? 'arrowUp' : 'arrowDown'}
          >
            {isToggleOpen ? 'Yopish' : "Hammasini ko'rish"}
          </Button>
        </Box>
      ) : null}
      <AnimatePresence mode="sync">
        {(formattedMessages.length > 0
          ? Object.entries(
              groupBy((msg) => {
                const formattedDate = moment(msg?.['DocDate']).format(
                  'DD-MM-YYYY'
                );
                return formattedDate;
              }, formattedMessages)
            )
          : []
        ).map(([date, messages], index) => {
          return (
            <Box dir="column" gap={2} key={index}>
              <MessageDate date={date} format={false} size={size} />
              {messages.map((message) => (
                <Message
                  msg={message}
                  key={message?.['_id']}
                  onEditMessage={onEditMessage}
                  onDeleteMessage={onDeleteMessage}
                  size={size}
                />
              ))}
            </Box>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default MessageRenderer;
