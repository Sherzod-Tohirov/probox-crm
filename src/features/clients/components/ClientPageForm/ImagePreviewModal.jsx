import { Modal, Box, Typography, Button } from "@components/ui";
import styles from "./clientPageForm.module.scss";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";
import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

const PreviewModalFooter = memo(
  ({ onCancel, onApply, isLoading, isDisabled }) => {
    return (
      <Box dir="row" justify="end" gap={4}>
        <Button fullWidth color="danger" onClick={onCancel}>
          Bekor qilish
        </Button>
        <Button
          fullWidth
          onClick={onApply}
          isLoading={isLoading}
          disabled={isDisabled}>
          Saqlash
        </Button>
      </Box>
    );
  }
);

export default function ImagePreviewModal({
  images = [],
  inputId,
  isOpen,
  onClose,
  onApply,
  isLoading,
  isDisabled = false,
  onRemoveImage,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  console.log(loadedImages, "loaded");
  return (
    <Modal
      title="Mijozga tegishli rasmlar"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <PreviewModalFooter
          onCancel={() => {
            onClose();
            setCurrentImage(0);
          }}
          isLoading={isLoading}
          isDisabled={isDisabled}
          onApply={onApply}
        />
      }>
      <div className={styles["image-preview-container"]}>
        <div className={styles["image-preview-wrapper"]}>
          <div className={styles["image-preview"]}>
            {images.length ? (
              images.map((img, index) => (
                <img
                  className={classNames(styles["preview-img"], {
                    [styles["active"]]: currentImage === index,
                  })}
                  key={img?.id}
                  src={img?.image}
                  alt={img?.image}
                  onLoad={() =>
                    setLoadedImages((prev) => ({ ...prev, [img.id]: true }))
                  }
                />
              ))
            ) : (
              <Box
                dir="column"
                align="center"
                gap={2}
                className={styles["no-image"]}>
                <Typography element={"p"} className={styles["no-image-text"]}>
                  Hozircha rasmlar yo'q
                </Typography>
              </Box>
            )}
          </div>
        </div>
        <div className={styles["image-indicator"]}>
          <AnimatePresence mode="popLayout">
            {images.map((img, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.2,
                  type: "tween",
                  ease: "easeInOut",
                  stiffness: 300,
                  damping: 30,
                }}
                className={styles["indicator-img-wrapper"]}
                key={img?.id}>
                <motion.img
                  className={classNames(styles["indicator-img"], {
                    [styles["active"]]: currentImage === index,
                  })}
                  key={img?.id}
                  src={img?.image}
                  alt={img?.image}
                  layoutId={`image-${index}`}
                  onClick={() => setCurrentImage(index)}
                />
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onRemoveImage(img, index);
                    if (index === currentImage) {
                      setCurrentImage(0);
                    }
                  }}
                  className={styles["indicator-img-close"]}>
                  {iconsMap["close"]}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>
          <label htmlFor={inputId} className={styles["upload-photo-label"]}>
            <Box dir="column" align="center" gap={1}>
              <Typography element="span">{iconsMap["addCircle"]}</Typography>
              <Typography element="span">Rasm yuklash</Typography>
            </Box>
          </label>
        </div>
      </div>
    </Modal>
  );
}
