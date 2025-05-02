import iconsMap from "@utils/iconsMap";
import styles from "./messenger.module.scss";
import moment from "moment";
import { Col, Button, Typography, Box } from "@components/ui";
import { AnimatePresence, motion } from "framer-motion";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
import classNames from "classnames";
import { useState } from "react";
const Menu = ({ msg, showMenu, onEditMessage, onDeleteMessage }) => {
  const handleEditMessage = () => {
    onEditMessage(msg);
  };
  const handleDeleteMessage = () => {
    onDeleteMessage(msg);
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={classNames(
          styles["message-text-menu"],
          showMenu && styles["message-text-menu-open"]
        )}>
        <ul className={styles["message-text-menu-list"]}>
          <li className={styles["message-text-menu-list-item"]}>
            <Button
              onClick={handleEditMessage}
              variant={"text"}
              icon={"edit"}
              className={styles["message-menu-btn"]}></Button>
          </li>
          <li className={styles["message-text-menu-list-item"]}>
            <Button
              onClick={handleDeleteMessage}
              variant={"text"}
              icon={"delete"}
              className={styles["message-menu-btn"]}></Button>
          </li>
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Message({ msg, onEditMessage, onDeleteMessage }) {
  const { data: executors } = useFetchExecutors();
  const [showMenu, setShowMenu] = useState(false);
  const foundExecutor = executors?.find(
    (executor) => executor?.["SlpCode"] === msg?.["SlpCode"]
  );
  const MessageTimestamp = moment(msg?.["DocDate"]).local().format("HH:mm");
  const handleMenuClick = (e) => {
    setShowMenu((prev) => !prev);
    e.stopPropagation();
  };

  return (
    <motion.div
      className={styles.message}
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -20 }}
      transition={{ damping: 20, type: "spring", duration: 0.05 }}>
      <Col>
        {console.log(msg, "msg")}
        <div dir="column" className={styles["message-text"]}>
          <Menu
            msg={msg}
            showMenu={showMenu}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
          />
          {/* <Button
            onClick={handleMenuClick}
            variant={"text"}
            icon={"menuDots"}
            className={styles["message-menu-btn"]}></Button> */}
          <p>{msg?.["Comments"]}</p>
          <time className={styles["message-time"]} dateTime={MessageTimestamp}>
            {MessageTimestamp}
          </time>
        </div>
      </Col>
      <Col>
        <Box dir="row" gap={1} align="center">
          <Typography element="span" className={styles["message-avatar-icon"]}>
            {msg.avatar ? (
              <img src={msg.avatar} width={50} height={50} />
            ) : (
              iconsMap["avatarFilled"]
            )}
          </Typography>
          <Typography element="span" className={styles["message-author"]}>
            {foundExecutor?.["SlpName"] || "Noma'lum shaxs"}
          </Typography>
        </Box>
      </Col>
    </motion.div>
  );
}
