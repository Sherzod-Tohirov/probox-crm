import { groupBy } from "ramda";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageDate from "./MessageDate";
import styles from "./styles/messenger.module.scss";
import { Box, Button } from "@components/ui";
import { AnimatePresence } from "framer-motion";
import _ from "lodash";
import moment from "moment";
const MessageRenderer = ({
  messages = [],
  onEditMessage,
  onDeleteMessage,
  hasToggleControl = true,
  size = "",
}) => {
  const scrollRef = useRef(null);
  const [formattedMessages, setFormattedMessages] = useState([]);
  const [lastMonthMessages, setLastMonthMessages] = useState([]);
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  // Scroll to bottom when new message is added
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useLayoutEffect(() => {
    const now = moment();
    const filteredMessages = messages.filter((msg) => {
      const msgDate = moment(msg.created_at);
      return !now.isSame(msgDate, "month");
    });
    setLastMonthMessages(filteredMessages);
  }, [messages]);

  useLayoutEffect(() => {
    if (hasToggleControl) {
      if (isToggleOpen) {
        setFormattedMessages(messages);
        return;
      }
      const now = moment();
      const filteredMessages = messages.filter((msg) => {
        const msgDate = moment(msg.created_at);
        return now.isSame(msgDate, "month");
      });
      setFormattedMessages(filteredMessages);
    } else {
      setFormattedMessages(messages);
    }
  }, [messages, hasToggleControl, isToggleOpen]);
  return (
    <div className={styles["messenger-messages"]} ref={scrollRef}>
      {hasToggleControl && lastMonthMessages.length > 0 ? (
        <Box align={"center"} justify={"center"}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsToggleOpen((p) => !p);
            }}
            className={styles["messenger-messages-toggle-btn"]}
            variant={"text"}
            icon={isToggleOpen ? "arrowUp" : "arrowDown"}>
            {isToggleOpen ? "Yopish" : "Hammasini ko'rish"}
          </Button>
        </Box>
      ) : null}
      <AnimatePresence mode="sync">
        {(formattedMessages.length > 0
          ? Object.entries(
              groupBy((msg) => {
                const formattedDate = moment(msg?.["DocDate"]).format(
                  "DD-MM-YYYY"
                );
                return formattedDate;
              }, formattedMessages)
            )
          : []
        ).map(([date, messages], index) => {
          return (
            <Box dir="column" gap={2} key={index}>
              <MessageDate date={date} format={false} size={size} />
              {messages.map((message) => (
                <Message
                  msg={message}
                  key={message?.["_id"]}
                  onEditMessage={onEditMessage}
                  onDeleteMessage={onDeleteMessage}
                  size={size}
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
