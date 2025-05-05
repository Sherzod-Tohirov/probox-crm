import { motion } from "framer-motion";
import { memo } from "react";
import { Typography } from "@components/ui";
import MessageForm from "./MessageForm";
import MessageRenderer from "./MessageRenderer";

import styles from "./messenger.module.scss";
import classNames from "classnames";

const MessengerModal = ({ messages = [], showSendForm = false }) => {
  return (
    <motion.div
      className={styles["messenger-modal"]}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}>
      <div className={styles["messenger-modal-header"]}>
        <Typography
          element="h2"
          className={classNames(styles.title, styles["small"])}>
          Xabarnoma
        </Typography>
      </div>
      <div className={styles["messenger-modal-body"]}>
        <MessageRenderer messages={messages} size={"small"} />
      </div>
      {showSendForm ? (
        <div className={styles["messenger-modal-footer"]}>
          <MessageForm onSubmit={() => {}} size={"small"} />
        </div>
      ) : (
        ""
      )}
    </motion.div>
  );
};

export default memo(MessengerModal);
