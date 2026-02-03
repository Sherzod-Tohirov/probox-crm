import { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'react-flatpickr';
import classNames from 'classnames';
import 'flatpickr/dist/flatpickr.css';
import styles from './datePicker.module.scss';

/**
 * DatePicker - Global sana tanlash komponenti
 * 
 * @component
 * @example
 * // Oddiy sana tanlash
 * <DatePicker
 *   value={date}
 *   onChange={(dates) => setDate(dates[0])}
 *   placeholder="Sanani tanlang"
 * />
 * 
 * @example
 * // Sana oralig'ini tanlash (range mode)
 * <DatePicker
 *   mode="range"
 *   value={[startDate, endDate]}
 *   onChange={(dates) => setDateRange(dates)}
 *   showMonths={2}
 * />
 * 
 * @example
 * // Ko'p sana tanlash
 * <DatePicker
 *   mode="multiple"
 *   value={dates}
 *   onChange={(dates) => setDates(dates)}
 * />
 * 
 * @param {Object} props - Komponent parametrlari
 * @param {Date|Date[]|string|string[]} props.value - Tanlangan sana(lar)
 * @param {Function} props.onChange - Sana o'zgarganda chaqiriladigan funksiya
 * @param {string} props.mode - Tanlash rejimi: 'single' | 'range' | 'multiple'
 * @param {string} props.dateFormat - Sana formati (masalan: 'd.m.Y', 'Y-m-d')
 * @param {number} props.showMonths - Ko'rsatiladigan oylar soni (range mode uchun)
 * @param {boolean} props.inline - Inline ko'rinishda ko'rsatish
 * @param {boolean} props.disabled - Disable holati
 * @param {string} props.placeholder - Placeholder matni
 * @param {string} props.className - Qo'shimcha CSS class
 * @param {Date|string} props.minDate - Minimal sana
 * @param {Date|string} props.maxDate - Maksimal sana
 * @param {Function} props.onOpen - Ochilganda chaqiriladigan funksiya
 * @param {Function} props.onClose - Yopilganda chaqiriladigan funksiya
 * @param {boolean} props.enableTime - Vaqt tanlashni yoqish
 * @param {boolean} props.noCalendar - Faqat vaqt tanlash (kalendarsiz)
 * @param {string} props.locale - Til (masalan: 'ru', 'uz', 'en')
 * @param {Array} props.disable - Disable qilinadigan sanalar
 * @param {Array} props.enable - Faqat ruxsat etilgan sanalar
 * @param {string} props.position - Kalendarning pozitsiyasi: 'auto' | 'above' | 'below'
 * @param {boolean} props.allowInput - Qo'lda kiritishga ruxsat berish
 * @param {boolean} props.clickOpens - Bosish orqali ochilishini yoqish
 * @param {Object} props.options - Flatpickr uchun qo'shimcha sozlamalar
 */
const DatePicker = forwardRef(
  (
    {
      value = null,
      onChange = () => {},
      mode = 'single',
      dateFormat = 'd.m.Y',
      showMonths = 1,
      inline = false,
      disabled = false,
      placeholder = 'Sanani tanlang',
      className = '',
      minDate = null,
      maxDate = null,
      onOpen = () => {},
      onClose = () => {},
      enableTime = false,
      noCalendar = false,
      locale = 'default',
      disable = [],
      enable = [],
      position = 'auto',
      allowInput = false,
      clickOpens = true,
      options = {},
    },
    ref
  ) => {
    // Flatpickr sozlamalari
    const flatpickrOptions = useMemo(
      () => ({
        mode,
        dateFormat,
        showMonths: mode === 'range' ? showMonths : 1,
        inline,
        minDate,
        maxDate,
        enableTime,
        noCalendar,
        locale,
        disable,
        enable,
        position,
        allowInput,
        clickOpens,
        nextArrow: '›',
        prevArrow: '‹',
        onOpen,
        onClose,
        // Qo'shimcha sozlamalarni qo'shish
        ...options,
      }),
      [
        mode,
        dateFormat,
        showMonths,
        inline,
        minDate,
        maxDate,
        enableTime,
        noCalendar,
        locale,
        disable,
        enable,
        position,
        allowInput,
        clickOpens,
        onOpen,
        onClose,
        options,
      ]
    );

    return (
      <div
        className={classNames(styles.datePickerWrapper, className, {
          [styles.inline]: inline,
          [styles.disabled]: disabled,
          [styles.range]: mode === 'range',
          [styles.multiple]: mode === 'multiple',
        })}
      >
        <Flatpickr
          ref={ref}
          value={value}
          onChange={onChange}
          options={flatpickrOptions}
          disabled={disabled}
          placeholder={placeholder}
          className={styles.datePickerInput}
        />
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    ),
  ]),
  onChange: PropTypes.func,
  mode: PropTypes.oneOf(['single', 'range', 'multiple']),
  dateFormat: PropTypes.string,
  showMonths: PropTypes.number,
  inline: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  minDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  maxDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  enableTime: PropTypes.bool,
  noCalendar: PropTypes.bool,
  locale: PropTypes.string,
  disable: PropTypes.array,
  enable: PropTypes.array,
  position: PropTypes.oneOf(['auto', 'above', 'below', 'auto left', 'auto right']),
  allowInput: PropTypes.bool,
  clickOpens: PropTypes.bool,
  options: PropTypes.object,
};

export default DatePicker;
