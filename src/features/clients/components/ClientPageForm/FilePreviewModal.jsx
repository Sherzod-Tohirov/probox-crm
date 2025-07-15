import { Modal, Box, Typography, Button } from "@components/ui";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./clientPageForm.module.scss";
import Skeleton from "react-loading-skeleton";
import { memo, useState } from "react";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";

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

export default function FilePreviewModal({
  files = [],
  inputId,
  isOpen,
  onClose,
  onApply,
  isLoading,
  isDisabled = false,
  onRemoveFile,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedFiles, setLoadedFiles] = useState({});

  return (
    <Modal
      title="Mijozga tegishli hujjatlar"
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
            <AnimatePresence>
              {files.length ? (
                files.map((file, index) => {
                  return (
                    <>
                      {!loadedFiles[file?.id] && (
                        <Skeleton
                          key={file?.id}
                          count={1}
                          style={{ background: "rgba(0,0,0,0.4s)" }}
                          className={styles["file-image"]}
                        />
                      )}
                      <motion.img
                        className={classNames(styles["preview-img"], {
                          [styles["active"]]: currentImage === index,
                          [styles["hidden"]]: loadedFiles[file?.id],
                        })}
                        key={file?.id}
                        src={file?.image}
                        alt={file?.image}
                        onLoad={() =>
                          setLoadedFiles((prev) => ({
                            ...prev,
                            [file.id]: true,
                          }))
                        }
                      />
                    </>
                  );
                })
              ) : (
                <Box
                  dir="column"
                  align="center"
                  justify="center"
                  gap={2}
                  className={styles["no-image"]}>
                  <Typography element={"p"} className={styles["no-image-text"]}>
                    Hozircha hujjatlar yo'q
                  </Typography>
                </Box>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className={styles["image-indicator"]}>
          <AnimatePresence mode="popLayout">
            {files.map((file, index) => (
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
                key={file?.id}>
                {!loadedFiles[file?.id] && (
                  <Skeleton
                    count={1}
                    style={{ background: "rgba(0,0,0,0)" }}
                    className={styles["indicator-img"]}
                  />
                )}
                <motion.img
                  className={classNames(styles["indicator-img"], {
                    [styles["active"]]: currentImage === index,
                    [styles["hidden"]]: !loadedFiles[file?.id],
                  })}
                  key={file?.id}
                  src={file?.image}
                  alt={file?.image}
                  onLoad={() =>
                    setLoadedFiles((prev) => ({ ...prev, [file.id]: true }))
                  }
                  layoutId={`image-${index}`}
                  onClick={() => setCurrentImage(index)}
                />
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onRemoveFile(file, index);
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
              <Typography element="span">Hujjat yuklash</Typography>
            </Box>
          </label>
        </div>
      </div>
    </Modal>
  );
}
