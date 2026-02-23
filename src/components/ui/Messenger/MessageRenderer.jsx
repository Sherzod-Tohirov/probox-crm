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
  const wasNearBottomRef = useRef(true);
  const previousMessageCountRef = useRef(0);
  const [formattedMessages, setFormattedMessages] = useState([]);
  const [lastMonthMessages, setLastMonthMessages] = useState([]);
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  // Normalize messages to array to avoid runtime errors
  // Memoize to prevent infinite loops in useLayoutEffect dependencies
  const safeMessages = useMemo(() => {
    return Array.isArray(messages) ? messages : [];
  }, [messages]);

  const scrollToBottom = (behavior = 'auto') => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({
      top: node.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const handleScroll = () => {
      const threshold = 80;
      const distanceToBottom =
        node.scrollHeight - node.scrollTop - node.clientHeight;
      wasNearBottomRef.current = distanceToBottom <= threshold;
    };

    handleScroll();
    node.addEventListener('scroll', handleScroll, { passive: true });
    return () => node.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    const currentCount = formattedMessages.length;
    const isFirstPaint = previousMessageCountRef.current === 0;
    const isNewMessageAppended =
      currentCount >= previousMessageCountRef.current;
    const shouldAutoScroll =
      !isLoadingMore &&
      (isFirstPaint || isNewMessageAppended || wasNearBottomRef.current);

    if (shouldAutoScroll) {
      requestAnimationFrame(() => {
        scrollToBottom(isFirstPaint ? 'auto' : 'smooth');
      });
    }

    previousMessageCountRef.current = currentCount;
  }, [formattedMessages, isLoadingMore]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (wasNearBottomRef.current) {
        scrollToBottom('auto');
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const now = moment();
    const filteredMessages = safeMessages.filter((msg) => {
      const msgDate = moment(msg.created_at ?? msg.createdAt);
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
        const msgDate = moment(msg.created_at ?? msg.createdAt);
        return now.isSame(msgDate, 'month');
      });
      setFormattedMessages(filteredMessages);
    } else {
      setFormattedMessages(safeMessages);
    }
  }, [safeMessages, hasToggleControl, isToggleOpen]);

  const groupedMessages = useMemo(() => {
    if (formattedMessages.length === 0) return [];
    return Object.entries(
      groupBy((msg) => {
        const formattedDate = moment(msg?.created_at ?? msg?.createdAt).format(
          'DD.MM.YYYY'
        );
        return formattedDate;
      }, formattedMessages)
    );
  }, [formattedMessages]);

  const totalMessageCount = formattedMessages.length;

  return (
    <div className={styles['messenger-messages']} ref={scrollRef}>
      {/* Load More Button for infinite scroll */}
      {hasMore && onLoadMore && (
        <Box align="center" justify="center" style={{ marginBottom: '1rem' }}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onLoadMore();
            }}
            className={styles['messenger-messages-toggle-btn']}
            variant="text"
            icon="arrowDown"
            disabled={isLoadingMore}
            isLoading={isLoadingMore}
          >
            {isLoadingMore ? 'Yuklanmoqda...' : 'Eski xabarlar'}
          </Button>
        </Box>
      )}
      {hasToggleControl && lastMonthMessages.length > 0 ? (
        <Box align="center" justify="center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsToggleOpen((p) => !p);
            }}
            className={styles['messenger-messages-toggle-btn']}
            variant="text"
            icon={isToggleOpen ? 'arrowUp' : 'arrowDown'}
          >
            {isToggleOpen ? 'Yopish' : "Hammasini ko'rish"}
          </Button>
        </Box>
      ) : null}
      <AnimatePresence initial={false} mode="sync">
        {groupedMessages.map(([date, messages]) => {
          return (
            <Box dir="column" gap={2} key={date}>
              <MessageDate date={date} format={false} size={size} />
              <AnimatePresence initial={false} mode="sync">
                {messages.map((message) => {
                  const animationIndex = formattedMessages.findIndex(
                    (m) => m?._id === message?._id
                  );
                  const staggerIndex =
                    animationIndex >= 0
                      ? Math.max(0, totalMessageCount - animationIndex - 1)
                      : 0;
                  return (
                    <Message
                      msg={message}
                      key={message?.['_id']}
                      onEditMessage={onEditMessage}
                      onDeleteMessage={onDeleteMessage}
                      size={size}
                      animationIndex={staggerIndex}
                    />
                  );
                })}
              </AnimatePresence>
            </Box>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default MessageRenderer;
