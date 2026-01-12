import moment from 'moment';
import classNames from 'classnames';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFloating, shift, offset, autoUpdate } from '@floating-ui/react-dom';

import { Col, Button, Typography, Box } from '@components/ui';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import useAuth from '@hooks/useAuth';
import useTheme from '@hooks/useTheme';
import iconsMap from '@utils/iconsMap';
import getMessageColorForUser from '@utils/getMessageColorForUser';
import styles from './styles/messenger.module.scss';
import { API_CLIENT_IMAGES } from '@utils/apiUtils';
import AudioPlayer from './AudioPlayer';

// Helper: ensure colored bubbles look good in dark/light themes
const toRgba = (color, alpha = 1) => {
  if (!color) return '';
  // rgba(a,b,c,d)
  const rgbaMatch = color.match(
    /^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*\.?\d+))?\)$/i
  );
  if (rgbaMatch) {
    const [, r, g, b] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // #RRGGBB or #RGB
  const hex = color.trim();
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let r, g, b;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // Fallback: return as-is
  return color;
};

export default function Message({ msg, onEditMessage, onDeleteMessage, size }) {
  const { data: executors } = useFetchExecutors();
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageText, setMessageText] = useState(msg?.['Comments']);
  const [editText, setEditText] = useState(msg?.['Comments']);

  const { x, y, strategy, update, refs } = useFloating({
    placement: 'top-end',
    middleware: [offset(0), shift()],
  });

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) return;
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  useEffect(() => {
    setMessageText(msg?.['Comments']);
    setEditText(msg?.['Comments']);
  }, [msg?.['Comments']]);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      if (msg?.['SlpCode'] === user?.SlpCode) {
        setShowMenu(true);
        update();
      }
    },
    [msg?.['SlpCode'], user?.SlpCode, update]
  );

  const handleEditSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      if (editText === '') {
        onDeleteMessage(msg?._id);
        return;
      }
      if (
        editText !== msg?.['Comments'] &&
        typeof onEditMessage === 'function'
      ) {
        setMessageText(editText);
        await onEditMessage(msg?._id, { Comments: editText });
      }
    } catch (error) {
      setMessageText(msg?.['Comments']);
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setEditMode(false);
    }
  }, [editText, msg?._id, msg?.['Comments'], onEditMessage, onDeleteMessage]);

  const handleClickOutside = useCallback(
    (e) => {
      if (
        refs.floating.current &&
        !refs.floating.current?.contains(e.target) &&
        !refs.reference.current?.contains(e.target)
      ) {
        setShowMenu(false);
      }
    },
    [refs.floating, refs.reference]
  );

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, handleClickOutside]);

  // Memoize expensive computations
  const executor = useMemo(
    () => executors?.find((e) => e?.['SlpCode'] === msg?.['SlpCode']),
    [executors, msg?.['SlpCode']]
  );

  const timestamp = useMemo(
    () =>
      moment(msg?.created_at ?? msg?.createdAt)
        .local()
        .format('HH:mm'),
    [msg?.created_at, msg?.createdAt]
  );

  const msgColor = useMemo(
    () =>
      getMessageColorForUser(
        msg?.['SlpCode'],
        executors?.map((e) => e?.['SlpCode']) || []
      ),
    [msg?.['SlpCode'], executors]
  );

  const messageType = useMemo(() => {
    if (msg?.['Comments'] !== null) return 'text';
    if (msg?.['Image'] !== null) return 'image';
    if (msg?.['Audio'] !== null) return 'audio';
    return null;
  }, [msg]);

  // Theme-aware bubble background to keep readable contrast in dark mode
  const bubbleBg = useMemo(() => {
    if (!msgColor?.bg) return undefined;
    return currentTheme === 'dark' ? toRgba(msgColor.bg, 0.25) : msgColor.bg;
  }, [msgColor?.bg, currentTheme]);

  // Theme-aware accent color for author/icon
  const accentColor = useMemo(() => {
    return currentTheme === 'dark' ? '#e5e7eb' : msgColor?.text;
  }, [currentTheme, msgColor?.text]);
  useEffect(() => {
    if (!msg?.['Audio']) return;

    const audio = new Audio(API_CLIENT_IMAGES + msg?.['Audio']);

    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {};

    // Cleanup
    return () => {
      audio.src = '';
    };
  }, [msg?.['Audio']]);

  return (
    <motion.div
      ref={refs.setReference}
      onContextMenu={handleContextMenu}
      className={classNames(styles.message, styles[size])}
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -20 }}
      transition={{ damping: 10, type: 'tween', duration: 0.2 }}
    >
      <Col>
        {(() => {
          if (messageType === 'text') {
            return (
              <div
                style={{
                  backgroundColor: bubbleBg,
                  border:
                    currentTheme === 'dark'
                      ? '1px solid rgba(255,255,255,0.06)'
                      : '1px solid rgba(0,0,0,0.04)',
                  boxShadow:
                    currentTheme === 'dark'
                      ? '0 1px 2px rgba(0,0,0,0.6)'
                      : undefined,
                }}
                className={styles['message-text-wrapper']}
              >
                {editMode ? (
                  <textarea
                    className={styles['message-edit-input']}
                    value={editText}
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
                        handleEditSubmit();
                      }
                    }}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <p className={styles['message-text']}>{messageText}</p>
                )}
                <Box dir="row" gap={2} align="center" justify={'end'}>
                  {editMode && (
                    <Button
                      className={styles['message-edit-submit-btn']}
                      onClick={handleEditSubmit}
                      variant={'text'}
                      icon={'send'}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
                    </Button>
                  )}
                  <time className={styles['message-time']} dateTime={timestamp}>
                    {timestamp}
                  </time>
                </Box>
              </div>
            );
          }
          if (messageType === 'image') {
            const url = API_CLIENT_IMAGES + msg?.['Image'];
            return (
              <div className={styles['message-image-wrapper']}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <img
                    src={url}
                    className={styles['message-image']}
                    alt="message image"
                    loading="lazy"
                  />
                </a>
              </div>
            );
          }
          if (messageType === 'audio') {
            return (
              <AudioPlayer
                className={size}
                src={API_CLIENT_IMAGES + msg?.['Audio']?.['url']}
                externalDuration={msg?.['Audio']?.['duration']}
                color={msgColor}
              />
            );
          }
        })()}
      </Col>

      <Col>
        <Box dir="row" gap={1} align="center">
          <Typography
            style={{ color: accentColor }}
            element="span"
            className={styles['message-avatar-icon']}
          >
            {msg.avatar ? (
              <img
                src={msg.avatar}
                width={50}
                height={50}
                alt="avatar"
                loading="lazy"
              />
            ) : (
              iconsMap['avatarFilled']
            )}
          </Typography>
          <Typography
            style={{ color: accentColor }}
            element="span"
            className={styles['message-author']}
          >
            {msg?.['SlpCode'] === user?.SlpCode
              ? 'Siz'
              : executor?.['SlpName'] || "Noma'lum shaxs"}
          </Typography>
        </Box>
      </Col>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: !isNaN(y) ? y + 25 : 0,
              left: !isNaN(x) ? x : 0,
              zIndex: 99999,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles['message-text-menu']}
          >
            <ul className={styles['message-text-menu-list']}>
              <li className={styles['message-text-menu-list-item']}>
                <Button
                  onClick={() => {
                    setShowMenu(false);
                    setEditMode(true);
                  }}
                  variant="text"
                  icon="pencil"
                  className={classNames(
                    styles['message-text-menu-btn'],
                    styles['edit']
                  )}
                  disabled={messageType !== 'text'}
                >
                  tahrirlash
                </Button>
              </li>
              <li className={styles['message-text-menu-list-item']}>
                <Button
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteMessage(msg?._id);
                  }}
                  variant="text"
                  icon="deleteFilled"
                  className={classNames(
                    styles['message-text-menu-btn'],
                    styles['delete']
                  )}
                >
                  o'chirish
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
