import { Modal, Box, Typography, Button } from "@components/ui";
import styles from "./clientPageForm.module.scss";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";
import { memo, useState } from "react";
import { motion } from "framer-motion";

const PreviewModalFooter = memo(({ onCancel, onApply }) => {
  return (
    <Box dir="row" justify="end" gap={4}>
      <Button fullWidth color="danger" onClick={onCancel}>
        Закрыть
      </Button>
      <Button fullWidth onClick={onApply}>
        Сохранить
      </Button>
    </Box>
  );
});

export default function ImagePreviewModal({
  images = [],
  inputId,
  isOpen,
  onClose,
  onApply,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  console.log(currentImage, "currentImage");
  console.log(images, "images");
  return (
    <Modal
      title="Изображения продукта"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <PreviewModalFooter
          onCancel={() => {
            onClose();
            setCurrentImage(0);
          }}
          onApply={onApply}
        />
      }>
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
            <div className={styles["indicator-img-wrapper"]} key={index}>
              <img
                className={classNames(styles["indicator-img"], {
                  [styles["active"]]: currentImage === index,
                })}
                key={index}
                src={image.img}
                alt={image.title}
                onClick={() => setCurrentImage(index)}
              />
              <motion.span
                whileTap={{ scale: 0.9 }}
                className={styles["indicator-img-close"]}>
                {iconsMap["close"]}
              </motion.span>
            </div>
          ))}
          <label htmlFor={inputId} className={styles["upload-photo-label"]}>
            <Box dir="column" align="center" gap={1}>
              <Typography element="span">{iconsMap["addCircle"]}</Typography>
              <Typography element="span">Загрузить фото</Typography>
            </Box>
          </label>
        </div>
      </div>
    </Modal>
  );
}
