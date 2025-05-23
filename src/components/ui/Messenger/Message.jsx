import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useFloating,
  shift,
  offset,
  flip,
  autoUpdate,
} from "@floating-ui/react-dom";
import moment from "moment";
import classNames from "classnames";

import styles from "./messenger.module.scss";
import iconsMap from "@utils/iconsMap";
import { Col, Button, Typography, Box } from "@components/ui";
import useFetchExecutors from "@hooks/data/clients/useFetchExecutors";

export default function Message({ msg, onEditMessage, onDeleteMessage, size }) {
  const { data: executors } = useFetchExecutors();
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(msg?.["Comments"]);

  const { x, y, strategy, update, refs } = useFloating({
    placement: "top-end",
    middleware: [offset(0), shift()],
  });

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) return;
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(true);
    update();
  };

  const handleEditSubmit = async () => {
    try {
      if (editText === "") {
        onDeleteMessage(msg?._id);
        return;
      }
      if (
        editText !== msg?.["Comments"] &&
        typeof onEditMessage === "function"
      ) {
        onEditMessage(msg?._id, { Comments: editText });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEditMode(false);
    }
  };

  const handleClickOutside = (e) => {
    if (
      refs.floating.current &&
      !refs.floating.current.contains(e.target) &&
      !refs.reference.current.contains(e.target)
    ) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const executor = executors?.find((e) => e?.["SlpCode"] === msg?.["SlpCode"]);
  const timestamp = moment(msg?.["DocDate"]).local().format("HH:mm");

  return (
    <motion.div
      ref={refs.setReference}
      onContextMenu={handleContextMenu}
      className={classNames(styles.message, styles[size])}
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -20 }}
      transition={{ damping: 10, type: "tween", duration: 0.2 }}>
      <Col>
        <div className={styles["message-text"]}>
          {editMode ? (
            <textarea
              className={styles["message-edit-input"]}
              value={editText}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.shiftKey) return;
                  handleEditSubmit();
                }
              }}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
          ) : (
            <p>{msg?.["Comments"]}</p>
          )}
          <time className={styles["message-time"]} dateTime={timestamp}>
            {timestamp}
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
            {executor?.["SlpName"] || "Noma'lum shaxs"}
          </Typography>
        </Box>
      </Col>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: !isNaN(y) ? y + 25 : 0,
              left: !isNaN(x) ? x : 0,
              zIndex: 99999,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles["message-text-menu"]}>
            <ul className={styles["message-text-menu-list"]}>
              <li className={styles["message-text-menu-list-item"]}>
                <Button
                  onClick={() => {
                    setShowMenu(false);
                    setEditMode(true);
                  }}
                  variant="text"
                  icon="pencil"
                  className={classNames(
                    styles["message-text-menu-btn"],
                    styles["edit"]
                  )}>
                  tahrirlash
                </Button>
              </li>
              <li className={styles["message-text-menu-list-item"]}>
                <Button
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteMessage(msg?._id);
                  }}
                  variant="text"
                  icon="deleteFilled"
                  className={classNames(
                    styles["message-text-menu-btn"],
                    styles["delete"]
                  )}>
                  o'chirish
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
