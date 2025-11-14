import Flatpickr from 'react-flatpickr';
import { buildTimeOptions } from '../utils/flatpickrOptions';
import { formatTimeUI } from '../utils/formatters';

const TimeInput = ({ datePickerOptions = {}, value, defaultValue, onChange, commonProps }) => {
  const options = buildTimeOptions({
    defaultDate: value || defaultValue || new Date(),
    datePickerOptions,
    hourOnly: false,
  });

  return (
    <Flatpickr
      value={value || defaultValue}
      {...commonProps}
      options={options}
      onChange={(dateArr) => {
        const date = dateArr[0];
        onChange?.(formatTimeUI(date));
      }}
      onReady={(selectedDates, dateStr, instance) => {
        if (!instance?.input) return;
        if (options.allowInput === false) {
          instance.input.setAttribute('readonly', 'readonly');
        }
      }}
    />
  );
};

export default TimeInput;
