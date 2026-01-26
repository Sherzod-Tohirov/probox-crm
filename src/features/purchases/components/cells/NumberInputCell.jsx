import { useState, useEffect } from 'react';
import { Input } from '@/components/ui';
import { formatCurrencyUZS } from '@/features/leads/utils/deviceUtils';

export default function NumberInputCell({
  value,
  onBlur,
  placeholder,
  disabled,
  isCurrency,
  isPercentage,
  icon,
  iconText,
}) {
  const [inputValue, setInputValue] = useState(value || '');
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    const val = value || '';
    setInputValue(val);
    if (isCurrency && val) {
      setDisplayValue(formatCurrencyUZS(val));
    } else if (isPercentage && val) {
      setDisplayValue(val + '%');
    } else {
      setDisplayValue(val);
    }
  }, [value, isCurrency, isPercentage]);

  const handleChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, ''); // Only numbers
    setInputValue(val);

    if (isCurrency && val) {
      setDisplayValue(formatCurrencyUZS(val));
    } else if (isPercentage && val) {
      setDisplayValue(val + '%');
    } else {
      setDisplayValue(val);
    }
  };

  const handleBlur = () => {
    if (inputValue !== value) {
      onBlur(inputValue);
    }
  };

  return (
    <Input
      type="text"
      variant="outlined"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      icon={icon}
      iconText={iconText}
    />
  );
}
