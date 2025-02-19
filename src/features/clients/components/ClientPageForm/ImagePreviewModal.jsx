import { Modal, Box, Typography } from "@components/ui";
import styles from "./clientPageForm.module.scss";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";
import { useState } from "react";
export default function ImagePreviewModal({
  images = [],
  inputId,
  isOpen,
  onClose,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  return (
    <Modal title="Image preview" isOpen={isOpen} onClose={onClose}>
      <div className={styles["image-preview-container"]}>
        <div className={styles["image-preview-wrapper"]}>
          <div className={styles["image-preview"]}>
            {images.map((image, index) => (
              <img
                className={classNames(styles["preview-img"], {
                  [styles["active"]]: currentImage === index,
                })}
                key={index}
                src={image.img}
                alt={image.title}
              />
            ))}
          </div>
        </div>
        <div className={styles["image-indicator"]}>
          {images.map((image, index) => (
            <img
              className={classNames(styles["indicator-img"], {
                [styles["active"]]: currentImage === index,
              })}
              key={index}
              src={image.img}
              alt={image.title}
              onClick={() => setCurrentImage(index)}
            />
          ))}
          <label htmlFor={inputId} className={styles["upload-photo-label"]}>
            <Box dir="column" align="center" gap={1}>
              <Typography element="span">{iconsMap["addCircle"]}</Typography>
              <Typography element="span">Upload photo</Typography>
            </Box>
          </label>
        </div>
      </div>
    </Modal>
  );
}
