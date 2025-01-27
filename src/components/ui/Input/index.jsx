import classNames from "classnames";
import styles from "./input.module.scss";
import { memo, useMemo } from "react";
import iconsMap from "../../../utils/iconsMap";
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

function Input({ type, variant, icon, label, options = [], ...props }) {
  const inputTypeMatcher = useMemo(
    () => ({
      date: (
        <Flatpickr
          className={classNames(styles["input"], styles[variant], styles[type])}
          data-enable-time
          options={{
            dateFormat: "d.m.Y", // Custom date format
            defaultDate: "20.12.2031", // Default selected date
          }}
          {...props}
        />
      ),
      select: (
        <select
          className={classNames(styles["input"], styles[variant], styles[type])}
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
          type={type}
          className={classNames(styles["input"], styles[variant], styles[type])}
          {...props}
        />
      ),
    }),
    [props, type, variant]
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
          <Typography element="span" className={styles["icon"]}>
            {iconsMap[icon || inputIcons[type] || ""]}
          </Typography>
        </Box>
      </Col>
    </Row>
  );
}

export default memo(Input);
