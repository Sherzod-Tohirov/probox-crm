import classNames from "classnames";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui";

import useToggle from "@hooks/useToggle";

import { mockMessages } from "../../../../mockData";

import { v4 as uuidv4 } from "uuid";

import styles from "./messenger.module.scss";
import moment from "moment";
import MessageForm from "./MessageForm";
import MessageRenderer from "./MessageRenderer";

export default function Messenger() {
  const { isOpen } = useToggle("messenger");
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = useCallback((data) => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          id: uuidv4(),
          text: data.msgText,
          sender: "agent",
          timestamp: `${moment().format("YYYY-MM-DDTHH:mm:ss")}.000Z`,
          status: "sent",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
      ];
    });
  }, []);

  console.log(messages, "messages");

  return (
    <motion.div
      initial={{ x: "0", display: "none" }}
      animate={{
        x: isOpen ? "0" : "100%",
        display: isOpen ? "flex" : "none",
      }}
      exit={{ x: "100%", display: "none" }}
      transition={{ type: "spring", stiffness: 100, damping: 16 }}
      className={classNames(styles.messenger)}>
      <div className={styles["messenger-header"]}>
        <Typography element="h2" className={styles.title}>
          Messenger
        </Typography>
      </div>
      <div className={styles["messenger-body"]}>
        <MessageRenderer messages={messages} />
      </div>
      <div className={styles["messenger-footer"]}>
        <MessageForm onSubmit={handleSendMessage} />
      </div>
    </motion.div>
  );
}
