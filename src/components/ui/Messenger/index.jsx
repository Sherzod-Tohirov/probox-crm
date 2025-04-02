import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Col, Row, Typography, Box } from "@components/ui";

import Message from "./Message";
import useToggle from "@hooks/useToggle";
import MessageDate from "./MessageDate";

import { mockMessages } from "../../../../mockData";
import { groupBy } from "ramda";
import { v4 as uuidv4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import { messengerSchema } from "@utils/validationSchemas";

import styles from "./messenger.module.scss";
import moment from "moment";

export default function Messenger() {
  const { isOpen } = useToggle("messenger");
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState(mockMessages);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(messengerSchema),
  });

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
    reset();
  }, []);

  // Scroll to bottom when new message is added
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

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
      </div>
      <div className={styles["messenger-footer"]}>
        <form
          className={styles["text-input-form"]}
          onSubmit={handleSubmit(handleSendMessage)}>
          <textarea
            className={styles["text-input"]}
            placeholder="Type here..."
            {...register("msgText")}></textarea>
          <Row direction="row" align="center" justify="space-between">
            <Col>
              <Button
                type={"button"}
                icon={"addCircle"}
                variant={"text"}
                color={"primary"}
                iconColor={"primary"}
              />
            </Col>
            <Col>
              <Button
                className={classNames(styles["send-btn"], {
                  [styles["invalid"]]: !isValid,
                })}
                style={{ fontWeight: 600 }}
                icon={"send"}
                variant={"text"}
                iconPosition="right"
                iconColor={"primary"}
                color={"primary"}
                type={"submit"}>
                Send
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    </motion.div>
  );
}
