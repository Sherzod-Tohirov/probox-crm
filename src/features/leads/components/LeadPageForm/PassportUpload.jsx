import { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Typography, Row, Col } from '@components/ui';
import iconsMap from '@utils/iconsMap';
import styles from './passportUpload.module.scss';
import { Upload } from 'lucide-react';

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
  disabled = false,
}) {
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const inputId = 'passport-files';
  const files = useMemo(() => value || [], [value]);

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
      const nextPayload = deduped.slice(0, availableSlots).map(buildPayload);
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
      if (file?.source !== 'local') return;
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      const filtered = files.filter((item) => item.id !== file.id);
      onChange?.(filtered);
    },
    [disabled, files, onChange]
  );

  const clearAll = useCallback(() => {
    if (disabled) return;
    files.forEach((f) => {
      if (f?.source === 'local' && f?.preview) URL.revokeObjectURL(f.preview);
    });
    onChange?.([]);
  }, [disabled, files, onChange]);

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
        {files.length > 0 ? (
          <Button
            size="small"
            variant="outlined"
            color="danger"
            icon="delete"
            onClick={clearAll}
            disabled={disabled}
          >
            Hammasini tozalash
          </Button>
        ) : null}
      </div>

      {error ? (
        <Typography element="p" className={styles.error}>
          {error}
        </Typography>
      ) : null}

      {files.length > 0 ? (
        <div className={styles.previewRail}>
          {files.map((file) => (
            <div key={file.id} className={styles.previewCard}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeFile(file)}
                disabled={disabled}
                aria-label="Rasmni o'chirish"
              >
                {iconsMap.delete}
              </button>
              <img src={file.preview} alt="Passport preview" />
              <div className={styles.fileName}>
                {file.file?.name || file.fileName || 'Server fayli'}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

PassportUpload.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};
