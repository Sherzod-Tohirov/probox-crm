import { Button, Input, Col, Row } from "@components/ui";
import Logo from "@components/Logo";
import styles from "./login.module.scss";

export default function Login() {
  return (
    <div className={styles.login}>
      <div className={styles["login-wrapper"]}>
        <Logo />
        <form className={styles.form}>
          <Row gutter={4}>
            <Col>
              {" "}
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                variant="filled"
                icon="avatar"
                className={styles.input}
              />
            </Col>
            <Col>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                variant="filled"
                icon="lock"
                className={styles.input}
              />
            </Col>
            <Col fullWidth>
              <Button fullWidth type="submit" className={styles.button}>
                Submit
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    </div>
  );
}
