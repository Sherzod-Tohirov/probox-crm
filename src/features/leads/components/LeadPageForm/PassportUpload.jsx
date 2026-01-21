import { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Typography, Row, Col, Button } from '@components/ui';
import ConfirmModal from '@/features/common/components/ConfirmModal';
import iconsMap from '@utils/iconsMap';
import styles from './passportUpload.module.scss';
import { Upload } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MAX_FILES = 6;
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/heic',
];

const buildPayload = (file) => ({
  id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
  preview: URL.createObjectURL(file),
  file,
  source: 'local',
});

export default function PassportUpload({
  value = [],
  onChange,
  onDelete,
  onUploadSingle,
  disabled = false,
}) {
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const inputId = 'passport-files';
  const files = useMemo(() => value || [], [value]);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    file: null,
  });
  const [deletingIds, setDeletingIds] = useState(new Set());

  const appendFiles = useCallback(
    (incomingFiles) => {
      if (!incomingFiles?.length) return;
      const availableSlots = MAX_FILES - files.length;
      if (availableSlots <= 0) {
        setError(`Maksimal ${MAX_FILES} ta rasm yuklash mumkin.`);
        return;
      }

      const validFiles = Array.from(incomingFiles).filter((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          return file.type.startsWith('image/');
        }
        return true;
      });

      if (!validFiles.length) {
        setError('Faqatgina rasm formatlarini yuklash mumkin.');
        return;
      }

      // prevent duplicates by name+size+lastModified
      const existingKey = new Set(
        files.map(
          (f) => `${f.file?.name}|${f.file?.size}|${f.file?.lastModified}`
        )
      );
      const deduped = validFiles.filter(
        (f) => !existingKey.has(`${f.name}|${f.size}|${f.lastModified}`)
      );
      const nextPayload = deduped
        .slice(0, availableSlots)
        .map((f) => ({ ...buildPayload(f), status: 'tayyor', progress: 0 }));
      const next = [...nextPayload, ...files];
      onChange?.(next);
      setError('');
    },
    [files, onChange]
  );

  const handleManualSelect = useCallback(
    (event) => {
      if (disabled) return;
      appendFiles(event.target.files);
      event.target.value = '';
    },
    [appendFiles, disabled]
  );

  const handleDragOver = useCallback(
    (event) => {
      event.preventDefault();
      if (!disabled) setDragActive(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (disabled) return;
      const droppedFiles = event.dataTransfer?.files;
      appendFiles(droppedFiles);
      setDragActive(false);
    },
    [appendFiles, disabled]
  );
  const removeFile = useCallback(
    (file) => {
      if (disabled) return;
      // Prevent removing server-side files here; deletion should be handled via API
      if (file?.source !== 'local') {
        setConfirmDelete({ open: true, file });
        return;
      }
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      const filtered = files.filter((item) => item.id !== file.id);
      onChange?.(filtered);
    },
    [disabled, files, onChange]
  );

  const handleConfirmDelete = useCallback(async () => {
    const file = confirmDelete.file;
    if (!file) return setConfirmDelete({ open: false, file: null });
    try {
      setDeletingIds((prev) => new Set([...prev, file.id]));
      await onDelete?.(file.id);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(file.id);
        return next;
      });
      setConfirmDelete({ open: false, file: null });
    }
  }, [confirmDelete, onDelete]);
  return (
    <div className={styles.wrapper}>
      <div
        className={classNames(styles.dropzone, {
          [styles.active]: dragActive,
          [styles.disabled]: disabled,
        })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Pasport rasmlarini yuklash uchun fayl tanlash yoki tashlash"
        onClick={() => {
          if (disabled) return;
          inputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleManualSelect}
          className={styles.fileInput}
          disabled={disabled}
          ref={inputRef}
          id={inputId}
          style={{ display: 'none' }}
        />

        <Row direction="column" align="center" gap={2}>
          <Col>
            <div className={styles.icon}>{iconsMap.uploadCloud}</div>
          </Col>
          <Col>
            <label
              htmlFor={inputId}
              className={styles.clickLabel}
              onClick={(e) => e.preventDefault()}
            >
              Passport nusxasini yuklang <Upload />
            </label>
          </Col>
          <Col>
            <Typography element="span" className={styles.subtitle}>
              Fayllarni shu yerga tashlang yoki yuqoridagi yozuvni bosing
            </Typography>
          </Col>
          <Col>
            <Typography element="span" className={styles.limit}>
              Maksimal {MAX_FILES} ta rasm (jpg, png, webp, heic)
            </Typography>
          </Col>
        </Row>
      </div>

      <div className={styles.actionsBar}>
        <span className={styles.countBadge}>
          Tanlangan: {files.length}/{MAX_FILES}
        </span>
      </div>

      {error ? (
        <Typography element="p" className={styles.error}>
          {error}
        </Typography>
      ) : null}

      {files.length > 0 ? (
        <div className={styles.previewRail}>
          <AnimatePresence mode="popLayout">
            {files.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className={styles.previewCard}
                onClick={() => {
                  // PDF fayllar uchun pdfUrl dan foydalanish
                  const href = file.isPdf && file.pdfUrl 
                    ? file.pdfUrl 
                    : file.previewLarge || file.preview;
                  if (href) window.open(href, '_blank');
                }}
              >
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file);
                  }}
                  disabled={disabled}
                  aria-label="Rasmni o'chirish"
                >
                  {iconsMap.delete}
                </button>

                {/* Deleting overlay */}
                {deletingIds.has(file.id) ? (
                  <div className={styles.cardOverlay}>
                    <div className={styles.spinner} />
                  </div>
                ) : null}

                {file.isPdf ? (
                  <div className={styles.pdfPreview}>
                    <div className={styles.pdfIcon}>PDF</div>
                  </div>
                ) : (
                  <img src={file.preview} alt="Passport preview" />
                )}

                {/* Status & progress for local items */}
                {file.source === 'local' ? (
                  <div className={styles.progressRow}>
                    <div className={styles.statusBadge}>
                      {file.status || 'tayyor'}
                    </div>
                    {file.status === 'yuklanmoqda' ? (
                      <div className={styles.progressBar}>
                        <span style={{ width: `${file.progress || 0}%` }} />
                      </div>
                    ) : null}
                    {file.status === 'failed' ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUploadSingle?.(file);
                        }}
                      >
                        Qayta urinib ko'rish
                      </Button>
                    ) : null}
                  </div>
                ) : null}

                <div className={styles.fileName}>
                  {file.file?.name || file.fileName || 'Server fayli'}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={confirmDelete.open}
        subtitle="Rasmni o'chirish"
        message="Haqiqatan ham bu rasmni o‘chirmoqchimisiz?"
        confirmText="O'chirish"
        cancelText="Bekor qilish"
        confirmColor="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ open: false, file: null })}
      />
    </div>
  );
}

PassportUpload.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onUploadSingle: PropTypes.func,
  disabled: PropTypes.bool,
};
