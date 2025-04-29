import { forwardRef, useMemo, useState } from "react";
import Flatpickr from "react-flatpickr";
import classNames from "classnames";
import styles from "./input.module.scss";
import iconsMap from "@utils/iconsMap";
import Typography from "../Typography";
import { Box, Col, Row } from "@components/ui";
import { omit } from "ramda";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import moment from "moment";
import * as r from "ramda";
import "flatpickr/dist/themes/airbnb.css";
import "react-phone-input-2/lib/style.css";
import { AnimatePresence, motion } from "framer-motion";
import SearchField from "./SearchField";
import formatPhoneNumber from "@utils/formatPhoneNumber";
import MultipleSelect from "./MultipleSelect";
import Skeleton from "react-loading-skeleton";

const inputIcons = {
  email: "email",
  select: "arrowDown",
  search: "search",
  tel: "telephone",
  date: "calendarDays",
};

const Input = forwardRef(
  (
    {
      id,
      style = {},
      inputBoxStyle = {},
      className,
      width,
      type = "text",
      variant,
      icon,
      iconText,
      label,
      options = [],
      placeholderColor = "primary",
      images = [],
      size = "",
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
      ...props
    },
    ref
  ) => {
    const [loadedImages, setLoadedImages] = useState({});

    const uniqueId = useMemo(
      () => `input-${Math.random().toString(36).slice(2)}`,
      []
    );
    const inputStyle = useMemo(
      () => ({
        ...(width ? { width } : {}),
        ...style,
      }),
      [width, style]
    );
    const classes = useMemo(
      () =>
        classNames(
          styles["input"],
          styles[variant],
          styles[type],
          styles[`placeholder-${placeholderColor}`],
          styles[disabled ? "disabled" : ""],
          styles[error ? "error" : ""],
          className,
          { [styles.error]: error }
        ),
      [variant, type, disabled, className, error]
    );

    const commonProps = useMemo(
      () => ({
        id: id || uniqueId,
        style: inputStyle,
        className: classes,
        disabled,
        ref,
      }),
      [inputStyle, classes, disabled, ref, id, uniqueId]
    );

    const inputTypeMatcher = useMemo(
      () => ({
        date: (
          <Controller
            name={props.name}
            {...(props.control ? { control: props.control } : {})}
            render={({ field }) => (
              <Flatpickr
                value={field.value || props.defaultValue}
                {...commonProps}
                options={{
                  enableTime: false,
                  defaultDate: field.value || props.defaultValue || new Date(),
                  dateFormat: "d.m.Y", // Custom date format
                  locale: { firstDayOfWeek: 1 },
                  ...(props.datePickerOptions || {}),
                }}
                onChange={(dateArr) => {
                  // Format to dd.mm.yyyy before saving to form
                  const formatted = dateArr[0]
                    ? moment(dateArr[0]).format("DD.MM.YYYY")
                    : "";
                  field.onChange(formatted);
                }}
                {...omit(props, ["datePickerOptions"])}
              />
            )}
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
                  {...props}
                />
              );
            }}
          />
        ) : (
          <select {...commonProps} {...props}>
            {options.map((option) => (
              <option
                disabled={option.isNotSelectable}
                key={option.value}
                value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ),
        file: (
          <Box dir="row" align={"center"}>
            <input
              id={props.id || uniqueId}
              type="file"
              multiple={props.multiple || true}
              {...commonProps}
              {...props}
            />
            <label htmlFor={props.id || uniqueId} {...commonProps} {...props}>
              <Row direction="row" align="center" gutter={1} wrap={true}>
                {images.length > 0 ? (
                  images.map((image) => {
                    const key = image?.id || image?.image || image;
                    return (
                      <AnimatePresence>
                        <Col key={key} style={{ position: "relative" }}>
                          {!loadedImages[key] && (
                            <Skeleton
                              count={1}
                              style={{ background: "rgba(0,0,0,0.2)" }}
                              className={styles["file-image"]}
                            />
                          )}

                          <motion.img
                            className={classNames(styles["file-image"], {
                              [styles["hidden"]]: !loadedImages[key],
                            })}
                            src={image?.image || image}
                            alt={"Client image url:" + (image?.image || image)}
                            onLoad={() =>
                              setLoadedImages((p) => ({
                                ...p,
                                [key]: true,
                              }))
                            }
                            style={
                              !loadedImages[key] ? { visibility: "hidden" } : {}
                            }
                          />
                        </Col>
                      </AnimatePresence>
                    );
                  })
                ) : (
                  <Col>Rasmlar yo'q</Col>
                )}
              </Row>
            </label>
          </Box>
        ),
        tel: (
          <Controller
            name={props.name}
            {...(props.control ? { control: props.control } : {})}
            render={({ field }) => {
              return (
                <PhoneInput
                  {...(props.onFocus ? { onFocus: props.onFocus } : {})}
                  {...field}
                  {...r.omit(["className", "style"], commonProps)}
                  value={formatPhoneNumber(field.value || "")}
                  inputClass={classNames(
                    styles[`input-tel-${variant}`],
                    styles[size]
                  )}
                  inputStyle={commonProps.style}
                  containerClass={styles["input-tel-container"]}
                  onlyCountries={["uz"]}
                  disableDropdown={true}
                  countryCodeEditable={false}
                  buttonClass={styles["hidden"]}
                  country={"uz"}
                  onChange={(value) => {
                    // Ensure the value always starts with 998
                    const formattedValue = formatPhoneNumber(value);
                    field.onChange(formattedValue);
                  }}
                />
              );
            }}
          />
        ),
        default: searchable ? (
          <Controller
            name={props.name}
            {...(props.control ? { control: props.control } : {})}
            render={({ field }) => {
              return (
                <input
                  {...field}
                  value={field.value || ""}
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
          <input type={type} {...commonProps} {...props} />
        ),
      }),
      [props, type, options, commonProps, images, uniqueId]
    );

    if (variant === "search") {
      return (
        <Box dir="row" gap={2} align={"center"}>
          <Typography element="span" className={styles["icon-text"]}>
            {iconsMap["search"]}
          </Typography>
          <input
            type={type}
            className={classNames(styles["input"], styles["search-variant"])}
            {...props}
          />
        </Box>
      );
    }

    return (
      <Row className={styles["input-wrapper"]} gutter={1.5}>
        {label && (
          <Col>
            <Typography element="label" className={styles["label"]}>
              {label}
            </Typography>
          </Col>
        )}

        <Col fullWidth>
          <Box dir="column" pos={"relative"} gap={1}>
            <Box
              pos="relative"
              style={inputBoxStyle}
              className={classNames(
                styles["input-box"],
                styles[variant],
                styles[type],
                styles[size]
              )}>
              {inputTypeMatcher[type] || inputTypeMatcher.default}
              {hasIcon ? (
                <Typography
                  style={{
                    cursor: onIconClick ? "pointer" : "default",
                    pointerEvents: canClickIcon ? "auto" : "none",
                  }}
                  element="span"
                  className={styles["icon"]}
                  {...(onIconClick ? { onClick: onIconClick } : {})}>
                  {iconText || iconsMap[icon || inputIcons[type]]}
                </Typography>
              ) : (
                ""
              )}
            </Box>
            <AnimatePresence mode="popLayout">
              {searchable && searchText?.length && searchText !== "998" ? (
                <SearchField
                  renderItem={props.renderSearchItem}
                  onSearch={onSearch}
                  searchText={searchText}
                  onSelect={onSearchSelect}
                />
              ) : (
                ""
              )}
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              {error ? (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={styles["error-text"]}>
                  {error}
                </motion.span>
              ) : (
                ""
              )}
            </AnimatePresence>
          </Box>
        </Col>
      </Row>
    );
  }
);

export default Input;
