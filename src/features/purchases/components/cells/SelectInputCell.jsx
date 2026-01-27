import { useState, useEffect } from 'react';
import { Input } from '@/components/ui';



export default function SelectInputCell({
  value,
  onChange,
  disabled,
  options,
  placeholder,
}) {
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
      options={options}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
