import classNames from "classnames";
import Button from "../Button";
import Col from "../Col";
import Row from "../Row";
import Typography from "../Typography";
import Message from "./Message";
import styles from "./messenger.module.scss";
import useToggle from "@hooks/useToggle";
import { motion } from "framer-motion";
import MessageDate from "./MessageDate";
import { mockMessages } from "../../../../mockData";
import Box from "../Box";
import { groupBy } from "ramda";
export default function Messenger() {
  const { isOpen } = useToggle("messenger");
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
        <div className={styles["messenger-messages"]}>
          {Object.entries(
            groupBy((msg) => msg.timestamp.slice(0, 10), mockMessages)
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
        </div>
      </div>
      <div className={styles["messenger-footer"]}>
        <form className={styles["text-input-form"]}>
          <textarea
            className={styles["text-input"]}
            placeholder="Type here..."></textarea>
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
                style={{ fontWeight: 600 }}
                icon={"send"}
                variant={"text"}
                iconPosition="right"
                iconColor={"primary"}
                color={"primary"}
                type={"button"}>
                Send
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    </motion.div>
  );
}
