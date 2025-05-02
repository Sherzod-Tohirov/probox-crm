import classNames from "classnames";
import { motion } from "framer-motion";
import { Typography, Button } from "@components/ui";
import useToggle from "@hooks/useToggle";
import styles from "./messenger.module.scss";
import MessageForm from "./MessageForm";
import MessageRenderer from "./MessageRenderer";
import { ClipLoader } from "react-spinners";
import { forwardRef } from "react";

export const Messenger = (
  {
    messages = [],
    isLoading = false,
    onSendMessage,
    onEditMessage,
    onDeleteMessage,
  },
  ref
) => {
  const { isOpen, toggle } = useToggle("messenger");
  console.log(messages, "messages");
  console.log(isOpen, "isOpen");
  return (
    <motion.div
      ref={ref}
      id={"messenger"}
      initial={{ x: "0", display: "none" }}
      animate={{
        x: isOpen ? "0" : "100%",
        display: isOpen ? "flex" : "none",
      }}
      exit={{ x: "100%", display: "none" }}
      transition={{ type: "spring", stiffness: 100, damping: 16 }}
      className={classNames(styles.messenger)}>
      <div className={styles["messenger-header"]}>
        <Button
          className={styles["toggle-button"]}
          variant={"text"}
          icon={"toggleOpen"}
          onClick={toggle}></Button>
        <Typography element="h2" className={styles.title}>
          Messenger
        </Typography>
      </div>
      <div className={styles["messenger-body"]}>
        {isLoading ? (
          <ClipLoader color={"black"} size={22} />
        ) : (
          <MessageRenderer
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            messages={messages}
          />
        )}
      </div>
      <div className={styles["messenger-footer"]}>
        <MessageForm onSubmit={onSendMessage} />
      </div>
    </motion.div>
  );
};

export default forwardRef(Messenger);
