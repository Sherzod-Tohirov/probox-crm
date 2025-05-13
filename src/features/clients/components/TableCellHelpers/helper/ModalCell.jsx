import { memo } from "react";
import styles from "./style.module.scss";
import { Button } from "@components/ui";
const ModalCell = ({
  title,
  children,
  onClose,
  onApply,
  applyButtonProps = {},
}) => {
  return (
    <div
      className={styles["modal"]}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <div className={styles["modal-header"]}>
        <h3 className={styles["modal-title"]}>{title}</h3>
      </div>
      <div className={styles["modal-body"]}>{children}</div>
      <div className={styles["modal-footer"]}>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}>
          Bekor qilish
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            onApply();
          }}
          {...applyButtonProps}>
          Tasdiqlash
        </Button>
      </div>
    </div>
  );
};

export default memo(ModalCell);
