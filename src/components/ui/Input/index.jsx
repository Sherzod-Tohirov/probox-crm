import { forwardRef, useCallback, useMemo, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import classNames from 'classnames';
import styles from './input.module.scss';
import iconsMap from '@utils/iconsMap';
import Typography from '../Typography';
import { Box, Col, Row } from '@components/ui';
import { omit } from 'ramda';
import { Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import moment from 'moment';
import * as r from 'ramda';
import 'flatpickr/dist/themes/airbnb.css';
import 'react-phone-input-2/lib/style.css';
import { AnimatePresence, motion } from 'framer-motion';
import SearchField from './SearchField';
import { formatPhoneNumber } from '@utils/formatPhoneNumber';
import MultipleSelect from './MultipleSelect';
import Skeleton from 'react-loading-skeleton';

const inputIcons = {
  email: 'email',
  select: 'arrowDown',
  search: 'search',
  tel: 'telephone',
  date: 'calendarDays',
};

const Input = forwardRef(
  (
    {
      id,
      style = {},
      inputBoxStyle = {},
      inputBoxClassName,
      className,
      width,
      type = 'text',
      variant,
      icon,
      iconText,
      label,
      options = [],
      placeholderColor = 'primary',
      images = [],
      size = '',
      searchText,
      searchable = false,
      multipleSelect = false,
      onSearch = () => {},
      onSearchSelect = () => {},
      onIconClick,
      canClickIcon = true,
      disabled = false,
      hasIcon = true,
      error = null,
      renderSearchItem = () => {},
      onClick = () => {},
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const [loadedImages, setLoadedImages] = useState({});
    const findFileType = useCallback((file) => {
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
    }, []);

    const uniqueId = useMemo(
      () => `input-${Math.random().toString(36).slice(2)}`,
      []
    );
    const inputStyle = useMemo(
      () => ({
        ...(width ? { width } : {}),
        ...style,
        // Automatically apply disabled styling
        ...(disabled
          ? {
              opacity: 0.65,
              pointerEvents: 'none',
              cursor: 'not-allowed',
            }
          : {}),
      }),
      [width, style, disabled]
    );
    const classes = useMemo(
      () =>
        classNames(
          styles['input'],
          styles[variant],
          styles[type],
          styles[`placeholder-${placeholderColor}`],
          styles[disabled ? 'disabled' : ''],
          styles[error ? 'error' : ''],
          className,
          { [styles.error]: error }
        ),
      [variant, type, disabled, className, error]
    );

    // Do not show overlay icon for react-select multi
    const showIcon = useMemo(
      () => hasIcon && !(type === 'select' && multipleSelect),
      [hasIcon, type, multipleSelect]
    );

    const commonProps = useMemo(
      () => ({
        id: id || uniqueId,
        style: inputStyle,
        className: classes,
        disabled,
        ref,
        onClick,
      }),
      [inputStyle, classes, disabled, ref, id, uniqueId]
    );

    const inputTypeMatcher = useMemo(
      () => ({
        textarea: props.control ? (
          <Controller
            name={props.name}
            control={props.control}
            render={({ field }) => (
              <textarea
                {...field}
                {...commonProps}
                {...omit(
                  [
                    'images',
                    'accept',
                    'multiple',
                    'control',
                    'datePickerOptions',
                  ],
                  props
                )}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        ) : (
          <textarea
            {...commonProps}
            {...omit(
              ['images', 'accept', 'multiple', 'control', 'datePickerOptions'],
              props
            )}
          />
        ),
        date: props.control ? (
          <Controller
            name={props.name}
            control={props.control}
            render={({ field }) => (
              <Flatpickr
                key={`fp-date-${props.includeTime ? 'dt' : 'd'}`}
                value={field.value || props.defaultValue}
                {...commonProps}
                options={{
                  enableTime: !!props.includeTime,
                  defaultDate: field.value || props.defaultValue || new Date(),
                  dateFormat: props.includeTime ? 'd.m.Y H:i' : 'd.m.Y',
                  ...(props.includeTime ? { time_24hr: true } : {}),
                  locale: { firstDayOfWeek: 1 },
                  clickOpens: true,
                  allowInput: false,
                  disableMobile: true,
                  static: false,
                  ...(props.datePickerOptions || {}),
                }}
                onChange={(dateArr) => {
                  const formatted = dateArr[0]
                    ? moment(dateArr[0]).format(
                        props.includeTime ? 'YYYY.MM.DD HH:mm' : 'YYYY.MM.DD'
                      )
                    : '';
                  console.log(formatted, 'formatted');
                  field.onChange(formatted);
                }}
                {...omit(['datePickerOptions', 'includeTime', 'type'], props)}
              />
            )}
          />
        ) : (
          <Flatpickr
            key={`fp-date-${props.includeTime ? 'dt' : 'd'}`}
            value={props.value || props.defaultValue}
            {...commonProps}
            options={{
              enableTime: !!props.includeTime,
              defaultDate: props.value || props.defaultValue || new Date(),
              dateFormat: props.includeTime ? 'd.m.Y H:i' : 'd.m.Y',
              ...(props.includeTime ? { time_24hr: true } : {}),
              locale: { firstDayOfWeek: 1 },
              clickOpens: true,
              allowInput: false,
              static: false,
              ...(props.datePickerOptions || {}),
            }}
            onChange={(dateArr) => {
              console.log(dateArr, 'datee');
              const formatted = dateArr[0]
                ? moment(dateArr[0]).format(
                    props.includeTime ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY'
                  )
                : '';
              props.onChange?.(formatted);
            }}
            {...omit(['datePickerOptions', 'includeTime', 'type'], props)}
          />
        ),
        time: props.control ? (
          <Controller
            name={props.name}
            control={props.control}
            render={({ field }) => (
              <Flatpickr
                value={field.value || props.defaultValue}
                {...commonProps}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: 'H:i',
                  time_24hr: true,
                  clickOpens: true,
                  allowInput: false,
                  disableMobile: true,
                  static: false,
                  ...(props.datePickerOptions || {}),
                }}
                onChange={(dateArr) => {
                  console.log(dateArr, 'datee');
                  const formatted = dateArr[0]
                    ? moment(dateArr[0]).format('HH:mm')
                    : '';
                  field.onChange(formatted);
                }}
                {...omit(['datePickerOptions', 'type'], props)}
              />
            )}
          />
        ) : (
          <Flatpickr
            value={props.value || props.defaultValue}
            {...commonProps}
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: 'H:i',
              time_24hr: true,
              clickOpens: true,
              allowInput: false,
              disableMobile: true,
              static: false,
              ...(props.datePickerOptions || {}),
            }}
            onChange={(dateArr) => {
              console.log(dateArr, 'datee');
              const formatted = dateArr[0]
                ? moment(dateArr[0]).format('HH:mm')
                : '';
              props.onChange?.(formatted);
            }}
            {...omit(['datePickerOptions', 'type'], props)}
          />
        ),
        'datetime-local': props.control ? (
          <Controller
            name={props.name}
            control={props.control}
            render={({ field }) => (
              <Flatpickr
                value={field.value || props.defaultValue}
                {...commonProps}
                options={{
                  enableTime: true,
                  dateFormat: 'd.m.Y H:i',
                  time_24hr: true,
                  clickOpens: true,
                  allowInput: false,
                  disableMobile: true,
                  static: false,
                  ...(props.datePickerOptions || {}),
                }}
                onChange={(dateArr) => {
                  console.log(dateArr, 'datee');
                  const formatted = dateArr[0]
                    ? moment(dateArr[0]).format('DD.MM.YYYY HH:mm')
                    : '';
                  field.onChange(formatted);
                }}
                {...omit(['datePickerOptions', 'type'], props)}
              />
            )}
          />
        ) : (
          <Flatpickr
            value={props.value || props.defaultValue}
            {...commonProps}
            options={{
              enableTime: true,
              dateFormat: 'd.m.Y H:i',
              time_24hr: true,
              clickOpens: true,
              allowInput: false,
              disableMobile: true,
              static: false,
              ...(props.datePickerOptions || {}),
            }}
            onChange={(dateArr) => {
              console.log(dateArr, 'datee');
              const formatted = dateArr[0]
                ? moment(dateArr[0]).format('DD.MM.YYYY HH:mm')
                : '';
              props.onChange?.(formatted);
            }}
            {...omit(['datePickerOptions', 'type'], props)}
          />
        ),
        number: (
          <input
            type="number"
            {...commonProps}
            {...omit(
              ['images', 'accept', 'multiple', 'control', 'datePickerOptions'],
              props
            )}
            inputMode={
              props?.min !== undefined &&
              props?.min !== null &&
              Number(props.min) >= 0
                ? 'numeric'
                : undefined
            }
            value={
              props?.value === undefined || props?.value === null
                ? ''
                : props.value
            }
            onWheel={(e) => {
              // Prevent scroll from changing value inadvertently
              e.currentTarget.blur();
            }}
            onKeyDown={(e) => {
              const minAttr =
                props?.min !== undefined && props?.min !== null
                  ? Number(props.min)
                  : undefined;
              const disallowNegative = minAttr !== undefined && minAttr >= 0;
              if (
                e.key === 'e' ||
                e.key === 'E' ||
                e.key === '+' ||
                (disallowNegative && e.key === '-')
              ) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              const minAttr =
                props?.min !== undefined && props?.min !== null
                  ? Number(props.min)
                  : undefined;
              const disallowNegative = minAttr !== undefined && minAttr >= 0;
              const text = e.clipboardData.getData('text');
              if (disallowNegative && /-/g.test(text)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '') {
                props.onChange?.('');
                return;
              }
              const n = Number(v);
              if (Number.isNaN(n)) {
                // ignore invalid intermediate values like '-'
                return;
              }
              const minAttr =
                props?.min !== undefined && props?.min !== null
                  ? Number(props.min)
                  : undefined;
              const maxAttr =
                props?.max !== undefined && props?.max !== null
                  ? Number(props.max)
                  : undefined;
              let out = n;
              if (minAttr !== undefined && out < minAttr) out = minAttr;
              if (maxAttr !== undefined && out > maxAttr) out = maxAttr;
              props.onChange?.(out);
            }}
          />
        ),
        select: multipleSelect ? (
          <Controller
            name={props.name}
            {...(props.control ? { control: props.control } : {})}
            render={({ field }) => {
              return (
                <MultipleSelect
                  style={commonProps.style}
                  field={field}
                  options={options}
                  isLoading={isLoading}
                  onClick={commonProps.onClick}
                  {...omit(
                    [
                      'onChange',
                      'onBlur',
                      'ref',
                      'name',
                      'value',
                      'defaultValue',
                      'inputRef',
                      'control',
                    ],
                    props
                  )}
                />
              );
            }}
          />
        ) : (
          <select
            {...commonProps}
            {...omit(
              [
                'images',
                'accept',
                'multiple',
                'control',
                'datePickerOptions',
                'placeholderOption',
              ],
              props
            )}
            value={
              props?.value !== undefined && props?.value !== null
                ? String(props.value)
                : props?.value
            }
            {...(props?.defaultValue !== undefined &&
            props?.defaultValue !== null
              ? { defaultValue: String(props.defaultValue) }
              : {})}
            onChange={(e) => {
              const raw = e.target.value;
              // Find the original option to preserve type (boolean/number/etc.)
              const match = options.find((opt) => String(opt.value) === raw);
              const parsed = match ? match.value : raw;
              props.onChange?.(parsed);
            }}
          >
            {(() => {
              const defaultPlaceholder = { value: '', label: '-' };
              const ph =
                typeof props.placeholderOption === 'boolean'
                  ? defaultPlaceholder
                  : props.placeholderOption;
              if (!ph) return null;
              const currentValueStr =
                props?.value !== undefined && props?.value !== null
                  ? String(props.value)
                  : props?.defaultValue !== undefined &&
                      props?.defaultValue !== null
                    ? String(props.defaultValue)
                    : undefined;
              const hasValue =
                currentValueStr !== undefined && currentValueStr !== null;
              const existsInOptions = hasValue
                ? options.some((opt) => String(opt.value) === currentValueStr)
                : false;
              // Show placeholder only if value is unset, equals placeholder value, or not found in options
              const showPlaceholder =
                !hasValue ||
                currentValueStr === String(ph.value) ||
                !existsInOptions;
              return showPlaceholder ? (
                <option
                  disabled
                  key={`placeholder-${String(ph.value)}`}
                  value={String(ph.value)}
                >
                  {ph.label}
                </option>
              ) : null;
            })()}
            {options.map((option) => (
              <option
                disabled={option.isNotSelectable}
                key={String(option.value)}
                value={String(option.value)}
              >
                {option.label}
              </option>
            ))}
          </select>
        ),
        file: (
          <Box dir="row" align={'center'}>
            <input
              id={props.id || uniqueId}
              type="file"
              multiple={props.multiple || true}
              {...commonProps}
              {...omit(['images', 'control', 'datePickerOptions'], props)}
            />
            <label
              htmlFor={props.id || uniqueId}
              {...omit(
                [
                  'type',
                  'multiple',
                  'accept',
                  'images',
                  'control',
                  'datePickerOptions',
                  'name',
                  'value',
                  'defaultValue',
                ],
                commonProps
              )}
              {...omit(
                [
                  'type',
                  'multiple',
                  'accept',
                  'images',
                  'control',
                  'datePickerOptions',
                  'name',
                  'value',
                  'defaultValue',
                ],
                props
              )}
            >
              <Row direction="row" align="center" gutter={1} wrap={true}>
                {images.length > 0 ? (
                  images.map((image) => {
                    const key = image?.id || image?.image || image;
                    return (
                      <AnimatePresence>
                        <Col key={key} style={{ position: 'relative' }}>
                          {findFileType(image) === 'image' &&
                            !loadedImages[key] && (
                              <Skeleton
                                count={1}
                                style={{ background: 'rgba(0,0,0,0.2)' }}
                                className={styles['file-image']}
                              />
                            )}
                          {(() => {
                            if (findFileType(image) === 'image') {
                              return (
                                <motion.img
                                  className={classNames(styles['file-image'], {
                                    [styles['hidden']]: !loadedImages[key],
                                  })}
                                  src={image?.image || image}
                                  alt={
                                    'Client image url:' +
                                    (image?.image || image)
                                  }
                                  onLoad={() =>
                                    setLoadedImages((p) => ({
                                      ...p,
                                      [key]: true,
                                    }))
                                  }
                                  style={
                                    !loadedImages[key]
                                      ? { visibility: 'hidden' }
                                      : {}
                                  }
                                />
                              );
                            }
                            if (findFileType(image) === 'pdf') {
                              return (
                                <motion.div
                                  className={classNames(styles['file-icon'])}
                                  onLoad={() =>
                                    setLoadedImages((p) => ({
                                      ...p,
                                      [key]: true,
                                    }))
                                  }
                                >
                                  {iconsMap['pdfFile']}
                                </motion.div>
                              );
                            }
                            if (findFileType(image) === 'excel') {
                              return (
                                <motion.div
                                  className={classNames(styles['file-icon'])}
                                >
                                  {iconsMap['excelFile']}
                                </motion.div>
                              );
                            }
                          })()}
                        </Col>
                      </AnimatePresence>
                    );
                  })
                ) : (
                  <Col>Hujjatlar yo'q</Col>
                )}
              </Row>
            </label>
          </Box>
        ),
        tel: props.control ? (
          <Controller
            name={props.name}
            control={props.control}
            render={({ field }) => {
              return (
                <PhoneInput
                  {...(props.onFocus ? { onFocus: props.onFocus } : {})}
                  {...field}
                  {...r.omit(['className', 'style'], commonProps)}
                  value={formatPhoneNumber(field.value || '')}
                  inputClass={classNames(
                    styles[`input-tel-${variant}`],
                    styles[size]
                  )}
                  inputStyle={commonProps.style}
                  containerClass={styles['input-tel-container']}
                  onlyCountries={['uz']}
                  disableDropdown={true}
                  countryCodeEditable={false}
                  buttonClass={styles['hidden']}
                  country={'uz'}
                  onChange={(value) => {
                    const formattedValue = formatPhoneNumber(value);
                    field.onChange(formattedValue);
                  }}
                />
              );
            }}
          />
        ) : (
          <PhoneInput
            {...(props.onFocus ? { onFocus: props.onFocus } : {})}
            {...r.omit(['className', 'style'], commonProps)}
            value={formatPhoneNumber(props.value || props.defaultValue || '')}
            inputClass={classNames(
              styles[`input-tel-${variant}`],
              styles[size]
            )}
            inputStyle={commonProps.style}
            containerClass={styles['input-tel-container']}
            onlyCountries={['uz']}
            disableDropdown={true}
            countryCodeEditable={false}
            buttonClass={styles['hidden']}
            country={'uz'}
          />
        ),
        default: searchable ? (
          props.control ? (
            <Controller
              name={props.name}
              control={props.control}
              render={({ field }) => {
                return (
                  <input
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    type={type}
                    {...commonProps}
                    placeholder={props?.placeholder}
                  />
                );
              }}
            />
          ) : (
            <input
              type={type}
              {...commonProps}
              {...omit(
                [
                  'images',
                  'accept',
                  'multiple',
                  'control',
                  'datePickerOptions',
                ],
                props
              )}
            />
          )
        ) : (
          <input
            type={type}
            {...commonProps}
            {...omit(
              ['images', 'accept', 'multiple', 'control', 'datePickerOptions'],
              props
            )}
          />
        ),
      }),
      [props, type, options, commonProps, images, uniqueId]
    );

    if (variant === 'search') {
      return (
        <Box dir="row" gap={2} align={'center'}>
          <Typography element="span" className={styles['icon-text']}>
            {iconsMap['search']}
          </Typography>
          <input
            type={type}
            className={classNames(styles['input'], styles['search-variant'])}
            {...omit(
              ['images', 'accept', 'multiple', 'control', 'datePickerOptions'],
              props
            )}
          />
        </Box>
      );
    }

    return (
      <Row className={styles['input-wrapper']} gutter={1.5}>
        {label && (
          <Col>
            <Typography
              element="label"
              className={classNames(styles['label'], {
                [styles['label-disabled']]: disabled,
              })}
            >
              {label}
            </Typography>
          </Col>
        )}

        <Col fullWidth>
          <Box pos={'relative'} dir="column" gap={1}>
            <Box
              pos="relative"
              style={inputBoxStyle}
              className={classNames(
                styles['input-box'],
                styles[variant],
                styles[type],
                styles[size],
                inputBoxClassName
              )}
            >
              {inputTypeMatcher[type] || inputTypeMatcher.default}
              {showIcon ? (
                <Typography
                  style={{
                    cursor: onIconClick ? 'pointer' : 'default',
                    pointerEvents: canClickIcon ? 'auto' : 'none',
                  }}
                  element="span"
                  className={styles['icon']}
                  {...(onIconClick ? { onClick: onIconClick } : {})}
                  disabled={disabled}
                >
                  {iconText || iconsMap[icon || inputIcons[type]]}
                </Typography>
              ) : (
                ''
              )}
            </Box>
            <AnimatePresence mode="popLayout">
              {searchable && searchText?.length && searchText !== '998' ? (
                <SearchField
                  renderItem={renderSearchItem}
                  onSearch={onSearch}
                  searchText={searchText}
                  onSelect={onSearchSelect}
                />
              ) : (
                ''
              )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              {error ? (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={styles['error-text']}
                >
                  {error}
                </motion.span>
              ) : (
                ''
              )}
            </AnimatePresence>
          </Box>
        </Col>
      </Row>
    );
  }
);

export default Input;
