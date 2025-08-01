import moment from 'moment';
import classNames from 'classnames';
import { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFloating, shift, offset, autoUpdate } from '@floating-ui/react-dom';

import { Col, Button, Typography, Box } from '@components/ui';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import useAuth from '@hooks/useAuth';
import iconsMap from '@utils/iconsMap';
import getMessageColorForUser from '@utils/getMessageColorForUser';
import styles from './styles/messenger.module.scss';
import { API_CLIENT_IMAGES } from '@utils/apiUtils';
import AudioDuration from './AudioDuration';
import AudioPlayer from './AudioPlayer';

export default function Message({ msg, onEditMessage, onDeleteMessage, size }) {
  const audioRef = useRef(null);
  const { data: executors } = useFetchExecutors();
  const { user } = useAuth();
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

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (msg?.['SlpCode'] === user?.SlpCode) {
      setShowMenu(true);
      update();
    }
  };

  const handleEditSubmit = async () => {
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
  };

  const handleClickOutside = (e) => {
    if (
      refs.floating.current &&
      !refs.floating.current?.contains(e.target) &&
      !refs.reference.current?.contains(e.target)
    ) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const executor = executors?.find((e) => e?.['SlpCode'] === msg?.['SlpCode']);
  const timestamp = moment(msg?.['DocDate']).local().format('HH:mm');
  console.log('Message rendered:', msg);
  console.log(executors, 'Executors data');
  const msgColor = useMemo(
    () =>
      getMessageColorForUser(
        msg?.['SlpCode'],
        executors?.map((e) => e?.['SlpCode']) || []
      ),
    [msg?.['SlpCode'], executors]
  );
  const messageType = useMemo(() => {
    if (msg?.['Comments'] !== null) {
      return 'text';
    }
    if (msg?.['Image'] !== null) {
      return 'image';
    }
    if (msg?.['Audio'] !== null) {
      return 'audio';
    }
  }, [msg]);
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
                style={{ backgroundColor: msgColor?.bg }}
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
                <a href={url} target="_blank" download>
                  <img src={url} className={styles['message-image']} />
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
            style={{ color: msgColor?.text }}
            element="span"
            className={styles['message-avatar-icon']}
          >
            {msg.avatar ? (
              <img src={msg.avatar} width={50} height={50} />
            ) : (
              iconsMap['avatarFilled']
            )}
          </Typography>
          <Typography
            style={{ color: msgColor?.text }}
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
