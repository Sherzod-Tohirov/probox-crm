import { useState, useEffect } from 'react';
import { Input } from '@/components/ui';

const STATUS_OPTIONS = [
  { value: 'Yangi', label: 'Yangi' },
  { value: 'B/U', label: 'B/U' },
];

export default function SelectInputCell({ value, onChange, disabled }) {
  const [selectedValue, setSelectedValue] = useState(value || '');

  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const handleChange = (val) => {
    setSelectedValue(val);
    onChange(val);
  };

  return (
    <Input
      type="select"
      variant="outlined"
      value={selectedValue}
      onChange={handleChange}
      options={STATUS_OPTIONS}
      placeholder="Holati"
      disabled={disabled}
    />
  );
}
