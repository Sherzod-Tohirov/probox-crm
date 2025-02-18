import { Modal, Col, Row } from "@components/ui";
import styles from "./clientPageForm.module.scss";
export default function ImagePreviewModal({ images = [], isOpen, onClose }) {
  return (
    <Modal title="Image preview" isOpen={isOpen} onClose={onClose}>
      <div className={styles["image-preview-container"]}>
        <div className={styles["image-preview-wrapper"]}>
          <div className={styles["image-preview"]}>
            {images.map((image, index) => (
              <img
                className={styles["preview-img"]}
                key={index}
                src={image.img}
                alt={image.title}
              />
            ))}
          </div>
        </div>
        {/* <div className={styles["image-indicator"]}>
          {images.map((image, index) => (
            <img
              className={"indicator-img"}
              key={index}
              src={image.img}
              alt={image.title}
            />
          ))}
        </div> */}
      </div>
    </Modal>
  );
}
