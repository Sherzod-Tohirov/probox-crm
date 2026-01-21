import { Modal, Box, Typography, Button } from '@components/ui';
import styles from './style.module.scss';
import iconsMap from '@utils/iconsMap';
import classNames from 'classnames';
import { memo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';

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
          disabled={isDisabled}
        >
          Saqlash
        </Button>
      </Box>
    );
  }
);

const EmptyPlaceholder = memo(({ title, className }) => {
  return (
    <Box
      dir="column"
      align="center"
      justify="center"
      gap={2}
      className={classNames(styles['no-image'], className)}
    >
      <Typography element="p" className={styles['no-image-text']}>
        {title ?? " Hozircha hujjatlar yo'q"}
      </Typography>
    </Box>
  );
});

export default function FilePreviewModal({
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
  const findFileType = (file) => {
    if (file.type === 'server') {
      const extension = file.image.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
          return 'image';
        case 'pdf':
          return 'pdf';
        case 'xlsx':
        case 'xls':
          return 'excel';
        default:
          return 'unknown';
      }
    } else {
      return file.originalFile.type.startsWith('image/')
        ? 'image'
        : file.originalFile.type.startsWith('application/pdf')
          ? 'pdf'
          : file.originalFile.type.startsWith(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              )
            ? 'excel'
            : 'other';
    }
  };
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
      }
    >
      <div className={styles['image-preview-container']}>
        <div className={styles['image-preview-wrapper']}>
          <div className={styles['image-preview']}>
            <AnimatePresence>
              {images.length ? (
                images.map((img, index) => {
                  return (
                    <>
                      {!loadedImages[img?.id] && (
                        <Skeleton
                          key={img?.id}
                          count={1}
                          style={{ background: 'rgba(0,0,0,0.4s)' }}
                          className={styles['file-image']}
                        />
                      )}
                      {(() => {
                        if (findFileType(img) === 'image') {
                          return (
                            <motion.img
                              className={classNames(styles['preview-img'], {
                                [styles['active']]: currentImage === index,
                                [styles['hidden']]: loadedImages[img?.id],
                              })}
                              key={img?.id}
                              src={img?.image}
                              onLoad={() =>
                                setLoadedImages((prev) => ({
                                  ...prev,
                                  [img.id]: true,
                                }))
                              }
                            />
                          );
                        }

                        if (findFileType(img) === 'pdf') {
                          return (
                            <motion.iframe
                              className={classNames(styles['preview-img'], {
                                [styles['active']]: currentImage === index,
                                [styles['hidden']]: loadedImages[img?.id],
                              })}
                              key={img?.id}
                              src={img?.image}
                              onLoad={() =>
                                setLoadedImages((prev) => ({
                                  ...prev,
                                  [img.id]: true,
                                }))
                              }
                            />
                          );
                        }
                        if (findFileType(img) === 'excel') {
                          return (
                            <EmptyPlaceholder
                              className={classNames({
                                [styles['hidden']]: currentImage !== index,
                              })}
                              title="Excel faylni yuklab oling"
                            />
                          );
                        }
                      })()}
                    </>
                  );
                })
              ) : (
                <EmptyPlaceholder />
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className={styles['image-indicator']}>
          <AnimatePresence mode="popLayout">
            {images.map((img, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.2,
                  type: 'tween',
                  ease: 'easeInOut',
                  stiffness: 300,
                  damping: 30,
                }}
                className={styles['indicator-img-wrapper']}
                key={img?.id}
              >
                {findFileType(img) === 'image' && !loadedImages[img?.id] && (
                  <Skeleton
                    count={1}
                    style={{ background: 'rgba(0,0,0,0)' }}
                    className={styles['indicator-img']}
                  />
                )}
                {(() => {
                  if (findFileType(img) === 'image') {
                    return (
                      <motion.img
                        className={classNames(styles['indicator-img'], {
                          [styles['active']]: currentImage === index,
                          [styles['hidden']]: !loadedImages[img?.id],
                        })}
                        key={img?.id}
                        src={img?.image}
                        onLoad={() =>
                          setLoadedImages((prev) => ({
                            ...prev,
                            [img.id]: true,
                          }))
                        }
                        layoutId={`image-${index}`}
                        onClick={() => setCurrentImage(index)}
                      />
                    );
                  }
                  if (findFileType(img) === 'pdf') {
                    return (
                      <Box>
                        <span
                          className={styles['file-icon']}
                          onClick={() => setCurrentImage(index)}
                        >
                          {iconsMap['pdfFile']}
                        </span>
                      </Box>
                    );
                  }
                  if (findFileType(img) === 'excel') {
                    return (
                      <a
                        href={img.image}
                        className={styles['file-icon']}
                        download
                        rel="noopener noreferrer"
                        onClick={() => setCurrentImage(index)}
                      >
                        {iconsMap['excelFile']}
                      </a>
                    );
                  }
                })()}
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onRemoveImage(img, index);
                    if (index === currentImage) {
                      setCurrentImage(0);
                    }
                  }}
                  className={styles['indicator-img-close']}
                >
                  {iconsMap['close']}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>
          <label htmlFor={inputId} className={styles['upload-photo-label']}>
            <Box dir="column" align="center" gap={1}>
              <Typography element="span">{iconsMap['addCircle']}</Typography>
              <Typography element="span">Hujjat yuklash</Typography>
            </Box>
          </label>
        </div>
      </div>
    </Modal>
  );
}
