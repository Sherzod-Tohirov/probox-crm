import classNames from "classnames";
import styles from "./input.module.scss";
import { memo, forwardRef, useMemo } from "react";
import iconsMap from "@utils/iconsMap";
import Typography from "../Typography";
import Box from "../Box";
import Col from "../Col";
import Row from "../Row";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";

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
      type = "text",
      variant,
      icon,
      label,
      options = [],
      images = [],
      width,
      style = {},
      size = "",
      disabled = false,
      hasIcon = true,
      id,
      className,
      error,
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
          className,
          { [styles.error]: error }
        ),
      [variant, type, size, disabled, className, error]
    );

    const commonProps = useMemo(
      () => ({
        style: inputStyle,
        className: classes,
        disabled,
        ref,
      }),
      [inputStyle, classes, disabled, ref]
    );

    const inputTypeMatcher = useMemo(
      () => ({
        date: (
          <Flatpickr
            data-enable-time
            options={{
              dateFormat: "d.m.Y", // Custom date format
              defaultDate: "01.01.2025", // Default selected date
            }}
            {...commonProps}
            {...props}
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
            <label htmlFor={props.id || uniqueId} {...commonProps}>
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
        default: <input type={type} {...commonProps} {...props} />,
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

        <Col>
          <Box pos="relative">
            {inputTypeMatcher[type] || inputTypeMatcher.default}
            {hasIcon ? (
              <Typography element="span" className={styles["icon"]}>
                {iconsMap[icon || inputIcons[type] || ""]}
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
