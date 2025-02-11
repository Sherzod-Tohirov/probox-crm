import { useState } from "react";
import styles from "./statistic.module.scss";
import classNames from "classnames";
import { motion } from "framer-motion";

const OPTIONS = {
  all: "All",
  year: "Year",
  month: "Month",
};

export default function FilterToggle() {
  const [selected, setSelected] = useState("all");

  return (
    <motion.div className={styles["filter-btn-group"]}>
      {Object.keys(OPTIONS).map((key) => (
        <motion.button
          onClick={() => setSelected(key)}
          whileTap={{ scale: 0.9 }} // Click effect
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={classNames(
            styles["filter-btn"],
            key === selected && styles["active"]
          )}
          key={key}>
          {OPTIONS[key]}
        </motion.button>
      ))}
    </motion.div>
  );
}
