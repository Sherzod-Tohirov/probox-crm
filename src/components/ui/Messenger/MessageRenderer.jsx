import { groupBy } from "ramda";
import { useEffect, useRef } from "react";
import Message from "./Message";
import MessageDate from "./MessageDate";
import styles from "./messenger.module.scss";
import { Box } from "@components/ui";
import { AnimatePresence } from "framer-motion";
const MessageRenderer = ({ messages = [] }) => {
  const scrollRef = useRef(null);
  // Scroll to bottom when new message is added
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);
  return (
    <div className={styles["messenger-messages"]} ref={scrollRef}>
      <AnimatePresence mode="sync">
        {Object.entries(
          groupBy((msg) => msg.timestamp.slice(0, 10), messages)
        ).map(([date, messages], index) => {
          return (
            <Box dir="column" gap={2} key={index}>
              <MessageDate date={date} />
              {messages.map((message) => (
                <Message msg={message} />
              ))}
            </Box>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default MessageRenderer;
