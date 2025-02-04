import Button from "../Button";
import Col from "../Col";
import Row from "../Row";
import Typography from "../Typography";
import Message from "./Message";
import styles from "./messenger.module.scss";

export default function Messenger() {
  return (
    <div className={styles.messenger}>
      <div className={styles["messenger-header"]}>
        <Typography element="h2" className={styles.title}>
          Messenger
        </Typography>
      </div>
      <div className={styles["messenger-body"]}>
        <Message isRead>
          Hi, how are yourwerwewqewqeeqweqeqeqweqwewrrwerwerewrwerwerrwrwe?r
        </Message>
        <Message isRead>Hi, how are ?</Message>
        <Message isRead>Hi, how are ?</Message>
        <Message isRead>Hi, how are ?</Message>
        <Message isRead>Hi, how are ?</Message>
        <Message isRead>Hi, how are ?</Message>
        <Message isRead>Hi, how are ?</Message>
        <Message isRead>Hi, how are ?</Message>
        <Message isRead>Hi, how are ?</Message>
      </div>
      <div className={styles["messenger-footer"]}>
        <form className={styles["text-input-form"]}>
          <textarea
            className={styles["text-input"]}
            placeholder="Type a comment..."></textarea>
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
                style={{ fontWeight: 600 }}
                icon={"send"}
                variant={"text"}
                iconPosition="right"
                iconColor={"primary"}
                color={"primary"}
                type={"button"}>
                Send
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    </div>
  );
}
