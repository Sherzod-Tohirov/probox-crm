import { memo, forwardRef, useMemo, useCallback } from "react";
import Flatpickr from "react-flatpickr";
import classNames from "classnames";
import styles from "./input.module.scss";
import iconsMap from "@utils/iconsMap";
import Typography from "../Typography";
import { Box, Col, Row, List } from "@components/ui";
import { omit } from "ramda";
import "flatpickr/dist/themes/airbnb.css";
import { Controller } from "react-hook-form";
import moment from "moment";

const inputIcons = {
  email: "email",
  select: "arrowDown",
  search: "search",
  tel: "telephone",
  date: "calendarDays",
};

const SearchField = ({ data = [], onSelect }) => {
  const render = useCallback((item) => {
    return (
      <Box
        onClick={() => onSelect(item)}
        className={styles["search-field-item"]}>
        <Typography element="span">{item}</Typography>
      </Box>
    );
  });

  return (
    <Box className={styles["search-field"]}>
      <List
        className={styles["search-field-list"]}
        items={data}
        renderItem={render}
        itemClassName={styles["search-field-item"]}
      />
    </Box>
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
    // console.log("value", value);

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
        default: searchable ? (
          <Controller
            name={props.name}
            control={props.control}
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
          <Box dir="column" gap={1}>
            <Box pos="relative">
              {console.log("props", props)}
              {inputTypeMatcher[type] || inputTypeMatcher.default}
              {hasIcon ? (
                <Typography element="span" className={styles["icon"]}>
                  {iconText || iconsMap[icon || inputIcons[type]]}
                </Typography>
              ) : null}
              {searchable ? (
                <SearchField onSearch={onSearch} onSelect={onSearchSelect} />
              ) : (
                ""
              )}
            </Box>
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
