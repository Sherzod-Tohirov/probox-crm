import { useState, useEffect } from 'react';
import { Input, Button } from '@/components/ui';
import styles from './EditableCells.module.scss';

export default function TextInputCell({
  value,
  onBlur,
  placeholder,
  disabled,
  withScanner,
  onScanClick,
}) {
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleBlur = () => {
    if (inputValue !== value) {
      onBlur(inputValue);
    }
  };

  return (
    <div className={styles.inputCell}>
      <Input
        type="text"
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
      />
      {withScanner && (
        <Button
          icon="camera"
          iconSize={20}
          variant="text"
          size="small"
          onClick={onScanClick}
          className={styles.scanButton}
        />
      )}
    </div>
  );
}
