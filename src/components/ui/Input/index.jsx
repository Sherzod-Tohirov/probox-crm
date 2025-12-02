import 'flatpickr/dist/themes/airbnb.css';
import 'react-phone-input-2/lib/style.css';

import { forwardRef, useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import styles from './input.module.scss';
import iconsMap from '@utils/iconsMap';
import Typography from '../Typography';
import { Box, Col, Row } from '@components/ui';
import { omit } from 'ramda';
import { Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import * as r from 'ramda';

import { AnimatePresence, motion } from 'framer-motion';
import { formatPhoneNumber } from '@utils/formatPhoneNumber';
import MultipleSelect from './components/MultipleSelect';
import Skeleton from 'react-loading-skeleton';
import InputWrapper from './components/InputWrapper';
import DateInput from './components/DateInput';
import TimeInput from './components/TimeInput';
import DateTimeLocalInput from './components/DateTimeLocalInput';

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
      dimOnDisabled = true,
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
    const inputStyle = useMemo(() => {
      const base = {
        ...(width ? { width } : {}),
        ...style,
      };
      if (disabled) {
        if (dimOnDisabled) {
          base.opacity = 0.65;
        }
        base.pointerEvents = 'none';
        base.cursor = 'not-allowed';
      }
      return base;
    }, [width, style, disabled, dimOnDisabled]);
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

    // hour-only logic is handled inside subcomponents

    const inputTypeMatcher = useMemo(
      () => ({
        textarea: props.control ? (
          <Controller
            name={props.name}
            control={props.control}
            render={({ field }) => (
              <textarea
                rows={5}
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
            rows={5}
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
              <DateInput
                includeTime={props.includeTime}
                datePickerOptions={props.datePickerOptions}
                value={field.value || props.defaultValue}
                defaultValue={props.defaultValue}
                onChange={field.onChange}
                commonProps={commonProps}
              />
            )}
          />
        ) : (
          <DateInput
            includeTime={props.includeTime}
            datePickerOptions={props.datePickerOptions}
            value={props.value}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            commonProps={commonProps}
          />
        ),
        time: props.control ? (
          <Controller
            name={props.name}
            control={props.control}
            render={({ field }) => (
              <TimeInput
                datePickerOptions={props.datePickerOptions}
                value={field.value || props.defaultValue}
                defaultValue={props.defaultValue}
                onChange={field.onChange}
                commonProps={commonProps}
              />
            )}
          />
        ) : (
          <TimeInput
            datePickerOptions={props.datePickerOptions}
            value={props.value}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            commonProps={commonProps}
          />
        ),
        'datetime-local': props.control ? (
          <Controller
            name={props.name}
            control={props.control}
            render={({ field }) => (
              <DateTimeLocalInput
                datePickerOptions={props.datePickerOptions}
                value={field.value || props.defaultValue}
                defaultValue={props.defaultValue}
                onChange={field.onChange}
                commonProps={commonProps}
              />
            )}
          />
        ) : (
          <DateTimeLocalInput
            datePickerOptions={props.datePickerOptions}
            value={props.value}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            commonProps={commonProps}
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
        ) : props.control ? (
          <Controller
            name={props.name}
            control={props.control}
            render={({ field }) => (
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
                    'name',
                  ],
                  props
                )}
                value={
                  field.value !== undefined && field.value !== null
                    ? String(field.value)
                    : field.value
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  // Find the original option to preserve type (boolean/number/etc.)
                  const match = options.find(
                    (opt) => String(opt.value) === raw
                  );
                  const parsed = match ? match.value : raw;
                  field.onChange(parsed);
                }}
                onBlur={field.onBlur}
              >
                {(() => {
                  const defaultPlaceholder = { value: '', label: '-' };
                  const ph =
                    typeof props.placeholderOption === 'boolean'
                      ? defaultPlaceholder
                      : props.placeholderOption;
                  if (!ph) return null;
                  const currentValueStr =
                    field.value !== undefined && field.value !== null
                      ? String(field.value)
                      : undefined;
                  const hasValue =
                    currentValueStr !== undefined && currentValueStr !== null;
                  const existsInOptions = hasValue
                    ? options.some(
                        (opt) => String(opt.value) === currentValueStr
                      )
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
            )}
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
                  {...(props.onBlur ? { onBlur: props.onBlur } : {})}
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
            {...(props.onBlur ? { onBlur: props.onBlur } : {})}
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
                    onFocus={(e) => {
                      field.onFocus?.();
                      props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                      field.onBlur?.();
                      props.onBlur?.(e);
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
      <InputWrapper
        label={label}
        disabled={disabled}
        dimOnDisabled={dimOnDisabled}
        variant={variant}
        type={type}
        size={size}
        inputBoxStyle={inputBoxStyle}
        inputBoxClassName={inputBoxClassName}
        hasIcon={hasIcon}
        showIcon={showIcon}
        icon={icon || inputIcons[type]}
        iconText={iconText}
        canClickIcon={canClickIcon}
        onIconClick={onIconClick}
        error={error}
        searchable={searchable}
        searchText={searchText}
        renderSearchItem={renderSearchItem}
        onSearch={onSearch}
        onSearchSelect={onSearchSelect}
      >
        {inputTypeMatcher[type] || inputTypeMatcher.default}
      </InputWrapper>
    );
  }
);

export default Input;
