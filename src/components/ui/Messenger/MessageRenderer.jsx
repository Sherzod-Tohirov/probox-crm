import moment from 'moment';
import Message from './Message';
import { groupBy } from 'ramda';
import MessageDate from './MessageDate';
import { Box, Button } from '@components/ui';
import { AnimatePresence } from 'framer-motion';
import styles from './styles/messenger.module.scss';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
const MessageRenderer = ({
  messages = [],
  onEditMessage,
  onDeleteMessage,
  hasToggleControl = true,
  size = '',
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  deletingId = null,
}) => {
  const scrollRef = useRef(null);
  const wasNearBottomRef = useRef(true);
  const previousMessageCountRef = useRef(0);
  const previousHeightRef = useRef(0);
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

      // Auto-load older messages when scrolled near the top
      if (
        node.scrollTop <= threshold &&
        hasMore &&
        onLoadMore &&
        !isLoadingMore
      ) {
        previousHeightRef.current = node.scrollHeight;
        onLoadMore();
      }
    };

    handleScroll();
    node.addEventListener('scroll', handleScroll, { passive: true });
    return () => node.removeEventListener('scroll', handleScroll);
  }, [hasMore, onLoadMore, isLoadingMore]);

  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const currentCount = formattedMessages.length;
    const isFirstPaint = previousMessageCountRef.current === 0;
    const prevCount = previousMessageCountRef.current;

    // If previousHeightRef is set, this render follows a load-more button click.
    // Restore scroll position so viewport doesn't jump when older msgs are prepended.
    if (!isFirstPaint && previousHeightRef.current > 0) {
      const heightDiff = node.scrollHeight - previousHeightRef.current;
      node.scrollTop += heightDiff;
      previousHeightRef.current = 0;
      previousMessageCountRef.current = currentCount;
      return;
    }

    // Auto-scroll to bottom only on first paint or when user is near bottom
    const isCountGrown = currentCount > prevCount;
    const shouldAutoScroll =
      isFirstPaint || (isCountGrown && wasNearBottomRef.current);

    if (shouldAutoScroll) {
      requestAnimationFrame(() => {
        scrollToBottom(isFirstPaint ? 'auto' : 'smooth');
      });
    }

    previousMessageCountRef.current = currentCount;
  }, [formattedMessages]);

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
      {/* Load older messages button — shown only when there are more pages and not loading */}
      {hasMore && onLoadMore && !isLoadingMore && (
        <Box align="center" justify="center" style={{ marginBottom: '1rem' }}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              // Capture scrollHeight before older messages are prepended
              if (scrollRef.current) {
                previousHeightRef.current = scrollRef.current.scrollHeight;
              }
              onLoadMore();
            }}
            className={styles['messenger-messages-toggle-btn']}
            variant="text"
            icon="arrowDown"
          >
            Eski xabarlar
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
      <AnimatePresence initial={false} mode="popLayout">
        {groupedMessages.map(([date, messages]) => {
          return (
            <div
              key={date}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4rem',
                width: '100%',
                minWidth: 0,
              }}
            >
              <MessageDate date={date} format={false} size={size} />
              <AnimatePresence initial={false} mode="popLayout">
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
                      isDeleting={deletingId === message?._id}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          );
        })}
      </AnimatePresence>

      {/* Loader: sticky at bottom-center, always visible in viewport during loading */}
      {isLoadingMore && (
        <div
          style={{
            position: 'sticky',
            bottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            pointerEvents: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--primary-bg-color, #fff)',
              border: '1px solid var(--primary-border-color, #eee)',
              borderRadius: '20px',
              padding: '6px 14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <ClipLoader size={14} color="var(--primary-color, #666)" />
            <span
              style={{
                fontSize: '2.8rem',
                color: 'var(--secondary-color, #888)',
              }}
            >
              Yuklanmoqda...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageRenderer;
