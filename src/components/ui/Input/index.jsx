import classNames from "classnames";
import styles from "./input.module.scss";
import { memo, useMemo } from "react";
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

function Input({
  type,
  variant,
  icon,
  label,
  options = [],
  width,
  style = {},
  size = "",
  disabled = false,
  hasIcon = true,
  ...props
}) {
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
        styles[disabled ? "disabled" : ""]
      ),
    [variant, type, size, disabled]
  );
  const inputTypeMatcher = useMemo(
    () => ({
      date: (
        <Flatpickr
          style={inputStyle}
          className={classes}
          data-enable-time
          options={{
            dateFormat: "d.m.Y", // Custom date format
            defaultDate: "01.01.2025", // Default selected date
          }}
          disabled={disabled}
          {...props}
        />
      ),
      select: (
        <select
          style={inputStyle}
          className={classes}
          disabled={disabled}
          {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ),
      default: (
        <input
          style={inputStyle}
          type={type}
          className={classes}
          disabled={disabled}
          {...props}
        />
      ),
    }),
    [props, type, options, inputStyle, classes, disabled]
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

export default memo(Input);
