import { Modal, Box, Typography, Button } from "@components/ui";
import styles from "./clientPageForm.module.scss";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";
import { useState } from "react";
import useAlert from "@hooks/useAlert";

const PreviewModalFooter = ({ onCancel, onApply }) => {
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
};

export default function ImagePreviewModal({
  images = [],
  inputId,
  isOpen,
  onClose,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const { alert } = useAlert();
  return (
    <Modal
      title="Изображения продукта"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <PreviewModalFooter
          onCancel={onClose}
          onApply={() => {
            alert("Изображения сохранены");
            onClose();
          }}
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
              <Typography element="span">Загрузить фото</Typography>
            </Box>
          </label>
        </div>
      </div>
    </Modal>
  );
}
