import { memo, forwardRef, useMemo, useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import classNames from "classnames";
import styles from "./input.module.scss";
import iconsMap from "@utils/iconsMap";
import Typography from "../Typography";
import { Box, Col, Row, List } from "@components/ui";
import { omit } from "ramda";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import moment from "moment";
import * as r from "ramda";
import "flatpickr/dist/themes/airbnb.css";
import "react-phone-input-2/lib/style.css";
import { ClipLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
const inputIcons = {
  email: "email",
  select: "arrowDown",
  search: "search",
  tel: "telephone",
  date: "calendarDays",
};

const SearchField = ({ searchText, onSearch, renderItem, onSelect }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const delaySearch = setTimeout(async () => {
      const results = await onSearch(searchText);
      console.log(results, "results");
      if (results) {
        setData(results);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchText]);

  return (
    <motion.div
      className={styles["search-field"]}
      initial={{ opacity: 0, height: 0, scale: 0.8 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}>
      {isLoading ? (
        <ClipLoader color={"black"} loading={true} size={20} />
      ) : data.length > 0 ? (
        <List
          className={styles["search-field-list"]}
          items={data}
          renderItem={renderItem}
          itemClassName={styles["search-field-item"]}
        />
      ) : (
        <Typography element="span" className={styles["search-field-empty"]}>
          No results found
        </Typography>
      )}
    </motion.div>
  );
};

const Input = forwardRef(
  (
    {
      id,
      style = {},
      className,
      width,
      type = "text",
      variant,
      icon,
      iconText,
      label,
      options = [],
      images = [],
      size = "",
      searchText,
      searchable = false,
      onSearch = () => {},
      onSearchSelect = () => {},
      disabled = false,
      hasIcon = true,
      error = null,
      ...props
    },
    ref
  ) => {
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
          styles[size],
          styles[disabled ? "disabled" : ""],
          styles[error ? "error" : ""],
          className,
          { [styles.error]: error }
        ),
      [variant, type, size, disabled, className, error]
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
                  defaultDate:
                    field.value ||
                    props.defaultValue ||
                    moment().format("d.m.y"),
                  dateFormat: "d.m.Y", // Custom date format

                  locale: {
                    firstDayOfWeek: 1,
                  },

                  ...(props.datePickerOptions || {}), // Custom options
                }}
                onChange={(date) => field.onChange(date[0])}
                {...omit(props, ["datePickerOptions"])}
              />
            )}
          />
        ),
        select: (
          <select {...commonProps} {...props}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
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
                {images.map((image, index) => (
                  <Col key={index}>
                    <img
                      className={styles["file-image"]}
                      src={image.img}
                      alt="img"
                    />
                  </Col>
                ))}
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
                  {...field}
                  {...r.omit(["className", "style"], commonProps)}
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
                  onChange={(v) => {
                    field.onChange(v);
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
                    onSearch(e.target.value);
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
            className={classNames(styles["input"], styles["search"])}
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
            <Box pos="relative">
              {inputTypeMatcher[type] || inputTypeMatcher.default}
              {hasIcon ? (
                <Typography element="span" className={styles["icon"]}>
                  {iconText || iconsMap[icon || inputIcons[type]]}
                </Typography>
              ) : null}
            </Box>
            <AnimatePresence mode="popLayout">
              {searchable && searchText.length && searchText !== "998" ? (
                <SearchField
                  searchText={searchText}
                  renderItem={props.renderSearchItem}
                  onSearch={onSearch}
                  onSelect={onSearchSelect}
                />
              ) : (
                ""
              )}
            </AnimatePresence>
            {error ? (
              <Typography element="span" className={styles["error-text"]}>
                {error}
              </Typography>
            ) : null}
          </Box>
        </Col>
      </Row>
    );
  }
);

Input.displayName = "Input";

export default memo(Input);
