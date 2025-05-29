import { useForm } from "react-hook-form";
import { messengerSchema } from "@utils/validationSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./messenger.module.scss";
import { Button, Col, Row, Box } from "@components/ui";
import classNames from "classnames";
import { useCallback } from "react";
const MessageForm = ({ onSubmit, size = "" }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(messengerSchema),
  });
  const handleKeyDown = useCallback((e) => {
    console.log(e, "clicked");
    if (!isValid) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit({ msgText: e.target.value });
      reset();
    }
  });
  return (
    <form
      className={classNames(styles["text-input-form"], styles[size])}
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}>
      <textarea
        className={styles["text-input"]}
        onKeyDown={handleKeyDown}
        placeholder="Xabar yozish..."
        {...register("msgText")}></textarea>
      <Row direction="row" align="center" justify="space-between">
        <Col>
          <Box>
            <label htmlFor="msgPhoto" className={styles["file-input-label"]}>
              <Button
                type={"button"}
                icon={"addCircle"}
                variant={"text"}
                color={"primary"}
                iconColor={"primary"}
              />
            </label>
            <input
              id={"msgPhoto"}
              {...register("msgPhoto")}
              className={styles["file-input"]}
              type="file"
              accept="image/*"
            />
          </Box>
        </Col>
        <Col>
          <Button
            className={classNames(styles["send-btn"], {
              [styles["invalid"]]: !isValid,
            })}
            style={{ fontWeight: 500 }}
            icon={"send"}
            variant={"text"}
            iconPosition="right"
            iconColor={"primary"}
            color={"primary"}
            type={"submit"}>
            Yuborish
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default MessageForm;
