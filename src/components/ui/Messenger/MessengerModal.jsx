import { memo, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MessageRenderer from './MessageRenderer';
import { Typography } from '@components/ui';
import MessageForm from './MessageForm';

import styles from './styles/messenger.module.scss';
import classNames from 'classnames';
import { ClipLoader } from 'react-spinners';
import moment from 'moment';

const MessengerModal = ({
  messages = [],
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  hasToggleControl = false,
  isLoading = false,
}) => {
  const [showSendForm, setShowSendForm] = useState(false);

  return (
    <motion.div
      className={styles['messenger-modal']}
      onClick={(e) => {
        e.stopPropagation();
        setShowSendForm(true);
      }}
    >
      <div className={styles['messenger-modal-header']}>
        <Typography
          element="h2"
          className={classNames(styles.title, styles['small'])}
        >
          Xabarnoma
        </Typography>
      </div>
      <div className={styles['messenger-body']}>
        {isLoading ? (
          <div className={styles['messenger-body-loader-wrapper']}>
            <ClipLoader color={'black'} size={22} />
          </div>
        ) : (
          <MessageRenderer
            hasToggleControl={hasToggleControl}
            onDeleteMessage={onDeleteMessage}
            onEditMessage={onEditMessage}
            messages={messages}
            size={'small'}
          />
        )}
      </div>
      <AnimatePresence mode="sync">
        {showSendForm ? (
          <motion.div className={styles['messenger-modal-footer']}>
            <MessageForm onSubmit={onSendMessage} size={'small'} />
          </motion.div>
        ) : (
          ''
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(MessengerModal);
