import { createElement } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { Pencil, Trash2 } from 'lucide-react';

import { Col, Button, Typography, Box } from '@components/ui';
import iconsMap from '@utils/iconsMap';
import { API_CLIENT_IMAGES } from '@utils/apiUtils';
import styles from './styles/messenger.module.scss';
import AudioPlayer from './AudioPlayer';

import { MESSAGE_VARIANTS } from './utils/constants';
import { translateFieldLabel, toRgba } from './utils/formatters';
import useMessageData from './hooks/useMessageData';
import useMessageActions from './hooks/useMessageActions';

export default function Message({
  msg,
  onEditMessage,
  onDeleteMessage,
  size,
  animationIndex = 0,
  isDeleting = false,
}) {
  const baseMessageText = msg?.Comments ?? msg?.message ?? '';

  const {
    user,
    currentTheme,
    timestamp,
    timestampDateTime,
    msgColor,
    audioUrl,
    messageType,
    headerInfo,
    changeList,
    actorLabel,
    formatChangeValueForUi,
    bubbleBg,
    accentColor,
    isTextMessage,
  } = useMessageData(msg, baseMessageText);

  const {
    showMenu,
    setShowMenu,
    editMode,
    setEditMode,
    isSubmitting,
    messageText,
    editText,
    setEditText,
    handleContextMenu,
    handleEditSubmit,
    menuRef,
  } = useMessageActions({
    msg,
    user,
    isTextMessage,
    baseMessageText,
    onEditMessage,
    onDeleteMessage,
  });

  return (
    <motion.div
      onContextMenu={handleContextMenu}
      className={classNames(styles.message, styles[size], {
        [styles['message--deleting']]: isDeleting,
      })}
      layout
      custom={animationIndex}
      variants={MESSAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {isDeleting && (
        <div className={styles['message-deleting-overlay']}>
          <ClipLoader size={14} color="#e53e3e" />
          <span className={styles['message-deleting-label']}>
            O'chirilmoqda...
          </span>
        </div>
      )}
      <Col>
        {headerInfo && (
          <div
            className={styles['message-action-wrapper']}
            style={{
              backgroundColor:
                currentTheme === 'dark'
                  ? toRgba(headerInfo.color, 0.18)
                  : toRgba(headerInfo.color, 0.08),
              borderColor: toRgba(headerInfo.color, 0.35),
            }}
          >
            <Box dir="row" align="center" gap={1}>
              <span
                className={styles['message-action-icon']}
                style={{ color: headerInfo.color }}
              >
                <headerInfo.icon size={14} />
              </span>
              <Typography
                element="strong"
                className={styles['message-action-title']}
                style={{ color: headerInfo.color }}
              >
                {headerInfo.label}
              </Typography>
            </Box>
            {headerInfo.directionMeta ? (
              <Typography
                element="span"
                className={styles['message-action-subtitle']}
              >
                <span className={styles['message-action-direction-icon']}>
                  {createElement(headerInfo.directionMeta.icon, { size: 13 })}
                </span>
                {headerInfo.directionMeta.label}
              </Typography>
            ) : null}
            {changeList.length > 0 ? (
              <div className={styles['message-change-log']}>
                {changeList.map((change, index) => {
                  const field = translateFieldLabel(change?.field);
                  const fromValue = formatChangeValueForUi(
                    change?.field,
                    change?.from
                  );
                  const toValue = formatChangeValueForUi(
                    change?.field,
                    change?.to
                  );
                  return (
                    <div
                      key={change?._id || `${field}-${index}`}
                      className={styles['message-change-row']}
                    >
                      <span className={styles['message-change-field']}>
                        {field}
                      </span>
                      <span className={styles['message-change-arrow']}>:</span>
                      <span className={styles['message-change-from']}>
                        {fromValue}
                      </span>
                      <span className={styles['message-change-arrow']}>→</span>
                      <span className={styles['message-change-to']}>
                        {toValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
            <time
              className={styles['message-time']}
              dateTime={timestampDateTime}
            >
              {timestamp}
            </time>
          </div>
        )}
        {(() => {
          if (messageType === 'text' && !msg?.action) {
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
                <Box dir="row" gap={2} align="center" justify="end">
                  {editMode && (
                    <Button
                      className={styles['message-edit-submit-btn']}
                      onClick={handleEditSubmit}
                      variant="text"
                      icon={isSubmitting ? undefined : 'send'}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Box dir="row" gap={1} align="center">
                          <ClipLoader size={12} color="currentColor" />
                          <span>Saqlanmoqda...</span>
                        </Box>
                      ) : (
                        'Saqlash'
                      )}
                    </Button>
                  )}
                  <time
                    className={styles['message-time']}
                    dateTime={timestampDateTime}
                  >
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
              <div className={styles['message-audio-body']}>
                <AudioPlayer
                  className={size}
                  src={audioUrl}
                  externalDuration={msg?.['Audio']?.['duration']}
                  color={msgColor}
                />
              </div>
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
            {actorLabel}
          </Typography>
        </Box>
      </Col>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.15 }}
            className={styles['message-context-menu']}
          >
            <button
              className={classNames(
                styles['message-context-btn'],
                styles['message-context-btn--edit']
              )}
              onClick={() => {
                setShowMenu(false);
                setEditMode(true);
              }}
              disabled={messageType !== 'text'}
            >
              <Pencil size={13} />
              <span>Tahrirlash</span>
            </button>
            <div className={styles['message-context-divider']} />
            <button
              className={classNames(
                styles['message-context-btn'],
                styles['message-context-btn--delete']
              )}
              onClick={() => {
                setShowMenu(false);
                onDeleteMessage(msg?._id);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ClipLoader size={11} color="#e53e3e" />
              ) : (
                <Trash2 size={13} />
              )}
              <span>{isDeleting ? "O'chirilmoqda..." : "O'chirish"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
