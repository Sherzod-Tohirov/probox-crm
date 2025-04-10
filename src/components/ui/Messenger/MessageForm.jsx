import { useForm } from "react-hook-form";
import { messengerSchema } from "@utils/validationSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./messenger.module.scss";
import { Button, Col, Row } from "@components/ui";
import classNames from "classnames";
const MessageForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(messengerSchema),
  });
  return (
    <form
      className={styles["text-input-form"]}
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}>
      <textarea
        className={styles["text-input"]}
        placeholder="Type here..."
        {...register("msgText")}></textarea>
      <Row direction="row" align="center" justify="space-between">
        <Col>
          <Button
            type={"button"}
            icon={"addCircle"}
            variant={"text"}
            color={"primary"}
            iconColor={"primary"}
          />
        </Col>
        <Col>
          <Button
            className={classNames(styles["send-btn"], {
              [styles["invalid"]]: !isValid,
            })}
            style={{ fontWeight: 600 }}
            icon={"send"}
            variant={"text"}
            iconPosition="right"
            iconColor={"primary"}
            color={"primary"}
            type={"submit"}>
            Send
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default MessageForm;
