import { groupBy } from "ramda";
import { useEffect, useRef } from "react";
import Message from "./Message";
import MessageDate from "./MessageDate";
import styles from "./messenger.module.scss";
import { Box } from "@components/ui";
import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import moment from "moment";
const MessageRenderer = ({ messages = [], onEditMessage, onDeleteMessage }) => {
  console.log(messages, "messagesRenderer");
  const scrollRef = useRef(null);
  // Scroll to bottom when new message is added
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);
  console.log(
    Object.entries(
      groupBy((msg) => {
        const formattedDate = moment(msg?.["DocDate"]).format("DD-MM-YYYY");
        console.log(msg, "msg");
        console.log(formattedDate, "formattedDate");
        return formattedDate;
      }, messages)
    ),
    "groupedMessages"
  );
  return (
    <div className={styles["messenger-messages"]} ref={scrollRef}>
      <AnimatePresence mode="sync">
        {(messages.length > 0
          ? Object.entries(
              groupBy((msg) => {
                const formattedDate = moment(msg?.["DocDate"]).format(
                  "DD-MM-YYYY"
                );
                return formattedDate;
              }, messages)
            )
          : []
        ).map(([date, messages], index) => {
          return (
            <Box dir="column" gap={2} key={index}>
              <MessageDate date={date} format={false} />
              {messages.map((message) => (
                <Message
                  msg={message}
                  key={message?.["_id"]}
                  onEditMessage={onEditMessage}
                  onDeleteMessage={onDeleteMessage}
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
