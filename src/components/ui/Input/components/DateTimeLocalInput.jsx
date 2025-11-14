import Flatpickr from 'react-flatpickr';
import { buildDateTimeLocalOptions } from '../utils/flatpickrOptions';
import { formatDateUI } from '../utils/formatters';
import { isHourOnly as calcHourOnly, normalizeToTopOfHour, applyHourOnlyGuards } from '../utils/flatpickrHourOnly';

const DateTimeLocalInput = ({ datePickerOptions = {}, value, defaultValue, onChange, commonProps }) => {
  const hourOnly = calcHourOnly(datePickerOptions);
  const options = buildDateTimeLocalOptions({
    defaultDate: value || defaultValue || new Date(),
    datePickerOptions,
    hourOnly,
  });

  return (
    <Flatpickr
      value={value || defaultValue}
      {...commonProps}
      options={options}
      onChange={(dateArr) => {
        let date = dateArr[0];
        if (hourOnly && date) {
          date = normalizeToTopOfHour(date);
        }
        onChange?.(formatDateUI(date, true));
      }}
      onReady={(selectedDates, dateStr, instance) => {
        if (!instance?.input) return;
        if (options.allowInput === false) {
          instance.input.setAttribute('readonly', 'readonly');
        }
        if (hourOnly) {
          applyHourOnlyGuards(instance);
          const d = instance.selectedDates && instance.selectedDates[0];
          if (d && d.getMinutes() !== 0) {
            const nd = normalizeToTopOfHour(d);
            instance.setDate(nd, true);
          }
        }
      }}
      onOpen={(selectedDates, dateStr, instance) => {
        if (hourOnly) {
          applyHourOnlyGuards(instance);
          const d = instance.selectedDates && instance.selectedDates[0];
          if (d && d.getMinutes() !== 0) {
            const nd = normalizeToTopOfHour(d);
            instance.setDate(nd, true);
          }
        }
      }}
    />
  );
};

export default DateTimeLocalInput;
